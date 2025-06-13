"use client";

import { validateCouponAndGetSavings } from "@/actions/coupon";
import { Coupon } from "@/types/coupon";
import { useEffect, useState } from "react";

export const useDiscountCoupon = () => {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);

  const handleCouponRemove = () => {
    setCoupon(null);
  };

  const handleCouponApply = async (couponCode: string, subtotal: number) => {
    setIsLoading(true);
    const couponData = await validateCouponAndGetSavings(couponCode, subtotal);

    if (couponData.isValid && couponData.coupon) {
      setCoupon(couponData.coupon);
      setError(null);
      setIsLoading(false);
      return { success: true, error: null };
    } else {
      setCoupon(null);
      setError(couponData.error);
      setIsLoading(false);
      return { success: false, error: couponData.error };
    }
  };

  return {
    coupon,
    error,
    handleCouponApply,
    handleCouponRemove,
    isLoading,
  };
};
