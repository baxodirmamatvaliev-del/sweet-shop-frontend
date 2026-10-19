import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../../components/footer";
import HomeNavbar from "../../components/headers/HomeNavbar";
import { useAppDispatch } from "../../hooks";
import { fetchProducts } from "../productsPage/slice";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewDishes from "./NewDishes";
import QuickOrder from "./QuickOrder";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { hash } = useLocation();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!hash) return;

    const frame = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
    });

    return () => cancelAnimationFrame(frame);
  }, [hash]);

  return (
    <div className="home-page">
      <HomeNavbar />
      <main>
        <Advertisement />
        <NewDishes />
        <Events />
        <ActiveUsers />
        <QuickOrder />
      </main>
      <Footer />
    </div>
  );
}
