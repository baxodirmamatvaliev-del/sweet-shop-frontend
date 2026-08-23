export default function QuickOrder() {
  return (
    <section className="quick-order">
      <div className="quick-order__panel">
        <div>
          <p className="home-kicker home-kicker--dark">QUICK ORDER</p>
          <h2>Let’s make your celebration sweeter</h2>
          <p>Leave your phone number and we will contact you within 15 minutes.</p>
        </div>
        <form className="quick-order__form" onSubmit={(event) => event.preventDefault()}>
          <input aria-label="Phone number" placeholder="Your phone number" type="tel" />
          <button className="button button--yellow" type="submit">Place an Order</button>
        </form>
      </div>
    </section>
  );
}
