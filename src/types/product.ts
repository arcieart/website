import { BaseCategoriesIds } from "@/data/categories";
import { Customization, DBCustomization } from "./customization";

export type BaseProduct = {
  id: string;
  name: string;
  images: string[];
  categoryId: BaseCategoriesIds;
};

export type DBProduct = BaseProduct & {
  price?: number;
  description?: string;
  customizationOptions: DBCustomization[];
};

export type UIProduct = BaseProduct & {
  baseDescription: string;
  price: number;
  customizationOptions: Customization[];
  description?: string;
};

