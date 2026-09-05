import { BaseCategoriesIds, Category } from "@/data/categories";
import { DBCustomization } from "./customization";

// Image with optional customization mapping
export type ProductImage = {
  url: string;
  customizationMapping: Record<string, string>; // customizationId -> value pairs that this image represents
};

export type BaseProduct = {
  id: string;
  name: string;
  imageMapping: ProductImage[]; // images with customization mapping
  videos: string[]; // aws s3 urls
  categoryId: BaseCategoriesIds;
  slug: string;
  available: boolean;
  isBestSeller: boolean;
  isDiscoverable: boolean;
  createdAt: number;
  description?: string;
  dimensions?: string;
  weight?: number;
  customizationOptions: DBCustomization[];
  /** Parent only. Ordered IDs of hidden bundle SKUs shown on this product page. */
  bundleIds?: string[];
  /** Bundle only. Product whose page offers this SKU. */
  parentProductId?: string;
};

export type DBProduct = BaseProduct & {
  price?: number;
};

export type UIProduct = BaseProduct & Category & {
  price: number;
  material: string;
  /** Set on the PDP merge when a pack is selected. Not stored on the Firestore product. */
  bundleName?: string;
};
