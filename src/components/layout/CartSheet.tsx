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
import { Loader2, ShoppingCart } from "lucide-react";
import Link from "next/link";

import OffersBanner from "@/components/banners/OffersBanner";
import { formatPriceLocalized } from "@/utils/price";
import CartItem from "@/components/cart/CartItem";
import { useCartSheet } from "@/hooks/useCartSheet";
import { Suspense } from "react";

interface CartSheetProps {
  children: React.ReactNode;
}

function CartSheet({ children }: CartSheetProps) {
  const { items, totalItems, totalPrice, updateQuantity, removeItem } =
    useCartStore();
  const { cartOpen, setCartOpen } = useCartSheet();

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-[90%] sm:max-w-sm">
        <SheetHeader className="space-y-4 px-2 pb-0 pt-3">
          <div className="flex items-center justify-center">
            <SheetTitle className="text-foreground">Shopping Cart</SheetTitle>
          </div>
          <OffersBanner />
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-scroll">
          {items.length === 0 ? (
            <div className="text-center text-muted h-full flex items-center justify-center">
              <p className="text-3xl font-semibold sm:text-5xl flex flex-col gap-3">
                {"Add Some Joy To Your Journey".split(" ").map((char, i) => (
                  <span key={i} className="italic">
                    {char}
                  </span>
                ))}
              </p>
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
            <div className="rounded-lg px-2">
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

export default function CartSheetWrapper({ children }: CartSheetProps) {
  return (
    <Suspense fallback={<Loader2 className="w-4 h-4 animate-spin" />}>
      <CartSheet>{children}</CartSheet>
    </Suspense>
  );
}
