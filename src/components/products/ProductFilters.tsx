import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { BaseCategories } from "@/data/categories";
import { SortOption, sortOptions } from "@/hooks/useProductFilters";

interface ProductFiltersProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  selectedCategories: string[];
  showBestSellers: boolean;
  setShowBestSellers: (show: boolean) => void;
  activeFiltersCount: number;
  handleCategoryChange: (categoryId: string, checked: boolean) => void;
  clearFilters: () => void;
  hideCategories?: boolean;
}

export function ProductFilters({
  sortBy,
  setSortBy,
  selectedCategories,
  showBestSellers,
  setShowBestSellers,
  activeFiltersCount,
  handleCategoryChange,
  clearFilters,
  hideCategories,
}: ProductFiltersProps) {
  return (
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
              {!hideCategories && (
                <>
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
                </>
              )}

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
  );
}
