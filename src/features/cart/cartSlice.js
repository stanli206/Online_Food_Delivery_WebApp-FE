// src/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

// GET /api/cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/cart");
      return res.data.cart || null;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        // not logged in
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message = err.response?.data?.message || "Failed to load cart";
      return rejectWithValue(message);
    }
  }
);

// POST /api/cart/add
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ restaurantId, menuItemId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/cart/add", {
        restaurantId,
        menuItemId,
        quantity,
      });
      return res.data.cart;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message =
        err.response?.data?.message || "Failed to add item to cart";
      return rejectWithValue(message);
    }
  }
);

// PUT /api/cart/item/:itemId
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/cart/item/${itemId}`, { quantity });
      return res.data.cart;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message =
        err.response?.data?.message || "Failed to update cart item";
      return rejectWithValue(message);
    }
  }
);

// DELETE /api/cart/item/:itemId
export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ itemId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/api/cart/item/${itemId}`);
      return res.data.cart;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message =
        err.response?.data?.message || "Failed to remove item from cart";
      return rejectWithValue(message);
    }
  }
);

// DELETE /api/cart/clear
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await api.delete("/api/cart/clear");
      return null;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message =
        err.response?.data?.message || "Failed to clear cart";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  cart: null,
  loading: false,
  error: null,
  isAuthIssue: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
      state.isAuthIssue = false;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
      state.isAuthIssue = false;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      if (action.payload === "NOT_AUTHENTICATED") {
        state.isAuthIssue = true;
        state.error = "Please login to use cart.";
      } else {
        state.error = action.payload || "Cart action failed";
      }
    };

    // fetchCart
    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected);

    // addToCart
    builder
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected);

    // updateCartItem
    builder
      .addCase(updateCartItem.pending, handlePending)
      .addCase(updateCartItem.fulfilled, handleFulfilled)
      .addCase(updateCartItem.rejected, handleRejected);

    // removeCartItem
    builder
      .addCase(removeCartItem.pending, handlePending)
      .addCase(removeCartItem.fulfilled, handleFulfilled)
      .addCase(removeCartItem.rejected, handleRejected);

    // clearCart
    builder
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
      })
      .addCase(clearCart.rejected, handleRejected);
  },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
