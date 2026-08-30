const API_URL = import.meta.env.REACT_APP_API_URL;

type QuickOrderResponse = {
  message?: string;
};

export async function createQuickOrder(phone: string): Promise<string> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}/quick-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const result = (await response.json()) as QuickOrderResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Quick order could not be submitted.");
  }

  return "Your request was received. We will call you soon.";
}
