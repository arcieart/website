import { Order } from "@/types/order";
import { MessageCreateOptions } from "discord.js";
import { getDate } from "./date";
import { getAddressString } from "./address";
import { getWhatsappOrderConfirmationLink } from "./whatsappMessageLinks";

export const getDiscordOrderMessage = (order: Order) => {
    const paymentMethod = order.payment.method === "razorpay" ? order.payment.razorpay?.paymentStatus?.toUpperCase() : "Cash";
  
    return {
      content: `🎉 We have a new order! \nSend ${
        order.customerInfo.name
      } their order info + shipping details by clicking [here](${getWhatsappOrderConfirmationLink(order)})`,
      embeds: [
        {
          title: "Order Details",
          color: 0xfb9e0b,
          fields: [
            { name: "ID", value: order.id },
            { name: "Name", value: order.customerInfo.name },
            {
              name: "Payment Details",
              value: `${paymentMethod} / ₹${order.pricing.total} ${order.pricing.couponCode ? `(${order.pricing.couponCode})` : ""}`,
            },
            { name: "Address", value: getAddressString(order.customerInfo) },
            {
              name: "Products",
              value: order.products.map(product => {
                let productLine = `${product.quantity}x ${product.name}`;
                if (product.customizations && Object.keys(product.customizations).length > 0) {
                  const customizationDetails = Object.entries(product.customizations)
                    .filter(([_, value]) => value && value !== "")
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
                  productLine += ` (${customizationDetails})`;
                }
                return productLine;
              }).join("\n"),
            },
          ],
          timestamp: new Date(getDate(order.createdAt)).toISOString(),
        },
      ],
    } as MessageCreateOptions;
  };
  