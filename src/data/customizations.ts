import { Customization, FilamentColor } from "@/types/customization";

export const BaseCustomizations: Record<string, Customization> = {
  "keychain-primary-color": {
    id: "keychain-primary-color",
    categoryId: "keychains",
    label: "Select Primary Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
    afterSelectionLabel: "Primary Color",
  },
  "keychain-secondary-color": {
    id: "keychain-secondary-color",
    categoryId: "keychains",
    label: "Select Background Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
    afterSelectionLabel: "Background Color",
  },
  "keychain-text": {
    id: "keychain-text",
    categoryId: "keychains",
    label: "Enter Keychain Text",
    placeholder: "",
    type: "input",
    required: true,
    priceAdd: 0,
    afterSelectionLabel: "Keychain Text",
  },
  "earrings-primary-color": {
    id: "earrings-primary-color",
    categoryId: "earrings",
    label: "Select Primary Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
    afterSelectionLabel: "Primary Color",
  },
  "earrings-background-color": {
    id: "earrings-background-color",
    categoryId: "earrings",
    label: "Select Background Color",
    type: "fixed-color-picker",
    required: true,
    priceAdd: 0,
    afterSelectionLabel: "Background Color",
  },
};

export const PLAFilamentColors: FilamentColor[] = [
  {
    id: "pla-candy-red",
    label: "Candy Red",
    value: "#FF0000",
    available: true,
    priceAdd: 50,
  },
  {
    id: "pla-midnight-black",
    label: "Midnight Black",
    value: "#000000",
    available: true,
    priceAdd: 0,
  },
  {
    id: "pla-natural-white",
    label: "Natural White",
    value: "#FFFFFF",
    available: true,
    priceAdd: 0,
  },
];
