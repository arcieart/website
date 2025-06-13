import { Suspense } from "react";
import { ProductPageSkeleton } from "@/components/skeletons/ProductPageSkeleton";
import { ProductPage } from "./ProductPage";
import { Metadata } from "next";
import { getProduct } from "@/lib/products";
import { BaseCategoriesObj } from "@/data/categories";

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productId = (await params).productId;
  const product = await getProduct(productId);

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
