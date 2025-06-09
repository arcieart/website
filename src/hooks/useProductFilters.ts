import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
}

export function useProductFilters({ products }: UseProductFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize state from URL parameters
  const [sortBy, setSortBy] = useState<SortOption>(() => {
    const urlSort = searchParams.get('sort') as SortOption;
    return sortOptions.find(option => option.value === urlSort) ? urlSort : "newest";
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const urlCategories = searchParams.get('categories');
    return urlCategories ? urlCategories.split(',').filter(Boolean) : [];
  });

  const [showBestSellers, setShowBestSellers] = useState(() => {
    return searchParams.get('bestSellers') === 'true';
  });

  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>(() => {
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
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }

    // Add best sellers parameter
    if (showBestSellers) {
      params.set('bestSellers', 'true');
    }

    // Add price range parameters
    if (priceRange.min !== 0) {
      params.set('minPrice', priceRange.min.toString());
    }
    if (priceRange.max !== 1000) {
      params.set('maxPrice', priceRange.max.toString());
    }

    // Update URL without causing a page reload
    const newUrl = params.toString() ? `?${params.toString()}` : '/products';
    router.replace(newUrl, { scroll: false });
  }, [sortBy, selectedCategories, showBestSellers, priceRange, router]);

  // Filter and sort products
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
  }, [products, selectedCategories, showBestSellers, priceRange, sortBy]);

  // Filter management functions
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
    setPriceRange({ min: 0, max: 1000 });
    setSortBy("newest");
    // Clear URL parameters
    router.replace('/products', { scroll: false });
  };

  const activeFiltersCount =
    selectedCategories.length + (showBestSellers ? 1 : 0);

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