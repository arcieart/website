"use server";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { Order } from "@/types/order";
import { createRazorpayOrder } from "./rzp";
import { sendOrderMessage } from "./discord";
import { getDiscordOrderMessage } from "@/utils/discordMessages";

export const createOrder = async (order: Omit<Order, "id">) => {

  console.log("Creating order", order);
  
  try {
    const orderRef = db.collection(Collections.Orders).doc();
    const dbId = orderRef.id;
    
    const orderWithId: Order = { ...order, id: dbId };
    
    if (order.payment.method === "razorpay") {
      const razorpayOrder = await createRazorpayOrder(
        orderWithId.pricing.total,
        dbId
      );
      orderWithId.payment.razorpay = {
        razorpayOrderId: razorpayOrder.id,
        paymentStatus: "created",
      };
    } else if (order.payment.method === "cod") {
      orderWithId.payment.status = "completed";
      sendOrderMessage(getDiscordOrderMessage(orderWithId));
    }
    
    await orderRef.set(orderWithId);
    return JSON.parse(JSON.stringify(orderWithId)) as Order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const updateOrder = async (orderId: string, order: object) => {
  await db.collection(Collections.Orders).doc(orderId).update(order);
  return true;
};