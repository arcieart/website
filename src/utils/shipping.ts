import { Coupon } from "@/types/coupon";
import { getFreeShippingThreshold, getShippingCost } from "@/config/currency";

export const calculateShippingCost = (
  subtotal: number,
  coupon: (Coupon & { grantsFreeShipping?: boolean }) | null
) => {
  const freeShippingThreshold = getFreeShippingThreshold();

  if (subtotal > freeShippingThreshold) {
    return 0;
  }

  if (coupon && (coupon.discountType === "free_shipping" || coupon.grantsFreeShipping)) {
    return 0;
  }

  return getShippingCost();
};
