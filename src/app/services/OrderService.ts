import { requireServerApi } from "../../lib/config";
import type {
  CreatedOrder,
  CreateOrderInput,
  OrderHistory,
  OrderTracking,
} from "../../lib/types/order";
import { authenticatedFetch } from "./AuthSessionService";

export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  const apiUrl = requireServerApi();

  const response = await authenticatedFetch(`${apiUrl}/orders/create`, {
    method: "POST",
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

  const response = await authenticatedFetch(`${apiUrl}/orders/my-orders`);
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

  const response = await authenticatedFetch(`${apiUrl}/orders/${orderId}/cancel`, {
    method: "PATCH",
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

export async function getOrderTracking(orderId: string): Promise<OrderTracking> {
  const apiUrl = requireServerApi();
  const response = await authenticatedFetch(
    `${apiUrl}/orders/${orderId}/tracking`,
  );
  const result = (await response.json()) as {
    data?: OrderTracking;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to load order tracking.");
  }

  return result.data;
}

export function subscribeToOrderTracking(
  orderId: string,
  callbacks: {
    onOpen: () => void;
    onUpdate: (order: OrderTracking) => void;
    onError: () => void;
  },
): () => void {
  const apiUrl = requireServerApi();
  const stream = new EventSource(
    `${apiUrl}/orders/${orderId}/tracking/stream`,
    { withCredentials: true },
  );

  stream.addEventListener("open", callbacks.onOpen);
  stream.addEventListener("tracking", (event) => {
    try {
      callbacks.onUpdate(JSON.parse(event.data) as OrderTracking);
    } catch {
      callbacks.onError();
    }
  });
  stream.addEventListener("error", callbacks.onError);

  return () => stream.close();
}
