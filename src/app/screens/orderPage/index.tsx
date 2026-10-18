import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import useBasket from "../../hooks/useBasket";
import { formatKRW } from "../../../lib/currency";
import { DELIVERY_FEE, FREE_DELIVERY_LIMIT } from "../../../lib/config";
import type { CreatedOrder } from "../../../lib/types/order";
import { useAppSelector } from "../../hooks";
import { createOrder } from "../../services/OrderService";
import { selectAuthMember } from "../authPage/selector";
import { getAvailableDeliverySlots } from "../../services/DeliverySlotService";
import type { DeliverySlot } from "../../../lib/types/delivery";

const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const getSeoulDateKey = (date: Date) =>
  new Date(date.getTime() + SEOUL_OFFSET_MS).toISOString().slice(0, 10);

export default function OrderPage() {
  const { items, clearBasket } = useBasket();
  const member = useAppSelector(selectAuthMember);
  const [customerName, setCustomerName] = useState(member?.memberNick ?? "");
  const [phone, setPhone] = useState(member?.memberPhone ?? "");
  const [address, setAddress] = useState(member?.memberAddress ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlotId, setDeliverySlotId] = useState("");
  const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [deliveryError, setDeliveryError] = useState("");
  const now = new Date();
  const minimumDeliveryDate = getSeoulDateKey(
    new Date(now.getTime() + DAY_MS),
  );
  const maximumDeliveryDate = getSeoulDateKey(
    new Date(now.getTime() + 90 * DAY_MS),
  );

  useEffect(() => {
    if (!deliveryDate) return;

    let isActive = true;

    getAvailableDeliverySlots(deliveryDate)
      .then((slots) => {
        if (!isActive) return;
        setDeliverySlots(slots);
        setDeliveryStatus("success");
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;
        setDeliverySlots([]);
        setDeliveryStatus("error");
        setDeliveryError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load delivery times.",
        );
      });

    return () => {
      isActive = false;
    };
  }, [deliveryDate]);

  const handleDeliveryDateChange = (value: string) => {
    setDeliveryDate(value);
    setDeliverySlotId("");
    setDeliverySlots([]);
    setDeliveryError("");
    setDeliveryStatus(value ? "loading" : "idle");
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const delivery = subtotal >= FREE_DELIVERY_LIMIT ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError("");

    if (!deliverySlotId) {
      setStatus("error");
      setError("Please select an available delivery time.");
      return;
    }

    try {
      const order = await createOrder({
        customerName,
        phone,
        address,
        deliverySlotId,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          ...(item.cakeConfiguration
            ? { cakeConfiguration: item.cakeConfiguration }
            : {}),
          ...(item.aiDesignId ? { aiDesignId: item.aiDesignId } : {}),
        })),
      });
      setCreatedOrder(order);
      setStatus("success");
      clearBasket();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to place your order.",
      );
      setStatus("error");
    }
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

          {status === "success" && createdOrder ? (
            <section className="order-success">
              <span aria-hidden="true">✓</span>
              <p className="order-kicker">ORDER CONFIRMED</p>
              <h2>Thank you for your order!</h2>
              <p>Your sweets are now being prepared. We will contact you shortly to confirm delivery.</p>
              <div>
                <small>Order number</small>
                <strong>#{createdOrder._id.slice(-8).toUpperCase()}</strong>
              </div>
              <div>
                <small>Delivery window</small>
                <strong>
                  {createdOrder.deliveryDate} · {createdOrder.deliveryStartTime}–{createdOrder.deliveryEndTime}
                </strong>
              </div>
              <Link className="button button--yellow" to={`/orders/${createdOrder._id}/track`}>
                Track this order
              </Link>
              <Link className="button button--yellow" to="/products">Continue shopping</Link>
            </section>
          ) : items.length === 0 ? (
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

                <fieldset className="order-delivery">
                  <legend>Delivery schedule</legend>
                  <label htmlFor="deliveryDate">Delivery date</label>
                  <input
                    id="deliveryDate"
                    max={maximumDeliveryDate}
                    min={minimumDeliveryDate}
                    onChange={(event) =>
                      handleDeliveryDateChange(event.target.value)
                    }
                    required
                    type="date"
                    value={deliveryDate}
                  />

                  {deliveryStatus === "loading" && (
                    <p className="order-delivery__message">Loading available times...</p>
                  )}
                  {deliveryStatus === "error" && (
                    <p className="order-delivery__message order-delivery__message--error" role="alert">
                      {deliveryError}
                    </p>
                  )}
                  {deliveryStatus === "success" && deliverySlots.length === 0 && (
                    <p className="order-delivery__message">No delivery times are available for this date.</p>
                  )}
                  {deliverySlots.length > 0 && (
                    <div className="order-delivery__slots">
                      {deliverySlots.map((slot) => (
                        <label
                          className={`order-delivery__slot${deliverySlotId === slot._id ? " order-delivery__slot--selected" : ""}`}
                          key={slot._id}
                        >
                          <input
                            checked={deliverySlotId === slot._id}
                            name="deliverySlot"
                            onChange={() => setDeliverySlotId(slot._id)}
                            required
                            type="radio"
                            value={slot._id}
                          />
                          <strong>{slot.startTime}–{slot.endTime}</strong>
                          <small>{slot.remainingCapacity} available</small>
                        </label>
                      ))}
                    </div>
                  )}
                </fieldset>

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

                {status === "error" && <p className="order-form__error" role="alert">{error}</p>}
                <button className="button button--yellow" disabled={status === "loading"} type="submit">
                  {status === "loading" ? "Placing order..." : "Place order"}
                </button>
              </form>

              <aside className="order-summary">
                <h2>Order summary</h2>
                <div className="order-summary__items">
                  {items.map((item) => (
                    <div className="order-summary__item" key={item.lineId}>
                      <span>
                        {item.name} × {item.quantity}
                        {item.cakeConfiguration && <small>Custom cake</small>}
                      </span>
                      <strong>{formatKRW(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="order-summary__row"><span>Subtotal</span><strong>{formatKRW(subtotal)}</strong></div>
                <div className="order-summary__row"><span>Delivery</span><strong>{delivery === 0 ? "Free" : formatKRW(delivery)}</strong></div>
                <div className="order-summary__total"><span>Total</span><strong>{formatKRW(total)}</strong></div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
