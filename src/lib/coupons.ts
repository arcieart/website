import "server-only";

import { Collections } from "@/constants/Collections";
import { db } from "@/lib/firebase-admin";
import { AppliedCoupon, Coupon } from "@/types/coupon";
import { getTimestamp } from "@/utils/date";
import { calculateDiscountAmount } from "@/utils/coupon";

const BRO_DISCOUNT_CODE = process.env.BRO_DISCOUNT_CODE;

function isBroDiscountCoupon(coupon: { code: string } | null | undefined) {
  if (!coupon || !BRO_DISCOUNT_CODE) return false;
  return coupon.code.toUpperCase() === BRO_DISCOUNT_CODE.toUpperCase();
}

function toAppliedCoupon(coupon: Coupon): AppliedCoupon {
  const isBro = isBroDiscountCoupon(coupon);
  return {
    ...coupon,
    grantsFreeShipping: coupon.discountType === "free_shipping" || isBro,
    isCashOrder: isBro,
  };
}

export async function getCouponByCode(couponCode: string) {
  const coupon = await db
    .collection(Collections.Coupons)
    .where("code", "==", couponCode)
    .limit(1)
    .get();

  if (coupon.empty) return null;
  return { id: coupon.docs[0].id, ...coupon.docs[0].data() } as Coupon;
}

export async function validateCoupon(couponCode: string, subtotal: number) {
  const normalizedCode = couponCode.toUpperCase();
  const coupon = await getCouponByCode(normalizedCode);

  if (!coupon) {
    return { isValid: false as const, error: "Invalid coupon code" };
  }

  if (!coupon.active) {
    return { isValid: false as const, error: "Invalid coupon code" };
  }

  if (coupon.validUntil && coupon.validUntil < getTimestamp()) {
    return { isValid: false as const, error: "Coupon has expired" };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      isValid: false as const,
      error: "Order amount is less than the minimum order amount",
    };
  }

  const discountAmount = calculateDiscountAmount(coupon, subtotal);
  return {
    isValid: true as const,
    error: null,
    discountAmount,
    coupon: toAppliedCoupon(coupon),
  };
}
