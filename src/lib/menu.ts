import type { Product } from "./types/product";

export const menuCategories = ["All", "Coffee", "Tea", "Ade", "Smoothie", "Dessert", "Other"] as const;
export type MenuCategory = (typeof menuCategories)[number];

export function getMenuCategory(category: string): Exclude<MenuCategory, "All"> {
  switch (category.toUpperCase()) {
    case "COFFEE": return "Coffee";
    case "TEA": return "Tea";
    case "ADE": return "Ade";
    case "SMOOTHIE": return "Smoothie";
    case "DESSERT":
    case "CAKE":
    case "BIRTHDAY_CAKE":
    case "CUPCAKE":
    case "COOKIE": return "Dessert";
    default: return "Other";
  }
}

export const isMenuProduct = (product: Product) =>
  product.productCategory !== "BIRTHDAY_CAKE" &&
  (product.productStatus === "PROCESS" || product.productStatus === "SOLD_OUT");
