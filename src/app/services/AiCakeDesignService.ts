import { requireServerApi, serverApi } from "../../lib/config";
import type {
  AiCakeDesign,
  AiCakeDesignHistory,
} from "../../lib/types/ai-design";
import { authenticatedFetch } from "./AuthSessionService";

export async function getAiCakeDesignHistory(): Promise<AiCakeDesignHistory> {
  const apiUrl = requireServerApi();
  const response = await authenticatedFetch(`${apiUrl}/ai-cake-designs`);
  const result = (await response.json()) as {
    data?: AiCakeDesignHistory;
    message?: string;
  };
  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to load AI cake designs.");
  }
  return result.data;
}

export async function generateAiCakeDesign(
  prompt: string,
): Promise<{ design: AiCakeDesign; remaining: number; dailyLimit: number }> {
  const apiUrl = requireServerApi();
  const response = await authenticatedFetch(`${apiUrl}/ai-cake-designs/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const result = (await response.json()) as {
    data?: { design: AiCakeDesign; remaining: number; dailyLimit: number };
    message?: string;
  };
  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Unable to generate an AI cake design.");
  }
  return result.data;
}

export function getAiDesignImageUrl(imageUrl: string): string {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${serverApi}/${imageUrl.replace(/^\//, "")}`;
}
