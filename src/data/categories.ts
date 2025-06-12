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
      "Keychains are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "earrings",
    name: "Earrings",
    baseDescription:
      "Earrings are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "lithophanes",
    name: "Lithophanes",
    baseDescription:
      "Lithophanes are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
    material: "pla",
  },
  {
    id: "coasters",
    name: "Coasters",
    baseDescription:
      "Coasters are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
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