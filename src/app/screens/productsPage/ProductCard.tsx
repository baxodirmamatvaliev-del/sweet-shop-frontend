import type { MouseEvent } from "react";
import { getMenuCategory } from "../../../lib/menu";
import { formatKRW } from "../../../lib/currency";
import { animateToBasket } from "../../../lib/animateToBasket";
import type { Product } from "../../../lib/types/product";
import useBasket from "../../hooks/useBasket";
import { BasketIcon } from "../../components/basket/BasketIcons";
import { getProductImageUrl } from "../../services/ProductService";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useBasket();
  const soldOut = product.productStatus === "SOLD_OUT";
  const image = getProductImageUrl(product.productImage);

  const addToBasket = (event: MouseEvent<HTMLButtonElement>) => {
    const added = addItem({ productId: product._id, name: product.productName, image, price: product.productPrice });
    if (added) animateToBasket(event.currentTarget.closest(".product-card")?.querySelector("img") ?? null);
  };

  return (
    <article className="product-card">
      <div className="product-card__media">
        <img src={image} alt={product.productName} loading="lazy" onError={(event) => {
          const fallback = "/img/morrow-coffee-logo.svg";
          if (event.currentTarget.getAttribute("src") !== fallback) event.currentTarget.src = fallback;
        }} />
        {soldOut && <span className="product-card__sold-out">Sold out</span>}
      </div>
      <div className="product-card__body">
        <p className="product-card__category">
          {getMenuCategory(product.productCategory)}
          {product.productTemperature && (
            <span className={`product-card__temperature product-card__temperature--${product.productTemperature.toLowerCase()}`}>
              {product.productTemperature}
            </span>
          )}
        </p>
        <h3>{product.productName}</h3>
        {product.productDesc && <p className="product-card__description">{product.productDesc}</p>}
        <div className="product-card__footer">
          <strong>{formatKRW(product.productPrice)}</strong>
          <button className="product-card__add" type="button" onClick={addToBasket} disabled={soldOut} aria-label={soldOut ? `${product.productName} is sold out` : `Add ${product.productName} to basket`}>
            <BasketIcon size={22} />
          </button>
        </div>
      </div>
      <div className="product-card__meta">
        <span>{soldOut ? "Back soon" : "Ready for your next break"}</span>
        <span aria-label={`${product.productViews ?? 0} views`}>{product.productViews ?? 0} views</span>
      </div>
    </article>
  );
}
