import { createContext } from "react";

export type BasketProduct = {
  productId: string;
  name: string;
  image: string;
  price: number;
};

export type BasketItem = BasketProduct & {
  quantity: number;
};

export type BasketContextValue = {
  items: BasketItem[];
  addItem: (product: BasketProduct) => void;
  changeQuantity: (productId: string, difference: number) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
};

export const BasketContext = createContext<BasketContextValue | null>(null);
