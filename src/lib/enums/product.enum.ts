export const ProductCategory = {
  COFFEE: "COFFEE",
  TEA: "TEA",
  ADE: "ADE",
  SMOOTHIE: "SMOOTHIE",
  DESSERT: "DESSERT",
  CUPCAKE: "CUPCAKE",
  CAKE: "CAKE",
  BIRTHDAY_CAKE: "BIRTHDAY_CAKE",
  COOKIE: "COOKIE",
  OTHER: "OTHER",
} as const;

export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];

export const ProductStatus = {
  PROCESS: "PROCESS",
  PAUSE: "PAUSE",
  SOLD_OUT: "SOLD_OUT",
  DELETE: "DELETE",
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

export const ProductTemperature = { ICE: "ICE", HOT: "HOT" } as const;
export type ProductTemperature = (typeof ProductTemperature)[keyof typeof ProductTemperature];
