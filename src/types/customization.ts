import { BaseCategoriesIds } from "@/data/categories";

export type Customization = SelectCustomization | InputCustomization | CheckboxCustomization | ImageCustomization | ColorPickerCustomization;

export type BaseCustomization = {
  id: string;
  label: string;
  required: boolean;
  priceAdd: number;
  categoryId: BaseCategoriesIds;
  afterSelectionLabel: string;
  description?: string;
};

export type DBCustomization = Partial<BaseCustomization> & {
  customizationRefId: string;
}

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

export type ColorPickerCustomization = BaseCustomization & {
  type: "color-picker";
  colorSet: "pla-filament" | "luggage-tag";
};

// Unified color type that works for both filament and luggage tag colors
export type Color = {
  id: string;
  label: string;
  value: string;
  available: boolean;
  priceAdd: number;
  assetType: "image" | "hex-code";
  canBeMixed?: boolean; // if true, the color can be mixed with other colors in a multicolor print
};

// Legacy types for backward compatibility
export type FilamentColor = Color;
export type LuggageTagColor = Color;