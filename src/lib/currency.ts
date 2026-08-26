export const formatUSD = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);

export const convertLegacyPriceToUSD = (price: number) =>
  price >= 1000 ? price / 1000 : price;
