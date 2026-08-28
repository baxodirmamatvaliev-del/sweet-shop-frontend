import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
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
  const [memberAddress, setMemberAddress] = useState("");
  const [memberDesc, setMemberDesc] = useState("");
  const [memberImage, setMemberImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError("Profile image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setMemberImage(file);
    setImagePreview(URL.createObjectURL(file));
    setValidationError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (memberPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    setValidationError(null);
    dispatch(signup({
      memberNick: memberNick.trim(),
      memberPhone: memberPhone.trim(),
      memberPassword,
      memberAddress: memberAddress.trim(),
      memberDesc: memberDesc.trim() || undefined,
      memberImage: memberImage ?? undefined,
    }));
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
        autoComplete="street-address"
        id="signup-address"
        label="Address"
        onChange={(event) => setMemberAddress(event.target.value)}
        placeholder="Your delivery address"
        required
        value={memberAddress}
      />
      <label className="auth-field" htmlFor="signup-description">
        <span>About me <small>(optional)</small></span>
        <textarea
          id="signup-description"
          maxLength={300}
          onChange={(event) => setMemberDesc(event.target.value)}
          placeholder="Tell us a little about yourself"
          rows={3}
          value={memberDesc}
        />
      </label>
      <div className="auth-upload">
        <span className="auth-upload__label">Profile image <small>(optional)</small></span>
        <button
          className="auth-upload__picker"
          onClick={() => imageInputRef.current?.click()}
          type="button"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Profile preview" />
          ) : (
            <span className="auth-upload__placeholder" aria-hidden="true">+</span>
          )}
          <span>
            <strong>{memberImage ? "Change image" : "Upload an image"}</strong>
            <small>{memberImage?.name ?? "JPG, PNG or WEBP · max 5 MB"}</small>
          </span>
        </button>
        <input
          ref={imageInputRef}
          accept="image/jpeg,image/png,image/webp"
          id="signup-image"
          onChange={handleImageChange}
          type="file"
        />
      </div>
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
