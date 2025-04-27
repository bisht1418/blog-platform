import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";

// Async thunk for login
export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for registration
export const register = createAsyncThunk("auth/register", async (userData, { rejectWithValue }) => {
  try {
    const response = await authService.register(userData);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for token refresh
export const refreshTokens = createAsyncThunk("auth/refreshTokens", async (refreshToken, { rejectWithValue }) => {
  try {
    const response = await authService.refreshToken(refreshToken);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    await authService.logout(auth.accessToken);
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await authService.getUserProfile(auth.accessToken);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for fetching all users
export const fetchAllUsers = createAsyncThunk("auth/fetchAllUsers", async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await authService.getAllUsers(auth.accessToken);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  status: "idle",
  error: null,
  users: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access.token;
        state.refreshToken = action.payload.tokens.refresh.token;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.tokens.access.token);
        localStorage.setItem("refreshToken", action.payload.tokens.refresh.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Registration cases
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.access.token;
        state.refreshToken = action.payload.tokens.refresh.token;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", action.payload.tokens.access.token);
        localStorage.setItem("refreshToken", action.payload.tokens.refresh.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Token refresh cases
      .addCase(refreshTokens.fulfilled, (state, action) => {
        state.accessToken = action.payload.tokens.access.token;
        state.refreshToken = action.payload.tokens.refresh.token;
        localStorage.setItem("accessToken", action.payload.tokens.access.token);
        localStorage.setItem("refreshToken", action.payload.tokens.refresh.token);
      })
      .addCase(refreshTokens.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.status = "idle";
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      
      // User profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // All users cases
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;