"use server";

import { getTimestamp } from "@/utils/date";
import { Collections } from "@/constants/Collections";
import { Coupon } from "@/types/coupon";
import { db } from "@/lib/firebase-admin";
import { calculateDiscountAmount } from "@/utils/coupon";

export const validateCouponAndGetSavings = async (
  couponCode: string,
  subtotal: number
) => {
  const normalizedCode = couponCode.toUpperCase();
  const coupon = await getCouponAdmin(normalizedCode);

  if (!coupon) {
    return { isValid: false, error: "Invalid coupon code" };
  }

  if (!coupon.active) {
    return { isValid: false, error: "Invalid coupon code" };
  }

  if (coupon.validUntil && coupon.validUntil < getTimestamp()) {
    return { isValid: false, error: "Coupon has expired" };
  }

  if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      error: "Order amount is less than the minimum order amount",
    };
  }

  const discountAmount = calculateDiscountAmount(coupon, subtotal);
  return { isValid: true, error: null, discountAmount, coupon };
};

export const getCouponAdmin = async (couponCode: string) => {
  const coupon = await db
    .collection(Collections.Coupons)
    .where("code", "==", couponCode)
    .limit(1)
    .get();
  if (coupon.empty) return null;
  return { id: coupon.docs[0].id, ...coupon.docs[0].data() } as Coupon;
};

export const createCouponAdmin = async (coupon: Omit<Coupon, "id">) => {
  const couponRef = db.collection(Collections.Coupons).doc();
  await couponRef.set(coupon);
  return couponRef.id;
};

export const getCouponsAdmin = async () => {
  const coupons = await db.collection(Collections.Coupons).get();
  return coupons.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Coupon[];
};

export const updateCouponAdmin = async (id: string, coupon: Coupon) => {
  const { id: _, ...couponWithoutId } = coupon;
  await db.collection(Collections.Coupons).doc(id).update(couponWithoutId);
};

export const deleteCouponAdmin = async (id: string) => {
  await db.collection(Collections.Coupons).doc(id).delete();
};
