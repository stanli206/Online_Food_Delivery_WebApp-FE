// src/features/order/orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

// ADMIN: GET /api/admin/orders
export const fetchAllOrdersAdmin = createAsyncThunk(
  "order/fetchAllOrdersAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/admin/orders");
      return res.data.orders || [];
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        return rejectWithValue("NOT_AUTHORIZED");
      }
      const message =
        err.response?.data?.message || "Failed to load all orders.";
      return rejectWithValue(message);
    }
  }
);

// ADMIN: PUT /api/admin/orders/:id/status
export const updateOrderStatusAdmin = createAsyncThunk(
  "order/updateOrderStatusAdmin",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/admin/orders/${orderId}/status`, {
        status,
      });
      return res.data.order;
    } catch (err) {
      const statusCode = err.response?.status;
      if (statusCode === 401 || statusCode === 403) {
        return rejectWithValue("NOT_AUTHORIZED");
      }
      const message =
        err.response?.data?.message || "Failed to update order status.";
      return rejectWithValue(message);
    }
  }
);

// POST /api/orders  → create order from cart
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ deliveryAddress, paymentMethod = "COD" }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/orders", {
        deliveryAddress,
        paymentMethod,
      });
      return res.data.order;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message =
        err.response?.data?.message || "Failed to place order. Try again.";
      return rejectWithValue(message);
    }
  }
);

// GET /api/orders/my → user order history
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/orders/my");
      return res.data.orders || [];
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        return rejectWithValue("NOT_AUTHENTICATED");
      }
      const message = err.response?.data?.message || "Failed to load orders.";
      return rejectWithValue(message);
    }
  }
);

// USER: GET /api/orders/:id
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/orders/${orderId}`);
      return res.data.order;
    } catch (err) {
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        return rejectWithValue("NOT_AUTHORIZED");
      }
      const message =
        err.response?.data?.message || "Failed to load order details.";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  myOrders: [],
  myOrdersLoading: false,
  myOrdersError: null,

  creating: false,
  createError: null,
  lastCreatedOrder: null,

  adminOrders: [],
  adminOrdersLoading: false,
  adminOrdersError: null,
  updatingStatus: false,
  updateStatusError: null,

  selectedOrder: null,
  selectedOrderLoading: false,
  selectedOrderError: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError(state) {
      state.createError = null;
      state.myOrdersError = null;
      state.adminOrdersError = null;
      state.updateStatusError = null;
      state.selectedOrderError = null;
    },
    clearLastCreatedOrder(state) {
      state.lastCreatedOrder = null;
    },
  },
  extraReducers: (builder) => {
    // createOrder
    builder
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.lastCreatedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        if (action.payload === "NOT_AUTHENTICATED") {
          state.createError = "Please login to place an order.";
        } else {
          state.createError = action.payload || "Order creation failed.";
        }
      });

    // fetchMyOrders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersLoading = true;
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersLoading = false;
        if (action.payload === "NOT_AUTHENTICATED") {
          state.myOrdersError = "Please login to view your orders.";
        } else {
          state.myOrdersError = action.payload || "Failed to load orders.";
        }
      });
    // ADMIN: fetchAllOrdersAdmin
    builder
      .addCase(fetchAllOrdersAdmin.pending, (state) => {
        state.adminOrdersLoading = true;
        state.adminOrdersError = null;
      })
      .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
        state.adminOrdersLoading = false;
        state.adminOrders = action.payload;
      })
      .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
        state.adminOrdersLoading = false;
        if (action.payload === "NOT_AUTHORIZED") {
          state.adminOrdersError = "You are not authorized to view orders.";
        } else {
          state.adminOrdersError =
            action.payload || "Failed to load all orders.";
        }
      });

    // ADMIN: updateOrderStatusAdmin
    builder
      .addCase(updateOrderStatusAdmin.pending, (state) => {
        state.updatingStatus = true;
        state.updateStatusError = null;
      })
      .addCase(updateOrderStatusAdmin.fulfilled, (state, action) => {
        state.updatingStatus = false;
        const updated = action.payload;
        // replace in adminOrders
        state.adminOrders = state.adminOrders.map((o) =>
          o._id === updated._id ? updated : o
        );
      })
      .addCase(updateOrderStatusAdmin.rejected, (state, action) => {
        state.updatingStatus = false;
        if (action.payload === "NOT_AUTHORIZED") {
          state.updateStatusError =
            "You are not authorized to update order status.";
        } else {
          state.updateStatusError =
            action.payload || "Failed to update order status.";
        }
      });

    // fetchOrderById
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.selectedOrderLoading = true;
        state.selectedOrderError = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedOrderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.selectedOrderLoading = false;
        if (action.payload === "NOT_AUTHORIZED") {
          state.selectedOrderError = "Not allowed to view this order.";
        } else {
          state.selectedOrderError =
            action.payload || "Failed to load order details.";
        }
      });
  },
});

export const { clearOrderError, clearLastCreatedOrder } = orderSlice.actions;
export default orderSlice.reducer;
