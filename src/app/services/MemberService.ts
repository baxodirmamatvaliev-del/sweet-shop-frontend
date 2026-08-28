
const API_URL = import.meta.env.REACT_APP_API_URL;

export type LoginInput = {
  memberNick: string;
  memberPassword: string;
};

export type SignupInput = LoginInput & {
  memberPhone: string;
  memberAddress: string;
  memberDesc?: string;
  memberImage?: File;
};

export type UpdateMemberInput = {
  memberNick: string;
  memberPhone: string;
  memberAddress?: string;
  memberDesc?: string;
};

export type AuthMember = {
  _id: string;
  memberNick: string;
  memberPhone: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
};

export type AuthResponse = {
  accessToken?: string;
  data?: AuthMember;
  member?: AuthMember;
  [key: string]: unknown;
};

async function sendAuthRequest(
  path: string,
  input: LoginInput,
): Promise<AuthResponse> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
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

export async function signupMember(input: SignupInput): Promise<AuthResponse> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const formData = new FormData();
  formData.append("memberNick", input.memberNick);
  formData.append("memberPhone", input.memberPhone);
  formData.append("memberPassword", input.memberPassword);
  formData.append("memberAddress", input.memberAddress);
  if (input.memberDesc) formData.append("memberDesc", input.memberDesc);
  if (input.memberImage) formData.append("memberImage", input.memberImage);

  const response = await fetch(`${API_URL}/members/signup`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = (await response.json()) as AuthResponse & { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "Sign up failed.");
  }

  return data;
}

export async function logoutMember(): Promise<void> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}/members/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed.");
  }
}

export async function updateMember(
  input: UpdateMemberInput,
): Promise<AuthMember> {
  if (!API_URL) {
    throw new Error("REACT_APP_API_URL is missing in the .env file.");
  }

  const response = await fetch(`${API_URL}/members/update`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  const result = (await response.json()) as {
    data?: AuthMember;
    message?: string;
  };

  if (!response.ok || !result.data) {
    throw new Error(result.message ?? "Profile update failed.");
  }

  return result.data;
}

export function getMemberImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;

  const cleanImage = image.replace(/^\//, "");
  const imagePath = cleanImage.startsWith("uploads/")
    ? cleanImage
    : `uploads/${cleanImage}`;

  return `${API_URL}/${imagePath}`;
}

export const getMembers = () =>
  fetch(`${API_URL}/members`, { credentials: "include" });
