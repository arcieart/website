"use server";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { getOrderById, updateOrderFields } from "@/lib/orders";
import { Order, PricingDetails } from "@/types/order";
import { createRazorpayOrder } from "@/lib/razorpay-order";
import { sendOrderMessage } from "./discord";
import { getDiscordOrderMessage } from "@/utils/discordMessages";
import { getTimestamp } from "@/utils/date";
import { getProductById } from "@/lib/products";
import { BaseCategoriesObj } from "@/data/categories";
import { calculateProductPrice } from "@/utils/price";
import { validateCoupon } from "@/lib/coupons";
import { calculateShippingCost } from "@/utils/shipping";
import { redactCustomerInfo } from "@/utils/redact";
import { AppliedCoupon } from "@/types/coupon";

const recalculateOrderPricing = async (order: Omit<Order, "id">) => {
  let subtotal = 0;

  for (const product of order.products) {
    const productData = await getProductById(product.productId);
    if (!productData) {
      throw new Error("One or more products are no longer available");
    }

    const category = BaseCategoriesObj[productData.categoryId];
    if (!category) {
      throw new Error("One or more products are no longer available");
    }

    const mergedProductWithCategory = { ...category, ...productData };

    const productPrice = calculateProductPrice(
      mergedProductWithCategory.price,
      product.customizations,
      product.quantity
    );
    subtotal += productPrice;
  }

  let shipping = calculateShippingCost(subtotal, null);
  let discountAmount = 0;
  let coupon: AppliedCoupon | null = null;

  if (order.pricing.couponCode) {
    const couponData = await validateCoupon(order.pricing.couponCode, subtotal);
    if (couponData.isValid && couponData.coupon) {
      coupon = couponData.coupon;
      shipping = calculateShippingCost(subtotal, couponData.coupon);
      discountAmount = couponData.discountAmount;
    }
  }

  const total = subtotal - discountAmount + shipping;
  const pricing: PricingDetails = {
    subtotal,
    discount: discountAmount,
    shipping,
    tax: 0,
    total,
  };

  if (coupon) {
    pricing.couponCode = coupon.code;
  }

  return { pricing, coupon };
};

export const getOrder = async (id: string) => {
  const order = await getOrderById(id);
  if (!order) return null;

  return {
    ...order,
    customerInfo: redactCustomerInfo(order.customerInfo),
    internalNotes: undefined,
    metadata: undefined,
  } as Order;
};

export const createOrder = async (order: Omit<Order, "id">) => {
  if (!order.products?.length) {
    throw new Error("Cart is empty");
  }

  try {
    const orderRef = db.collection(Collections.Orders).doc();
    const dbId = orderRef.id;

    const { pricing, coupon } = await recalculateOrderPricing(order);
    const isCod = coupon?.isCashOrder ?? false;

    const newOrder: Omit<Order, "id"> = {
      customerInfo: order.customerInfo,
      products: order.products,
      pricing,
      payment: {
        method: isCod ? "cod" : "razorpay",
        status: "pending",
      },
      status: isCod ? "confirmed" : "initiated",
      createdAt: getTimestamp(),
      source: "website",
    };

    if (isCod) {
      newOrder.confirmedAt = getTimestamp();
      sendOrderMessage(getDiscordOrderMessage({ ...newOrder, id: dbId }));
    } else {
      const razorpayOrder = await createRazorpayOrder(newOrder.pricing.total, dbId);
      newOrder.payment.razorpay = {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "created",
      };
    }

    await orderRef.set(newOrder);
    return JSON.parse(JSON.stringify({ ...newOrder, id: dbId })) as Order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const cancelInitiatedOrder = async (orderId: string) => {
  const existing = await getOrderById(orderId);
  if (!existing || existing.status !== "initiated") {
    return false;
  }

  await updateOrderFields(orderId, { status: "cancelled" });
  return true;
};
