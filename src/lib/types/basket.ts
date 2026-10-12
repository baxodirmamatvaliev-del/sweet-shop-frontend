import type { CakeConfigurationInput } from "./cake";

export interface BasketProduct {
  lineId?: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  cakeConfiguration?: CakeConfigurationInput;
  aiDesignId?: string;
  customizationSummary?: string[];
}

export interface BasketItem extends BasketProduct {
  lineId: string;
  quantity: number;
}

export interface BasketContextValue {
  items: BasketItem[];
  addItem: (product: BasketProduct) => boolean;
  changeQuantity: (lineId: string, difference: number) => void;
  removeItem: (lineId: string) => void;
  clearBasket: () => void;
}
