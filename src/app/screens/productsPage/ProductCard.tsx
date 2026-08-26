import useBasket from "../../hooks/useBasket";
import {
  getProductImageUrl,
  type Product,
} from "../../services/ProductService";
import { convertLegacyPriceToUSD, formatUSD } from "../../../lib/currency";
import { animateToBasket } from "../../../lib/animateToBasket";
import type { MouseEvent } from "react";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useBasket();
  const price = convertLegacyPriceToUSD(product.productPrice);

  const handleAddToBasket = (event: MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget.closest(".products-card");
    animateToBasket(card?.querySelector("img") ?? null);
    addItem({
      productId: product._id,
      name: product.productName,
      image: getProductImageUrl(product.productImage),
      price,
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
          <strong>{formatUSD(price)}</strong>
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
