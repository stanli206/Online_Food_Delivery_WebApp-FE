// src/features/restaurant/restaurantSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

// GET /api/restaurants
export const fetchRestaurants = createAsyncThunk(
  "restaurant/fetchRestaurants",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/restaurants");
      return res.data.restaurants || [];
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load restaurants";
      return rejectWithValue(message);
    }
  }
);

// GET /api/restaurants/:id
export const fetchRestaurantDetails = createAsyncThunk(
  "restaurant/fetchRestaurantDetails",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/restaurants/${restaurantId}`);
      return res.data.restaurant;
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load restaurant details";
      return rejectWithValue(message);
    }
  }
);

// GET /api/menu/:restaurantId
export const fetchRestaurantMenu = createAsyncThunk(
  "restaurant/fetchRestaurantMenu",
  async (restaurantId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/api/menu/${restaurantId}`);
      return res.data.items || [];
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to load menu items";
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  list: [],
  listLoading: false,
  listError: null,

  selectedRestaurant: null,
  detailLoading: false,
  detailError: null,

  menuItems: [],
  menuLoading: false,
  menuError: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    clearRestaurantErrors(state) {
      state.listError = null;
      state.detailError = null;
      state.menuError = null;
    },
  },
  extraReducers: (builder) => {
    // RESTAURANT LIST
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.listLoading = true;
        state.listError = null;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.listLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.listLoading = false;
        state.listError = action.payload;
      });

    // RESTAURANT DETAILS
    builder
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.selectedRestaurant = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
      });

    // RESTAURANT MENU
    builder
      .addCase(fetchRestaurantMenu.pending, (state) => {
        state.menuLoading = true;
        state.menuError = null;
        state.menuItems = [];
      })
      .addCase(fetchRestaurantMenu.fulfilled, (state, action) => {
        state.menuLoading = false;
        state.menuItems = action.payload;
      })
      .addCase(fetchRestaurantMenu.rejected, (state, action) => {
        state.menuLoading = false;
        state.menuError = action.payload;
      });
  },
});

export const { clearRestaurantErrors } = restaurantSlice.actions;
export default restaurantSlice.reducer;
