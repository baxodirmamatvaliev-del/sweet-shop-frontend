const API_URL = import.meta.env.REACT_APP_API_URL;

export type Product = {
  _id: string;
  productCategory: string;
  productStatus: string;
  productName: string;
  productPrice: number;
  productDesc?: string;
  productImage?: string;
  productViews?: number;
};

type ProductsResponse = {
  data: Product[];
  message?: string;
};

export async function getProducts(): Promise<Product[]> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}/products`);
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

  return `${API_URL}/${imagePath}`;
}
