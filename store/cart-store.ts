import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
  printifyProductId: string;
  size: string;
  color: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (item: CartItem) => void;
  alterQty: (item: CartItem) => void;
  currentColor: { url: string; colorName: string };
  setCurrentColor: (color: { url: string; colorName: string }) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.id === item.id &&
              i.size === item.size &&
              i.color === item.color,
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),
      alterQty: (item) =>
        set((state) => {
          return {
            items: state.items.map((i) => {
              if (
                i.id === item.id &&
                i.size === item.size &&
                i.color === item.color
              ) {
                return { ...i, quantity: item.quantity };
              }
              return i;
            }),
          };
        }),
      removeItem: (item) =>
        set((state) => {
          return {
            items: state.items.filter(
              (i) =>
                !(
                  i.id === item.id &&
                  i.size === item.size &&
                  i.color === item.color
                ),
            ),
          };
        }),

      currentColor: {
        url: "",
        colorName: "",
      },
      setCurrentColor: (color) => set(() => ({ currentColor: color })),
    }),
    { name: "cart" },
  ),
);
