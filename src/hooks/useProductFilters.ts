import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { UIProduct } from "@/types/product";
import { trackProductsFiltered, trackProductsSorted } from "@/lib/analytics";

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

const defaultSortBy = "name-a-z";


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
    return sortOptions.find(option => option.value === urlSort) ? urlSort : defaultSortBy;
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
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    // Update URL parameters
    if (sortBy !== defaultSortBy) {
      current.set('sort', sortBy);
    } else {
      current.delete('sort');
    }
    
    if (enableCategoryFilter && selectedCategories.length > 0) {
      current.set('categories', selectedCategories.join(','));
    } else {
      current.delete('categories');
    }
    
    if (showBestSellers) {
      current.set('bestSellers', 'true');
    } else {
      current.delete('bestSellers');
    }
    
    if (enablePriceFilter && (priceRange.min !== 0 || priceRange.max !== 1000)) {
      current.set('minPrice', priceRange.min.toString());
      current.set('maxPrice', priceRange.max.toString());
    } else {
      current.delete('minPrice');
      current.delete('maxPrice');
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    
    if (search !== searchParams.toString()) {
      router.replace(`${urlBase}${query}`, { scroll: false });
    }
  }, [sortBy, selectedCategories, showBestSellers, priceRange, enableCategoryFilter, enablePriceFilter]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
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
    
    let newCategories;
    if (checked) {
      newCategories = [...selectedCategories, categoryId];
    } else {
      newCategories = selectedCategories.filter((id) => id !== categoryId);
    }
    
    setSelectedCategories(newCategories);
    
    // Track filtering event
    trackProductsFiltered("category", categoryId, filteredAndSortedProducts.length);
  };

  const clearFilters = () => {
    if (enableCategoryFilter) {
      setSelectedCategories([]);
    }
    setShowBestSellers(false);
    if (enablePriceFilter) {
      setPriceRange({ min: 0, max: 1000 });
    }
    setSortBy(defaultSortBy);
  };

  // Track sort changes
  const handleSortChange = (newSortBy: SortOption) => {
    setSortBy(newSortBy);
    trackProductsSorted(newSortBy, filteredAndSortedProducts.length);
  };

  // Track best sellers filter
  const handleBestSellersChange = (checked: boolean) => {
    setShowBestSellers(checked);
    trackProductsFiltered("best_sellers", checked, filteredAndSortedProducts.length);
  };

  // Count active filters
  let activeFiltersCount = 0;
  if (enableCategoryFilter && selectedCategories.length > 0) activeFiltersCount += selectedCategories.length;
  if (showBestSellers) activeFiltersCount += 1;
  if (enablePriceFilter && (priceRange.min !== 0 || priceRange.max !== 1000)) activeFiltersCount += 1;

  return {
    // State
    sortBy,
    setSortBy: handleSortChange,
    selectedCategories,
    showBestSellers,
    setShowBestSellers: handleBestSellersChange,
    priceRange,
    setPriceRange,
    
    // Results
    filteredAndSortedProducts,
    activeFiltersCount,
    
    // Actions
    handleCategoryChange,
    clearFilters,
  };
} 