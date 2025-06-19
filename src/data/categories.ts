export type Category = {
  id: string;
  name: string;
  baseDescription: string;
  images: string[];
  price: number;
  material: "pla" | "petg";
};

export const BaseCategories: Category[] = [
  // {
  //   id: "keychains",
  //   name: "Keychains",
  //   baseDescription:
  //     "A personalized accessory that adds character to your everyday carry. Perfect as a thoughtful gift or a unique touch to your own keys.",
  //   images: [],
  //   price: 150,
  //   material: "pla",
  // },
  {
    id: "showpieces",
    name: "Display Showpieces",
    baseDescription: "A collection of beautiful and unique display pieces for your home or office.",
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

export type BaseCategoriesIds = "keychains" | "earrings" | "showpieces";