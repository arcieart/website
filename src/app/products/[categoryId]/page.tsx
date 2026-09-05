import { ProductsGridSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { Suspense } from "react";
import { CategoryProductsPage } from "./ProductsCategoryPage";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BaseCategoriesObj } from "@/data/categories";
import { CLICKER_KEYWORDS } from "@/config/site";
import { pageMetadata, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { getAvailableProducts } from "@/lib/products";
import { getDiscoverableProducts } from "@/lib/product-bundles";
import { JsonLd } from "@/components/seo/JsonLd";

type CategoryPageProps = { params: Promise<{ categoryId: string }> };

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categoryId = (await params).categoryId;
  const category = BaseCategoriesObj[categoryId];

  if (!category) {
    return pageMetadata({
      title: "Category not found",
      description: "This product category does not exist.",
      path: `/products/${categoryId}`,
      noIndex: true,
    });
  }

  const keywords =
    category.id === "clickers"
      ? CLICKER_KEYWORDS
      : [category.name, "3d printed", "arcie art", "mumbai"];

  return pageMetadata({
    title: category.seoTitle,
    description: category.seoDescription,
    path: `/products/${category.id}`,
    keywords,
    images: category.images[0]
      ? [{ url: category.images[0], alt: category.name }]
      : undefined,
  });
}

export default async function CategoryProductsPageWrapper({
  params,
}: CategoryPageProps) {
  const categoryId = (await params).categoryId;
  const category = BaseCategoriesObj[categoryId];

  if (!category) notFound();

  let initialProducts: Awaited<ReturnType<typeof getAvailableProducts>> = [];
  try {
    const products = getDiscoverableProducts(await getAvailableProducts());
    initialProducts = products.filter(
      (product) => product.categoryId === categoryId
    );
  } catch {
    initialProducts = [];
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: category.name, path: `/products/${category.id}` },
        ])}
      />
      {initialProducts.length > 0 && (
        <JsonLd
          data={itemListJsonLd({
            name: category.name,
            path: `/products/${category.id}`,
            products: initialProducts,
          })}
        />
      )}
      <Suspense fallback={<ProductsGridSkeleton />}>
        <CategoryProductsPage initialProducts={initialProducts} />
      </Suspense>
    </>
  );
}
