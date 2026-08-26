import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { BasketIcon } from "../basket/BasketIcons";

export default function OtherNavbar() {
  const { items } = useBasket();
  const basketCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="navbar">
      <Link className="navbar__brand" to="/"><span>Sweet</span> Shop</Link>
      <Link className="navbar__basket" to="/basket"><BasketIcon /> Basket <span>{basketCount}</span></Link>
    </header>
  );
}
