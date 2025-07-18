import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shared } from "use-broadcast-ts";
import { UIProduct } from "@/types/product";
import { BaseCustomizationsObj } from "@/data/customizations";
import { calculateProductUnitPrice } from "@/utils/price";
import { trackAddToCart } from "@/lib/analytics";

// todo: optionally better handling of customizations
const createItemId = (
  productId: string,
  customizations: Record<string, string>
): string => {
  // Sort keys to ensure consistent ordering
  const sortedKeys = Object.keys(customizations).sort();
  const normalizedCustomizations = sortedKeys.reduce((acc, key) => {
    acc[key] = customizations[key];
    return acc;
  }, {} as Record<string, string>);

  // Create a deterministic string representation and hash it
  const customizationString = JSON.stringify(normalizedCustomizations);

  // Simple djb2 hash algorithm for consistent hashing
  let hash = 5381;
  for (let i = 0; i < customizationString.length; i++) {
    hash = (hash << 5) + hash + customizationString.charCodeAt(i);
  }

  // Convert to positive base36 string for shorter IDs
  return `${productId}-${Math.abs(hash).toString(36)}`;
};

export type CartItem = {
  id: string;
  product: UIProduct;
  quantity: number;
  customizations: Record<string, string>;
  totalPrice: number;
};

export type CartStore = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (product: UIProduct, customizations: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItem: (itemId: string) => CartItem | undefined;
};

export const useCartStore = create<CartStore>()(
  shared(
    persist(
      (set, get) => ({
        items: [],
        totalItems: 0,
        totalPrice: 0,

        addItem: (product: UIProduct, customizations: Record<string, string>) => {
          const state = get();
          const itemId = createItemId(product.id, customizations);
          const existingItem = state.items.find((item) => item.id === itemId);

          const unitPrice = calculateProductUnitPrice(product.price, customizations);
          const totalPrice = unitPrice;

          if (existingItem) {
            set({
              items: state.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      quantity: item.quantity + 1,
                      totalPrice: totalPrice * (item.quantity + 1),
                    }
                  : item
              ),
            });
          } else {
            set({
              items: [
                ...state.items,
                {
                  id: itemId,
                  product,
                  quantity: 1,
                  customizations,
                  totalPrice,
                },
              ],
            });
          }

          // Update totals
          const newState = get();
          const newTotalItems = newState.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const newTotalPrice = newState.items.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          set({
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          });

          // Track add to cart event (for items added from cart store)
          trackAddToCart({
            productId: product.id,
            productName: product.name,
            categoryId: product.categoryId,
            categoryName: product.baseDescription || product.categoryId,
            price: product.price,
            quantity: 1, // This function always adds 1 item at a time
            customizations: customizations,
            totalPrice: unitPrice,
          });
        },

        removeItem: (itemId: string) => {
          const state = get();
          const newItems = state.items.filter((item) => item.id !== itemId);
          const newTotalItems = newItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const newTotalPrice = newItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          set({
            items: newItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          });
        },

        updateQuantity: (itemId: string, quantity: number) => {
          if (quantity <= 0) {
            get().removeItem(itemId);
            return;
          }

          const state = get();
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              const unitPrice = calculateProductUnitPrice(item.product.price, item.customizations);
              return {
                ...item,
                quantity,
                totalPrice: unitPrice * quantity,
              };
            }
            return item;
          });

          const newTotalItems = updatedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          const newTotalPrice = updatedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          );

          set({
            items: updatedItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice,
          });
        },

        clearCart: () => {
          set({
            items: [],
            totalItems: 0,
            totalPrice: 0,
          });
        },

        getItem: (itemId: string) => {
          return get().items.find((item) => item.id === itemId);
        },
      }),
      { name: "cart-storage" }
    ),
    { name: "cart-storage" }
  )
);
