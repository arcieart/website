import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductPageSkeleton } from "@/components/skeletons/ProductPageSkeleton";
import { ProductPage } from "./ProductPage";
import { Metadata } from "next";
import { getProductBySlug, toUIProduct } from "@/lib/products";
import { BaseCategoriesObj } from "@/data/categories";
import removeMd from "remove-markdown";
import {
  breadcrumbJsonLd,
  pageMetadata,
  productJsonLd,
  truncateMetaDescription,
} from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { CLICKER_KEYWORDS } from "@/config/site";

interface ProductPageProps {
  params: Promise<{ productSlug: string; categoryId?: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const productSlug = (await params).productSlug;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return pageMetadata({
      title: "Product not found",
      description: "This product is unavailable.",
      path: `/products/${productSlug}`,
      noIndex: true,
    });
  }

  const category = BaseCategoriesObj[product.categoryId];
  const rawDescription = removeMd(
    product.description ?? category?.seoDescription ?? category?.baseDescription ?? product.name
  );
  const isClicker = product.categoryId === "clickers";
  const title = isClicker
    ? `${product.name}, fidget clicker switch`
    : product.name;
  let description = truncateMetaDescription(rawDescription);
  if (isClicker && !/fidget|switch/i.test(description)) {
    description = truncateMetaDescription(
      `${description} Fidget clicker switch, 3D printed in Mumbai.`
    );
  }

  return pageMetadata({
    title,
    description,
    path: `/products/${product.categoryId}/${product.slug}`,
    keywords: [
      product.name,
      category?.name ?? product.categoryId,
      "3d printed",
      "arcie art",
      ...(isClicker ? CLICKER_KEYWORDS : []),
    ],
    images: product.imageMapping[0]?.url
      ? [{ url: product.imageMapping[0].url, alt: product.name }]
      : undefined,
  });
}

export default async function ProductPageWrapper({ params }: ProductPageProps) {
  const resolved = await params;
  const dbProduct = await getProductBySlug(resolved.productSlug);
  const initialProduct = dbProduct ? toUIProduct(dbProduct) : null;

  if (!initialProduct) notFound();

  const category = BaseCategoriesObj[initialProduct.categoryId];

  return (
    <>
      <JsonLd data={productJsonLd(initialProduct)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          {
            name: category?.name ?? initialProduct.categoryId,
            path: `/products/${initialProduct.categoryId}`,
          },
          {
            name: initialProduct.name,
            path: `/products/${initialProduct.categoryId}/${initialProduct.slug}`,
          },
        ])}
      />
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductPage params={params} initialProduct={initialProduct} />
      </Suspense>
    </>
  );
}
