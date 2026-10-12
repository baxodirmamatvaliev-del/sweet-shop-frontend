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

export interface CakeOption {
  _id: string;
  optionType: CakeOptionType;
  code: string;
  name: string;
  description: string;
  priceModifier: number;
  previewImage: string;
  previewColor: string;
  sortOrder: number;
}

export interface CakeLayerConfiguration {
  spongeOptionId: string;
  fillingOptionId: string;
}

export interface CakeConfigurationInput {
  sizeOptionId: string;
  layers: CakeLayerConfiguration[];
  creamOptionId: string;
  frostingOptionId: string;
  chocolateOptionIds: string[];
  fruitOptionIds: string[];
  decorationOptionIds: string[];
  message: string;
}

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
