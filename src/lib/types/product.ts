import type {
  ProductCategory,
  ProductStatus,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productCategory: ProductCategory;
  productStatus: ProductStatus;
  productName: string;
  productPrice: number;
  productDesc?: string;
  productImage?: string;
  productViews?: number;
}

export interface ProductsResponse {
  data: Product[];
  message?: string;
}
