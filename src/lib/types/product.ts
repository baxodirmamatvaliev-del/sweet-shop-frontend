import type {
  ProductCategory,
  ProductStatus,
  ProductTemperature,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productCategory: ProductCategory;
  productStatus: ProductStatus;
  productTemperature?: ProductTemperature | null;
  productName: string;
  productPrice: number;
  productDesc?: string;
  productImage?: string;
  productViews?: number;
  createdAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  message?: string;
}
