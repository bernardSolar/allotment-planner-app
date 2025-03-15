import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  currentWeather: null,
  forecast: null,
  alerts: [],
  loading: false,
  error: null,
};

// Weather slice
export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherError: (state) => {
      state.error = null;
    },
  },
});

export const { clearWeatherError } = weatherSlice.actions;
export default weatherSlice.reducer;
