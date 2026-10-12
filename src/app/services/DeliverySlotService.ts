import { requireServerApi } from "../../lib/config";
import type { DeliverySlot } from "../../lib/types/delivery";

export async function getAvailableDeliverySlots(
  date: string,
): Promise<DeliverySlot[]> {
  const apiUrl = requireServerApi();
  const response = await fetch(
    `${apiUrl}/delivery-slots?date=${encodeURIComponent(date)}`,
    { credentials: "include" },
  );
  const result = (await response.json()) as {
    data?: DeliverySlot[];
    message?: string;
  };

  if (!response.ok || !Array.isArray(result.data)) {
    throw new Error(result.message ?? "Unable to load delivery times.");
  }

  return result.data;
}
