// src/features/payment/paymentSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";
import { loadStripe } from "@stripe/stripe-js";

// ⚠️ Frontend publishable key (Stripe dashboard-la irukkum)
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// 1) Create Stripe session & redirect
export const startStripeCheckout = createAsyncThunk(
  "payment/startStripeCheckout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/payments/stripe/create-session");
      const { sessionId, url } = res.data;

      // Option 1: simple redirect to url
      if (url) {
        window.location.href = url;
        return { sessionId };
      }

      // Option 2: use stripe.redirectToCheckout (if you prefer)
      const stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        return rejectWithValue(error.message);
      }

      return { sessionId };
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("Please login to pay.");
      }
      const message =
        err.response?.data?.message || "Failed to start payment.";
      return rejectWithValue(message);
    }
  }
);

// 2) After Stripe success → confirm order in backend
export const confirmStripeOrder = createAsyncThunk(
  "payment/confirmStripeOrder",
  async ({ deliveryAddress }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/payments/stripe/confirm-order", {
        deliveryAddress,
      });
      return res.data.order;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("Please login again.");
      }
      const message =
        err.response?.data?.message || "Failed to confirm order.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  stripeLoading: false,
  stripeError: null,
  confirmLoading: false,
  confirmError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentErrors(state) {
      state.stripeError = null;
      state.confirmError = null;
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

    builder
      .addCase(confirmStripeOrder.pending, (state) => {
        state.confirmLoading = true;
        state.confirmError = null;
      })
      .addCase(confirmStripeOrder.fulfilled, (state) => {
        state.confirmLoading = false;
      })
      .addCase(confirmStripeOrder.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmError =
          action.payload || "Stripe order confirmation failed.";
      });
  },
});

export const { clearPaymentErrors } = paymentSlice.actions;
export default paymentSlice.reducer;
