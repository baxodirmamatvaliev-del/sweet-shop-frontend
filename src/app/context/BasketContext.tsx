import { createContext, useState } from "react";
import type { Dispatch, PropsWithChildren, SetStateAction } from "react";
export type BasketItem = { productId: string; quantity: number };
type BasketContextValue = { items: BasketItem[]; setItems: Dispatch<SetStateAction<BasketItem[]>> };
export const BasketContext = createContext<BasketContextValue | null>(null);
export function BasketProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<BasketItem[]>([]);
  return <BasketContext.Provider value={{ items, setItems }}>{children}</BasketContext.Provider>;
}
