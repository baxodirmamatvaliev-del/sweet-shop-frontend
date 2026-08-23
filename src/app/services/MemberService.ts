
const API_URL = import.meta.env.REACT_APP_API_URL;

export type LoginInput = {
  memberNick: string;
  memberPassword: string;
};

export type SignupInput = LoginInput & {
  memberPhone: string;
};

export type AuthResponse = {
  accessToken?: string;
  member?: Record<string, unknown>;
  [key: string]: unknown;
};

async function sendAuthRequest(
  path: string,
  input: LoginInput | SignupInput,
): Promise<AuthResponse> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as AuthResponse & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "Authentication request failed.");
  }

  return data;
}

export const loginMember = (input: LoginInput) =>
  sendAuthRequest("/members/login", input);

export const signupMember = (input: SignupInput) =>
  sendAuthRequest("/members/signup", input);

export const getMembers = () => fetch(`${API_URL}/members`);
