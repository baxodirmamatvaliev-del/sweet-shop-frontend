import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { BasketIcon } from "../basket/BasketIcons";
import { useAppSelector } from "../../hooks";
import { selectAuthData } from "../../screens/authPage/selector";
import ProfileMenu from "../auth/ProfileMenu";

function NavigationLinks({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <>
      <Link to="/products">Menu</Link>
      <a href="#our-story">Our Story</a>
      <a href="#how-to-order">How to order</a>
      {isAuthenticated && <Link to="/my-orders">My Orders</Link>}
    </>
  );
}

export default function HomeNavbar() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame: number | null = null;

    const updateBackground = () => {
      const progress = Math.min(Math.max(window.scrollY / 180, 0), 1);
      headerRef.current?.style.setProperty("--header-progress", String(progress));
      frame = null;
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateBackground);
    };

    updateBackground();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  const { items } = useBasket();
  const authData = useAppSelector(selectAuthData);
  const basketCount = items.reduce((total, item) => total + item.quantity, 0);
  const isAuthenticated = Boolean(authData);

  return (
    <div className="home-header" ref={headerRef}>
      <header className="navbar navbar--home">
        <Link className="navbar__brand" to="/">
          <img
            src="/img/morrow-coffee-logo.svg"
            alt="Morrow Coffee — Big size, 2 shot"
            width="380"
            height="97"
          />
        </Link>
        <nav className="navbar__links" aria-label="Main navigation">
          <NavigationLinks isAuthenticated={isAuthenticated} />
        </nav>
        <div className="navbar__actions">
          {!isAuthenticated && (
            <>
              <Link className="navbar__login" to="/auth/login">Sign in</Link>
              <Link className="navbar__signup" to="/auth/signup">Sign up</Link>
            </>
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
              <span aria-hidden="true">☰</span>
              Menu
            </summary>
            <nav aria-label="Mobile navigation">
              <NavigationLinks isAuthenticated={isAuthenticated} />
              {!isAuthenticated && (
                <>
                  <Link to="/auth/login">Sign in</Link>
                  <Link to="/auth/signup">Sign up</Link>
                </>
              )}
            </nav>
          </details>
        </div>
      </header>
    </div>
  );
}
