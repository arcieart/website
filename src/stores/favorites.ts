import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UIProduct } from "@/types/product";

export type FavoritesStore = {
  items: UIProduct[];
  addItem: (product: UIProduct) => void;
  removeItem: (productId: string) => void;
  toggleItem: (product: UIProduct) => void;
  isInFavorites: (productId: string) => boolean;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: UIProduct) => {
        const state = get();
        if (!state.items.find((item) => item.id === product.id)) {
          set({
            items: [...state.items, product],
          });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      toggleItem: (product: UIProduct) => {
        const state = get();
        const existingItem = state.items.find((item) => item.id === product.id);

        if (existingItem) state.removeItem(product.id);
        else state.addItem(product);
      },

      isInFavorites: (productId: string) => {
        return get().items.some((item) => item.id === productId);
      },

      clearFavorites: () => {
        set({ items: [] });
      },
    }),
    {
      name: "favorites-storage",
    }
  )
);
