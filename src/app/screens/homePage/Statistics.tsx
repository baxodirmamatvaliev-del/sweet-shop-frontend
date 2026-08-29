import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { animateToBasket } from "../../../lib/animateToBasket";
import { formatUSD } from "../../../lib/currency";
import useBasket from "../../hooks/useBasket";

const celebrationCakes = [
  {
    id: "birthday-cake-classic",
    image: "/img/tort1.png",
    name: "Chocolate Drip Cake",
    description: "Chocolate and vanilla cream for 8–10 guests.",
    price: 45,
  },
  {
    id: "birthday-cake-colorful",
    image: "/img/tort2.png",
    name: "Tropical Fruit Cake",
    description: "A fresh mango and fruit cake for a bright celebration.",
    price: 55,
  },
  {
    id: "birthday-cake-chocolate",
    image: "/img/tort4.png",
    name: "Carrot Cream Cake",
    description: "A soft spiced cake finished with smooth white cream.",
    price: 60,
  },
  {
    id: "birthday-cake-premium",
    image: "/img/tort5.png",
    name: "Blueberry Fruit Cake",
    description: "A bold blue celebration cake crowned with fresh fruit.",
    price: 75,
  },
  {
    id: "birthday-cake-berry",
    image: "/img/minit.tort.png",
    name: "Chocolate Berry Cake",
    description: "Rich chocolate topped with berries, figs, and fresh greens.",
    price: 65,
  },
  {
    id: "birthday-cake-heart",
    image: "/img/mini.tort6.png",
    name: "Chocolate Heart Cake",
    description: "A romantic heart-shaped cake with chocolate curls.",
    price: 40,
  },
];

export default function Statistics() {
  const { addItem } = useBasket();
  const navigate = useNavigate();

  const handleOrder = (
    event: MouseEvent<HTMLButtonElement>,
    cake: (typeof celebrationCakes)[number],
  ) => {
    const card = event.currentTarget.closest(".celebration-card");
    animateToBasket(card?.querySelector("img") ?? null);
    addItem({
      productId: cake.id,
      name: cake.name,
      image: cake.image,
      price: cake.price,
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
        <div className="celebration-grid">
          {celebrationCakes.map((cake) => (
            <article className="celebration-card" key={cake.id}>
              <div className="celebration-card__image">
                <img src={cake.image} alt={cake.name} />
                <span>Whole cake</span>
              </div>
              <div className="celebration-card__body">
                <h3>{cake.name}</h3>
                <p>{cake.description}</p>
                <div>
                  <strong>From {formatUSD(cake.price)}</strong>
                  <button
                    onClick={(event) => handleOrder(event, cake)}
                    type="button"
                  >
                    Order cake
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="celebration-grid__hint">Swipe to explore all cakes →</p>
      </div>
    </section>
  );
}
