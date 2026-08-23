import type { RootState } from "../../store";
export const selectAuth = (state: RootState) => state.auth;
export const selectAuthData = (state: RootState) => state.auth.data;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
