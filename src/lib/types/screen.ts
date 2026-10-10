import type { ApiStatus } from "./common";
import type { AuthResponse } from "./member";
import type { Product } from "./product";

export interface AuthState {
  data: AuthResponse | null;
  status: ApiStatus;
  error: string | null;
}

export interface ProductsState {
  items: Product[];
  status: ApiStatus;
  error: string | null;
}
