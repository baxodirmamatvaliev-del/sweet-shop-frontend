import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatUSD } from "../../../lib/currency";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import {
  cancelOrder,
  getMyOrders,
} from "../../services/OrderService";
import { getProductImageUrl } from "../../services/ProductService";
import type { OrderHistory } from "../../../lib/types/order";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<{ orderId: string; message: string } | null>(null);

  const loadOrders = async () => {
    setStatus("loading");
    setError("");

    try {
      setOrders(await getMyOrders());
      setStatus("success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load your orders.");
      setStatus("error");
    }
  };

  useEffect(() => {
    let isActive = true;

    getMyOrders()
      .then((result) => {
        if (!isActive) return;
        setOrders(result);
        setStatus("success");
      })
      .catch((requestError: unknown) => {
        if (!isActive) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load your orders.");
        setStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleCancel = async (orderId: string) => {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!shouldCancel) return;

    setCancellingOrderId(orderId);
    setCancelError(null);

    try {
      const cancelledOrder = await cancelOrder(orderId);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? cancelledOrder : order,
        ),
      );
    } catch (requestError) {
      setCancelError({
        orderId,
        message:
          requestError instanceof Error
            ? requestError.message
            : "Unable to cancel this order.",
      });
    } finally {
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="my-orders-page">
      <OtherNavbar />
      <main className="my-orders-main">
        <div className="my-orders-container">
          <header className="my-orders-heading">
            <p>ORDER HISTORY</p>
            <h1>My orders</h1>
            <span>Track and review all the sweets you have ordered.</span>
          </header>

          {status === "loading" && <div className="my-orders-state">Loading your orders...</div>}
          {status === "error" && (
            <div className="my-orders-state my-orders-state--error">
              <p>{error}</p>
              <button className="button button--yellow" onClick={() => void loadOrders()} type="button">Try again</button>
            </div>
          )}
          {status === "success" && orders.length === 0 && (
            <div className="my-orders-state">
              <h2>No orders yet</h2>
              <p>Your completed orders will appear here.</p>
              <Link className="button button--yellow" to="/products">Browse catalog</Link>
            </div>
          )}
          {status === "success" && orders.length > 0 && (
            <section className="my-orders-list" aria-label="Your orders">
              {orders.map((order) => (
                <article className="my-order-card" key={order._id}>
                  <header>
                    <div className="my-order-card__number">
                      <small>Order number</small>
                      <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                    </div>
                    <div className="my-order-card__date">
                      <small>Order date</small>
                      <strong>{formatDate(order.createdAt)}</strong>
                    </div>
                    <div className="my-order-card__status-group">
                      <small>Order status</small>
                      <span className={`my-order-card__status my-order-card__status--${order.orderStatus.toLowerCase()}`}>
                        {order.orderStatus}
                      </span>
                      <Link className="my-order-card__track" to={`/orders/${order._id}/track`}>
                        Track order
                      </Link>
                    </div>
                  </header>
                  <div className="my-order-card__section-title">
                    <div>
                      <strong>Ordered products</strong>
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items in this order</span>
                    </div>
                    <div className="my-order-card__columns" aria-hidden="true">
                      <span>Quantity</span>
                      <span>Unit price</span>
                      <span>Item total</span>
                    </div>
                  </div>
                  <div className="my-order-card__items">
                    {order.items.map((item) => (
                      <div className="my-order-product" key={item.productId}>
                        <img
                          src={getProductImageUrl(item.aiDesign?.imageUrl ?? item.productImage)}
                          alt=""
                        />
                        <div>
                          <strong>{item.productName}</strong>
                          {item.cakeConfiguration ? (
                            <span>
                              {item.cakeConfiguration.size.name} · {item.cakeConfiguration.layers.length} custom layer{item.cakeConfiguration.layers.length === 1 ? "" : "s"}
                              {item.cakeConfiguration.message
                                ? ` · “${item.cakeConfiguration.message}”`
                                : ""}
                            </span>
                          ) : (
                            <span>Sweet Shop product</span>
                          )}
                          {item.aiDesign && (
                            <span>AI concept attached: {item.aiDesign.prompt}</span>
                          )}
                        </div>
                        <span className="my-order-product__quantity"><small>Quantity</small>{item.quantity}</span>
                        <span className="my-order-product__unit"><small>Unit price</small>{formatUSD(item.productPrice)}</span>
                        <strong className="my-order-product__total"><small>Item total</small>{formatUSD(item.itemTotal)}</strong>
                      </div>
                    ))}
                  </div>
                  <footer>
                    <div className="my-order-card__delivery">
                      <div><small>Delivery address</small><strong>{order.address}</strong></div>
                      {order.deliveryDate ? (
                        <>
                          <div>
                            <small>Delivery window</small>
                            <strong>{order.deliveryDate} · {order.deliveryStartTime}–{order.deliveryEndTime}</strong>
                          </div>
                          <p>We will deliver this order during the selected window.</p>
                        </>
                      ) : (
                        <p>Delivery time will be confirmed separately for this older order.</p>
                      )}
                      {order.orderStatus === "PENDING" && (
                        <button
                          className="my-order-card__cancel"
                          disabled={cancellingOrderId === order._id}
                          onClick={() => void handleCancel(order._id)}
                          type="button"
                        >
                          {cancellingOrderId === order._id
                            ? "Cancelling..."
                            : "Cancel order"}
                        </button>
                      )}
                      {cancelError?.orderId === order._id && (
                        <p className="my-order-card__cancel-error" role="alert">
                          {cancelError.message}
                        </p>
                      )}
                    </div>
                    <div className="my-order-card__price">
                      <h3>Payment summary</h3>
                      <p><span>Subtotal</span><strong>{formatUSD(order.subtotal)}</strong></p>
                      <p><span>Delivery</span><strong>{order.deliveryFee === 0 ? "Free" : formatUSD(order.deliveryFee)}</strong></p>
                      <p><span>Order total</span><strong>{formatUSD(order.total)}</strong></p>
                    </div>
                  </footer>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
