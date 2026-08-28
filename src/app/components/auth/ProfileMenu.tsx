import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useBasket from "../../hooks/useBasket";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  getMemberImageUrl,
  logoutMember,
} from "../../services/MemberService";
import {
  selectAuthError,
  selectAuthMember,
  selectAuthStatus,
} from "../../screens/authPage/selector";
import { logout, updateProfile } from "../../screens/authPage/slice";

export default function ProfileMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const member = useAppSelector(selectAuthMember);
  const authStatus = useAppSelector(selectAuthStatus);
  const authError = useAppSelector(selectAuthError);
  const { clearBasket } = useBasket();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    memberNick: member?.memberNick ?? "",
    memberPhone: member?.memberPhone ?? "",
    memberAddress: member?.memberAddress ?? "",
    memberDesc: member?.memberDesc ?? "",
  });

  const memberImage = getMemberImageUrl(member?.memberImage);
  const memberInitial = member?.memberNick?.charAt(0).toUpperCase() ?? "U";

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeWithEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);

  const openEditor = () => {
    setForm({
      memberNick: member?.memberNick ?? "",
      memberPhone: member?.memberPhone ?? "",
      memberAddress: member?.memberAddress ?? "",
      memberDesc: member?.memberDesc ?? "",
    });
    setIsEditing(true);
  };

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(updateProfile(form));

    if (updateProfile.fulfilled.match(result)) setIsEditing(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutMember();
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      dispatch(logout());
      clearBasket();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div className="profile-menu" ref={menuRef}>
      <button
        className="profile-menu__trigger"
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        {memberImage ? (
          <img src={memberImage} alt={member?.memberNick ?? "Member"} />
        ) : (
          <span>{memberInitial}</span>
        )}
      </button>

      {isOpen && (
        <div className="profile-menu__dropdown">
          <div className="profile-menu__cover">
            <div className="profile-menu__avatar">
              {memberImage ? (
                <img src={memberImage} alt={member?.memberNick ?? "Member"} />
              ) : (
                <span>{memberInitial}</span>
              )}
            </div>
            <div className="profile-menu__identity">
              <strong>{member?.memberNick ?? "Sweet Shop member"}</strong>
              <small>Sweet Shop member</small>
            </div>
          </div>

          {isEditing ? (
            <form className="profile-menu__form" onSubmit={handleUpdate}>
              <label>
                Name
                <input
                  required
                  value={form.memberNick}
                  onChange={(event) =>
                    setForm({ ...form, memberNick: event.target.value })
                  }
                />
              </label>
              <label>
                Phone number
                <input
                  required
                  value={form.memberPhone}
                  onChange={(event) =>
                    setForm({ ...form, memberPhone: event.target.value })
                  }
                />
              </label>
              <label>
                Address
                <input
                  value={form.memberAddress}
                  onChange={(event) =>
                    setForm({ ...form, memberAddress: event.target.value })
                  }
                />
              </label>
              <label>
                About me
                <textarea
                  rows={3}
                  value={form.memberDesc}
                  onChange={(event) =>
                    setForm({ ...form, memberDesc: event.target.value })
                  }
                />
              </label>
              {authError && <p className="profile-menu__error">{authError}</p>}
              <div className="profile-menu__form-actions">
                <button type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={authStatus === "loading"}>
                  {authStatus === "loading" ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-menu__details">
              <div><span>Phone</span><strong>{member?.memberPhone ?? "Not added"}</strong></div>
              <div><span>Address</span><strong>{member?.memberAddress || "Not added"}</strong></div>
              <div><span>About</span><strong>{member?.memberDesc || "Tell us about yourself"}</strong></div>
              <button type="button" onClick={openEditor}>
                Edit profile
              </button>
            </div>
          )}

          <button
            className="profile-menu__logout"
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
