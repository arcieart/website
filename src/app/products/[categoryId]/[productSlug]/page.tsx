import { Suspense } from "react";
import { ProductPageSkeleton } from "@/components/skeletons/ProductPageSkeleton";
import { ProductPage } from "./ProductPage";
import { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { BaseCategoriesObj } from "@/data/categories";

interface ProductPageProps {
  params: Promise<{ productSlug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productSlug = (await params).productSlug;
  const product = await getProductBySlug(productSlug);

  if (product) {
    const category = BaseCategoriesObj[product.categoryId];
    const newMetadata: Metadata = {
      title: product.name + " | " + "by Arcie Art",
      description: product.description ?? category.baseDescription,
    };

    if (product.images[0]) {
      newMetadata.openGraph = { images: [product.images[0]] };
      newMetadata.twitter = { images: [product.images[0]] };
    }

    return newMetadata;
  }

  return {};
}

export default function ProductPageWrapper({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductPageSkeleton />}>
      <ProductPage params={params} />
    </Suspense>
  );
}
