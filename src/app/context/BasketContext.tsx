import { useEffect, useState } from "react";
import type { PropsWithChildren } from "react";
import { BASKET_STORAGE_KEY } from "../../lib/config";
import type { BasketItem, BasketProduct } from "../../lib/types/basket";
import { BasketContext } from "./basket-context";
import { useAppSelector } from "../hooks";
import { selectAuthData } from "../screens/authPage/selector";

const readSavedBasket = (): BasketItem[] => {
  try {
    const savedBasket = localStorage.getItem(BASKET_STORAGE_KEY);
    const parsedBasket = savedBasket
      ? (JSON.parse(savedBasket) as BasketItem[])
      : [];

    return parsedBasket
      .filter(
        (item) =>
        typeof item.productId === "string" &&
        typeof item.name === "string" &&
        typeof item.image === "string" &&
        typeof item.price === "number" &&
          typeof item.quantity === "number",
      )
      .map((item) => ({
        ...item,
        lineId:
          typeof item.lineId === "string" && item.lineId
            ? item.lineId
            : item.productId,
      }));
  } catch {
    return [];
  }
};

export function BasketProvider({ children }: PropsWithChildren) {
  const authData = useAppSelector(selectAuthData);
  const [items, setItems] = useState<BasketItem[]>(readSavedBasket);

  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: BasketProduct): boolean => {
    if (!authData) {
      window.alert("Please log in or sign up to purchase products.");
      return false;
    }

    setItems((currentItems) => {
      const lineId = product.lineId ?? product.productId;
      const existingItem = currentItems.find(
        (item) => item.lineId === lineId,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, lineId, quantity: 1 }];
    });
    return true;
  };

  const changeQuantity = (lineId: string, difference: number) => {
    setItems((currentItems) =>
      currentItems
        .map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: item.quantity + difference }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (lineId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.lineId !== lineId),
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
