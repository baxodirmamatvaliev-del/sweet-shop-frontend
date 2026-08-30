import ContextProvider from "./context/ContextProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./screens/authPage";
import BasketPage from "./screens/basketPage";
import HomePage from "./screens/homePage";
import OrderPage from "./screens/orderPage";
import ProductsPage from "./screens/productsPage";
import MyOrdersPage from "./screens/myOrdersPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <ContextProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/basket"
          element={
            <ProtectedRoute>
              <BasketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContextProvider>
  );
}
