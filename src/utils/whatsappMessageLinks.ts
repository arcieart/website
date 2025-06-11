import { Order } from "@/types/order";
import { getAddressString } from "./address";
import { formatPrice } from "./price";

export const getWhatsappOrderConfirmationLink = (order: Order) => {
    const paymentMethod = order.payment.method === "razorpay" ? order.payment.razorpay?.paymentMethod?.toUpperCase() : "Cash";
  
    const message = [
      "Hey, we have received your order!",
      "",
      `*Order ID:* ${order.id}`,
      "",
      `*Order Total:* ${ formatPrice(order.pricing.total) }`,
      "",
      `*Shipping Address:* ${getAddressString(order.customerInfo)}`,
      "",
      `*Payment Method:* ${paymentMethod}`,
      "",
      "Check your order details here:",
      `https://arcie.art/order/${order.id}`,
      "",
      "You should receive your order in 7-10 days.",
      "",
      "Thanks for shopping with arcie.art! 🎉 ",
      "If you have any questions, please feel free to reply here."
    ].join("\n");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/91${order.customerInfo.phone}?text=${encodedMessage}`;
  };