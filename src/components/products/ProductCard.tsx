"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UIProduct } from "@/types/product";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { formatPrice, getStrikethroughPrice } from "@/utils/price";
import { BaseCategoriesObj } from "@/data/categories";
import { useCartSheet } from "@/hooks/useCartSheet";
import { Suspense } from "react";
import { ProductCardSkeleton } from "../skeletons/ProductsPageSkeleton";

interface ProductCardProps {
  product: UIProduct;
  className?: string;
}

function ProductCardContent({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInFavorites } = useFavoritesStore();
  const isInWishlist = isInFavorites(product.id);
  const { setCartOpen } = useCartSheet();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // For products with customizations, redirect to product page
    if (product.customizationOptions.length > 0) {
      window.location.href = `/products/${product.categoryId}/${product.id}`;
      return;
    }

    // Add to cart with empty customizations for simple products
    addToCart(product, {});
    setCartOpen(true);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
  };

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-500 py-0 animate-in slide-in-from-bottom-4 fade-in gap-4 flex justify-between`}
    >
      <div>
        <Link href={`/products/${product.categoryId}/${product.id}`}>
          <div className="relative overflow-hidden rounded-t-lg">
            {/* Product Image */}
            <div className="aspect-square relative bg-transparent">
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
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                aria-label={
                  isInWishlist ? "Remove from favorites" : "Add to favorites"
                }
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                />
              </button>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isBestSeller && (
                  <Badge
                    variant="default"
                    className="text-[10px] px-1.5 py-0.5"
                  >
                    Best Seller
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>

        <CardContent className="p-2 pb-0">
          {/* Brand/Category */}
          <Link href={`/products/${product.categoryId}`}>
            <div className="flex items-center">
              <span className="text-[10px] md:text-xs text-muted-foreground capitalize hover:text-primary transition-colors duration-200">
                {BaseCategoriesObj[product.categoryId].name}
              </span>
            </div>
          </Link>

          <Link href={`/products/${product.categoryId}/${product.id}`}>
            {/* Product Name */}
            <h3 className="font-semibold text-foreground text-xs md:text-sm mb-1.5 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            {/* Price */}
            <div className="mb-2">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(getStrikethroughPrice(product.price))}
                </span>
              </div>
            </div>
          </Link>
        </CardContent>
      </div>

      {/* Add to Cart Button */}
      <div className="px-2 pb-2">
        <Button
          onClick={handleAddToCart}
          disabled={!product.available}
          className="w-full text-xs h-8"
          size="sm"
        >
          {product.customizationOptions.length > 0 ? (
            <span className="flex items-center justify-between gap-1">
              Customize
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          ) : (
            <span className="flex items-center justify-between gap-1">
              <ShoppingCart className="w-3 h-3" />
              Add to Cart
            </span>
          )}
        </Button>
      </div>
    </Card>
  );
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Suspense fallback={<ProductCardSkeleton />}>
      <ProductCardContent product={product} />
    </Suspense>
  );
}
