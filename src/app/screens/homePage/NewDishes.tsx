const products = [
  ["krem.zamok1.png", "Creamy Dream", "Light cream on a vanilla base"],
  ["krem.zamok2.png", "Raspberry Delight", "Raspberry and smooth chocolate"],
  ["krem.zamok3.png", "Colorful Celebration", "Colorful cream on a sponge base"],
  ["krem.zamok4.png", "Chocolate World", "A soft chocolate cupcake"],
  ["krem.zamok5.png", "Dragon's Tear", "Delicate cream and decorations"],
  ["krem.zamok6.png", "Summer Fantasy", "A bright and fruity flavor"],
];

export default function NewDishes() {
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
          {products.map(([image, title, description]) => (
            <article className="product-card" key={title}>
              <img src={`/img/${image}`} alt={title} />
              <div className="product-card__body">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="product-card__footer">
                  <strong>UZS 150,000</strong>
                  <button className="button button--small">Choose</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
