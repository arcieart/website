import React from "react";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Order } from "@/types/order";

export interface OrderStatusConfig {
  value: Order["status"];
  label: string;
  color: string;
  icon: React.ReactNode;
}

export const orderStatuses: OrderStatusConfig[] = [
  {
    value: "initiated",
    label: "Initiated",
    color: "bg-blue-100 text-blue-800",
    icon: <Package className="w-3 h-3" />,
  },
  {
    value: "payment-failed",
    label: "Payment Failed",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-3 h-3" />,
  },
  {
    value: "payment-fraud",
    label: "Payment Fraud",
    color: "bg-red-100 text-red-800",
    icon: <XCircle className="w-3 h-3" />,
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-blue-100 text-blue-800",
    icon: <Truck className="w-3 h-3" />,
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
    icon: <XCircle className="w-3 h-3" />,
  },
  {
    value: "returned",
    label: "Returned",
    color: "bg-yellow-100 text-yellow-800",
    icon: <RotateCcw className="w-3 h-3" />,
  },
];

// Utility function to get status configuration
export const getOrderStatusConfig = (
  status: Order["status"]
): OrderStatusConfig => {
  return orderStatuses.find((s) => s.value === status) || orderStatuses[0];
};

// Utility function to format order status for display
export const formatOrderStatus = (status: string): string => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ");
};

// Create a lookup object for better performance if needed
export const orderStatusLookup = orderStatuses.reduce((acc, status) => {
  acc[status.value] = status;
  return acc;
}, {} as Record<Order["status"], OrderStatusConfig>);
