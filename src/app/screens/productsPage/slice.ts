import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts, type Product } from "../../services/ProductService";

type ProductsStatus = "idle" | "loading" | "succeeded" | "failed";

type ProductsState = {
  items: Product[];
  status: ProductsStatus;
  error: string | null;
};

const initialState: ProductsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Products could not be loaded.",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = String(action.payload ?? "Products could not be loaded.");
      });
  },
});

export default productsSlice.reducer;
