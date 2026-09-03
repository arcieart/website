import { MetadataRoute } from "next";
import { BaseCategories } from "@/data/categories";
import { getAvailableProducts } from "@/lib/products";
import { SITE_URL } from "@/config/site";

export const revalidate = 86400;

function lastModifiedFromTimestamp(timestamp?: number): Date {
  if (!timestamp) return new Date();
  const ms = timestamp < 1e12 ? timestamp * 1000 : timestamp;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/clicker-switches`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/3d-printing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = BaseCategories.map(
    (category) => ({
      url: `${SITE_URL}/products/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: category.id === "clickers" ? 0.9 : 0.8,
    })
  );

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await getAvailableProducts();
    productPages = products.map((product) => ({
      url: `${SITE_URL}/products/${product.categoryId}/${product.slug}`,
      lastModified: lastModifiedFromTimestamp(product.createdAt),
      changeFrequency: "weekly" as const,
      priority:
        product.categoryId === "clickers" || product.isBestSeller ? 0.9 : 0.7,
    }));
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
