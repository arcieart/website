export type Coupon = {
  id: string;
  code: string;
  name: string;
  description: string;
  validUntil: number | null;
  active: boolean;
  createdAt: number;
  minOrderAmount: number | null;
  discountType: 'fixed' | 'percentage' | 'free_shipping';
  discountValue: number;
  maxDiscountAmount: number | null;
  currency: "INR";
};