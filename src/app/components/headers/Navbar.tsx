import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { useAppSelector } from "../../hooks";
import { selectAuthData } from "../../screens/authPage/selector";
import { BasketIcon } from "../basket/BasketIcons";
import ProfileMenu from "../auth/ProfileMenu";

function NavigationLinks({ authenticated }: { authenticated: boolean }) {
  return (
    <>
      <Link to="/">Home</Link>
      <Link to="/products">Menu</Link>
      <Link to="/#our-story">Our Story</Link>
      <Link to="/#how-to-order">How to order</Link>
      {authenticated && <Link to="/my-orders">My Orders</Link>}
    </>
  );
}

export default function Navbar() {
  const authenticated = Boolean(useAppSelector(selectAuthData));
  const { items } = useBasket();
  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar navbar--shop">
      <Link className="navbar__brand" to="/">
        <img src="/img/morrow-coffee-logo.svg" alt="Morrow Coffee" width="380" height="97" />
      </Link>
      <nav className="navbar__links" aria-label="Main navigation">
        <NavigationLinks authenticated={authenticated} />
      </nav>
      <div className="navbar__actions">
        {!authenticated && (
          <>
            <Link className="navbar__login" to="/auth/login">Sign in</Link>
            <Link className="navbar__signup" to="/auth/signup">Sign up</Link>
          </>
        )}
        <Link className="navbar__basket" to="/basket" aria-label={`Basket with ${count} items`}>
          <BasketIcon /> <span>{count}</span>
        </Link>
        {authenticated && <ProfileMenu />}
        <details className="navbar__mobile-menu">
          <summary aria-label="Open navigation menu"><span aria-hidden="true">☰</span> Menu</summary>
          <nav aria-label="Mobile navigation" onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) event.currentTarget.closest("details")?.removeAttribute("open");
          }}>
            <NavigationLinks authenticated={authenticated} />
            {!authenticated && <Link to="/auth/signup">Sign up</Link>}
          </nav>
        </details>
      </div>
    </header>
  );
}
