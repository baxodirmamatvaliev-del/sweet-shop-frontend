import { Link } from "react-router-dom";

export default function Advertisement() {
  return (
    <section className="hero" id="top">
      <div className="hero__layout home-container">
        <div className="hero__content">
          <p className="home-kicker">HANDCRAFTED DESSERTS</p>
          <h1>
            Made slowly.
            <br />
            Enjoyed fully.
          </h1>
          <p className="hero__text">
            Handcrafted desserts for life&apos;s sweetest moments, baked fresh
            with carefully selected ingredients.
          </p>
          <div className="hero__action">
            <Link className="button button--yellow" to="/products">
              Shop desserts <span aria-hidden="true">→</span>
            </Link>
            <a className="button button--ghost" href="#cake-studio">
              Design your cake <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="hero-cake">
          <span className="hero-cake__note">Baked fresh daily</span>
          <img
            src="/img/cake-animation/cake-assembled.png"
            alt="Chocolate cake decorated with fresh berries"
          />
        </div>
      </div>
    </section>
  );
}
