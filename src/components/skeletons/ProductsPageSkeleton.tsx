import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function ProductsGridSkeleton({
  showFilters = false,
}: {
  showFilters?: boolean;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Filters and Sort Bar Skeleton */}
        {showFilters && (
          <div className="mb-8 space-y-4">
            {/* Mobile filter toggle and sort */}
            <div className="flex items-center justify-between md:hidden">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-32" />
            </div>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-40" />
              </div>
            </div>

            <Separator className="md:hidden" />
          </div>
        )}

        {/* Products Grid Skeleton */}
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {/* Product Card Skeletons */}
            {Array.from({ length: 15 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      {/* Product Image */}
      <Skeleton className="aspect-square w-full rounded-lg" />

      {/* Product Info */}
      <div className="space-y-2">
        {/* Product Name */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Category/Brand */}
        <Skeleton className="h-3 w-1/2" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
}
