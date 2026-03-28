import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api";

// Register
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please check credentials.";
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/auth/logout");
      localStorage.removeItem("token");
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Logout failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);


export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue(null);

      const res = await api.get("/api/auth/me");
      return res.data.user;
    } catch (err) {
      
      localStorage.removeItem("token");
      return rejectWithValue(null);
    }
  }
);

export const handleOAuthSuccess = createAsyncThunk(
  "auth/handleOAuthSuccess",
  async (token, { rejectWithValue }) => {
    try {
      
      localStorage.setItem("token", token);
      
      const res = await api.get("/api/auth/me");
      return res.data.user;
    } catch (err) {
      localStorage.removeItem("token");
      return rejectWithValue("OAuth login failed");
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });

  
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      });

    
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });

    
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
      });

    // GOOGLE OAUTH SUCCESS
    builder
      .addCase(handleOAuthSuccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleOAuthSuccess.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(handleOAuthSuccess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "OAuth failed";
        state.isAuthenticated = false;
        state.initialized = true;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;