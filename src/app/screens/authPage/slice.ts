import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginMember,
  signupMember,
  updateMember,
} from "../../services/MemberService";
import {
  clearStoredAuthSession,
  loadStoredAuthSession,
  saveStoredAuthSession,
} from "../../services/AuthSessionService";
import type {
  LoginInput,
  SignupInput,
  UpdateMemberInput,
} from "../../../lib/types/member";
import type { AuthState } from "../../../lib/types/screen";

const initialState: AuthState = {
  data: loadStoredAuthSession(),
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
      clearStoredAuthSession();
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
        saveStoredAuthSession(action.payload);
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
        saveStoredAuthSession(action.payload);
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
          saveStoredAuthSession(state.data);
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
