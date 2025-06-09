"use client";

import { useState, useMemo } from "react";
import { Filter, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProductCard } from "@/components/products/ProductCard";
import { BaseCategories } from "@/data/categories";
import { useProducts } from "@/hooks/useProducts";

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name-a-z"
  | "name-z-a";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
];

export default function ProductsPage() {
  const { products } = useProducts();

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showBestSellers, setShowBestSellers] = useState(false);
  const [showAvailable, setShowAvailable] = useState(true);
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 1000,
  });

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.categoryId)
      ) {
        return false;
      }

      // Best sellers filter
      if (showBestSellers && !product.isBestSeller) {
        return false;
      }

      // Availability filter
      if (showAvailable && !product.available) {
        return false;
      }

      // Price filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.createdAt - a.createdAt;
        case "oldest":
          return a.createdAt - b.createdAt;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    products,
    selectedCategories,
    showBestSellers,
    showAvailable,
    priceRange,
    sortBy,
  ]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setShowBestSellers(false);
    setShowAvailable(true);
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("newest");
  };

  const activeFiltersCount =
    selectedCategories.length + (showBestSellers ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            All Products
          </h1>
          <p className="text-muted-foreground">
            Discover our complete collection of personalized products
          </p>
        </div>

        {/* Filters and Sort Bar */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  {/* Categories Section */}
                  <div>
                    <DropdownMenuLabel className="px-0 pb-2 text-sm font-semibold">
                      Categories
                    </DropdownMenuLabel>
                    <div className="space-y-2">
                      {BaseCategories.map((category) => (
                        <DropdownMenuCheckboxItem
                          key={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category.id,
                              checked as boolean
                            )
                          }
                          className="capitalize"
                        >
                          {category.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Special Filters Section */}
                  <div>
                    <DropdownMenuLabel className="px-0 pb-2 text-sm font-semibold">
                      Collections
                    </DropdownMenuLabel>
                    <div className="space-y-2">
                      <DropdownMenuCheckboxItem
                        checked={showBestSellers}
                        onCheckedChange={(checked) =>
                          setShowBestSellers(checked as boolean)
                        }
                      >
                        Best Sellers
                      </DropdownMenuCheckboxItem>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {activeFiltersCount > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {activeFiltersCount} filter
                          {activeFiltersCount !== 1 ? "s" : ""} active
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="h-8 px-2 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear All
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Active Filter Tags */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedCategories.map((categoryId) => {
                  const category = BaseCategories.find(
                    (cat) => cat.id === categoryId
                  );
                  return category ? (
                    <span
                      key={categoryId}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border"
                    >
                      {category.name}
                      <button
                        onClick={() => handleCategoryChange(categoryId, false)}
                        className="hover:text-primary/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {showBestSellers && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border">
                    Best Sellers
                    <button
                      onClick={() => setShowBestSellers(false)}
                      className="hover:text-primary/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="w-full">
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard key={product.id + index} product={product} />
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
