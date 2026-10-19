import type { OrderStatus } from "../enums/order.enum";
import type { CakeConfigurationSnapshot } from "./cake";

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  address: string;
  deliverySlotId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface CreatedOrder {
  _id: string;
  total: number;
  orderStatus: OrderStatus;
  deliveryDate: string;
  deliveryStartTime: string;
  deliveryEndTime: string;
}

export interface OrderHistoryItem {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  itemTotal: number;
  cakeConfiguration?: CakeConfigurationSnapshot;
  aiDesign?: {
    designId: string;
    prompt: string;
    imageUrl: string;
  };
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

export interface OrderStatusHistory {
  status: OrderStatus;
  changedAt: string;
  source: "CUSTOMER" | "ADMIN" | "SYSTEM";
}

export interface OrderTracking extends OrderHistory {
  statusHistory: OrderStatusHistory[];
  updatedAt: string;
}
