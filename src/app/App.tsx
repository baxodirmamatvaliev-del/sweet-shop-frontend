import { useEffect } from "react";
import ContextProvider from "./context/ContextProvider";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./screens/authPage";
import BasketPage from "./screens/basketPage";
import HomePage from "./screens/homePage";
import OrderPage from "./screens/orderPage";
import ProductsPage from "./screens/productsPage";
import MyOrdersPage from "./screens/myOrdersPage";
import OrderTrackingPage from "./screens/orderTrackingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAppDispatch } from "./hooks";
import { logout } from "./screens/authPage/slice";
import { AUTH_SESSION_EXPIRED_EVENT } from "./services/AuthSessionService";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const expireSession = () => dispatch(logout());
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, expireSession);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, expireSession);
    };
  }, [dispatch]);

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
        <Route
          path="/orders/:id/track"
          element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cake-builder/:productId"
          element={<Navigate to="/products" replace />}
        />
        <Route path="/auth/*" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ContextProvider>
  );
}
