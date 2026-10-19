import { Link } from "react-router-dom";
import { DELIVERY_FEE, FREE_DELIVERY_LIMIT } from "../../../lib/config";
import { formatKRW } from "../../../lib/currency";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__benefits">
        <div><span aria-hidden="true">☕</span><p><strong>Your daily coffee moment</strong><small>Find a new favorite at Morrow</small></p></div>
        <div><span aria-hidden="true">↗</span><p><strong>Free delivery from {formatKRW(FREE_DELIVERY_LIMIT)}</strong><small>{formatKRW(DELIVERY_FEE)} delivery below the threshold</small></p></div>
        <div><span aria-hidden="true">↻</span><p><strong>Keep up with your order</strong><small>Follow its progress from your account</small></p></div>
      </div>
      <div className="footer__inner">
        <div className="footer__brand-block">
          <Link to="/" className="footer__brand"><img src="/img/morrow-coffee-logo.svg" width="380" height="97" alt="Morrow Coffee" /></Link>
          <p>A little pause. A favorite cup.<br />Something good to look forward to.</p>
        </div>
        <div className="footer__column">
          <h3>Explore Morrow</h3>
          <Link to="/">Home</Link>
          <Link to="/products">Our menu</Link>
          <Link to="/#our-story">Our story</Link>
        </div>
        <div className="footer__column">
          <h3>Your coffee break</h3>
          <Link to="/basket">Your basket</Link>
          <Link to="/my-orders">Your orders</Link>
          <Link to="/auth/login">Your account</Link>
        </div>
        <div className="footer__column">
          <h3>Here to help</h3>
          <Link to="/#how-to-order">How to order</Link>
          <Link to="/#quick-order">Request a callback</Link>
          <p>Seoul, South Korea<br />Made for everyday coffee moments.</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Morrow Coffee.</p>
        <p>Independent portfolio concept.</p>
        <a href="#" aria-label="Back to top">Back to top ↑</a>
      </div>
    </footer>
  );
}
