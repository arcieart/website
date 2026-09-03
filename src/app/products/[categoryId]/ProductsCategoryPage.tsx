"use client";

import { Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";
import { useProducts } from "@/hooks/useProducts";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { BaseCategoriesObj } from "@/data/categories";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductsGridSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { UIProduct } from "@/types/product";

export function CategoryProductsPage({
  initialProducts = [],
}: {
  initialProducts?: UIProduct[];
}) {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const category = BaseCategoriesObj[categoryId];

  const { products, isLoading } = useProducts();

  const liveCategoryProducts = useMemo(() => {
    if (!products || !categoryId) return [];
    return products.filter((product) => product.categoryId === categoryId);
  }, [products, categoryId]);

  const categoryProducts =
    liveCategoryProducts.length > 0 || !isLoading
      ? liveCategoryProducts
      : initialProducts;

  const {
    sortBy,
    setSortBy,
    selectedCategories,
    showBestSellers,
    setShowBestSellers,
    filteredAndSortedProducts,
    activeFiltersCount,
    handleCategoryChange,
    clearFilters,
  } = useProductFilters({
    products: categoryProducts,
    baseUrl: `/products/${categoryId}`,
  });

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link href="/products">
            <Button variant="outline">Browse all products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const showGridSkeleton =
    isLoading && filteredAndSortedProducts.length === 0 && initialProducts.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/products">
              <Button variant="ghost" size="sm" className="gap-2">
                <span className="flex items-center group transition-all">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:-translate-x-1" />
                  All Products
                </span>
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {category.name}
          </h1>
          {category.baseDescription && (
            <p className="text-muted-foreground max-w-lg text-sm">
              {category.baseDescription}
            </p>
          )}
        </div>

        {categoryProducts.length > 0 && (
          <ProductFilters
            hideCategories
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedCategories={selectedCategories}
            showBestSellers={showBestSellers}
            setShowBestSellers={setShowBestSellers}
            activeFiltersCount={activeFiltersCount}
            handleCategoryChange={handleCategoryChange}
            clearFilters={clearFilters}
          />
        )}

        <div className="w-full">
          {showGridSkeleton ? (
            <ProductsGridSkeleton showFilters={false} />
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : categoryProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No {category.name.toLowerCase()} listed yet
              </h2>
              <p className="text-muted-foreground mb-4">
                Check back soon, or browse the rest of the shop.
              </p>
              <Link href="/products">
                <Button variant="outline">Browse all products</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                No products found
              </h2>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
