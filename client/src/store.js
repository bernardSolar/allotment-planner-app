import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gardenReducer from './slices/gardenSlice';
import plantReducer from './slices/plantSlice';
import weatherReducer from './slices/weatherSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    gardens: gardenReducer,
    plants: plantReducer,
    weather: weatherReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
