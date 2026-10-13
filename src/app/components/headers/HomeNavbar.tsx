import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { BasketIcon } from "../basket/BasketIcons";
import { useAppSelector } from "../../hooks";
import { selectAuthData } from "../../screens/authPage/selector";
import ProfileMenu from "../auth/ProfileMenu";

function NavigationLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <>
      <Link to="/products">Catalog</Link>
      <a href="#cake-studio">Cake Studio</a>
      <a href="#our-story">Our Story</a>
      <a href="#how-to-order">Delivery</a>
      {isAuthenticated && <Link to="/my-orders">My Orders</Link>}
    </>
  );
}

export default function HomeNavbar() {
  const { items } = useBasket();
  const authData = useAppSelector(selectAuthData);
  const basketCount = items.reduce((total, item) => total + item.quantity, 0);
  const isAuthenticated = Boolean(authData);

  return (
    <div className="home-header">
      <p className="home-header__announcement">
        Handcrafted desserts for life&apos;s sweetest moments.
      </p>
      <header className="navbar navbar--home">
        <Link className="navbar__brand" to="/">
          Sweet Shop
        </Link>
        <nav className="navbar__links" aria-label="Main navigation">
          <NavigationLinks isAuthenticated={isAuthenticated} />
        </nav>
        <div className="navbar__actions">
          {!isAuthenticated && (
            <Link className="navbar__login" to="/auth/login">
              Sign in
            </Link>
          )}
          <Link
            aria-label={`Basket with ${basketCount} items`}
            className="navbar__basket"
            to="/basket"
          >
            <BasketIcon /> <span>{basketCount}</span>
          </Link>
          {isAuthenticated && <ProfileMenu />}
          <details className="navbar__mobile-menu">
            <summary aria-label="Open navigation menu">
              <span />
              <span />
              <span />
            </summary>
            <nav aria-label="Mobile navigation">
              <NavigationLinks isAuthenticated={isAuthenticated} />
            </nav>
          </details>
        </div>
      </header>
    </div>
  );
}
