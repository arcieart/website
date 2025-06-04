import { Customization } from "@/types/customization";

export const BaseCustomizations: Record<string, Customization> = {
  "keychain-color-1": {
    id: "keychain-color-1",
    categoryId: "keychains",
    label: "Select Text Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
  },
  "keychain-color-2": {
    id: "keychain-color-2",
    categoryId: "keychains",
    label: "Select Background Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
  },
  "keychain-text-1": {
    id: "keychain-text-1",
    categoryId: "keychains",
    label: "Enter Text You Want on the Keychain",
    placeholder: "Arsiwala",
    type: "input",
    required: true,
    priceAdd: 0,
  },
  "earrings-color-1": {
    id: "earrings-color-1",
    categoryId: "earrings",
    label: "Select Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
  },
};

export const FilamentColors = [
  {
    id: "candy-red",
    label: "Red",
    value: "#FF0000",
    available: true,
  },
  {
    id: "midnight-black",
    label: "Black",
    value: "#000000",
    available: true,
  },
  {
    id: "natural-white",
    label: "White",
    value: "#FFFFFF",
    available: true,
  },
];
