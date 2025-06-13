"use client";

import { useState } from "react";
import { AddCouponSheet, CouponSheet } from "./CouponSheet";
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
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  Trash2,
  Pencil,
  Copy,
  Calendar,
} from "lucide-react";
import { Coupon } from "@/types/coupon";

// Mock data for demonstration - replace with actual API calls
const generateMockCoupons = (): Coupon[] => {
  return [
    {
      id: "1",
      code: "SAVE10",
      name: "Save 10%",
      description: "Get 10% off on all orders",
      validUntil: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
      active: true,
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
      minOrderAmount: 500,
      discountType: "percentage",
      discountValue: 10,
      maxDiscountAmount: 100,
      currency: "INR",
    },
    {
      id: "2",
      code: "FLAT50",
      name: "Flat ₹50 Off",
      description: "Get flat ₹50 off on orders above ₹200",
      validUntil: null,
      active: true,
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      minOrderAmount: 200,
      discountType: "fixed",
      discountValue: 50,
      maxDiscountAmount: null,
      currency: "INR",
    },
    {
      id: "3",
      code: "FREESHIP",
      name: "Free Shipping",
      description: "Free shipping on all orders",
      validUntil: Date.now() + 15 * 24 * 60 * 60 * 1000,
      active: false,
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      minOrderAmount: null,
      discountType: "free_shipping",
      discountValue: 0,
      maxDiscountAmount: null,
      currency: "INR",
    },
  ];
};

type CouponFilter = "all" | "active" | "inactive" | "expired";

export const CouponManagement = () => {
  const [statusFilter, setStatusFilter] = useState<CouponFilter>("all");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock state - replace with actual data fetching
  const [coupons, setCoupons] = useState<Coupon[]>(generateMockCoupons());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter coupons based on status
  const filteredCoupons = coupons.filter((coupon) => {
    const now = Date.now();
    const isExpired = coupon.validUntil && coupon.validUntil < now;

    switch (statusFilter) {
      case "active":
        return coupon.active && !isExpired;
      case "inactive":
        return !coupon.active;
      case "expired":
        return isExpired;
      default:
        return true;
    }
  });

  const totalCoupons = filteredCoupons.length;
  const totalPages = Math.ceil(totalCoupons / pageSize);
  const paginatedCoupons = filteredCoupons.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const refetch = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCoupons(generateMockCoupons());
      setLoading(false);
    }, 500);
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "No expiry";
    return new Date(timestamp).toLocaleDateString();
  };

  const formatDiscountValue = (coupon: Coupon) => {
    switch (coupon.discountType) {
      case "fixed":
        return `₹${coupon.discountValue}`;
      case "percentage":
        return `${coupon.discountValue}%`;
      case "free_shipping":
        return "Free Shipping";
      default:
        return "-";
    }
  };

  const getCouponStatus = (coupon: Coupon) => {
    const now = Date.now();
    const isExpired = coupon.validUntil && coupon.validUntil < now;

    if (isExpired) return "expired";
    if (!coupon.active) return "inactive";
    return "active";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
  };

  const handleCouponUpdated = () => {
    refetch();
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = async (couponId: string, couponCode: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete coupon "${couponCode}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingIds((prev) => new Set(prev).add(couponId));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Failed to delete coupon. Please try again.");
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }
  };

  const handleCopyCouponCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
      console.log(`Copied coupon code: ${code}`);
    } catch (error) {
      console.error("Failed to copy coupon code:", error);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Error loading coupons</p>
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
          <h3 className="text-lg font-semibold">Coupon Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage discount coupons and promotional codes
          </p>
        </div>
        <AddCouponSheet onCouponSaved={refetch} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Filter by status:
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as CouponFilter);
              setCurrentPage(1); // Reset to first page when filtering
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={refetch}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4  ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Coupons Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Valid Until</TableHead>
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
                    Loading coupons...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedCoupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="text-muted-foreground">
                    {statusFilter === "all"
                      ? "No coupons found. Add your first coupon to get started."
                      : `No ${statusFilter} coupons found.`}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedCoupons.map((coupon) => {
                const status = getCouponStatus(coupon);
                return (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                          {coupon.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCouponCode(coupon.code)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{coupon.name}</TableCell>
                    <TableCell>{formatDiscountValue(coupon)}</TableCell>
                    <TableCell>
                      {coupon.minOrderAmount
                        ? `₹${coupon.minOrderAmount}`
                        : "No minimum"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(coupon.validUntil)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCoupon(coupon)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                          onClick={() =>
                            handleDeleteCoupon(coupon.id, coupon.code)
                          }
                          disabled={deletingIds.has(coupon.id)}
                        >
                          {deletingIds.has(coupon.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
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
      {!loading && paginatedCoupons.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing page {currentPage} of {totalPages} ({totalCoupons} total
            coupons)
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={prevPage}
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink isActive>{currentPage}</PaginationLink>
              </PaginationItem>

              {currentPage < totalPages && (
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
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Edit Coupon Sheet */}
      {editingCoupon && (
        <CouponSheet
          coupon={editingCoupon}
          onCouponSaved={handleCouponUpdated}
          isOpen={!!editingCoupon}
          onOpenChange={(open) => {
            if (!open) setEditingCoupon(null);
          }}
        />
      )}
    </>
  );
};
