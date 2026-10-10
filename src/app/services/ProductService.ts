import { requireServerApi, serverApi } from "../../lib/config";
import type { Product, ProductsResponse } from "../../lib/types/product";

export async function getProducts(): Promise<Product[]> {
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}/products`);
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error("The backend returned an invalid response.");
  }

  const result = (await response.json()) as ProductsResponse;

  if (!response.ok) {
    throw new Error(result.message ?? "Products could not be loaded.");
  }

  return result.data;
}

export function getProductImageUrl(image?: string): string {
  if (!image) return "/img/krem.zamok1.png";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("/img/")) return image;

  const cleanImage = image.replace(/^\//, "");
  const imagePath = cleanImage.startsWith("uploads/")
    ? cleanImage
    : `uploads/${cleanImage}`;

  return `${serverApi}/${imagePath}`;
}
