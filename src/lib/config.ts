export const serverApi = import.meta.env.REACT_APP_API_URL ?? "";

export const AUTH_STORAGE_KEY = "sweetShopAuth";
export const BASKET_STORAGE_KEY = "sweet-shop-basket-krw";

export const FREE_DELIVERY_LIMIT = 20_000;
export const DELIVERY_FEE = 3_000;

export function requireServerApi(): string {
  if (!serverApi) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  return serverApi;
}
