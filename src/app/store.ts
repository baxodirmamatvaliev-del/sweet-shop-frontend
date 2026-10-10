import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./screens/authPage/slice";
import productsReducer from "./screens/productsPage/slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
