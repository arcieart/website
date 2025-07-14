import { RequiredStar } from "@/components/misc/RequiredStar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coupon } from "@/types/coupon";
import { formatPrice } from "@/utils/price";
import { CheckCircle2, Loader2, X } from "lucide-react";

export const CouponForm = ({
  coupon,
  handleCouponRemove,
  handleCouponApplyForm,
  couponIsLoading,
  discountAmount,
}: {
  coupon: Coupon | null;
  handleCouponRemove: () => void;
  handleCouponApplyForm: (e: React.FormEvent) => void;
  couponIsLoading: boolean;
  discountAmount: number;
}) => {
  return (
    <>
      {coupon && coupon.code ? (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Coupon Applied:
                  </span>
                  <code className="text-sm font-mono font-semibold text-green-900 dark:text-green-100 bg-green-100 dark:bg-green-900 px-2 py-0.5 rounded">
                    {coupon.code}
                  </code>
                </div>
                {discountAmount > 0 && (
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    You saved {formatPrice(discountAmount)}!
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCouponRemove()}
              className="text-green-700 hover:text-green-900 hover:bg-green-100 dark:text-green-300 dark:hover:text-green-100 dark:hover:bg-green-900 flex-shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove coupon</span>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCouponApplyForm}>
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="couponCode" className="text-sm gap-1">
              Have a discount code? <RequiredStar />
            </Label>
            <div className="flex items-center gap-2 w-full">
              <Input
                type="text"
                name="couponCode"
                placeholder="Enter here"
                className="flex-1"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={couponIsLoading}
              >
                {couponIsLoading ? (
                  <span>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  </span>
                ) : (
                  <span>Apply</span>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};
