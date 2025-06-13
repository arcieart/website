import { Collections } from "@/constants/Collections";
import { db } from "./firebase-admin";
import { Coupon } from "@/types/coupon";

export const getCoupon = async (id: string) => {
  const coupon = await db.collection(Collections.Coupons).doc(id).get();
  return coupon.data();
};

export const createCoupon = async (coupon: Coupon) => {
  const couponRef = db.collection(Collections.Coupons).doc();
  await couponRef.set(coupon);
  return couponRef.id;
};
