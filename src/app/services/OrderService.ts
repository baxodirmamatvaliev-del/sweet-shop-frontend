const API_URL = import.meta.env.REACT_APP_API_URL;

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  address: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

export type CreatedOrder = {
  _id: string;
  total: number;
  orderStatus: string;
};

export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}/orders/create`, {
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
