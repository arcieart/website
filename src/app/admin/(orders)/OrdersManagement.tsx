"use client";

import { useState } from "react";
import { useOrdersAdmin } from "@/hooks/useOrdersAdmin";
import { Order } from "@/types/order";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { orderStatuses, getOrderStatusConfig } from "@/data/orderStatuses";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, AlertCircle, Eye, CreditCard } from "lucide-react";
import { formatPrice } from "@/utils/price";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Collections } from "@/constants/Collections";
import { getDate } from "@/utils/date";

export const OrdersManagement = () => {
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "all"
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const pageSize = 20;

  const {
    orders,
    loading,
    error,
    hasNextPage,
    hasPrevPage,
    currentPage,
    totalOrders,
    nextPage,
    prevPage,
    refetch,
  } = useOrdersAdmin({ pageSize, statusFilter });

  const formatDate = (timestamp: number) => {
    return getDate(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      setUpdatingOrderId(orderId);
      const orderRef = doc(db, Collections.Orders, orderId);

      const updateData: Partial<Order> = {
        status: newStatus,
      };

      // Add confirmation timestamp if status is confirmed
      if (newStatus === "confirmed") {
        updateData.confirmedAt = Date.now();
      }

      await updateDoc(orderRef, updateData);
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getTotalProducts = (products: Order["products"]) => {
    return products.reduce((sum, product) => sum + product.quantity, 0);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Error loading orders</p>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Orders Management</h3>
          <p className="text-sm text-muted-foreground">
            View and manage customer orders with status updates
          </p>
        </div>
        <Button onClick={() => window.print()} variant="outline">
          Export Orders
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Filter by status:
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as Order["status"] | "all")
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {orderStatuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    {status.icon}
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-muted-foreground">
                    {statusFilter === "all"
                      ? "No orders found."
                      : `No orders found with status "${
                          getOrderStatusConfig(statusFilter as Order["status"])
                            .label
                        }".`}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const statusConfig = getOrderStatusConfig(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(-8)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {order.customerInfo.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {order.customerInfo.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {getTotalProducts(order.products)} items
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="capitalize font-medium">
                            {order.payment.method}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatPrice(order.pricing.total)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig.color} variant="secondary">
                        <div className="flex items-center gap-1">
                          {statusConfig.icon}
                          {statusConfig.label}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>

                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusUpdate(
                              order.id,
                              value as Order["status"]
                            )
                          }
                          disabled={updatingOrderId === order.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatuses.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                <div className="flex items-center gap-2">
                                  {status.icon}
                                  {status.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {Math.ceil(totalOrders / pageSize)} (
            {totalOrders} total orders)
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={
                    !hasPrevPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              {hasNextPage && (
                <PaginationItem>
                  <PaginationLink onClick={nextPage} className="cursor-pointer">
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={nextPage}
                  className={
                    !hasNextPage
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        onOrderUpdated={refetch}
      />
    </>
  );
};
