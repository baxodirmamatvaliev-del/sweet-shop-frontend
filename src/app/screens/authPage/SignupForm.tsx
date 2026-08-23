import { useState, type FormEvent } from "react";
import AuthField from "../../components/auth";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectAuthError, selectAuthStatus } from "./selector";
import { signup } from "./slice";

export default function SignupForm() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (memberPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError(null);
    dispatch(signup({ memberNick, memberPhone, memberPassword }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <AuthField
        id="signup-nickname"
        label="Nickname"
        onChange={(event) => setMemberNick(event.target.value)}
        placeholder="Choose a nickname"
        required
        value={memberNick}
      />
      <AuthField
        id="signup-phone"
        label="Phone number"
        onChange={(event) => setMemberPhone(event.target.value)}
        placeholder="01012345678"
        required
        type="tel"
        value={memberPhone}
      />
      <AuthField
        autoComplete="new-password"
        id="signup-password"
        label="Password"
        minLength={6}
        onChange={(event) => setMemberPassword(event.target.value)}
        placeholder="At least 6 characters"
        required
        type="password"
        value={memberPassword}
      />
      <AuthField
        autoComplete="new-password"
        id="signup-confirm-password"
        label="Confirm password"
        minLength={6}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Repeat your password"
        required
        type="password"
        value={confirmPassword}
      />
      {(validationError || error) && (
        <p className="auth-form__error">{validationError ?? error}</p>
      )}
      <button
        className="button button--yellow auth-form__submit"
        disabled={status === "loading"}
        type="submit"
      >
        {status === "loading" ? "Creating account..." : "Signup"}
      </button>
    </form>
  );
}
