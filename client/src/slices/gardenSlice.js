import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  gardens: [],
  gardenDetails: null,
  loading: false,
  error: null,
  success: false,
  selectedElement: null,
  elements: [],
};

// Mock data for initial development
const mockGarden = {
  _id: 'garden1',
  name: 'My Test Garden',
  dimensions: {
    width: 1000,
    height: 600
  },
  elements: [
    {
      id: 'background',
      type: 'background',
      x: 0,
      y: 0,
      width: 1000,
      height: 600,
      fill: '#8FBC8F',
      locked: true
    }
  ]
};

// Action to get user gardens
export const getUserGardens = createAsyncThunk(
  'gardens/getUserGardens',
  async (_, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return [mockGarden];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to get garden details
export const getGardenDetails = createAsyncThunk(
  'gardens/getGardenDetails',
  async (gardenId, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return mockGarden;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to create a new garden
export const createGarden = createAsyncThunk(
  'gardens/createGarden',
  async (gardenData, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return {
        ...mockGarden,
        _id: `garden-${Date.now()}`,
        name: gardenData.name || 'New Garden',
        elements: [
          {
            id: 'background',
            type: 'background',
            x: 0,
            y: 0,
            width: 1000,
            height: 600,
            fill: '#8FBC8F',
            locked: true
          }
        ]
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to update a garden
export const updateGarden = createAsyncThunk(
  'gardens/updateGarden',
  async ({ gardenId, gardenData }, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return {
        ...mockGarden,
        ...gardenData
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to delete a garden
export const deleteGarden = createAsyncThunk(
  'gardens/deleteGarden',
  async (gardenId, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return gardenId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to add an element to a garden
export const addElement = createAsyncThunk(
  'gardens/addElement',
  async ({ gardenId, element }, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return {
        ...element,
        id: `element-${Date.now()}`
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to update an element
export const updateElement = createAsyncThunk(
  'gardens/updateElement',
  async ({ gardenId, element }, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return element;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Action to delete an element
export const deleteElement = createAsyncThunk(
  'gardens/deleteElement',
  async ({ gardenId, elementId }, { rejectWithValue }) => {
    try {
      // For development, return mock data
      // In production, this would be an API call
      return elementId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
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
        state.success = false;
      })
      .addCase(createGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gardens.push(action.payload);
      })
      .addCase(createGarden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update garden
      .addCase(updateGarden.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gardens = state.gardens.map(garden =>
          garden._id === action.payload._id ? action.payload : garden
        );
        state.gardenDetails = action.payload;
      })
      .addCase(updateGarden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete garden
      .addCase(deleteGarden.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteGarden.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.gardens = state.gardens.filter(garden => garden._id !== action.payload);
        state.gardenDetails = null;
      })
      .addCase(deleteGarden.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add element
      .addCase(addElement.fulfilled, (state, action) => {
        if (state.gardenDetails) {
          state.gardenDetails.elements.push(action.payload);
        }
      })
      
      // Update element
      .addCase(updateElement.fulfilled, (state, action) => {
        if (state.gardenDetails) {
          state.gardenDetails.elements = state.gardenDetails.elements.map(element =>
            element.id === action.payload.id ? action.payload : element
          );
        }
      })
      
      // Delete element
      .addCase(deleteElement.fulfilled, (state, action) => {
        if (state.gardenDetails) {
          state.gardenDetails.elements = state.gardenDetails.elements.filter(
            element => element.id !== action.payload
          );
        }
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