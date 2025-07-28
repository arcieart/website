import { Suspense } from "react";
import AllProductsPage from "./AllProductsPage";
import { ProductsGridSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Arcie Art",
  description: "All products page",
};

export default function ProductsPageWrapper() {
  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <AllProductsPage />
    </Suspense>
  );
}
