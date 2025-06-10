import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to refresh token"
      );
    }
  }
);

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Refresh Token
      .addCase(refreshUserToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUserToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
