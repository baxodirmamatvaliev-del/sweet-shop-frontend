export default function ActiveUsers() {
  return (
    <section className="about home-section" id="our-story">
      <div className="home-container about__inner">
        <div className="about__copy">
          <p className="home-kicker">YOUR PASTRY CHEF</p>
          <h2>Care and craftsmanship in every detail</h2>
          <p className="about__lead">I make every order delicious and beautiful enough to become the highlight of your celebration.</p>
          <ul>
            <li>We choose the flavor and decoration together</li>
            <li>We use only fresh ingredients</li>
            <li>Every order is packaged with care</li>
          </ul>
          <a className="button button--navy" href="#quick-order">
            Contact Us
          </a>
        </div>
        <div className="about__portrait">
          <img src="/img/qiz.png" alt="Sweet Shop pastry chef" />
          <span className="about__name">Madina<small>Head Pastry Chef</small></span>
        </div>
      </div>
    </section>
  );
}
