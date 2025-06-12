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
    baseDescription:
      "A personalized accessory that adds character to your everyday carry. Perfect as a thoughtful gift or a unique touch to your own keys.",
    images: [],
    price: 150,
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
  {
    id: "lithophanes",
    name: "Lithophanes",
    baseDescription:
      "Transform your cherished photo into an enchanting light art piece. When backlit, this unique creation reveals its hidden image in stunning detail.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "coasters",
    name: "Coasters",
    baseDescription:
      "A stylish way to protect your surfaces while adding character to your space. Combines practical functionality with artistic flair.",
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

export type BaseCategoriesIds = "keychains" | "earrings" | "lithophanes" | "coasters";