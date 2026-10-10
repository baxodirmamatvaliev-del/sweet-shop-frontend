import type { MemberStatus, MemberType } from "../enums/member.enum";

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

export interface SignupInput extends LoginInput {
  memberPhone: string;
  memberAddress: string;
  memberDesc?: string;
  memberImage?: File;
}

export interface UpdateMemberInput {
  memberNick: string;
  memberPhone: string;
  memberAddress?: string;
  memberDesc?: string;
}

export interface AuthMember {
  _id: string;
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberNick: string;
  memberPhone: string;
  memberAddress?: string;
  memberDesc?: string;
  memberImage?: string;
}

export interface AuthResponse {
  accessToken?: string;
  data?: AuthMember;
  member?: AuthMember;
  [key: string]: unknown;
}
