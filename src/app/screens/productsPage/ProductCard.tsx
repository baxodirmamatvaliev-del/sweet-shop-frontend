import { getMenuCategory } from "../../../lib/menu";
import type { MouseEvent } from "react";
import { formatKRW } from "../../../lib/currency";
import { animateToBasket } from "../../../lib/animateToBasket";
import useBasket from "../../hooks/useBasket";
import type { Product } from "../../../lib/types/product";
import { getProductImageUrl } from "../../services/ProductService";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useBasket();
  const price = product.productPrice;

  const handleAddToBasket = (event: MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget.closest(".products-card");
    const added = addItem({
      productId: product._id,
      name: product.productName,
      image: getProductImageUrl(product.productImage),
      price,
    });
    if (!added) return;

    animateToBasket(card?.querySelector("img") ?? null);
  };

  return (
    <article className="products-card">
      <div className="products-card__image">
        <img
          loading="lazy"
          alt={product.productName}
          src={getProductImageUrl(product.productImage)}
        />
        <span>{getMenuCategory(product.productCategory)}</span>
      </div>
      <div className="products-card__body">
        <h2>{product.productName}</h2>
        <p>{product.productDesc || "Discover your next favorite."}</p>
        <div className="products-card__footer">
          <strong>{formatKRW(price)}</strong>
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
