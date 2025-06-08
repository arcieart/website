"use client";

import { useCartStore } from "@/stores/cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import CouponBanner from "@/components/banners/CouponBanner";
import { formatPriceLocalized } from "@/utils/price";
import { QuantityStepper } from "../misc/QuantityStepper";

interface CartSheetProps {
  children: React.ReactNode;
}

export default function CartSheet({ children }: CartSheetProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCartStore();

  const getCustomizationText = (customizations: Record<string, any>) => {
    return Object.entries(customizations)
      .filter(([_, value]) => value && value !== "")
      .map(([key, value]) => {
        if (typeof value === "object" && value.name) {
          return `${key}: ${value.name}`;
        }
        return `${key}: ${value}`;
      })
      .join(", ");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[85%] sm:max-w-lg">
        <SheetHeader className="space-y-6 px-2 pb-0">
          <div className="flex items-center justify-center gap-3">
            <SheetTitle className="text-foreground">Shopping Cart</SheetTitle>
          </div>
          <CouponBanner />
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-foreground">
                  Your cart is empty
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add some items to get started
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 space-y-4 p-2 pt-0">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border bg-card p-2"
                  >
                    <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                      {item.product.images && item.product.images[0] ? (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <ShoppingCart className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium text-foreground leading-none">
                        {item.product.name}
                      </h4>
                      {getCustomizationText(item.customizations) && (
                        <p className="text-xs text-muted-foreground">
                          {getCustomizationText(item.customizations)}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-sm font-semibold text-foreground">
                          {formatPriceLocalized(item.totalPrice)}
                        </span>
                        <div className="flex items-center gap-3">
                          <QuantityStepper
                            quantity={item.quantity}
                            increment={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            decrement={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <SheetFooter className="gap-3 px-0">
          <Separator />

          <div className="space-y-4 px-2">
            <div className="rounded-lg bg-muted/30 px-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-foreground">
                  Subtotal
                </span>
                <span className="text-lg font-medium text-foreground">
                  {formatPriceLocalized(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Coupons can be applied at checkout
              </p>
            </div>
          </div>

          <div className="px-2 flex flex-col gap-2">
            <SheetClose asChild>
              <Button variant="outline" className="flex-1">
                Continue Shopping
              </Button>
            </SheetClose>
            <Button className="flex-1" disabled={totalItems === 0}>
              Checkout{" "}
              {totalPrice > 0 ? `• ${formatPriceLocalized(totalPrice)}` : ""}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
