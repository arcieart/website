"use server";


import { getTimestamp } from "@/utils/date";
import { Collections } from "@/constants/Collections";
import { Coupon } from "@/types/coupon";
import { db } from "@/lib/firebase-admin";

export const validateCoupon = async (couponCode: string) => {
  // Convert to uppercase for case-insensitive validation
  const normalizedCode = couponCode.toUpperCase();
  const coupon = await getCouponAdmin(normalizedCode);
  if (!coupon) {
    return { isValid: false, error: "Coupon not found" };
  }

  if (coupon.validUntil && coupon.validUntil < getTimestamp()) {
    return { isValid: false, error: "Coupon has expired" };
  }

  return coupon;
};



export const getCouponAdmin = async (id: string) => {
  const coupon = await db.collection(Collections.Coupons).doc(id).get();
  return coupon.data();
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