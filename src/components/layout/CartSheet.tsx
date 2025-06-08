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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";
import CouponBanner from "@/components/banners/CouponBanner";
import { formatPriceLocalized } from "@/utils/price";

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
        <SheetHeader className="space-y-6 mt-10">
          <CouponBanner />

          <div className="flex items-center gap-3">
            <ShoppingCart className="h-6 w-6 text-foreground" />
            <SheetTitle className="text-foreground">Shopping Cart</SheetTitle>
            <Badge variant="secondary" className="ml-auto">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 py-6">
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
              <div className="flex-1 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border bg-card p-4"
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
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
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

              <Separator />

              {/* Order Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatPriceLocalized(totalPrice)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-foreground">
                    {formatPriceLocalized(totalPrice)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <SheetFooter className="gap-3 pt-6">
          <SheetClose asChild>
            <Button variant="outline" className="flex-1">
              Continue Shopping
            </Button>
          </SheetClose>
          <Button className="flex-1" disabled={totalItems === 0}>
            Checkout{" "}
            {totalPrice > 0 ? `• ${formatPriceLocalized(totalPrice)}` : ""}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
