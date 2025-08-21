import { Suspense } from "react";
import { ProductPageSkeleton } from "@/components/skeletons/ProductPageSkeleton";
import { ProductPage } from "./ProductPage";
import { Metadata } from "next";
import { getProductBySlug } from "@/lib/products";
import { BaseCategoriesObj } from "@/data/categories";
import removeMd from "remove-markdown";

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
      description: removeMd(product.description ?? category.baseDescription),
    };

    if (product.imageMapping[0].url) {
      newMetadata.openGraph = { images: [product.imageMapping[0].url] };
      newMetadata.twitter = { images: [product.imageMapping[0].url] };
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
