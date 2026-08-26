import type { Product } from "../../services/ProductService";
import ProductCard from "./ProductCard";

type ProductsListProps = {
  products: Product[];
};

export default function ProductsList({ products }: ProductsListProps) {
  if (products.length === 0) {
    return <p className="products-message">No matching products found.</p>;
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
