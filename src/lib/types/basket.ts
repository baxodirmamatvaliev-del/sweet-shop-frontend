export interface BasketProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
}

export interface BasketItem extends BasketProduct {
  quantity: number;
}

export interface BasketContextValue {
  items: BasketItem[];
  addItem: (product: BasketProduct) => void;
  changeQuantity: (productId: string, difference: number) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
}
