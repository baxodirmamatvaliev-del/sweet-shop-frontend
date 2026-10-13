import { Link } from "react-router-dom";

export default function ShopExperience() {
  return (
    <section className="cake-studio home-section" id="cake-studio">
      <div className="home-container">
        <header className="cake-studio__heading">
          <div>
            <p className="home-kicker home-kicker--dark">YOUR CAKE, YOUR WAY</p>
            <h2>One studio for the whole celebration</h2>
          </div>
          <p>
            Create a cake concept, choose a delivery time, and follow every
            order update without leaving Sweet Shop.
          </p>
        </header>

        <div className="cake-studio__grid">
          <article className="studio-card studio-card--designer">
            <div className="studio-card__topline">
              <span>01</span>
              <strong>AI Cake Designer</strong>
            </div>
            <div className="studio-card__visual studio-card__visual--prompt" aria-hidden="true">
              <span className="studio-card__spark">✦</span>
              <p>Elegant berry cake with gold details...</p>
              <div>
                <i />
                <i />
                <i />
              </div>
            </div>
            <h3>Imagine it, then make it yours</h3>
            <p>
              Describe your celebration and generate a visual concept before
              selecting layers, flavors, and decoration.
            </p>
            <a className="studio-card__link" href="#works">
              Choose a cake to customize <span aria-hidden="true">→</span>
            </a>
          </article>

          <article className="studio-card studio-card--delivery">
            <div className="studio-card__topline">
              <span>02</span>
              <strong>Smart Delivery</strong>
            </div>
            <div className="studio-card__visual studio-card__visual--calendar" aria-hidden="true">
              <div><small>FRI</small><b>18</b></div>
              <div className="is-selected"><small>SAT</small><b>19</b></div>
              <div><small>SUN</small><b>20</b></div>
              <p><span>✓</span> 14:00–16:00 available</p>
            </div>
            <h3>Reserve a time that works</h3>
            <p>
              See available delivery windows during checkout and reserve a
              suitable date before placing your order.
            </p>
            <Link className="studio-card__link" to="/basket">
              Plan your delivery <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className="studio-card studio-card--tracking">
            <div className="studio-card__topline">
              <span>03</span>
              <strong>Live Order Tracking</strong>
            </div>
            <div className="studio-card__visual studio-card__visual--tracking" aria-hidden="true">
              <div className="is-complete"><i>✓</i><span>Confirmed</span></div>
              <div className="is-current"><i /> <span>Preparing</span></div>
              <div><i /> <span>On the way</span></div>
            </div>
            <h3>Know what is happening now</h3>
            <p>
              Follow preparation and delivery progress from your account as
              soon as the order status changes.
            </p>
            <Link className="studio-card__link" to="/my-orders">
              Track your orders <span aria-hidden="true">→</span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
