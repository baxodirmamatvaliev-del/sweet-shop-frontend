import type { OrderStatus } from "../enums/order.enum";

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  address: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface CreatedOrder {
  _id: string;
  total: number;
  orderStatus: OrderStatus;
}

export interface OrderHistoryItem {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  itemTotal: number;
}

export interface OrderHistory extends CreatedOrder {
  customerName: string;
  phone: string;
  address: string;
  items: OrderHistoryItem[];
  subtotal: number;
  deliveryFee: number;
  createdAt: string;
}
