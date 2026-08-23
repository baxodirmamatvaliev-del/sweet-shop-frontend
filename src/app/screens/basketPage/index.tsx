import { Link } from "react-router-dom";
import useBasket from "../../hooks/useBasket";

export default function BasketPage() {
  const { items, setItems } = useBasket();

  const changeQuantity = (productId: string, difference: number) => {
    setItems((currentItems) => currentItems
      .map((item) => item.productId === productId
        ? { ...item, quantity: item.quantity + difference }
        : item)
      .filter((item) => item.quantity > 0));
  };

  return (
    <main className="basket-page home-container">
      <Link to="/">← Home</Link>
      <h1>Your Basket</h1>
      {items.length === 0 ? (
        <p>Your basket is currently empty. <Link to="/products">Browse the catalog</Link></p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.productId}>
              <span>Product: {item.productId}</span>
              <button onClick={() => changeQuantity(item.productId, -1)} type="button">−</button>
              <span>{item.quantity}</span>
              <button onClick={() => changeQuantity(item.productId, 1)} type="button">+</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
