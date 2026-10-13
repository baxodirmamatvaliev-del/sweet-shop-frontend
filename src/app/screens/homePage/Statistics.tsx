import { useNavigate } from "react-router-dom";
import { convertLegacyPriceToUSD, formatUSD } from "../../../lib/currency";
import { useAppSelector } from "../../hooks";
import type { Product } from "../../../lib/types/product";
import { getProductImageUrl } from "../../services/ProductService";
import { selectProducts } from "../productsPage/selector";

export default function Statistics() {
  const navigate = useNavigate();
  const products = useAppSelector(selectProducts);
  const celebrationCakes = products
    .filter(
      (product) =>
        product.productCategory.toUpperCase() === "BIRTHDAY_CAKE",
    )
    .slice(-6);

  const handleOrder = (cake: Product) => navigate(`/cake-builder/${cake._id}`);

  return (
    <section className="gallery home-section" id="works">
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
              const image = getProductImageUrl(cake.productImage);

              return (
                <article className="celebration-card" key={cake._id}>
                  <div className="celebration-card__image">
                    <img
                      src={image}
                      alt={cake.productName}
                    />
                    <span>Whole cake</span>
                  </div>
                  <div className="celebration-card__body">
                    <h3>{cake.productName}</h3>
                    <p>{cake.productDesc || "A whole cake made for your celebration."}</p>
                    <div>
                      <strong>From {formatUSD(price)}</strong>
                      <button
                        onClick={() => handleOrder(cake)}
                        type="button"
                      >
                        Customize cake
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="celebration-grid__empty">
            Birthday cakes will appear here when BIRTHDAY_CAKE products are added.
          </p>
        )}
        {celebrationCakes.length > 0 && (
          <p className="celebration-grid__hint">Swipe to explore all cakes →</p>
        )}
      </div>
    </section>
  );
}
