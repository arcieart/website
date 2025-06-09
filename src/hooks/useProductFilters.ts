import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UIProduct } from "@/types/product";

export type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name-a-z"
  | "name-z-a";

export const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
] as const;

interface UseProductFiltersProps {
  products: UIProduct[];
  enableCategoryFilter?: boolean;
  enablePriceFilter?: boolean;
  baseUrl?: string;
}

export function useProductFilters({ 
  products, 
  enableCategoryFilter = true,
  enablePriceFilter = true,
  baseUrl
}: UseProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Determine the base URL to use
  const urlBase = baseUrl || (enableCategoryFilter ? '/products' : pathname);

  // Initialize state from URL parameters
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const urlSort = searchParams.get('sort') as SortOption;
    return sortOptions.find(option => option.value === urlSort) ? urlSort : "name-a-z";
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (!enableCategoryFilter) return [];
    const urlCategories = searchParams.get('categories');
    return urlCategories ? urlCategories.split(',').filter(Boolean) : [];
  });

  const [showBestSellers, setShowBestSellers] = useState(() => {
    return searchParams.get('bestSellers') === 'true';
  });

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(() => {
    if (!enablePriceFilter) return { min: 0, max: 1000 };
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    return {
      min: minPrice ? parseInt(minPrice, 10) : 0,
      max: maxPrice ? parseInt(maxPrice, 10) : 1000,
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Add sort parameter
    if (sortBy !== "newest") {
      params.set('sort', sortBy);
    }

    // Add categories parameter
    if (enableCategoryFilter && selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }

    // Add best sellers parameter
    if (showBestSellers) {
      params.set('bestSellers', 'true');
    }

    // Add price range parameters
    if (enablePriceFilter) {
      if (priceRange.min !== 0) {
        params.set('minPrice', priceRange.min.toString());
      }
      if (priceRange.max !== 1000) {
        params.set('maxPrice', priceRange.max.toString());
      }
    }

    // Update URL without causing a page reload
    const newUrl = params.toString() ? `${urlBase}?${params.toString()}` : urlBase;
    router.replace(newUrl, { scroll: false });
  }, [sortBy, selectedCategories, showBestSellers, priceRange, router, urlBase, enableCategoryFilter, enablePriceFilter]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Category filter
      if (
        enableCategoryFilter &&
        selectedCategories.length > 0 &&
        !selectedCategories.includes(product.categoryId)
      ) {
        return false;
      }

      // Best sellers filter
      if (showBestSellers && !product.isBestSeller) {
        return false;
      }

      // Price filter
      if (enablePriceFilter && (product.price < priceRange.min || product.price > priceRange.max)) {
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
  }, [products, selectedCategories, showBestSellers, priceRange, sortBy, enableCategoryFilter, enablePriceFilter]);

  // Filter management functions
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (!enableCategoryFilter) return;
    
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const clearFilters = () => {
    if (enableCategoryFilter) {
      setSelectedCategories([]);
    }
    setShowBestSellers(false);
    if (enablePriceFilter) {
      setPriceRange({ min: 0, max: 1000 });
    }
    setSortBy("newest");
  };

  const activeFiltersCount =
    (enableCategoryFilter ? selectedCategories.length : 0) + 
    (showBestSellers ? 1 : 0) +
    (enablePriceFilter && (priceRange.min !== 0 || priceRange.max !== 1000) ? 1 : 0);

  return {
    // State
    sortBy,
    selectedCategories,
    showBestSellers,
    priceRange,
    filteredAndSortedProducts,
    activeFiltersCount,
    
    // Actions
    setSortBy,
    setSelectedCategories,
    setShowBestSellers,
    setPriceRange,
    handleCategoryChange,
    clearFilters,
  };
} 