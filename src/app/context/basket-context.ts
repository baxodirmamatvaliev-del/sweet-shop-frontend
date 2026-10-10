import { createContext } from "react";
import type { BasketContextValue } from "../../lib/types/basket";

export const BasketContext = createContext<BasketContextValue | null>(null);
