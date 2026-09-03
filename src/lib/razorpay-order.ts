import "server-only";

import Razorpay from "razorpay";

export async function createRazorpayOrder(amount: number, dbId: string) {
  const rzp = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RZP_KEY_ID!,
    key_secret: process.env.RZP_KEY_SECRET!,
  });

  const order = await rzp.orders.create({
    notes: { dbId: dbId },
    amount: amount * 100,
    currency: "INR",
  });

  return order;
}
