import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import useBasket from "../../hooks/useBasket";
import { formatKRW } from "../../../lib/currency";
import { BasketIcon, TrashIcon } from "../../components/basket/BasketIcons";
import { DELIVERY_FEE, FREE_DELIVERY_LIMIT } from "../../../lib/config";

export default function BasketPage() {
  const { items, changeQuantity, removeItem, clearBasket } = useBasket();
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <div className="basket-page">
      <OtherNavbar />
      <main className="basket-main">
        <div className="basket-container">
          <div className="basket-heading">
            <div>
              <p className="basket-kicker">YOUR ORDER</p>
              <h1><BasketIcon size={42} /> Your Basket</h1>
            </div>
            {items.length > 0 && (
              <button onClick={clearBasket} type="button"><TrashIcon /> Clear basket</button>
            )}
          </div>

          {items.length === 0 ? (
            <section className="basket-empty">
              <h2>Your basket is empty</h2>
              <p>Find your next favorite coffee and treats.</p>
              <Link className="button button--yellow" to="/products">Explore the menu</Link>
            </section>
          ) : (
            <div className="basket-layout">
              <section className="basket-items" aria-label="Basket products">
                {items.map((item) => (
                  <article className="basket-item" key={item.lineId}>
                    <img alt={item.name} src={item.image} />
                    <div className="basket-item__info">
                      <h2>{item.name}</h2>
                      <strong>{formatKRW(item.price)}</strong>
                      <button className="basket-item__remove" onClick={() => removeItem(item.lineId)} type="button"><TrashIcon size={16} /> Remove</button>
                    </div>
                    <div className="basket-quantity">
                      <button aria-label={`Decrease ${item.name} quantity`} onClick={() => changeQuantity(item.lineId, -1)} type="button">−</button>
                      <span>{item.quantity}</span>
                      <button aria-label={`Increase ${item.name} quantity`} onClick={() => changeQuantity(item.lineId, 1)} type="button">+</button>
                    </div>
                    <strong className="basket-item__total">{formatKRW(item.price * item.quantity)}</strong>
                  </article>
                ))}
              </section>

              <aside className="basket-summary">
                <h2>Order summary</h2>
                <div className="basket-summary__row"><span>Subtotal</span><strong>{formatKRW(subtotal)}</strong></div>
                <div className="basket-summary__row"><span>Delivery</span><strong>{delivery === 0 ? "Free" : formatKRW(delivery)}</strong></div>
                {delivery > 0 && (
                  <p className="basket-summary__note">Add {formatKRW(FREE_DELIVERY_LIMIT - subtotal)} more for free delivery.</p>
                )}
                <div className="basket-summary__total"><span>Total</span><strong>{formatKRW(total)}</strong></div>
                <Link className="button button--yellow" to="/order">Continue to checkout</Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
