import { requireServerApi } from "../../lib/config";
import type {
  CreatedOrder,
  CreateOrderInput,
  OrderHistory,
} from "../../lib/types/order";

export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}/orders/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const result = (await response.json()) as {
    data?: CreatedOrder;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to place your order.");
  }

  return result.data;
}

export async function getMyOrders(): Promise<OrderHistory[]> {
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}/orders/my-orders`, {
    credentials: "include",
  });
  const result = (await response.json()) as {
    data?: OrderHistory[];
    message?: string;
  };

  if (!response.ok || !Array.isArray(result.data)) {
    throw new Error(result.message ?? "Unable to load your orders.");
  }

  return result.data;
}

export async function cancelOrder(orderId: string): Promise<OrderHistory> {
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  });
  const result = (await response.json()) as {
    data?: OrderHistory;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to cancel this order.");
  }

  return result.data;
}
