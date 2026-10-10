export const OrderStatus = {
  PENDING: "PENDING",
  PROCESS: "PROCESS",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
