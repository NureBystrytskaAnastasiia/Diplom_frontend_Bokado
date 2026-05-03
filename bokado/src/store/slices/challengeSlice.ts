// store/challengesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Challenge } from '../../types/challenge';
import { fetchAllChallenges, selectChallenges } from '../../api/challenges';

interface ChallengesState {
  challenges: Challenge[];
  selectedChallengeIds: number[]; 
  loading: boolean;
  error: string | null;
}

const initialState: ChallengesState = {
  challenges: [],
  selectedChallengeIds: [],
  loading: false,
  error: null
};

// Async Thunk для отримання всіх челенджів
export const loadAllChallenges = createAsyncThunk(
  'challenges/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllChallenges();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Async Thunk для вибору активних челенджів
export const updateSelectedChallenges = createAsyncThunk(
  'challenges/select',
  async (challengeIds: number[], { rejectWithValue }) => {
    try {
      const response = await selectChallenges(challengeIds);
      return { challengeIds, message: response.message };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {
    toggleChallengeSelection(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.selectedChallengeIds.includes(id)) {
        state.selectedChallengeIds = state.selectedChallengeIds.filter(cid => cid !== id);
      } else {
        state.selectedChallengeIds.push(id);
      }
    },
    clearSelectedChallenges(state) {
      state.selectedChallengeIds = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAllChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadAllChallenges.fulfilled, (state, action) => {
        state.challenges = action.payload;
        state.selectedChallengeIds = action.payload
          .filter(challenge => challenge.isActive)
          .map(challenge => challenge.challengeId);
        state.loading = false;
      })
      .addCase(loadAllChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSelectedChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSelectedChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedChallengeIds = action.payload.challengeIds;
      })
      .addCase(updateSelectedChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { toggleChallengeSelection, clearSelectedChallenges } = challengesSlice.actions;
export default challengesSlice.reducer;
