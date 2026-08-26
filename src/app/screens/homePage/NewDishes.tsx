import useBasket from "../../hooks/useBasket";
import { formatUSD } from "../../../lib/currency";
import { animateToBasket } from "../../../lib/animateToBasket";

const products = [
  { id: "home-1", image: "krem.zamok1.png", name: "Creamy Dream", description: "Light cream on a vanilla base", price: 15 },
  { id: "home-2", image: "krem.zamok2.png", name: "Raspberry Delight", description: "Raspberry and smooth chocolate", price: 15 },
  { id: "home-3", image: "krem.zamok3.png", name: "Colorful Celebration", description: "Colorful cream on a sponge base", price: 15 },
  { id: "home-4", image: "krem.zamok4.png", name: "Chocolate World", description: "A soft chocolate cupcake", price: 15 },
  { id: "home-5", image: "krem.zamok5.png", name: "Dragon's Tear", description: "Delicate cream and decorations", price: 15 },
  { id: "home-6", image: "krem.zamok6.png", name: "Summer Fantasy", description: "A bright and fruity flavor", price: 15 },
];

export default function NewDishes() {
  const { addItem } = useBasket();

  return (
    <section className="catalog home-section" id="catalog">
      <div className="home-container">
        <div className="section-heading">
          <div>
            <p className="home-kicker">OUR CATALOG</p>
            <h2>
              Most-loved
              <br />
              sweet creations
            </h2>
          </div>
          <p>
            Every order is made with fresh ingredients and decorated in the
            style you choose.
          </p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <img src={`/img/${product.image}`} alt={product.name} />
              <div className="product-card__body">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-card__footer">
                  <strong>{formatUSD(product.price)}</strong>
                  <button
                    className="button button--small"
                    onClick={(event) => {
                      const card = event.currentTarget.closest(".product-card");
                      animateToBasket(card?.querySelector("img") ?? null);
                      addItem({
                        productId: product.id,
                        name: product.name,
                        image: `/img/${product.image}`,
                        price: product.price,
                      });
                    }}
                    type="button"
                  >
                    Add to basket
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
