import { Link } from "react-router-dom";

export default function OtherNavbar() {
  return <header className="navbar"><Link className="navbar__brand" to="/">Sweet Shop</Link><Link to="/basket">Basket</Link></header>;
}
