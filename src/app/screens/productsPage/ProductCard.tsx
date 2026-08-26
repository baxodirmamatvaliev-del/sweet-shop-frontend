import useBasket from "../../hooks/useBasket";
import {
  getProductImageUrl,
  type Product,
} from "../../services/ProductService";

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US").format(price);

export default function ProductCard({ product }: ProductCardProps) {
  const { setItems } = useBasket();

  const handleAddToBasket = () => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product._id,
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { productId: product._id, quantity: 1 }];
    });
  };

  return (
    <article className="products-card">
      <div className="products-card__image">
        <img
          alt={product.productName}
          src={getProductImageUrl(product.productImage)}
        />
        <span>{product.productCategory}</span>
      </div>
      <div className="products-card__body">
        <h2>{product.productName}</h2>
        <p>{product.productDesc || "A freshly made Sweet Shop dessert."}</p>
        <div className="products-card__footer">
          <strong>UZS {formatPrice(product.productPrice)}</strong>
          <button
            className="button button--yellow button--small"
            onClick={handleAddToBasket}
            type="button"
          >
            Add to basket
          </button>
        </div>
      </div>
    </article>
  );
}
