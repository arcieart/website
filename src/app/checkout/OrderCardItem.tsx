import { CartItem } from "@/stores/cart";
import { formatPriceLocalized } from "@/utils/price";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { CustomizationBadge } from "@/components/products/CustomizationBadge";
import Link from "next/link";

export default function OrderCardItem({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border bg-muted/30">
      <div className="relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-md bg-muted">
        <Link
          href={`/products/${item.product.categoryId}/${item.product.slug}`}
        >
          {item.product.images && item.product.images[0] ? (
            <Image
              width={64}
              height={64}
              src={item.product.images[0]}
              alt={item.product.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ShoppingCart className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
          )}
        </Link>
      </div>

      <div className="flex-1 space-y-1">
        <h4 className="font-medium text-sm sm:text-sm leading-tight">
          <Link
            href={`/products/${item.product.categoryId}/${item.product.slug}`}
            className="hover:underline"
          >
            {item.product.name}
          </Link>
        </h4>

        {/* Customizations */}
        {Object.keys(item.customizations).length > 0 && (
          <div className="flex flex-wrap gap-0.5 sm:gap-1">
            {Object.entries(item.customizations)
              .filter(([_, value]) => value && value !== "")
              .map(([key, value]) => {
                return (
                  <CustomizationBadge
                    key={`${key}-${value}`}
                    customizationId={key}
                    value={value}
                  />
                );
              })}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-xs text-muted-foreground">
            Qty: {item.quantity}
          </span>
          <span className="font-semibold text-sm sm:text-sm">
            {formatPriceLocalized(item.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
