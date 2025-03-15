import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  gardens: [],
  gardenDetails: null,
  loading: false,
  error: null,
  success: false,
  selectedElement: null,
};

// Mock action for development
export const getUserGardens = createAsyncThunk(
  'gardens/getUserGardens',
  async () => {
    return [];
  }
);

// Mock action for development
export const getGardenDetails = createAsyncThunk(
  'gardens/getGardenDetails',
  async () => {
    return null;
  }
);

// Mock action for development
export const createGarden = createAsyncThunk(
  'gardens/createGarden',
  async () => {
    return {};
  }
);

// Mock action for development
export const updateGarden = createAsyncThunk(
  'gardens/updateGarden',
  async () => {
    return {};
  }
);

// Mock action for development
export const deleteGarden = createAsyncThunk(
  'gardens/deleteGarden',
  async () => {
    return "";
  }
);

// Mock action for development
export const addElement = createAsyncThunk(
  'gardens/addElement',
  async () => {
    return {};
  }
);

// Mock action for development
export const updateElement = createAsyncThunk(
  'gardens/updateElement',
  async () => {
    return {};
  }
);

// Garden slice
export const gardenSlice = createSlice({
  name: 'gardens',
  initialState,
  reducers: {
    clearGardenError: (state) => {
      state.error = null;
    },
    resetGardenSuccess: (state) => {
      state.success = false;
    },
    setSelectedElement: (state, action) => {
      state.selectedElement = action.payload;
    },
    clearSelectedElement: (state) => {
      state.selectedElement = null;
    },
    resetGardenDetails: (state) => {
      state.gardenDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user gardens
      .addCase(getUserGardens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserGardens.fulfilled, (state, action) => {
        state.loading = false;
        state.gardens = action.payload;
      })
      .addCase(getUserGardens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Other cases...
  },
});

export const {
  clearGardenError,
  resetGardenSuccess,
  setSelectedElement,
  clearSelectedElement,
  resetGardenDetails,
} = gardenSlice.actions;

export default gardenSlice.reducer;
