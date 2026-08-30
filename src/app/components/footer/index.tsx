import type { ReactNode } from "react";

type SocialIconProps = {
  label: string;
  children: ReactNode;
};

function SocialIcon({ label, children }: SocialIconProps) {
  return (
    <span className="footer__social-icon" role="img" aria-label={label}>
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="footer__inner">
        <div className="footer__brand-block">
          <div className="footer__brand"><span>Sweet</span> Shop</div>
          <p>Handcrafted cakes and desserts made to turn every celebration into a sweet memory.</p>
          <div className="footer__socials">
            <SocialIcon label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" /></svg></SocialIcon>
            <SocialIcon label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" /></svg></SocialIcon>
            <SocialIcon label="X / Twitter"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.26-8.3L2.98 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.73L8.44 4.05H6.59L17.8 19.84Z" /></svg></SocialIcon>
            <SocialIcon label="Telegram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.94 4.66 18.9 19.04c-.23 1.01-.83 1.26-1.68.78l-4.63-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.74 8.58-7.8c.37-.33-.08-.52-.58-.19L7.14 13l-4.57-1.44c-.99-.31-1.01-1 .21-1.48L20.65 3.2c.83-.31 1.55.19 1.29 1.46Z" /></svg></SocialIcon>
          </div>
        </div>

        <div className="footer__column">
          <h3>Explore</h3>
          <span>Home</span>
          <span>Catalog</span>
          <span>Birthday Cakes</span>
          <span>How to Order</span>
        </div>

        <div className="footer__column">
          <h3>Visit us</h3>
          <p>Sweet Street 24, Seoul</p>
          <span>+82 10-1234-5678</span>
          <span>hello@sweetshop.com</span>
        </div>

        <div className="footer__column footer__hours">
          <h3>Opening hours</h3>
          <p><span>Mon–Fri</span><strong>09:00–20:00</strong></p>
          <p><span>Saturday</span><strong>10:00–21:00</strong></p>
          <p><span>Sunday</span><strong>10:00–18:00</strong></p>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Sweet Shop. All rights reserved.</p>
        <p>Baked with care for your sweetest moments.</p>
      </div>
    </footer>
  );
}
