import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shared } from "use-broadcast-ts";

export type FavoritesStore = {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  isInFavorites: (productId: string) => boolean;
  clearFavorites: () => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  shared(
    persist(
      (set, get) => ({
        items: [],

        addItem: (productId: string) => {
          const state = get();
          if (!state.items.includes(productId)) {
            set({
              items: [...state.items, productId],
            });
          }
        },

        removeItem: (productId: string) => {
          set({
            items: get().items.filter((id) => id !== productId),
          });
        },

        toggleItem: (productId: string) => {
          const state = get();
          const isInFavorites = state.items.includes(productId);

          if (isInFavorites) state.removeItem(productId);
          else state.addItem(productId);
        },

        isInFavorites: (productId: string) => {
          return get().items.includes(productId);
        },

        clearFavorites: () => {
          set({ items: [] });
        },
      }),
      { name: "favorites-storage" }
    ),
    { name: "favorites-storage" }
  )
);
