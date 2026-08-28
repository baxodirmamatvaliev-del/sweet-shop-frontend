import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginMember,
  signupMember,
  updateMember,
  type AuthResponse,
  type LoginInput,
  type SignupInput,
  type UpdateMemberInput,
} from "../../services/MemberService";
import type { ApiStatus } from "../../../lib/types/common";

type AuthState = {
  data: AuthResponse | null;
  status: ApiStatus;
  error: string | null;
};

const getSavedAuth = (): AuthResponse | null => {
  try {
    const savedAuth = localStorage.getItem("sweetShopAuth");
    return savedAuth ? (JSON.parse(savedAuth) as AuthResponse) : null;
  } catch {
    localStorage.removeItem("sweetShopAuth");
    return null;
  }
};

const initialState: AuthState = {
  data: getSavedAuth(),
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
      await signupMember(input);
      return await loginMember({
        memberNick: input.memberNick,
        memberPassword: input.memberPassword,
      });
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Sign up failed.",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (input: UpdateMemberInput, { rejectWithValue }) => {
    try {
      return await updateMember(input);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Profile update failed.",
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
      localStorage.removeItem("sweetShopAuth");
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
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        if (state.data) {
          state.data = { ...state.data, data: action.payload };
          delete state.data.member;
          localStorage.setItem("sweetShopAuth", JSON.stringify(state.data));
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? "Profile update failed.");
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
