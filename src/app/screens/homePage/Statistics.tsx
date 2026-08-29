import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { animateToBasket } from "../../../lib/animateToBasket";
import { convertLegacyPriceToUSD, formatUSD } from "../../../lib/currency";
import useBasket from "../../hooks/useBasket";
import { useAppSelector } from "../../hooks";
import { getProductImageUrl, type Product } from "../../services/ProductService";
import { selectProducts } from "../productsPage/selector";

export default function Statistics() {
  const { addItem } = useBasket();
  const navigate = useNavigate();
  const products = useAppSelector(selectProducts);
  const celebrationCakes = products
    .filter((product) => product.productCategory.toUpperCase() === "CAKE")
    .slice(-6);

  const handleOrder = (
    event: MouseEvent<HTMLButtonElement>,
    cake: Product,
  ) => {
    const card = event.currentTarget.closest(".celebration-card");
    const image = getProductImageUrl(cake.productImage);
    const price = convertLegacyPriceToUSD(cake.productPrice);
    animateToBasket(card?.querySelector("img") ?? null);
    addItem({
      productId: cake._id,
      name: cake.productName,
      image,
      price,
    });
    navigate("/basket");
  };

  return (
    <section className="gallery home-section" id="works">
      <div className="gallery__glow gallery__glow--one" aria-hidden="true" />
      <div className="gallery__glow gallery__glow--two" aria-hidden="true" />
      <div className="home-container">
        <div className="gallery__heading">
          <div>
            <p className="home-kicker home-kicker--dark">BIRTHDAY CAKES</p>
            <h2>Make their birthday unforgettable</h2>
          </div>
          <p>
            Choose a whole celebration cake, then tell us the colors, message,
            and decorations you would love.
          </p>
        </div>
        {celebrationCakes.length > 0 ? (
          <div className="celebration-grid">
            {celebrationCakes.map((cake) => {
              const price = convertLegacyPriceToUSD(cake.productPrice);

              return (
                <article className="celebration-card" key={cake._id}>
                  <div className="celebration-card__image">
                    <img
                      src={getProductImageUrl(cake.productImage)}
                      alt={cake.productName}
                    />
                    <span>Whole cake</span>
                  </div>
                  <div className="celebration-card__body">
                    <h3>{cake.productName}</h3>
                    <p>
                      {cake.productDesc ||
                        "A whole cake made for your celebration."}
                    </p>
                    <div>
                      <strong>From {formatUSD(price)}</strong>
                      <button
                        onClick={(event) => handleOrder(event, cake)}
                        type="button"
                      >
                        Order cake
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="celebration-grid__empty">
            Birthday cakes will appear here when CAKE products are added.
          </p>
        )}
        {celebrationCakes.length > 0 && (
          <p className="celebration-grid__hint">Swipe to explore all cakes →</p>
        )}
      </div>
    </section>
  );
}
