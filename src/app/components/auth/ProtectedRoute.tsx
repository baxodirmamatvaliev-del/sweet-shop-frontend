import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks";
import { selectAuthData } from "../../screens/authPage/selector";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const authData = useAppSelector(selectAuthData);
  const location = useLocation();

  if (!authData) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
