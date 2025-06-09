import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shared } from "use-broadcast-ts";

export type FavoritesStore = {
  itemIds: string[];
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
        itemIds: [],

        addItem: (productId: string) => {
          const state = get();
          if (!state.itemIds.includes(productId)) {
            set({
              itemIds: [...state.itemIds, productId],
            });
          }
        },

        removeItem: (productId: string) => {
          set({
            itemIds: get().itemIds.filter((id) => id !== productId),
          });
        },

        toggleItem: (productId: string) => {
          const state = get();
          const isInFavorites = state.itemIds.includes(productId);

          if (isInFavorites) state.removeItem(productId);
          else state.addItem(productId);
        },

        isInFavorites: (productId: string) => {
          return get().itemIds.includes(productId);
        },

        clearFavorites: () => {
          set({ itemIds: [] });
        },
      }),
      { name: "favorites-storage" }
    ),
    { name: "favorites-storage" }
  )
);
