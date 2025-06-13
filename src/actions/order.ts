"use server";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { Order, PricingDetails } from "@/types/order";
import { createRazorpayOrder } from "./rzp";
import { sendOrderMessage } from "./discord";
import { getDiscordOrderMessage } from "@/utils/discordMessages";
import { getTimestamp } from "@/utils/date";
import { getProduct } from "@/lib/products";
import { BaseCategoriesObj } from "@/data/categories";
import { calculateProductPrice } from "@/utils/price";
import { getFreeShippingThreshold, getShippingCost } from "@/config/currency";
import { validateCouponAndGetSavings } from "./coupon";

export const getOrder = async (id: string) => {
  const order = await db.collection(Collections.Orders).doc(id).get();

  if (!order.exists) return null;
  return { id: order.id, ...order.data() } as Order;
};

// this function focuses only on the pricing of the order.
// do not use the `recalculatedProducts` array for anything else.
const recalculateOrderPricing = async (order: Omit<Order, "id">) => {
  let subtotal = 0;

  for (const product of order.products) {
    const productData = await getProduct(product.id);
    const { id, ...restBaseCategory } =
      BaseCategoriesObj[productData.categoryId];

    const mergedProductWithCategory = { ...restBaseCategory, ...productData };

    const productPrice = calculateProductPrice(
      mergedProductWithCategory.price,
      product.customizations,
      product.quantity
    );
    subtotal += productPrice;
  }

  let shipping = subtotal > getFreeShippingThreshold() ? 0 : getShippingCost();
  let discountAmount = 0;
  if (order.pricing.couponCode) {
    const couponData = await validateCouponAndGetSavings(
      order.pricing.couponCode,
      subtotal
    );
    if (couponData.isValid && couponData.coupon) {
      if (couponData.coupon.discountType === "free_shipping") {
        shipping = 0;
      }
      discountAmount = couponData.discountAmount;
    }
  }

  const total = subtotal - discountAmount + shipping;
  const pricing: PricingDetails = { subtotal, discount: discountAmount, shipping, tax: 0, total };
  return pricing;
};

export const createOrder = async (order: Omit<Order, "id">) => {
  console.log("Creating order", order);

  try {
    const orderRef = db.collection(Collections.Orders).doc();
    const dbId = orderRef.id;

    const pricing = await recalculateOrderPricing(order);

    const newOrder: Omit<Order, "id"> = { ...order, pricing };

    if (order.payment.method === "razorpay") {
      const razorpayOrder = await createRazorpayOrder(
        newOrder.pricing.total,
        dbId
      );
      newOrder.payment.razorpay = {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "created",
      };
    } else if (order.payment.method === "cod") {
      newOrder.payment.status = "completed";
      newOrder.status = "confirmed";
      newOrder.payment.paidAt = getTimestamp();
      newOrder.confirmedAt = getTimestamp();
      sendOrderMessage(getDiscordOrderMessage({ ...newOrder, id: dbId }));
    }

    await orderRef.set(newOrder);
    return JSON.parse(JSON.stringify({ ...newOrder, id: dbId })) as Order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrder = async (orderId: string, order: object) => {
  await db.collection(Collections.Orders).doc(orderId).update(order);
  return true;
};
