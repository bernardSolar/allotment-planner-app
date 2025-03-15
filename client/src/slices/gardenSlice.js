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
});

export const {
  clearGardenError,
  resetGardenSuccess,
  setSelectedElement,
  clearSelectedElement,
  resetGardenDetails,
} = gardenSlice.actions;

// Mock action for development
export const getUserGardens = createAsyncThunk(
  'gardens/getUserGardens',
  async () => {
    return [];
  }
);

export default gardenSlice.reducer;
