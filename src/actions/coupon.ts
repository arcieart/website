"use server";

import { Collections } from "@/constants/Collections";
import { Coupon } from "@/types/coupon";
import { db } from "@/lib/firebase-admin";
import { assertAdmin } from "@/lib/assert-admin";
import { validateCoupon } from "@/lib/coupons";

export const validateCouponAndGetSavings = async (
  couponCode: string,
  subtotal: number
) => {
  return validateCoupon(couponCode, subtotal);
};

export const createCouponAdmin = async (
  idToken: string,
  coupon: Omit<Coupon, "id">
) => {
  await assertAdmin(idToken);
  const couponRef = db.collection(Collections.Coupons).doc();
  await couponRef.set({
    ...coupon,
    code: coupon.code.toUpperCase(),
  });
  return couponRef.id;
};

export const getCouponsAdmin = async (idToken: string) => {
  await assertAdmin(idToken);
  const coupons = await db.collection(Collections.Coupons).get();
  return coupons.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Coupon[];
};

export const updateCouponAdmin = async (
  idToken: string,
  id: string,
  coupon: Coupon
) => {
  await assertAdmin(idToken);
  const { id: _, ...couponWithoutId } = coupon;
  await db.collection(Collections.Coupons).doc(id).update({
    ...couponWithoutId,
    code: couponWithoutId.code.toUpperCase(),
  });
};

export const deleteCouponAdmin = async (idToken: string, id: string) => {
  await assertAdmin(idToken);
  await db.collection(Collections.Coupons).doc(id).delete();
};
