import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state
const initialState = {
  gardens: [],
  gardenDetails: null,
  loading: false,
  error: null,
  success: false,
  selectedElement: null,
};

// Get all gardens for a user
export const getUserGardens = createAsyncThunk(
  'gardens/getUserGardens',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get('/api/gardens', config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Get garden details
export const getGardenDetails = createAsyncThunk(
  'gardens/getGardenDetails',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get(`/api/gardens/${id}`, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Create a new garden
export const createGarden = createAsyncThunk(
  'gardens/createGarden',
  async (gardenData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.post('/api/gardens', gardenData, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Update a garden
export const updateGarden = createAsyncThunk(
  'gardens/updateGarden',
  async ({ id, gardenData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.put(`/api/gardens/${id}`, gardenData, config);
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Delete a garden
export const deleteGarden = createAsyncThunk(
  'gardens/deleteGarden',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      await axios.delete(`/api/gardens/${id}`, config);
      return id;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Add garden element
export const addElement = createAsyncThunk(
  'gardens/addElement',
  async ({ gardenId, elementData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/gardens/${gardenId}/elements`,
        elementData,
        config
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Update garden element
export const updateElement = createAsyncThunk(
  'gardens/updateElement',
  async ({ gardenId, elementId, elementData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/gardens/${gardenId}/elements/${elementId}`,
        elementData,
        config
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Delete garden element
export const deleteElement = createAsyncThunk(
  'gardens/deleteElement',
  async ({ gardenId, elementId }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.delete(
        `/api/gardens/${gardenId}/elements/${elementId}`,
        config
      );
      return data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Garden slice
const gardenSlice = createSlice({
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
      // Get garden details
      .addCase(getGardenDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGardenDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.gardenDetails = action.payload;
      })
      .addCase(getGardenDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create garden
      .addCase(createGarden.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.gardens.push(action.payload);
        state.success = true;
      })
      .addCase(createGarden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update garden
      .addCase(updateGarden.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.gardenDetails = action.payload;
        state.gardens = state.gardens.map((garden) =>
          garden._id === action.payload._id ? action.payload : garden
        );
        state.success = true;
      })
      .addCase(updateGarden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete garden
      .addCase(deleteGarden.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.gardens = state.gardens.filter((garden) => garden._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteGarden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add element
      .addCase(addElement.fulfilled, (state, action) => {
        state.gardenDetails = action.payload;
        state.success = true;
      })
      // Update element
      .addCase(updateElement.fulfilled, (state, action) => {
        state.gardenDetails = action.payload;
        state.success = true;
      })
      // Delete element
      .addCase(deleteElement.fulfilled, (state, action) => {
        state.gardenDetails = action.payload;
        state.success = true;
      });
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
