type Category = {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
};

export const BaseCategories: Category[] = [
  {
    id: "keychains",
    name: "Keychains",
    description:
      "Keychains are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
  },
  {
    id: "earrings",
    name: "Earrings",
    description:
      "Earrings are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
  },
  {
    id: "lithophanes",
    name: "Lithophanes",
    description:
      "Lithophanes are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
  },
  {
    id: "coasters",
    name: "Coasters",
    description:
      "Coasters are a great way to show off your personality and style. They are small, portable, and can be customized to your liking.",
    images: [],
    price: 150,
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