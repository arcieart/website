import { Order } from "@/types/order";
import { getAddressString } from "./address";
import { formatPrice } from "./price";
import { UIProduct } from "@/types/product";

// Support phone number for WhatsApp
export const SUPPORT_PHONE_NUMBER = "919769910657";

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
      "Thanks for shopping with arcie.art! :D",
      "If you have any questions, please feel free to reply here."
    ].join("\n");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/91${order.customerInfo.phone}?text=${encodedMessage}`;
};

export const getWhatsappHelpLink = (order: Order) => {
    const message = [
      "Hi, I need help with my order.",
      "",
      `*Order ID:* ${order.id}`,
      `*Order Status:* ${order.status}`,
      `*Order Total:* ${formatPrice(order.pricing.total)}`,
    ].join("\n");
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${SUPPORT_PHONE_NUMBER}?text=${encodedMessage}`;
};


/**
 * Returns a WhatsApp link for help with customization options for a product.
 * @param product The product for which customization help is needed.
 */
export const getWhatsappCustomizationHelpLink = (product: UIProduct) => {
  const message = [
    "Hi, I'm interested in customizing a product.",
    "",
    `*Product Name:* ${product.name}`,
    `*Category:* ${product.categoryId}`,
    product.id ? `*Product ID:* ${product.id}` : "",
    "",
    "Could you help me with the available customization options?",
  ]
    .filter(Boolean)
    .join("\n");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${SUPPORT_PHONE_NUMBER}?text=${encodedMessage}`;
};
