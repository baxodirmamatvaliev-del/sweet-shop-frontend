export const OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  BAKING: "BAKING",
  DECORATING: "DECORATING",
  OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  PROCESS: "PROCESS",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
