import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import useBasket from "../../hooks/useBasket";
import { formatUSD } from "../../../lib/currency";

const FREE_DELIVERY_LIMIT = 100;
const DELIVERY_FEE = 5;

export default function OrderPage() {
  const { items } = useBasket();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="order-page">
      <OtherNavbar />
      <main className="order-main">
        <div className="order-container">
          <div className="order-heading">
            <p className="order-kicker">CHECKOUT</p>
            <h1>Complete your order</h1>
            <p>Enter your delivery details and review your order.</p>
          </div>

          {items.length === 0 ? (
            <section className="order-empty">
              <h2>Your basket is empty</h2>
              <p>Add a dessert before continuing to checkout.</p>
              <Link className="button button--yellow" to="/products">Browse catalog</Link>
            </section>
          ) : (
            <div className="order-layout">
              <form className="order-form" onSubmit={handleSubmit}>
                <h2>Delivery details</h2>

                <label htmlFor="customerName">Full name</label>
                <input
                  id="customerName"
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Enter your full name"
                  required
                  type="text"
                  value={customerName}
                />

                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your phone number"
                  required
                  type="tel"
                  value={phone}
                />

                <label htmlFor="address">Delivery address</label>
                <textarea
                  id="address"
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="Enter your delivery address"
                  required
                  rows={4}
                  value={address}
                />

                <fieldset className="order-payment">
                  <legend>Payment method</legend>
                  <div className="order-payment__card">
                    <div>
                      <strong>Credit or debit card</strong>
                      <small>Demo payment for South Korea — no real charge will be made.</small>
                    </div>

                    <label htmlFor="cardNumber">Card number</label>
                    <input
                      autoComplete="cc-number"
                      id="cardNumber"
                      inputMode="numeric"
                      placeholder="0000 0000 0000 0000"
                      required
                      type="text"
                    />

                    <div className="order-payment__details">
                      <div>
                        <label htmlFor="cardExpiry">Expiry date</label>
                        <input
                          autoComplete="cc-exp"
                          id="cardExpiry"
                          inputMode="numeric"
                          placeholder="MM / YY"
                          required
                          type="text"
                        />
                      </div>
                      <div>
                        <label htmlFor="cardCvc">CVC</label>
                        <input
                          autoComplete="cc-csc"
                          id="cardCvc"
                          inputMode="numeric"
                          placeholder="123"
                          required
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                <button className="button button--yellow" type="submit">Place order</button>
              </form>

              <aside className="order-summary">
                <h2>Order summary</h2>
                <div className="order-summary__items">
                  {items.map((item) => (
                    <div className="order-summary__item" key={item.productId}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{formatUSD(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="order-summary__row"><span>Subtotal</span><strong>{formatUSD(subtotal)}</strong></div>
                <div className="order-summary__row"><span>Delivery</span><strong>{delivery === 0 ? "Free" : formatUSD(delivery)}</strong></div>
                <div className="order-summary__total"><span>Total</span><strong>{formatUSD(total)}</strong></div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
