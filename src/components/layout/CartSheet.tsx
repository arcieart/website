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
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import CouponBanner from "@/components/banners/CouponBanner";
import { formatPriceLocalized } from "@/utils/price";
import CartItem from "@/components/cart/CartItem";
import { useCartSheet } from "@/hooks/useCartSheet";

interface CartSheetProps {
  children: React.ReactNode;
}

export default function CartSheet({ children }: CartSheetProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCartStore();
  const { cartOpen, setCartOpen } = useCartSheet();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-sm">
        <SheetHeader className="space-y-6 px-2 pb-0 pt-3">
          <div className="flex items-center justify-center">
            <SheetTitle className="text-foreground">Shopping Cart</SheetTitle>
          </div>
          <CouponBanner />
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-scroll">
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
              <div className="space-y-4 p-2 pt-0">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <SheetFooter className="gap-3 px-0 pt-0">
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
            <SheetClose asChild>
              <Button className="flex-1" disabled={totalItems === 0} asChild>
                <Link href="/checkout">
                  Checkout{" "}
                  {totalPrice > 0
                    ? `• ${formatPriceLocalized(totalPrice)}`
                    : ""}
                </Link>
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
