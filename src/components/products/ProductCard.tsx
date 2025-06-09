"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UIProduct } from "@/types/product";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { formatPrice } from "@/utils/price";
import { toast } from "sonner";
import { BaseCategoriesObj } from "@/data/categories";

interface ProductCardProps {
  product: UIProduct;
  className?: string;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInFavorites } = useFavoritesStore();
  const isInWishlist = isInFavorites(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // For products with customizations, redirect to product page
    if (product.customizationOptions.length > 0) {
      window.location.href = `/products/${product.id}`;
      return;
    }

    // Add to cart with empty customizations for simple products
    addToCart(product, {});
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    toast.success(
      isInWishlist
        ? `${product.name} removed from favorites!`
        : `${product.name} added to favorites!`
    );
  };

  return (
    <Card
      className={`group cursor-pointer hover:shadow-lg transition-all duration-200 py-0`}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Product Image */}
          <div className="aspect-square relative bg-amber-200">
            <Image
              src={product.images[0] || "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
              aria-label={
                isInWishlist ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart
                className={`w-4 h-4 ${
                  isInWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-gray-600 hover:text-red-500"
                }`}
              />
            </button>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isBestSeller && (
                <Badge variant="default" className="text-xs">
                  Best Seller
                </Badge>
              )}
            </div>
          </div>
        </div>

        <CardContent className="p-4 pb-0">
          {/* Brand/Category */}
          <div className="flex items-center">
            <span className="text-xs text-muted-foreground capitalize">
              {BaseCategoriesObj[product.categoryId].name}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.customizationOptions.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  + customization
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </CardContent>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          disabled={!product.available}
          className="w-full text-sm"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.customizationOptions.length > 0
            ? "Customize & Add to Cart"
            : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
}
