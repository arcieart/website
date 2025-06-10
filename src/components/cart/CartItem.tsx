"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatPriceLocalized } from "@/utils/price";
import { QuantityStepper } from "../misc/QuantityStepper";
import { BaseCustomizations } from "@/data/customizations";
import Link from "next/link";
import { type CartItem } from "@/stores/cart";

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const getCustomizationItems = (customizations: Record<string, any>) => {
  return Object.entries(customizations)
    .filter(([_, value]) => value && value !== "")
    .map(([key, value]) => {
      let displayValue;
      if (typeof value === "object" && value !== null) {
        // Handle different object structures
        displayValue =
          value.label || value.name || value.value || JSON.stringify(value);
      } else {
        displayValue = value;
      }
      return { key, value: displayValue };
    });
};

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemProps) {
  return (
    <div className="flex gap-4 rounded-lg border bg-card p-2">
      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
        <Link href={`/products/${item.product.categoryId}/${item.product.id}`}>
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
              <ShoppingCart className="h-6 w-6" />
            </div>
          )}
        </Link>
      </div>
      <div className="flex-1 space-y-2">
        <div>
          <Link
            href={`/products/${item.product.categoryId}/${item.product.id}`}
          >
            <h4 className="text-sm md:text-base font-medium text-foreground leading-none hover:underline">
              {item.product.name}
            </h4>
          </Link>
        </div>
        {getCustomizationItems(item.customizations).length > 0 && (
          <div className="space-y-1">
            <div className="flex flex-wrap gap-1">
              {getCustomizationItems(item.customizations).map(
                (customization, index) => {
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-[10px] md:text-xs px-2 py-0.5 h-auto"
                    >
                      <span className="font-medium">
                        {
                          BaseCustomizations[customization.key]
                            .afterSelectionLabel
                        }
                        :
                      </span>
                      <span>{customization.value}</span>
                    </Badge>
                  );
                }
              )}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-foreground">
            {formatPriceLocalized(item.totalPrice)}
          </span>
          <div className="flex items-center gap-3">
            <QuantityStepper
              quantity={item.quantity}
              increment={() => onUpdateQuantity(item.id, item.quantity + 1)}
              decrement={() => onUpdateQuantity(item.id, item.quantity - 1)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRemoveItem(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
