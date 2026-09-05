import { Suspense } from "react";
import AllProductsPage from "./AllProductsPage";
import { ProductsGridSkeleton } from "@/components/skeletons/ProductsPageSkeleton";
import { Metadata } from "next";
import { pageMetadata, itemListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { CLICKER_KEYWORDS } from "@/config/site";
import { getAvailableProducts } from "@/lib/products";
import { getDiscoverableProducts } from "@/lib/product-bundles";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "3D Printed Products",
  description:
    "Shop 3D printed fidget clickers, clicker switches, keychains, desk accessories, and decor from Arcie Art in Mumbai. Made in India, shipped nationwide.",
  path: "/products",
  keywords: [
    "3d printed products india",
    ...CLICKER_KEYWORDS,
    "3d printed keychains",
    "buy 3d printed gifts mumbai",
    "arcie art shop",
  ],
});

export default async function ProductsPageWrapper() {
  let products: Awaited<ReturnType<typeof getAvailableProducts>> = [];
  try {
    products = getDiscoverableProducts(await getAvailableProducts());
  } catch {
    products = [];
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      {products.length > 0 && (
        <JsonLd
          data={itemListJsonLd({
            name: "3D printed products",
            path: "/products",
            products,
          })}
        />
      )}
      <Suspense fallback={<ProductsGridSkeleton />}>
        <AllProductsPage initialProducts={products} />
      </Suspense>
    </>
  );
}
