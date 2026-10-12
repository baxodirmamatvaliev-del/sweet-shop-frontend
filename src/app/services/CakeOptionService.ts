import { requireServerApi } from "../../lib/config";
import type { CakeOption } from "../../lib/types/cake";

export async function getActiveCakeOptions(): Promise<CakeOption[]> {
  const apiUrl = requireServerApi();
  const response = await fetch(`${apiUrl}/cake-options`);
  const result = (await response.json()) as {
    data?: CakeOption[];
    message?: string;
  };

  if (!response.ok || !Array.isArray(result.data)) {
    throw new Error(
      result.message ?? "Unable to load cake customization options.",
    );
  }

  return result.data;
}
