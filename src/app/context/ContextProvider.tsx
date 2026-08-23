import type { PropsWithChildren } from "react";
import { BasketProvider } from "./BasketContext";
export default function ContextProvider({ children }: PropsWithChildren) { return <BasketProvider>{children}</BasketProvider>; }
