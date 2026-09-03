"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductFilters } from "@/components/products/ProductFilters";

import { useProducts } from "@/hooks/useProducts";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductsGridSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { UIProduct } from "@/types/product";

export default function AllProductsPage({
  initialProducts = [],
}: {
  initialProducts?: UIProduct[];
}) {
  const { products, isLoading } = useProducts();
  const catalog =
    products.length > 0 || !isLoading ? products : initialProducts;
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
  } = useProductFilters({ products: catalog });

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            3D printed products
          </h1>
          <p className="text-muted-foreground">
            Clickers, fidget switches, keychains, desk accessories, and decor.
            Printed in Mumbai, shipped across India.
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <ProductFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          selectedCategories={selectedCategories}
          showBestSellers={showBestSellers}
          setShowBestSellers={setShowBestSellers}
          activeFiltersCount={activeFiltersCount}
          handleCategoryChange={handleCategoryChange}
          clearFilters={clearFilters}
        />

        {/* Products Grid */}
        <div className="w-full">
          {isLoading && filteredAndSortedProducts.length === 0 ? (
            <ProductsGridSkeleton />
          ) : filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
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
