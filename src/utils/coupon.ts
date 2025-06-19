import { Coupon } from "@/types/coupon";

export const calculateDiscountAmount = (coupon: Coupon, subtotal: number) => {
  let discountAmount = 0;

  switch (coupon.discountType) {
    case "fixed":
      
      discountAmount = Math.max(coupon.discountValue, 0);
      break;

    case "percentage":
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
      break;

    case "free_shipping":
      // Free shipping handled separately in shipping calculation
      discountAmount = 0;
      break;
  }

  discountAmount = Math.round(discountAmount * 100) / 100;

  return discountAmount;
};
