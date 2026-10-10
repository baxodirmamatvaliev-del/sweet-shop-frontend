export const MemberType = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type MemberType = (typeof MemberType)[keyof typeof MemberType];

export const MemberStatus = {
  ACTIVE: "ACTIVE",
  BLOCK: "BLOCK",
  DELETE: "DELETE",
} as const;

export type MemberStatus = (typeof MemberStatus)[keyof typeof MemberStatus];
