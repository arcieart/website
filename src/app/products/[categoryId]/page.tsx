import { ProductsGridSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { Suspense } from "react";
import { CategoryProductsPage } from "./ProductsCategoryPage";
import { Metadata } from "next";
import { BaseCategoriesObj } from "@/data/categories";

type CategoryPageProps = { params: Promise<{ categoryId: string }> };

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryId = (await params).categoryId;
  const category = BaseCategoriesObj[categoryId];

  if (category) {
    const newMetadata: Metadata = {
      title: category.name + " | " + "by Arcie Art",
      description: category.baseDescription,
    };

    if (category.images[0]) {
      newMetadata.openGraph = { images: [category.images[0]] };
      newMetadata.twitter = { images: [category.images[0]] };
    }

    return newMetadata;
  }

  return {};
}

export default function CategoryProductsPageWrapper() {
  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <CategoryProductsPage />
    </Suspense>
  );
}
