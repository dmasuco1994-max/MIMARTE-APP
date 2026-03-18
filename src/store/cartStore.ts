import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ICartItem } from "../types/index.ts";

interface CartState {
  items: ICartItem[];
  addItem: (item: ICartItem) => void;
  removeItem: (productId: string, variationId: string) => void;
  updateQuantity: (productId: string, variationId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) =>
            item._id === newItem._id &&
            item.selectedVariation._id === newItem.selectedVariation._id
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += newItem.quantity;
          set({ items: updatedItems });
        } else {
          set({ items: [...items, newItem] });
        }
      },
      removeItem: (productId, variationId) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item._id === productId && item.selectedVariation._id === variationId)
          ),
        });
      },
      updateQuantity: (productId, variationId, quantity) => {
        const updatedItems = get().items.map((item) => {
          if (item._id === productId && item.selectedVariation._id === variationId) {
            return { ...item, quantity: Math.max(1, quantity) };
          }
          return item;
        });
        set({ items: updatedItems });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "mimarte-cart",
    }
  )
);
