"use client";

import { useImperativeHandle } from "react";
import { Order } from "@/types/order";
import Script from "next/script";
import { toast } from "sonner";
import {
  trackPaymentFailed,
  trackPaymentCancelled,
  trackOrderCompleted,
} from "@/lib/analytics";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

type RazorpayPaymentGatewayProps = {
  ref: React.RefObject<RazorpayPaymentGatewayRef | null>;
  onSuccess: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onFailed: () => void;
};

export type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

export type RazorpayPaymentGatewayRef = {
  handlePayment: (order: Order) => void;
};

export const RazorpayPaymentGateway = ({
  ref,
  onSuccess,
  onCancel,
  onFailed,
}: RazorpayPaymentGatewayProps) => {
  useImperativeHandle(ref, () => ({ handlePayment }));

  const handlePayment = (order: Order) => {
    if (typeof window.Razorpay === "undefined") {
      toast.warning("RazorPay failed to load. Please refresh the page");
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RZP_KEY_ID!,
      amount: order.pricing.total * 100,
      currency: "INR",
      order_id: order.payment.razorpay!.razorpayOrderId,
      prefill: {
        name: order.customerInfo.name,
        email: order.customerInfo.email,
        contact: order.customerInfo.phone,
        method: "upi",
      },
      config: {
        display: {
          hide: [{ method: "netbanking" }, { method: "paylater" }],
        },
      },
      notes: { dbId: order.id },
      modal: {
        confirm_close: true,
        ondismiss: () => {
          trackPaymentCancelled(order.id);
          onCancel(order.id);
        },
      },
      handler: (response: RazorpaySuccessResponse) => {
        trackOrderCompleted(order, response.razorpay_payment_id);
        onSuccess(order.id);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response: any) => {
      trackPaymentFailed(
        order.id,
        response.error?.description || "Payment failed"
      );
      onFailed();
    });
    rzp.open(options);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </>
  );
};
