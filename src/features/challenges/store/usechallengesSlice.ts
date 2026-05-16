import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Challenge } from '../types/challenge';
import { challengeApi } from '../api/usechallenges';

interface ChallengesState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
}

const initialState: ChallengesState = {
  challenges: [],
  loading: false,
  error: null,
};

export const fetchChallenges = createAsyncThunk(
  'userChallenges/fetchChallenges',
  async (token: string, { rejectWithValue }) => {
    try {
      const data = await challengeApi.getChallenges(token);
      // ChallengeDto → Challenge
      return data.map(c => ({
        ...c,
        isCompleted: !!c.completedAt,
      })) as Challenge[];
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

export const completeChallenge = createAsyncThunk(
  'userChallenges/completeChallenge',
  async (
    { challengeId, token }: { challengeId: number; token: string },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as { userChallenges: ChallengesState };
      const challenge = state.userChallenges.challenges.find(c => c.challengeId === challengeId);

      if (!challenge) throw new Error('Челендж не знайдено');
      if (challenge.isCompleted) throw new Error('Челендж вже виконаний');

      const response = await challengeApi.checkChallenge(challengeId, token);
      return { challengeId, message: response.message };
    } catch (e) {
      return rejectWithValue(e instanceof Error ? e.message : 'Unknown error');
    }
  }
);

const userChallengesSlice = createSlice({
  name: 'userChallenges',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action: PayloadAction<Challenge[]>) => {
        state.loading = false;
        state.challenges = action.payload;
        state.error = null;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeChallenge.pending, (state) => { state.error = null; })
      .addCase(completeChallenge.fulfilled, (state, action) => {
        const { challengeId } = action.payload;
        state.challenges = state.challenges.map(c =>
          c.challengeId === challengeId
            ? { ...c, completedAt: new Date().toISOString(), isCompleted: true }
            : c
        );
        state.error = null;
      })
      .addCase(completeChallenge.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userChallengesSlice.actions;
export default userChallengesSlice.reducer;
