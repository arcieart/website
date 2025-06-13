import { BaseCustomizationsObj } from "@/data/customizations";

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

export type OrderProduct = {
  id: string;
  productId: string;
  name: string;
  description?: string;
  sku?: string;
  categoryId: string;
  price: number; // Unit price
  quantity: number;
  total: number; // price * quantity
  imageUrl?: string;
  customizations?: Record<keyof typeof BaseCustomizationsObj, string>;
};

export type ShippingInfo = {
  method: "standard" | "express" | "overnight" | "pickup";
  cost: number;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
};

export type RazorpayPaymentDetails = {
  razorpayOrderId: string; // Razorpay order ID
  razorpayPaymentId?: string; // Set after successful payment
  paymentStatus?: "created" | "authorized" | "captured" | "refunded" | "failed";
  paymentMethod?: "card" | "netbanking" | "wallet" | "upi" | "emi" | "paylater";
  currency?: string;
  amountPaid?: number; // Amount actually paid (in paise for Razorpay)
  refundId?: string;
  refundAmount?: number;
  failureReason?: string; // Reason for failure
};

export type PaymentInfo = {
  method: "razorpay" | "cod"
  status: "pending" | "processing" | "completed" | "failed" | "refunded" | "partial_refund";
  razorpay?: RazorpayPaymentDetails;
  paidAt?: number; // Timestamp
  refundedAt?: number; // Timestamp
};

export type PricingDetails = {
  subtotal: number; // Sum of all product totals
  tax: number; // GST or other taxes
  shipping: number;
  discount?: number;
  couponCode?: string;
  total: number; // Final amount
};

export type Order = {
  id: string; // Internal order ID
  
  // Customer Information
  customerInfo: CustomerInfo;
  
  // Order Details
  products: OrderProduct[];
  pricing: PricingDetails;
  
  // Shipping
  // shipping: ShippingInfo;
  
  // Payment
  payment: PaymentInfo;
  
  // Status & Workflow
  status: "initiated" | "payment-failed" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";
  
  // Timestamps
  createdAt: number;
  confirmedAt?: number;
  
  // Additional Information
  notes?: string; // Customer notes
  internalNotes?: string; // Internal staff notes
  source?: "website" | "admin"; // Order source
  tags?: string[]; // For categorization
  
  // Compliance & Business
  invoiceNumber?: string;
  gstNumber?: string; // For Indian businesses
  
  // Metadata
  metadata?: Record<string, any>; // For extensibility
};