import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import {
  BasketContext,
  type BasketItem,
  type BasketProduct,
} from "./basket-context";

const readSavedBasket = (): BasketItem[] => {
  try {
    const savedBasket = localStorage.getItem("sweet-shop-basket");
    const parsedBasket = savedBasket
      ? (JSON.parse(savedBasket) as BasketItem[])
      : [];

    return parsedBasket.filter(
      (item) =>
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number",
    );
  } catch {
    return [];
  }
};

export function BasketProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<BasketItem[]>(readSavedBasket);

  useEffect(() => {
    localStorage.setItem("sweet-shop-basket", JSON.stringify(items));
  }, [items]);

  const addItem = (product: BasketProduct) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product.productId,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (productId: string, difference: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + difference }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const clearBasket = () => setItems([]);

  return (
    <BasketContext.Provider
      value={{ items, addItem, changeQuantity, removeItem, clearBasket }}
    >
      {children}
    </BasketContext.Provider>
  );
}
