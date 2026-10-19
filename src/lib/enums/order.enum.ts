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

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  BAKING: "Preparing",
  DECORATING: "Ready to dispatch",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PROCESS: "Processing",
};
