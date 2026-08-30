import { useState, type FormEvent } from "react";
import { createQuickOrder } from "../../services/QuickOrderService";

export default function QuickOrder() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedPhone = phone.trim();
    const digits = normalizedPhone.replace(/\D/g, "");
    const localPhone = digits.startsWith("82") ? `0${digits.slice(2)}` : digits;

    if (!/^[\d\s()+-]+$/.test(normalizedPhone) || !/^010\d{8}$/.test(localPhone)) {
      setStatus("error");
      setMessage("Enter a valid Korean phone number, for example 01012345678.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const successMessage = await createQuickOrder(normalizedPhone);
      setStatus("success");
      setMessage(successMessage);
      setPhone("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Quick order could not be submitted.");
    }
  };

  return (
    <section className="quick-order">
      <div className="quick-order__panel">
        <div>
          <p className="home-kicker home-kicker--dark">CALLBACK REQUEST</p>
          <h2>Need help choosing a cake?</h2>
          <p>Leave your phone number and our team will call you within 15 minutes.</p>
        </div>
        <form className="quick-order__form" onSubmit={handleSubmit}>
          <input
            aria-label="Phone number"
            autoComplete="tel"
            disabled={status === "loading"}
            maxLength={20}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="01012345678"
            required
            type="tel"
            value={phone}
          />
          <button
            className="button button--yellow"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? "Sending..." : "Request a Call"}
          </button>
          {message && (
            <p
              className={`quick-order__message quick-order__message--${status}`}
              role={status === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
