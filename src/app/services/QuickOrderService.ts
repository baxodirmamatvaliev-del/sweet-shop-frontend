import { requireServerApi } from "../../lib/config";
import type { QuickOrderResponse } from "../../lib/types/quick-order";

export async function createQuickOrder(phone: string): Promise<string> {
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}/quick-orders`, {
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
