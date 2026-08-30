import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { animateToBasket } from "../../../lib/animateToBasket";
import { convertLegacyPriceToUSD, formatUSD } from "../../../lib/currency";
import useBasket from "../../hooks/useBasket";
import { useAppSelector } from "../../hooks";
import { getProductImageUrl, type Product } from "../../services/ProductService";
import { selectProducts } from "../productsPage/selector";

const celebrationCakeDetails = [
  {
    name: "Chocolate Celebration Cake",
    description: "Rich chocolate layers with smooth cream for 8–10 guests.",
    price: 45,
    image: "/img/tort1.png",
  },
  {
    name: "Strawberry Roll Cake",
    description: "Soft vanilla sponge rolled with fresh strawberry cream.",
    price: 40,
    image: "/img/tort2.png",
  },
  {
    name: "Black Forest Cake",
    description: "Chocolate sponge, light cream, and a sweet berry filling.",
    price: 55,
    image: "/img/tort4.png",
  },
  {
    name: "Berry Cream Cake",
    description: "Delicate cream cake finished with fresh seasonal berries.",
    price: 60,
    image: "/img/tort5.png",
  },
  {
    name: "Chocolate Berry Cake",
    description: "Dark chocolate topped with berries, fruit, and fresh greens.",
    price: 65,
    image: "/img/minit.tort.png",
  },
  {
    name: "Chocolate Heart Cake",
    description: "A romantic heart-shaped cake with rich chocolate curls.",
    price: 50,
    image: "/img/mini.tort6.png",
  },
];

type CelebrationCakeDetails = (typeof celebrationCakeDetails)[number];

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
    details: CelebrationCakeDetails,
  ) => {
    const card = event.currentTarget.closest(".celebration-card");
    animateToBasket(card?.querySelector("img") ?? null);
    addItem({
      productId: cake._id,
      name: details.name,
      image: details.image,
      price: details.price,
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
            {celebrationCakes.map((cake, index) => {
              const details = celebrationCakeDetails[index] ?? {
                name: cake.productName,
                description:
                  cake.productDesc ||
                  "A whole cake made for your celebration.",
                price: convertLegacyPriceToUSD(cake.productPrice),
                image: getProductImageUrl(cake.productImage),
              };

              return (
                <article className="celebration-card" key={cake._id}>
                  <div className="celebration-card__image">
                    <img
                      src={details.image}
                      alt={details.name}
                    />
                    <span>Whole cake</span>
                  </div>
                  <div className="celebration-card__body">
                    <h3>{details.name}</h3>
                    <p>{details.description}</p>
                    <div>
                      <strong>From {formatUSD(details.price)}</strong>
                      <button
                        onClick={(event) => handleOrder(event, cake, details)}
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
