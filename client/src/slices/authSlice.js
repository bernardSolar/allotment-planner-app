import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  userInfo: null,
  loading: false,
  error: null,
  success: false,
};

// Mock auth actions for development
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    // Mock login response
    return {
      _id: '1',
      name: 'Test User',
      email: email,
      isAdmin: false,
      token: 'fake-token',
    };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    // Mock register response
    return {
      _id: '1',
      name: name,
      email: email,
      isAdmin: false,
      token: 'fake-token',
    };
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData) => {
    // Mock update response
    return {
      ...userData,
      _id: '1',
      isAdmin: false,
      token: 'fake-token',
    };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    return null;
  }
);

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Profile update failed';
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { clearError, resetSuccess } = authSlice.actions;
export default authSlice.reducer;
