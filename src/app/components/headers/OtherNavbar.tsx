import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { BasketIcon } from "../basket/BasketIcons";
import ProfileMenu from "../auth/ProfileMenu";

export default function OtherNavbar() {
  const { items } = useBasket();
  const basketCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar navbar--internal">
      <Link className="navbar__brand" to="/">Sweet Shop</Link>
      <nav className="navbar__links" aria-label="Account navigation">
        <Link to="/products">Catalog</Link>
        <Link to="/my-orders">My Orders</Link>
      </nav>
      <div className="navbar__actions">
        <Link
          aria-label={`Basket with ${basketCount} items`}
          className="navbar__basket"
          to="/basket"
        >
          <BasketIcon /> <span>{basketCount}</span>
        </Link>
        <ProfileMenu />
      </div>
    </header>
  );
}
