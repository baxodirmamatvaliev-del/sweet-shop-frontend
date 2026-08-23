import Footer from "../../components/footer";
import HomeNavbar from "../../components/headers/HomeNavbar";
import ActiveUsers from "./ActiveUsers";
import Advertisement from "./Advertisement";
import Events from "./Events";
import NewDishes from "./NewDishes";
import QuickOrder from "./QuickOrder";
import Statistics from "./Statistics";

export default function HomePage() {
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
