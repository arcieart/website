export type Category = {
  id: string;
  name: string;
  baseDescription: string;
  images: string[];
  price: number;
  material: "pla" | "petg";
};

export const BaseCategories: Category[] = [
  {
    id: "keychains",
    name: "Keychains",
    baseDescription:"Perfect as a meaningful keepsake or a thoughtful gift for loved ones.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "decor",
    name: "Decor & Gifting",
    baseDescription: "A collection of beautiful and unique display pieces for your home or office and perfect for gifting",
    images: [],
    price: 300,
    material: "pla",
  },
  {
    id: "earrings",
    name: "Earrings",
    baseDescription:
      "A lightweight and comfortable statement piece that brings personality to any outfit. Each design is carefully crafted to catch the eye.",
    images: [],
    price: 150,
    material: "pla",
  },
];

export const BaseCategoriesObj = BaseCategories.reduce(
  (acc: Record<string, Category>, category) => {
    acc[category.id] = category;
    return acc;
  },
  {}
);

export type BaseCategoriesIds = "keychains" | "earrings" | "decor";