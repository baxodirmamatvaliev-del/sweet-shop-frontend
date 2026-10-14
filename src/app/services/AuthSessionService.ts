import { AUTH_STORAGE_KEY } from "../../lib/config";
import type { AuthResponse } from "../../lib/types/member";

const AUTH_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export const AUTH_SESSION_EXPIRED_EVENT = "sweet-shop:auth-session-expired";
export const AUTH_SESSION_NOTICE_KEY = "sweet-shop-auth-session-notice";

interface StoredAuthSession {
  data: AuthResponse;
  expiresAt: number;
}

const isAuthResponse = (value: unknown): value is AuthResponse => {
  if (!value || typeof value !== "object") return false;

  const auth = value as AuthResponse;
  return Boolean(auth.data || auth.member);
};

const isStoredAuthSession = (value: unknown): value is StoredAuthSession => {
  if (!value || typeof value !== "object") return false;

  const session = value as Partial<StoredAuthSession>;
  return (
    Boolean(session.data) &&
    typeof session.data === "object" &&
    typeof session.expiresAt === "number"
  );
};

export const clearStoredAuthSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const saveStoredAuthSession = (data: AuthResponse) => {
  const session: StoredAuthSession = {
    data,
    expiresAt: Date.now() + AUTH_SESSION_DURATION_MS,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  sessionStorage.removeItem(AUTH_SESSION_NOTICE_KEY);
};

export const loadStoredAuthSession = (): AuthResponse | null => {
  try {
    const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!savedSession) return null;

    const parsedSession: unknown = JSON.parse(savedSession);
    if (isStoredAuthSession(parsedSession)) {
      if (parsedSession.expiresAt > Date.now()) return parsedSession.data;

      clearStoredAuthSession();
      sessionStorage.setItem(AUTH_SESSION_NOTICE_KEY, "expired");
      return null;
    }

    // Migrate auth data saved before sessions had an explicit expiry time.
    // A protected API request will still invalidate it if the cookie is stale.
    if (isAuthResponse(parsedSession)) {
      saveStoredAuthSession(parsedSession);
      return parsedSession;
    }

    clearStoredAuthSession();
    return null;
  } catch {
    clearStoredAuthSession();
    return null;
  }
};

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.status === 401) {
    sessionStorage.setItem(AUTH_SESSION_NOTICE_KEY, "expired");
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
  }

  return response;
}
