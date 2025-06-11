import { Order } from "@/types/order";
import { MessageCreateOptions } from "discord.js";
import { getDate } from "./date";
import { getAddressString } from "./address";
import { getWhatsappOrderConfirmationLink } from "./whatsappMessageLinks";

// Utility function to generate product URL
const getProductUrl = (categoryId: string, productId: string) => {
  return `https://arcie.art/products/${categoryId}/${productId}`;
};

export const getDiscordOrderMessage = (order: Order) => {
    const paymentMethod = order.payment.method === "razorpay" ? order.payment.razorpay?.paymentMethod?.toUpperCase() : "Cash";
  
    return {
      content: `🎉 We have a new order! \nSend ${
        order.customerInfo.name
      } their order info by clicking [here](${getWhatsappOrderConfirmationLink(order)})`,
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
                // Create the product link
                const productLink = `[${product.name}](${getProductUrl(product.categoryId, product.productId)})`;
                let productLine = `**${product.quantity}x** ${productLink}`;
                
                // Format customizations if they exist
                if (product.customizations && Object.keys(product.customizations).length > 0) {
                  const customizationDetails = Object.entries(product.customizations)
                    .filter(([_, value]) => value && value !== "")
                    .map(([key, value]) => `**${key}**: ${value}`)
                    .join("\n   ");
                  
                  if (customizationDetails) {
                    productLine += `\n   ${customizationDetails}`;
                  }
                }
                
                return productLine;
              }).join("\n\n"),
            },
          ],
          timestamp: new Date(getDate(order.createdAt)).toISOString(),
        },
      ],
    } as MessageCreateOptions;
  };
  