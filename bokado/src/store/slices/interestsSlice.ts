// src/store/slices/interestsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Interest } from '../../types/user';
import { getAvailableInterests } from '../../api/user';

interface InterestsState {
  availableInterests: Interest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: InterestsState = {
  availableInterests: [],
  isLoading: false,
  error: null,
};

// Отримати всі доступні інтереси
export const fetchAvailableInterests = createAsyncThunk(
  'interests/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      return await getAvailableInterests();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interests');
    }
  }
);

const interestsSlice = createSlice({
  name: 'interests',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearInterests: (state) => {
      state.availableInterests = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableInterests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableInterests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableInterests = action.payload;
      })
      .addCase(fetchAvailableInterests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearInterests } = interestsSlice.actions;
export default interestsSlice.reducer;