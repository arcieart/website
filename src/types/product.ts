import { BaseCategoriesIds, Category } from "@/data/categories";
import { Customization, DBCustomization } from "./customization";

export type BaseProduct = {
  id: string;
  name: string;
  images: string[];
  categoryId: BaseCategoriesIds;
  available: boolean;
  isBestSeller: boolean;
  createdAt: number;
  description?: string;
};

export type DBProduct = BaseProduct & {
  price?: number;
  customizationOptions: DBCustomization[];
};

export type UIProduct = BaseProduct & Category & {
  price: number;
  customizationOptions: Customization[];
};

