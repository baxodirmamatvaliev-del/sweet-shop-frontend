import { requireServerApi, serverApi } from "../../lib/config";
import type {
  AuthMember,
  AuthResponse,
  LoginInput,
  SignupInput,
  UpdateMemberInput,
} from "../../lib/types/member";
import { authenticatedFetch } from "./AuthSessionService";

async function sendAuthRequest(
  path: string,
  input: LoginInput,
): Promise<AuthResponse> {
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}${path}`, {
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
  const apiUrl = requireServerApi();

  const formData = new FormData();
  formData.append("memberNick", input.memberNick);
  formData.append("memberPhone", input.memberPhone);
  formData.append("memberPassword", input.memberPassword);
  formData.append("memberAddress", input.memberAddress);
  if (input.memberDesc) formData.append("memberDesc", input.memberDesc);
  if (input.memberImage) formData.append("memberImage", input.memberImage);

  const response = await fetch(`${apiUrl}/members/signup`, {
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
  const apiUrl = requireServerApi();

  const response = await fetch(`${apiUrl}/members/logout`, {
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
  const apiUrl = requireServerApi();

  const response = await authenticatedFetch(`${apiUrl}/members/update`, {
    method: "PATCH",
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

  return `${serverApi}/${imagePath}`;
}
