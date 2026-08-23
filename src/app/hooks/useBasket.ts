import { useContext } from "react";
import { BasketContext } from "../context/BasketContext";
export default function useBasket() { const basket = useContext(BasketContext); if (!basket) throw new Error("useBasket must be used inside ContextProvider"); return basket; }
