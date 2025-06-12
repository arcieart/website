"use client";

import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { UIProduct } from "@/types/product";
import { shuffleArray } from "@/utils/misc";

interface RecommendedProductsProps {
  currentProduct: UIProduct;
  limit?: number;
}

export function RecommendedProducts({
  currentProduct,
  limit = 4,
}: RecommendedProductsProps) {
  const { products, isLoading } = useProducts();

  // Filter products from same category, excluding current product
  const recommended = shuffleArray(
    products.filter(
      (p) =>
        p.id !== currentProduct.id && p.categoryId === currentProduct.categoryId
    )
  ).slice(0, limit);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
        {Array.from({ length: limit }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (recommended.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        You may also like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
