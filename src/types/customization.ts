import { BaseCategoriesIds } from "@/data/categories";

export type Customization = InputCustomization | CheckboxCustomization | ImageCustomization | FixedColorPickerCustomization;

export type DBCustomization = {
  customizationRefId: string;
}

export type BaseCustomization = {
  id: string;
  label: string;
  required: boolean;
  priceAdd: number;
  categoryId: BaseCategoriesIds;
};


export type InputCustomization = BaseCustomization & {
  type: "input";
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
};

export type CheckboxCustomization = BaseCustomization & {
  type: "checkbox";
};

export type SelectCustomization = BaseCustomization & {
  type: "select";
  options: { id: string; label: string; }[];
};

export type ImageCustomization = BaseCustomization & {
  type: "image";
  maxImages: number;
  compress: "no-compress" | "compress";
  allowedImageFormats: ("png" | "svg")[];
};

export type FixedColorPickerCustomization = BaseCustomization & {
  type: "fixed-color-picker";
};

export type FilamentColor = {
  id: string;
  label: string;
  value: string;
  available: boolean;
  priceAdd: number;
};