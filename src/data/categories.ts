import { isProduction } from "@/utils/misc";

export type Category = {
  id: string;
  name: string;
  baseDescription: string;
  seoTitle: string;
  seoDescription: string;
  images: string[];
  price: number;
  material: "pla" | "petg";
};

const _BaseCategories: Category[] = [
  {
    id: "clickers",
    name: "Clickers",
    baseDescription:
      "3D printed fidget clickers and switches. Clicky, tactile, pocket-sized, printed in PLA+ in Mumbai.",
    seoTitle: "3D Printed Fidget Clickers & Switches",
    seoDescription:
      "Shop 3D printed fidget clickers, clicker switches, and clicky desk toys from Arcie Art in Mumbai. Tactile PLA+ fidgets, made in India, shipped nationwide.",
    images: [],
    price: 200,
    material: "pla",
  },
  {
    id: "keychains",
    name: "Keychains",
    baseDescription:
      "3D printed keychains, including custom name and character designs. Printed in Mumbai.",
    seoTitle: "3D Printed Keychains",
    seoDescription:
      "Shop 3D printed keychains from Arcie Art. Custom names, characters, and keepsakes, printed in Mumbai and shipped across India.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "decor",
    name: "Decor & Gifting",
    baseDescription:
      "3D printed desk and shelf pieces for gifting or display, printed in PLA+ in Mumbai.",
    seoTitle: "3D Printed Decor and Gifts",
    seoDescription:
      "3D printed decor and gifts from Arcie Art in Mumbai. Desk pieces, wall art, and personalized showpieces shipped across India.",
    images: [],
    price: 300,
    material: "pla",
  },
  {
    id: "desk-accessories",
    name: "Desk Accessories",
    baseDescription:
      "3D printed phone stands and desk organizers. Functional prints for a work or gaming setup.",
    seoTitle: "3D Printed Desk Accessories",
    seoDescription:
      "3D printed desk accessories from Arcie Art. Phone stands, organizers, and setup pieces printed in Mumbai.",
    images: [],
    price: 300,
    material: "pla",
  },
  {
    id: "earrings",
    name: "Earrings",
    baseDescription:
      "Lightweight 3D printed earrings. Statement pieces printed in PLA+.",
    seoTitle: "3D Printed Earrings",
    seoDescription:
      "Lightweight 3D printed earrings from Arcie Art in Mumbai. Custom colours and designs.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "accessories",
    name: "Accessories",
    baseDescription:
      "Everyday 3D printed accessories such as luggage tags and carry-along pieces.",
    seoTitle: "3D Printed Accessories",
    seoDescription:
      "Everyday 3D printed accessories from Arcie Art, including luggage tags and carry-along pieces. Made in Mumbai.",
    images: [],
    price: 300,
    material: "pla",
  },
];

export const BaseCategories: Category[] = isProduction
  ? _BaseCategories.filter((category) => category.id !== "earrings")
  : _BaseCategories;

export const BaseCategoriesObj = BaseCategories.reduce(
  (acc: Record<string, Category>, category) => {
    acc[category.id] = category;
    return acc;
  },
  {}
);

export type BaseCategoriesIds =
  | "keychains"
  | "earrings"
  | "decor"
  | "desk-accessories"
  | "accessories"
  | "clickers";
