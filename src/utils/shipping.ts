import { Coupon } from "@/types/coupon";
import { BRO_DISCOUNT_CODE } from "./coupon";
import { getFreeShippingThreshold, getShippingCost } from "@/config/currency";

export const calculateShippingCost = (
  subtotal: number,
  coupon: Coupon | null
) => {
  const freeShippingThreshold = getFreeShippingThreshold();

  if (subtotal > freeShippingThreshold) {
    return 0;
  }

  if (coupon && coupon.discountType === "free_shipping") {
    return 0;
  }

  if (coupon && coupon.code === BRO_DISCOUNT_CODE) {
    return 0;
  }

  return getShippingCost();
};
