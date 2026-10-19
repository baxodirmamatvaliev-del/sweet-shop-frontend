import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { selectAuthData } from "./selector";
import { clearAuthError } from "./slice";
import { AUTH_SESSION_NOTICE_KEY } from "../../services/AuthSessionService";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authData = useAppSelector(selectAuthData);
  const sessionExpired =
    sessionStorage.getItem(AUTH_SESSION_NOTICE_KEY) === "expired";
  const isSignup = location.pathname.endsWith("/signup");
  const redirectPath =
    (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch, isSignup]);

  useEffect(() => {
    if (authData) {
      navigate(redirectPath, { replace: true });
    }
  }, [authData, navigate, redirectPath]);

  return (
    <main className="auth-page">
      <section className="auth-page__intro">
        <Link className="auth-page__brand" to="/">
          Morrow Coffee
        </Link>
        <div>
          <p className="home-kicker home-kicker--dark">WELCOME TO MORROW COFFEE</p>
          <h1>{isSignup ? "Create your Morrow account" : "Welcome back"}</h1>
          <p>
            Save your details, manage your basket, and find your next
            favorite coffee.
          </p>
        </div>
        <small>A little pause. A favorite cup. A Morrow moment.</small>
      </section>

      <section className="auth-page__content">
        <div className="auth-card">
          <Link className="auth-card__back" to="/">
            ← Back to home
          </Link>
          <div className="auth-card__tabs">
            <Link className={!isSignup ? "active" : ""} to="/auth/login">
              Login
            </Link>
            <Link className={isSignup ? "active" : ""} to="/auth/signup">
              Signup
            </Link>
          </div>
          <div className="auth-card__heading">
            <h2>{isSignup ? "Create your account" : "Login to your account"}</h2>
            <p>
              {isSignup
                ? "Fill in your details to get started."
                : "Enter your nickname and password."}
            </p>
          </div>
          {sessionExpired && !isSignup && (
            <p className="auth-form__error" role="alert">
              Your session has expired. Please log in again.
            </p>
          )}
          {isSignup ? <SignupForm /> : <LoginForm />}
        </div>
      </section>
    </main>
  );
}
