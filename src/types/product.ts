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
  images?: string[]; // aws s3 urls
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
};

export type DBProduct = BaseProduct & {
  price?: number;
};

export type UIProduct = BaseProduct & Category & {
  price: number;
  material: string;
};
