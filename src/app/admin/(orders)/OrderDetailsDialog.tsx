"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { orderStatuses, getOrderStatusConfig } from "@/data/orderStatuses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CreditCard,
  User,
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Banknote,
} from "lucide-react";
import { Order } from "@/types/order";
import { formatPrice } from "@/utils/price";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/constants/Collections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CustomizationBadge } from "@/components/products/CustomizationBadge";
import { getDate, getTimestamp } from "@/utils/date";
import { getPaymentStatusConfig } from "@/config/payment";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated?: () => void;
}

export function OrderDetailsDialog({
  order,
  isOpen,
  onOpenChange,
  onOrderUpdated,
}: OrderDetailsDialogProps) {
  const [isUpdatingOrderStatus, setIsUpdatingOrderStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const formatDate = (timestamp: number) => {
    return getDate(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return;

    try {
      setIsUpdatingOrderStatus(true);
      const orderRef = doc(db, Collections.Orders, order.id);

      const updateData: Partial<Order> = {
        status: newStatus,
      };

      // Add confirmation timestamp if status is confirmed
      if (newStatus === "confirmed") {
        updateData.confirmedAt = getTimestamp();
      }

      await updateDoc(orderRef, updateData);
      onOrderUpdated?.();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setIsUpdatingOrderStatus(false);
    }
  };

  const handlePaymentStatusUpdate = async (
    newPaymentStatus: Order["payment"]["status"]
  ) => {
    if (!order) return;

    try {
      setIsUpdatingPayment(true);
      const orderRef = doc(db, Collections.Orders, order.id);

      const updateData: Partial<Order> = {
        payment: {
          ...order.payment,
          status: newPaymentStatus,
          ...(newPaymentStatus === "completed"
            ? { paidAt: getTimestamp() }
            : {}),
        },
      };

      await updateDoc(orderRef, updateData);
      onOrderUpdated?.();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  if (!order) return null;

  const statusConfig = getOrderStatusConfig(order.status);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[50%] max-h-[95vh] overflow-hidden flex flex-col bg-background">
        <DialogHeader className="space-y-4 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <div className="p-2 rounded-full bg-primary/10">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
              Order #{order.id}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              className={`${statusConfig.color} px-3 py-1`}
              variant="secondary"
            >
              <div className="flex items-center gap-2">
                {statusConfig.icon}
                <span className="font-medium">{statusConfig.label}</span>
              </div>
            </Badge>
          </div>

          <DialogDescription className="flex items-center gap-6 text-base">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(order.createdAt)}</span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-3">
          {/* Customer Information */}
          <Card className="border shadow-sm bg-card gap-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <User className="w-3 h-3" />
                    Full Name
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {order.customerInfo.name}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Mail className="w-3 h-3" />
                    Email Address
                  </div>
                  <p className="text-sm text-foreground">
                    {order.customerInfo.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <Phone className="w-3 h-3" />
                    Phone Number
                  </div>
                  <p className="text-sm text-foreground">
                    {order.customerInfo.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <MapPin className="w-3 h-3" />
                    Delivery Address
                  </div>
                  <div className="space-y-1 text-sm text-foreground">
                    <p className="font-medium">{order.customerInfo.address}</p>
                    <p>
                      {order.customerInfo.city}, {order.customerInfo.state}
                    </p>
                    <p className="font-medium">
                      PIN: {order.customerInfo.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="border shadow-sm bg-card gap-0">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50">
                  <Package className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                Order Items
                <Badge variant="outline" className="ml-2 px-2 py-1">
                  {order.products.length}{" "}
                  {order.products.length === 1 ? "item" : "items"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.products.map((product, index) => (
                <div key={product.id} className="space-y-3">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-base font-semibold text-foreground">
                          {product.name}
                        </span>
                        <Badge variant="secondary" className="px-2 py-1 w-fit">
                          Qty: {product.quantity}
                        </Badge>
                      </div>

                      {product.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {product.description.slice(0, 50)}
                          {product.description.length > 50 && "..."}
                        </p>
                      )}

                      {product.customizations &&
                        Object.keys(product.customizations).length > 0 && (
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-foreground">
                              Customizations:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(product.customizations).map(
                                ([key, value]) => (
                                  <CustomizationBadge
                                    key={key}
                                    customizationId={key}
                                    value={value}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    <div className="text-right space-y-1 lg:ml-6 flex-shrink-0">
                      <p className="text-lg font-bold text-foreground">
                        {formatPrice(product.total)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)} each
                      </p>
                    </div>
                  </div>
                  {index < order.products.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment & Pricing */}
          <Card className="border shadow-sm bg-card gap-0">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                  <CreditCard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                Payment & Pricing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-muted/20 rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground text-sm">
                      Subtotal
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(order.pricing.subtotal)}
                    </span>
                  </div>

                  {order.pricing.tax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">Tax</span>
                      <span className="font-medium text-foreground">
                        {formatPrice(order.pricing.tax)}
                      </span>
                    </div>
                  )}

                  {order.pricing.shipping > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">
                        Shipping
                      </span>
                      <span className="font-medium text-foreground">
                        {formatPrice(order.pricing.shipping)}
                      </span>
                    </div>
                  )}

                  {!!order.pricing.discount && order.pricing.discount > 0 && (
                    <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-2 text-sm">
                        Discount
                        {order.pricing.couponCode && (
                          <Badge variant="outline" className="text-xs">
                            {order.pricing.couponCode}
                          </Badge>
                        )}
                      </span>
                      <span className="font-medium">
                        -{formatPrice(order.pricing.discount)}
                      </span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-foreground">
                      Total Amount
                    </span>
                    <span className="text-xl font-bold text-foreground">
                      {formatPrice(order.pricing.total)}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex flex-col gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3">
                    {order.payment.method === "cod" ? (
                      <Banknote className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                    <span className="font-medium text-foreground text-sm">
                      Payment Method:
                    </span>
                    <span className="capitalize text-foreground text-sm">
                      {order.payment.method}
                    </span>
                    <Badge
                      className={
                        getPaymentStatusConfig(order.payment.status).color
                      }
                      variant="secondary"
                    >
                      {getPaymentStatusConfig(order.payment.status).label}
                    </Badge>
                  </div>

                  {order.payment.paidAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>Paid: {formatDate(order.payment.paidAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card className="border shadow-sm bg-card gap-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Order Status Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Update the order status to track progress and notify the
                  customer.
                </div>
                <Select
                  value={order.status}
                  onValueChange={(value) =>
                    handleStatusUpdate(value as Order["status"])
                  }
                  disabled={isUpdatingOrderStatus}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-3 py-1">
                          {status.icon}
                          <span className="font-medium">{status.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isUpdatingOrderStatus && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating order status...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Update for COD orders */}
          {order.payment.method === "cod" && (
            <Card className="border shadow-sm bg-card gap-0">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-900/50">
                    <Banknote className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  Payment Status Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Update the payment status for this cash on delivery order.
                  </div>
                  <Select
                    value={order.payment.status}
                    onValueChange={(value) =>
                      handlePaymentStatusUpdate(
                        value as Order["payment"]["status"]
                      )
                    }
                    disabled={isUpdatingPayment}
                  >
                    <SelectTrigger className="w-full h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                          <span className="font-medium">Pending</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="completed">
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="font-medium">Completed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="failed">
                        <div className="flex items-center gap-3 py-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full" />
                          <span className="font-medium">Failed</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {isUpdatingPayment && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating payment status...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
