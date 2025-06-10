"use client";

import { useState } from "react";
import { useCartStore } from "@/stores/cart";
import { formatPriceLocalized } from "@/utils/price";
import {
  getFreeShippingThreshold,
  getShippingCost,
  getTaxRate,
} from "@/config/currency";
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
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import OrderCardItem from "./OrderCardItem";

// Form validation
interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

const RequiredStar = () => {
  return <span className="text-destructive">*</span>;
};

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, clearCart } = useCartStore();

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

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing
  const subtotal = totalPrice;
  const shippingCost =
    subtotal > getFreeShippingThreshold() ? 0 : getShippingCost(); // Free shipping over ₹999

  const finalTotal = subtotal + shippingCost;

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return phoneRegex.test(phone);
  };

  const validatePincode = (pincode: string): boolean => {
    const pincodeRegex = /^[1-9][0-9]{5}$/; // Indian pincode format
    return pincodeRegex.test(pincode);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length < 10) {
      errors.address =
        "Please enter a complete address (at least 10 characters)";
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    // State validation
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    // Pincode validation
    if (!formData.pincode.trim()) {
      errors.pincode = "Pincode is required";
    } else if (!validatePincode(formData.pincode)) {
      errors.pincode = "Please enter a valid 6-digit pincode";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCouponApply = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Coupon applied");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Here you would typically send the order to your backend
      console.log("Order data:", {
        customerInfo: formData,
        items,
        pricing: {
          subtotal,
          shipping: shippingCost,
          tax: 0,
          total: finalTotal,
        },
      });

      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully!");

      // Redirect to success page (you might want to create this)
      router.push("/?orderSuccess=true");
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Redirect to products if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-4 sm:mb-6">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2">
                Your cart is empty
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground px-4">
                Add some items to your cart before proceeding to checkout
              </p>
            </div>
            <Link href="/products">
              <Button className="text-xs sm:text-sm">
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
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
                        className={formErrors.name ? "border-destructive" : ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
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
                    disabled={isSubmitting}
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
                          Place Order • {formatPriceLocalized(finalTotal)}
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
                {/* Cart Items */}
                <div className="space-y-2 sm:space-y-3">
                  {items.map((item) => (
                    <OrderCardItem key={item.id} item={item} />
                  ))}
                </div>

                <Separator />

                <form onSubmit={handleCouponApply}>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      placeholder="Enter coupon code"
                      className="w-full"
                    />
                    <Button type="submit" variant="outline">
                      Apply
                    </Button>
                  </div>
                </form>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm sm:text-sm">
                    <span>Subtotal</span>
                    <span>{formatPriceLocalized(subtotal)}</span>
                  </div>

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

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg sm:text-lg">
                    <span>Total</span>
                    <span>{formatPriceLocalized(finalTotal)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                {/* <div className="mt-4 sm:mt-6 p-2 sm:p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5" />
                    <div className="text-sm sm:text-sm">
                      <p className="font-medium text-primary text-sm sm:text-sm">
                        Delivery Information
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-xs mt-1">
                        Expected delivery: 5-7 business days
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-xs">
                        Free shipping on orders over ₹999
                      </p>
                    </div>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
