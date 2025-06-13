"use client";

import { useState, useEffect } from "react";
import { Plus, X, Loader2, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Coupon } from "@/types/coupon";
import { getTimestamp } from "@/utils/misc";
import { createCouponAdmin, updateCouponAdmin } from "@/actions/coupon";
import { getDate } from "@/utils/date";

const defaultCouponData: Omit<Coupon, "id"> = {
  code: "",
  name: "",
  description: "",
  validUntil: null,
  active: true,
  createdAt: getTimestamp(),
  minOrderAmount: null,
  discountType: "fixed",
  discountValue: 0,
  maxDiscountAmount: null,
  currency: "INR",
};

interface CouponSheetProps {
  trigger?: React.ReactNode;
  onCouponSaved?: () => void;
  coupon?: Coupon | null;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CouponSheet({
  trigger,
  onCouponSaved,
  coupon,
  isOpen: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CouponSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [couponData, setCouponData] = useState(defaultCouponData);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onOpenChange =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen;

  const isEditMode = !!coupon;

  // Initialize form data when coupon changes or sheet opens
  useEffect(() => {
    if (isOpen) {
      if (coupon) {
        // Edit mode - load existing coupon data
        const { id, ...couponWithoutId } = coupon;
        setCouponData(couponWithoutId);
      } else {
        // Add mode - reset to defaults
        setCouponData(defaultCouponData);
      }
    }
  }, [isOpen, coupon]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setCouponData(defaultCouponData);
    }
  }, [isOpen]);

  const generateCouponCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCouponData((prev) => ({ ...prev, code: result }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditMode && coupon?.id) {
        // Update existing coupon
        await updateCouponAdmin(coupon.id, { ...couponData, id: coupon.id });
        console.log("Updated coupon:", couponData);
      } else {
        // Create new coupon
        const newCoupon: Omit<Coupon, "id"> = { ...couponData };
        const couponId = await createCouponAdmin(newCoupon);
        console.log("Created coupon with ID:", couponId);
      }

      // Trigger callback
      onCouponSaved?.();

      // Reset form and close
      setCouponData(defaultCouponData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("Error saving coupon. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateForInput = (timestamp: number | null) => {
    if (!timestamp) return "";
    return getDate(timestamp).toISOString().split("T")[0];
  };

  const handleDateChange = (dateString: string) => {
    if (!dateString) {
      setCouponData((prev) => ({ ...prev, validUntil: null }));
      return;
    }

    const date = new Date(dateString);
    // Set to end of day
    date.setHours(23, 59, 59, 999);
    setCouponData((prev) => ({
      ...prev,
      validUntil: Math.floor(date.getTime() / 1000),
    }));
  };

  const sheetContent = (
    <SheetContent className="w-[600px] sm:max-w-none overflow-y-auto p-8">
      <SheetHeader className="pb-6">
        <SheetTitle className="text-2xl">
          {isEditMode ? "Edit Coupon" : "Add New Coupon"}
        </SheetTitle>
        <SheetDescription className="text-base">
          {isEditMode
            ? "Update coupon details"
            : "Create a new discount coupon"}
        </SheetDescription>
      </SheetHeader>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Coupon Info */}
        <div className="space-y-6 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Coupon Code
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponData.code}
                onChange={(e) =>
                  setCouponData((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                className="flex-1"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateCouponCode}
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Coupon Name
            </label>
            <Input
              placeholder="Enter coupon name"
              value={couponData.name}
              onChange={(e) =>
                setCouponData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Description
            </label>
            <Textarea
              placeholder="Enter coupon description"
              className="min-h-24"
              value={couponData.description}
              onChange={(e) =>
                setCouponData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Valid Until
            </label>
            <div className="relative">
              <Input
                type="date"
                value={formatDateForInput(couponData.validUntil)}
                onChange={(e) => handleDateChange(e.target.value)}
                className="pl-10"
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty for no expiration date
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Active
            </label>
            <Select
              value={couponData.active.toString()}
              onValueChange={(value) =>
                setCouponData((prev) => ({
                  ...prev,
                  active: value === "true",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Discount Settings */}
        <div className="space-y-6 p-6 border rounded-lg">
          <h3 className="text-lg font-semibold">Discount Settings</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Discount Type
            </label>
            <Select
              value={couponData.discountType}
              onValueChange={(value) =>
                setCouponData((prev) => ({
                  ...prev,
                  discountType: value as
                    | "fixed"
                    | "percentage"
                    | "free_shipping",
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="free_shipping">Free Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {couponData.discountType !== "free_shipping" && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Discount Value
                {couponData.discountType === "fixed" && " (₹)"}
                {couponData.discountType === "percentage" && " (%)"}
              </label>
              <Input
                type="number"
                placeholder="0"
                value={couponData.discountValue || ""}
                onChange={(e) =>
                  setCouponData((prev) => ({
                    ...prev,
                    discountValue: parseFloat(e.target.value) || 0,
                  }))
                }
                required
                min="0"
                step={couponData.discountType === "percentage" ? "0.01" : "1"}
                max={
                  couponData.discountType === "percentage" ? "100" : undefined
                }
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Minimum Order Amount (₹)
            </label>
            <Input
              type="number"
              placeholder="No minimum"
              value={couponData.minOrderAmount || ""}
              onChange={(e) =>
                setCouponData((prev) => ({
                  ...prev,
                  minOrderAmount: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                }))
              }
              min="0"
              step="0.01"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for no minimum order requirement
            </p>
          </div>

          {couponData.discountType === "percentage" && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Maximum Discount Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="No maximum"
                value={couponData.maxDiscountAmount || ""}
                onChange={(e) =>
                  setCouponData((prev) => ({
                    ...prev,
                    maxDiscountAmount: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  }))
                }
                min="0"
                step="0.01"
              />
              <p className="text-xs text-muted-foreground">
                Maximum discount amount for percentage-based coupons
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {isEditMode ? "Update Coupon" : "Add Coupon"}
              </>
            )}
          </Button>
        </div>
      </form>
    </SheetContent>
  );

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      {sheetContent}
    </Sheet>
  );
}

// Convenience component for adding coupons
export function AddCouponSheet({
  onCouponSaved,
}: {
  onCouponSaved?: () => void;
}) {
  return (
    <CouponSheet
      trigger={
        <Button>
          <Plus className="w-4 h-4 mr-1" />
          Add Coupon
        </Button>
      }
      onCouponSaved={onCouponSaved}
    />
  );
}
