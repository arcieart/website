import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Skeleton className="h-4 w-12" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-12" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-12" />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Skeleton className="h-4 w-12" />
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Product Images Skeleton */}
          <div className="md:sticky md:top-18 md:self-start">
            <div className="space-y-4">
              {/* Main image */}
              <Skeleton className="aspect-square w-full rounded-lg" />
              {/* Thumbnail images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="aspect-square w-16 h-16 rounded-md flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-3/4 mb-2" />

              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Price */}
              <div className="space-y-1">
                <Skeleton className="h-4 w-16" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <Separator />

            {/* Customization Options */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-48" />

              {/* Color picker skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-wrap gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="w-10 h-10 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Input field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>

              {/* Select field skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <Separator />

            {/* Quantity and Buttons */}
            <div className="space-y-4">
              {/* Quantity stepper */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-32" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />

              {/* Details rows */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex py-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24 ml-4" />
                </div>
              ))}
            </div>

            <Separator />

            {/* Product Specifications */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-44" />

              {/* Accordion items */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg">
                  <div className="p-4">
                    <Skeleton className="h-5 w-40" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
