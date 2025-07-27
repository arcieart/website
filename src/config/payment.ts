import { Order } from "@/types/order";

export const getPaymentStatusConfig = (status: Order["payment"]["status"]) => {
    const configs = {
      pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
      processing: { label: "Processing", color: "bg-blue-100 text-blue-800" },
      completed: { label: "Completed", color: "bg-green-100 text-green-800" },
      failed: { label: "Failed", color: "bg-red-100 text-red-800" },
      refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
      partial_refund: {
        label: "Partial Refund",
        color: "bg-orange-100 text-orange-800",
      },
    };
    return configs[status] || configs.pending;
  };