// Historical order snapshots only; new orders use coffee products.
export const CakeOptionType = {
  SIZE: "SIZE",
  SPONGE: "SPONGE",
  FILLING: "FILLING",
  CREAM: "CREAM",
  FROSTING: "FROSTING",
  CHOCOLATE: "CHOCOLATE",
  FRUIT: "FRUIT",
  DECORATION: "DECORATION",
} as const;

export type CakeOptionType =
  (typeof CakeOptionType)[keyof typeof CakeOptionType];

export interface CakeOptionSnapshot {
  optionId: string;
  optionType: CakeOptionType;
  code: string;
  name: string;
  priceModifier: number;
}

export interface CakeConfigurationSnapshot {
  size: CakeOptionSnapshot;
  layers: Array<{
    position: number;
    sponge: CakeOptionSnapshot;
    filling: CakeOptionSnapshot;
  }>;
  cream: CakeOptionSnapshot;
  frosting: CakeOptionSnapshot;
  chocolates: CakeOptionSnapshot[];
  fruits: CakeOptionSnapshot[];
  decorations: CakeOptionSnapshot[];
  message: string;
  basePrice: number;
  customizationPrice: number;
  finalPrice: number;
}
