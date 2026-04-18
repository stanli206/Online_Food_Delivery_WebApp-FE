import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

export const startStripeCheckout = createAsyncThunk(
  "payment/startStripeCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/payments/create");

      const { url } = res.data;

      // redirect to Stripe Checkout
      window.location.href = url;

      return true;
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        return rejectWithValue("Please login to pay.");
      }

      return rejectWithValue(
        err.response?.data?.message || "Failed to start payment",
      );
    }
  },
);

const initialState = {
  stripeLoading: false,
  stripeError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentErrors(state) {
      state.stripeError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startStripeCheckout.pending, (state) => {
        state.stripeLoading = true;
        state.stripeError = null;
      })
      .addCase(startStripeCheckout.fulfilled, (state) => {
        state.stripeLoading = false;
      })
      .addCase(startStripeCheckout.rejected, (state, action) => {
        state.stripeLoading = false;
        state.stripeError = action.payload || "Stripe checkout failed.";
      });
  },
});

export const { clearPaymentErrors } = paymentSlice.actions;
export default paymentSlice.reducer;
