
"use server";

import Razorpay from "razorpay";

export const createRazorpayOrder = async (amount: number, dbId: string) => {
  console.log("Creating Razorpay order", amount, dbId);
  console.log("RZP_KEY_SECRET", process.env.RZP_KEY_SECRET);
  console.log("NEXT_PUBLIC_RZP_KEY_ID", process.env.NEXT_PUBLIC_RZP_KEY_ID);

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
};
