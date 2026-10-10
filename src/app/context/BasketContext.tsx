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
  const authData = useAppSelector(selectAuthData);
  const [items, setItems] = useState<BasketItem[]>(readSavedBasket);

  useEffect(() => {
    localStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: BasketProduct): boolean => {
    if (!authData) {
      window.alert("Obuna oling. Mahsulot xarid qilish uchun hisobingizga kiring yoki ro‘yxatdan o‘ting.");
      return false;
    }

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
    return true;
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
