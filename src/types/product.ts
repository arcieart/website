import { BaseCategoriesIds, Category } from "@/data/categories";
import { DBCustomization } from "./customization";

export type BaseProduct = {
  id: string;
  name: string;
  images: string[];
  categoryId: BaseCategoriesIds;
  available: boolean;
  isBestSeller: boolean;
  createdAt: number;
  description?: string;
  customizationOptions: DBCustomization[];
};

export type DBProduct = BaseProduct & {
  price?: number;
};

export type UIProduct = BaseProduct & Category & {
  price: number;
};

