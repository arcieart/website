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

export function CategoryProductsPage() {
  const params = useParams();
  const categoryId = params.categoryId as string;

  const { products, isLoading } = useProducts();

  // Filter products by category
  const categoryProducts = useMemo(() => {
    if (!products || !categoryId) return [];
    return products.filter((product) => product.categoryId === categoryId);
  }, [products, categoryId]);

  // Get category name for display
  const categoryName = useMemo(() => {
    // First try to get category name from BaseCategoriesObj using categoryId
    const categoryFromId = BaseCategoriesObj[categoryId];
    if (categoryFromId) {
      return categoryFromId.name;
    }

    // If categoryId doesn't match, try to find from products
    if (categoryProducts.length > 0) {
      const productCategoryId = categoryProducts[0].categoryId;
      const category = BaseCategoriesObj[productCategoryId];
      if (category) {
        return category.name;
      }
    }

    // Fallback to formatted categoryId
    return categoryId
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }, [categoryProducts, categoryId]);

  // Use the category-specific hook that handles URL params without redirects
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

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
            {categoryName}
          </h1>
          {BaseCategoriesObj[categoryId]?.baseDescription && (
            <p className="text-muted-foreground max-w-lg text-sm">
              {BaseCategoriesObj[categoryId].baseDescription}
            </p>
          )}
        </div>

        {/* Show filters only if we have products */}
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

        {/* Products Grid */}
        <div className="w-full">
          {isLoading ? (
            <ProductsGridSkeleton showFilters={categoryProducts.length === 0} />
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id + index} product={product} />
              ))}
            </div>
          ) : categoryProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Category not found
              </h3>
              <p className="text-muted-foreground mb-4">
                We couldn&apos;t find any products in the &quot;{categoryName}
                &quot; category
              </p>
              <Link href="/products">
                <Button variant="outline">Browse All Products</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
