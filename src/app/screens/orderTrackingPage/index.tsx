import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { formatKRW } from "../../../lib/currency";
import { OrderStatus, orderStatusLabels as statusLabels, type OrderStatus as OrderStatusType } from "../../../lib/enums/order.enum";
import type { OrderTracking } from "../../../lib/types/order";
import Footer from "../../components/footer";
import OtherNavbar from "../../components/headers/OtherNavbar";
import { getProductImageUrl } from "../../services/ProductService";
import {
  getOrderTracking,
  subscribeToOrderTracking,
} from "../../services/OrderService";

const progressStatuses: Array<{ status: OrderStatusType; label: string; detail: string }> = [
  { status: OrderStatus.PENDING, label: "Order received", detail: "We received your order." },
  { status: OrderStatus.CONFIRMED, label: "Confirmed", detail: "Your order has been confirmed." },
  { status: OrderStatus.BAKING, label: statusLabels.BAKING, detail: "We are preparing your coffee and treats." },
  { status: OrderStatus.DECORATING, label: statusLabels.DECORATING, detail: "Your order is packed and ready to go." },
  { status: OrderStatus.OUT_FOR_DELIVERY, label: "Out for delivery", detail: "Your order is on the way." },
  { status: OrderStatus.DELIVERED, label: "Delivered", detail: "Your order has arrived." },
];

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function OrderTrackingPage() {
  const { id = "" } = useParams();
  const [order, setOrder] = useState<OrderTracking | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [connection, setConnection] = useState<"connecting" | "live" | "reconnecting">("connecting");
  const [error, setError] = useState("");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">(
    () => typeof Notification === "undefined" ? "unsupported" : Notification.permission,
  );
  const notificationPermissionRef = useRef(notificationPermission);
  const latestStatusRef = useRef<OrderStatusType | null>(null);

  useEffect(() => {
    let active = true;
    let closeStream: (() => void) | undefined;

    getOrderTracking(id)
      .then((tracking) => {
        if (!active) return;
        setOrder(tracking);
        latestStatusRef.current = tracking.orderStatus;
        setStatus("success");
        closeStream = subscribeToOrderTracking(id, {
          onOpen: () => active && setConnection("live"),
          onUpdate: (updatedOrder) => {
            if (!active) return;
            if (
              latestStatusRef.current !== updatedOrder.orderStatus &&
              notificationPermissionRef.current === "granted" &&
              document.hidden
            ) {
              new Notification("Morrow Coffee order update", {
                body: `Order #${updatedOrder._id.slice(-8).toUpperCase()} is now ${statusLabels[updatedOrder.orderStatus].toLowerCase()}.`,
              });
            }
            latestStatusRef.current = updatedOrder.orderStatus;
            setOrder(updatedOrder);
          },
          onError: () => active && setConnection("reconnecting"),
        });
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load order tracking.",
        );
        setStatus("error");
      });

    return () => {
      active = false;
      closeStream?.();
    };
  }, [id]);

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    notificationPermissionRef.current = permission;
    setNotificationPermission(permission);
  };

  const normalizedStatus = order?.orderStatus === OrderStatus.PROCESS
    ? OrderStatus.CONFIRMED
    : order?.orderStatus;
  const currentIndex = progressStatuses.findIndex(
    ({ status: progressStatus }) => progressStatus === normalizedStatus,
  );
  const isCancelled = order?.orderStatus === OrderStatus.CANCELLED;

  return (
    <div className="tracking-page">
      <OtherNavbar />
      <main className="tracking-main">
        <div className="tracking-container">
          <Link className="tracking-back" to="/my-orders">← Back to my orders</Link>

          {status === "loading" && (
            <div className="tracking-state">Loading live tracking...</div>
          )}
          {status === "error" && (
            <div className="tracking-state tracking-state--error">
              <h1>Tracking unavailable</h1>
              <p>{error}</p>
              <Link className="button button--yellow" to="/my-orders">View my orders</Link>
            </div>
          )}

          {status === "success" && order && (
            <>
              <header className="tracking-heading">
                <div>
                  <p>LIVE ORDER TRACKING</p>
                  <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
                  <span>Placed {formatDateTime(order.createdAt)}</span>
                </div>
                <div className="tracking-heading__actions">
                  {notificationPermission === "default" && (
                    <button onClick={() => void enableNotifications()} type="button">
                      Enable notifications
                    </button>
                  )}
                  <span className={`tracking-connection tracking-connection--${connection}`}>
                    {connection === "live" ? "Live" : connection === "connecting" ? "Connecting" : "Reconnecting"}
                  </span>
                </div>
              </header>

              <section className={`tracking-progress${isCancelled ? " tracking-progress--cancelled" : ""}`}>
                <div className="tracking-progress__summary">
                  <div>
                    <small>Current status</small>
                    <strong aria-live="polite">{statusLabels[order.orderStatus]}</strong>
                  </div>
                  <div>
                    <small>Estimated delivery</small>
                    <strong>
                      {order.deliveryDate
                        ? `${order.deliveryDate} · ${order.deliveryStartTime}–${order.deliveryEndTime}`
                        : "To be confirmed"}
                    </strong>
                  </div>
                </div>

                {isCancelled ? (
                  <div className="tracking-cancelled">
                    <span>×</span>
                    <div><strong>Order cancelled</strong><p>This order will not be prepared or delivered.</p></div>
                  </div>
                ) : (
                  <ol className="tracking-timeline">
                    {progressStatuses.map((step, index) => {
                      const state = index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming";
                      return (
                        <li className={`tracking-timeline__step tracking-timeline__step--${state}`} key={step.status}>
                          <span className="tracking-timeline__marker">{index < currentIndex ? "✓" : index + 1}</span>
                          <div><strong>{step.label}</strong><p>{step.detail}</p></div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>

              <div className="tracking-details">
                <section className="tracking-card">
                  <h2>Order details</h2>
                  <div className="tracking-items">
                    {order.items.map((item) => (
                      <div className="tracking-item" key={item.productId}>
                        <img alt="" src={getProductImageUrl(item.productImage)} />
                        <div><strong>{item.productName}</strong><span>Quantity: {item.quantity}</span></div>
                        <strong>{formatKRW(item.itemTotal)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className="tracking-total"><span>Total</span><strong>{formatKRW(order.total)}</strong></div>
                  <div className="tracking-address"><small>Delivery address</small><strong>{order.address}</strong></div>
                </section>

                <section className="tracking-card">
                  <h2>Status history</h2>
                  <ol className="tracking-history">
                    {[...order.statusHistory].reverse().map((entry, index) => (
                      <li key={`${entry.status}-${entry.changedAt}-${index}`}>
                        <span />
                        <div><strong>{statusLabels[entry.status]}</strong><small>{formatDateTime(entry.changedAt)}</small></div>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
