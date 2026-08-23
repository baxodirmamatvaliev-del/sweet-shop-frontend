import ContextProvider from "./context/ContextProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./screens/authPage";
import BasketPage from "./screens/basketPage";
import HomePage from "./screens/homePage";
import OrderPage from "./screens/orderPage";
import ProductsPage from "./screens/productsPage";
import UserPage from "./screens/userPage";

export default function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/basket" element={<BasketPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContextProvider>
  );
}
