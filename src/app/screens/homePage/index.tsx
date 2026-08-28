import { useEffect } from "react";
import Footer from "../../components/footer";
import HomeNavbar from "../../components/headers/HomeNavbar";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectProductsStatus } from "../productsPage/selector";
import { fetchProducts } from "../productsPage/slice";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewDishes from "./NewDishes";
import QuickOrder from "./QuickOrder";
import Statistics from "./Statistics";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const productsStatus = useAppSelector(selectProductsStatus);

  useEffect(() => {
    if (productsStatus === "idle") dispatch(fetchProducts());
  }, [dispatch, productsStatus]);

  return (
    <div className="home-page">
      <HomeNavbar />
      <main>
        <Advertisement />
        <NewDishes />
        <Events />
        <ActiveUsers />
        <Statistics />
        <QuickOrder />
      </main>
      <Footer />
    </div>
  );
}
