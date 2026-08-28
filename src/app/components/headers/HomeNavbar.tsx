import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { BasketIcon } from "../basket/BasketIcons";
import { useAppSelector } from "../../hooks";
import { selectAuthData } from "../../screens/authPage/selector";
import ProfileMenu from "../auth/ProfileMenu";

export default function HomeNavbar() {
  const { items } = useBasket();
  const authData = useAppSelector(selectAuthData);
  const basketCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/"><span>Sweet</span> Shop</Link>
      <nav className="navbar__links" aria-label="Main navigation">
        <Link to="/products">Catalog</Link>
        <a href="#custom-order">Custom Order</a>
        <a href="#works">Our Work</a>
        {!authData && <Link to="/auth/login">Login</Link>}
      </nav>
      <div className="navbar__actions">
        <Link className="navbar__basket" to="/basket">
          <BasketIcon /> Basket <span>{basketCount}</span>
        </Link>
        {authData && <ProfileMenu />}
      </div>
    </header>
  );
}
