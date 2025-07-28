"use client";

import { useRef, useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart";
import { formatPriceLocalized } from "@/utils/price";
import { getFreeShippingThreshold, getShippingCost } from "@/config/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ShoppingCart,
  Truck,
  CreditCard,
  MapPin,
  User,
  Tag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import OrderCardItem from "./OrderCardItem";
import { CustomerInfo, Order } from "@/types/order";
import { getTimestamp } from "@/utils/misc";
import { createOrder, updateOrder } from "@/actions/order";
import { identifyUser, trackPurchaseCompleted } from "@/lib/analytics";
import {
  RazorpayPaymentGateway,
  RazorpayPaymentGatewayRef,
} from "@/components/RzpGateway";
import OrderConfirmationDialog from "@/components/OrderConfirmationDialog";
import { useDiscountCoupon } from "@/hooks/useDiscountCoupon";
import { calculateDiscountAmount } from "@/utils/coupon";
import { CouponForm } from "./CouponForm";
import { RequiredStar } from "@/components/misc/RequiredStar";

import {
  FormErrors,
  validateForm,
  validateField,
  CheckoutFormData,
} from "@/utils/inputValidation";

const BRO_DISCOUNT_CODE = process.env.NEXT_PUBLIC_BRO_DISCOUNT_CODE;

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCartStore();
  const {
    coupon,
    isLoading: couponIsLoading,
    handleCouponApply,
    handleCouponRemove,
  } = useDiscountCoupon();

  const router = useRouter();

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [isNavigatingToOrder, setIsNavigatingToOrder] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });

  const rzpRef = useRef<RazorpayPaymentGatewayRef>(null);

  const subtotal = totalPrice;
  const discountAmount = coupon ? calculateDiscountAmount(coupon, subtotal) : 0;

  let shippingCost =
    subtotal > getFreeShippingThreshold() ? 0 : getShippingCost(); // Free shipping above threshold

  if (coupon && coupon.discountType === "free_shipping") {
    shippingCost = 0;
  }

  if (coupon && coupon.code === BRO_DISCOUNT_CODE) {
    shippingCost = 0;
  }

  const finalTotal = subtotal + shippingCost - discountAmount;

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputBlur = (field: keyof CheckoutFormData) => {
    const value = formData[field];
    const error = validateField<CheckoutFormData>(field, value || "");

    if (error) {
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    } else {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCouponApplyForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const couponCode = (e.target as HTMLFormElement).couponCode.value;
    const normalCouponCode = couponCode.trim().toUpperCase();

    const { success, error } = await handleCouponApply(
      normalCouponCode,
      subtotal
    );

    if (success) {
      toast.success("Coupon applied successfully 🎊");
    } else toast.error(error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fieldsToValidate: (keyof CheckoutFormData)[] = [
      "name",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "pincode",
    ];

    const submitErrors = validateForm(formData, fieldsToValidate);

    const isFormValid = Object.keys(submitErrors).length === 0;

    if (!isFormValid) {
      setFormErrors(submitErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    // Review
    const customerInfo: CustomerInfo = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      landmark: formData.landmark,
    };

    try {
      const order: Omit<Order, "id"> = {
        customerInfo,
        products: items.map((item) => ({
          id: item.id,
          productId: item.product.id,
          productSlug: item.product.slug,
          name: item.product.name,
          categoryId: item.product.categoryId || "unknown",
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity,
          imageUrl: item.product.images[0],
          sku: item.id,
          description: item.product.description,
          customizations: item.customizations,
        })),
        pricing: {
          subtotal,
          shipping: shippingCost,
          tax: 0,
          total: finalTotal,
          couponCode: coupon?.code || undefined,
        },
        payment: {
          method: coupon?.code === BRO_DISCOUNT_CODE ? "cod" : "razorpay",
          status: "pending",
        },
        status: "initiated",
        createdAt: getTimestamp(),
        source: "website",
      };

      identifyUser(order.customerInfo.email, {
        name: order.customerInfo.name,
        email: order.customerInfo.email,
      });

      const createdOrder = await createOrder(order);

      // console.log("Created order:", createdOrder);

      if (createdOrder.payment.method === "razorpay") {
        rzpRef.current?.handlePayment(createdOrder);
      } else {
        finalizeOrder(createdOrder.id);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function handlePaymentSuccess(orderId: string) {
    finalizeOrder(orderId);
  }

  function handlePaymentCancel(orderId: string) {
    if (!orderId) return;
    updateOrder(orderId, { status: "cancelled" });
  }

  function handlePaymentFailed() {
    toast.error("Payment failed. Please try again");
  }

  function finalizeOrder(orderId: string) {
    setConfirmedOrderId(orderId);

    // Track purchase completed event
    trackPurchaseCompleted({
      orderId: orderId,
      totalAmount: finalTotal,
      subtotal: subtotal,
      shippingCost: shippingCost,
      discountAmount: discountAmount,
      couponCode: coupon?.code,
      paymentMethod: "razorpay",
      items: items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        categoryId: item.product.categoryId,
        price: item.product.price,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
    });
  }

  function handleCloseConfirmationDialog(orderId: string) {
    setConfirmedOrderId("");
    setIsNavigatingToOrder(true);
    clearCart(); // Clear immediately to ensure it happens
    router.push(`/order/${orderId}`);
  }

  return (
    <>
      <RazorpayPaymentGateway
        ref={rzpRef}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
        onFailed={handlePaymentFailed}
      />

      <OrderConfirmationDialog
        isOpen={!!confirmedOrderId}
        orderId={confirmedOrderId}
        orderTotal={formatPriceLocalized(finalTotal)}
        onClose={handleCloseConfirmationDialog}
      />

      {/* Navigation Loading Overlay */}
      {isNavigatingToOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Redirecting to your order...
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <Link href="/products">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm gap-2"
                >
                  <span className="flex items-center group transition-all">
                    <ArrowLeft className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                    <span className="inline">Back to Shopping</span>
                  </span>
                </Button>
              </Link>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground text-center md:text-left">
                Checkout
              </h1>
            </div>
          </div>

          <div className="flex flex-col-reverse lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Order Form */}
            <div className="flex-1">
              <Card>
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Personal Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="name" className="text-sm gap-1">
                          Full Name
                          <RequiredStar />
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          className={
                            formErrors.name ? "border-destructive" : ""
                          }
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          onBlur={(e) => handleInputBlur("name")}
                        />
                        {formErrors.name && (
                          <p className="text-xs sm:text-sm text-destructive">
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="email" className="gap-1 text-sm">
                            Email <RequiredStar />
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            onBlur={(e) => handleInputBlur("email")}
                            className={
                              formErrors.email ? "border-destructive" : ""
                            }
                          />
                          {formErrors.email && (
                            <p className="text-xs sm:text-sm text-destructive">
                              {formErrors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="phone" className="gap-1 text-sm">
                            Phone <RequiredStar />
                          </Label>

                          <span className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              +91
                            </span>
                            <Input
                              id="phone"
                              type="tel"
                              maxLength={10}
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              onBlur={(e) => handleInputBlur("phone")}
                              className={
                                formErrors.phone ? "border-destructive" : ""
                              }
                            />
                          </span>
                          {formErrors.phone && (
                            <p className="text-xs sm:text-sm text-destructive">
                              {formErrors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator className="my-5" />

                    {/* Address Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                        <h3 className="text-base sm:text-lg font-semibold">
                          Address Details
                        </h3>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="address" className="text-sm gap-1">
                          Full Address <RequiredStar />
                        </Label>
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) =>
                            handleInputChange("address", e.target.value)
                          }
                          onBlur={(e) => handleInputBlur("address")}
                          className={
                            formErrors.address ? "border-destructive" : ""
                          }
                          rows={3}
                        />
                        {formErrors.address && (
                          <p className="text-xs sm:text-sm text-destructive">
                            {formErrors.address}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="landmark" className="text-sm gap-1">
                          Landmark
                        </Label>
                        <Input
                          id="landmark"
                          type="text"
                          className="text-xs sm:text-sm"
                          value={formData.landmark}
                          onChange={(e) =>
                            handleInputChange("landmark", e.target.value)
                          }
                          onBlur={(e) => handleInputBlur("landmark")}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="city" className="text-sm gap-1">
                            City <RequiredStar />
                          </Label>
                          <Input
                            id="city"
                            type="text"
                            value={formData.city}
                            onChange={(e) =>
                              handleInputChange("city", e.target.value)
                            }
                            onBlur={(e) => handleInputBlur("city")}
                            className={
                              formErrors.city ? "border-destructive" : ""
                            }
                          />
                          {formErrors.city && (
                            <p className="text-xs sm:text-sm text-destructive">
                              {formErrors.city}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="state" className="text-sm gap-1">
                            State <RequiredStar />
                          </Label>
                          <Input
                            id="state"
                            type="text"
                            value={formData.state}
                            onChange={(e) =>
                              handleInputChange("state", e.target.value)
                            }
                            onBlur={(e) => handleInputBlur("state")}
                            className={
                              formErrors.state ? "border-destructive" : ""
                            }
                          />
                          {formErrors.state && (
                            <p className="text-xs sm:text-sm text-destructive">
                              {formErrors.state}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5 sm:space-y-2">
                          <Label htmlFor="pincode" className="text-sm gap-1">
                            Pincode <RequiredStar />
                          </Label>
                          <Input
                            id="pincode"
                            type="text"
                            value={formData.pincode}
                            onChange={(e) =>
                              handleInputChange("pincode", e.target.value)
                            }
                            onBlur={(e) => handleInputBlur("pincode")}
                            className={
                              formErrors.pincode ? "border-destructive" : ""
                            }
                            maxLength={6}
                          />
                          {formErrors.pincode && (
                            <p className="text-xs sm:text-sm text-destructive">
                              {formErrors.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full text-sm sm:text-base"
                      size="lg"
                      disabled={isSubmitting || totalItems === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          <span className="text-sm sm:text-base">
                            Processing Order...
                          </span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="text-sm sm:text-base">
                            Place Order
                            {totalItems > 0 &&
                              ` • ${formatPriceLocalized(finalTotal)}`}
                          </span>
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="flex-1">
              <Card>
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="flex items-center justify-between gap-2 w-full">
                      <span>Order Summary</span>
                      <span className="text-xs text-muted-foreground">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </span>
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {items.length === 0 ? (
                    /* Empty Cart State */
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                      <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4">
                        Add some items to your cart to proceed with checkout
                      </p>
                      <Link href="/products">
                        <Button variant="outline" size="sm" className="group">
                          Continue Shopping
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      {/* Cart Items */}
                      <div className="space-y-2 sm:space-y-3">
                        {items.map((item) => (
                          <OrderCardItem key={item.id} item={item} />
                        ))}
                      </div>

                      <Separator className="my-5" />

                      <CouponForm
                        coupon={coupon}
                        handleCouponRemove={handleCouponRemove}
                        handleCouponApplyForm={handleCouponApplyForm}
                        couponIsLoading={couponIsLoading}
                        discountAmount={discountAmount}
                      />

                      <Separator className="my-5" />

                      {/* Pricing Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm sm:text-sm">
                          <span className="flex flex-col items-start gap-1">
                            <span className="flex items-center gap-1">
                              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                              Subtotal
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {totalItems} {totalItems === 1 ? "item" : "items"}
                            </span>
                          </span>
                          <span>{formatPriceLocalized(subtotal)}</span>
                        </div>

                        {coupon && discountAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="flex flex-col items-start gap-1">
                              <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                                Discount
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Applied{" "}
                                <span className="font-semibold text-primary">
                                  {coupon.code}
                                </span>
                              </span>
                            </span>

                            <span className="text-positive">
                              - {formatPriceLocalized(discountAmount)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between text-sm sm:text-sm items-center">
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Shipping</span>
                          </div>
                          {shippingCost > 0 ? (
                            <span>{formatPriceLocalized(shippingCost)}</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <span className="line-through">
                                {formatPriceLocalized(getShippingCost())}
                              </span>
                              <span className="text-positive">FREE</span>
                            </div>
                          )}
                        </div>

                        <Separator className="my-5" />

                        <div className="flex justify-between font-semibold text-lg sm:text-lg">
                          <span>Total</span>
                          <span>{formatPriceLocalized(finalTotal)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
