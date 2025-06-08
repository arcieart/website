import { Customization, FilamentColor } from "@/types/customization";

export const BaseCustomizations: Record<string, Customization> = {
  "keychain-primary-color": {
    id: "keychain-primary-color",
    categoryId: "keychains",
    label: "Primary Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
  },
  "keychain-secondary-color": {
    id: "keychain-secondary-color",
    categoryId: "keychains",
    label: "Background Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
  },
  "keychain-text": {
    id: "keychain-text",
    categoryId: "keychains",
    label: "Enter Text You Want on the Keychain",
    placeholder: "Arsiwala",
    type: "input",
    required: true,
    priceAdd: 0,
  },
  "earrings-primary-color": {
    id: "earrings-primary-color",
    categoryId: "earrings",
    label: "Primary Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
  },
};

export const FilamentColors: FilamentColor[] = [
  {
    id: "pla-candy-red",
    label: "Red PLA",
    value: "#FF0000",
    available: true,
    priceAdd: 0,
  },
  {
    id: "pla-midnight-black",
    label: "Black PLA",
    value: "#000000",
    available: true,
    priceAdd: 0,
  },
  {
    id: "pla-natural-white",
    label: "White PLA",
    value: "#FFFFFF",
    available: true,
    priceAdd: 0,
  },
];
