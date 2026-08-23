import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";

export default function HomeNavbar() {
  const { items } = useBasket();
  const basketCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/"><span>Sweet</span> Shop</Link>
      <nav className="navbar__links" aria-label="Main navigation">
        <Link to="/products">Catalog</Link>
        <a href="#custom-order">Custom Order</a>
        <a href="#works">Our Work</a>
      </nav>
      <Link className="navbar__basket" to="/basket">
        Basket <span>{basketCount}</span>
      </Link>
    </header>
  );
}
