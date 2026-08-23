import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginMember,
  signupMember,
  type AuthResponse,
  type LoginInput,
  type SignupInput,
} from "../../services/MemberService";
import type { ApiStatus } from "../../../lib/types/common";

type AuthState = {
  data: AuthResponse | null;
  status: ApiStatus;
  error: string | null;
};

const initialState: AuthState = {
  data: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (input: LoginInput, { rejectWithValue }) => {
    try {
      return await loginMember(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed.",
      );
    }
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (input: SignupInput, { rejectWithValue }) => {
    try {
      return await signupMember(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Sign up failed.",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    logout(state) {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? "Login failed.");
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? "Sign up failed.");
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
