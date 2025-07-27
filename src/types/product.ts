import { BaseCategoriesIds, Category } from "@/data/categories";
import { DBCustomization } from "./customization";

export type BaseProduct = {
  id: string;
  name: string;
  images: string[];
  videos: string[];
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
};
