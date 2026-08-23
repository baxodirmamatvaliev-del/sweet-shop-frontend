import { useState, type FormEvent } from "react";
import AuthField from "../../components/auth";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectAuthError, selectAuthStatus } from "./selector";
import { login } from "./slice";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [memberNick, setMemberNick] = useState("");
  const [memberPassword, setMemberPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({ memberNick, memberPassword }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <AuthField
        id="login-nickname"
        label="Nickname"
        onChange={(event) => setMemberNick(event.target.value)}
        placeholder="Enter your nickname"
        required
        value={memberNick}
      />
      <AuthField
        autoComplete="current-password"
        id="login-password"
        label="Password"
        minLength={6}
        onChange={(event) => setMemberPassword(event.target.value)}
        placeholder="Enter your password"
        required
        type="password"
        value={memberPassword}
      />
      {error && <p className="auth-form__error">{error}</p>}
      <button
        className="button button--yellow auth-form__submit"
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
