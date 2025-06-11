"use server";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { Order } from "@/types/order";
import { createRazorpayOrder } from "./rzp";
import { sendOrderMessage } from "./discord";
import { getDiscordOrderMessage } from "@/utils/discordMessages";
import { getTimestamp } from "@/utils/date";

export const getOrder = async (id: string) => {
  const order = await db.collection(Collections.Orders).doc(id).get();

  if (!order.exists) return null;
  return { id: order.id, ...order.data() } as Order;
};


export const createOrder = async (order: Omit<Order, "id">) => {

  console.log("Creating order", order);
  
  try {
    const orderRef = db.collection(Collections.Orders).doc();
    const dbId = orderRef.id;
    
    const newOrder: Omit<Order, "id"> = { ...order };
    
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