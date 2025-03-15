import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  plants: [],
  plantDetails: null,
  loading: false,
  error: null,
  success: false,
};

// Plant slice
export const plantSlice = createSlice({
  name: 'plants',
  initialState,
  reducers: {
    clearPlantError: (state) => {
      state.error = null;
    },
    resetPlantSuccess: (state) => {
      state.success = false;
    },
  },
});

export const { clearPlantError, resetPlantSuccess } = plantSlice.actions;
export default plantSlice.reducer;
