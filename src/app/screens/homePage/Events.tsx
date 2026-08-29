const orderSteps = [
  { number: "01", icon: "♢", title: "Choose your cake", description: "Browse the catalog and pick the dessert you love." },
  { number: "02", icon: "⌑", title: "Add to basket", description: "Select your favorites and adjust the quantity." },
  { number: "03", icon: "⌖", title: "Add delivery details", description: "Tell us where and when your order should arrive." },
  { number: "04", icon: "✓", title: "Enjoy your sweets", description: "We prepare everything fresh and deliver it with care." },
];

export default function Events() {
  return (
    <section className="how-order home-section" id="how-to-order">
      <div className="home-container">
        <div className="how-order__heading">
          <div>
            <p className="home-kicker">HOW TO ORDER</p>
            <h2>From our kitchen to your celebration</h2>
          </div>
          <p>Your favorite dessert is only four simple steps away. We make the whole process quick and easy.</p>
        </div>
        <div className="how-order__steps">
          {orderSteps.map((step) => (
            <article className="how-order__step" key={step.number}>
              <div className="how-order__number">{step.number}</div>
              <span className="how-order__icon" aria-hidden="true">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
