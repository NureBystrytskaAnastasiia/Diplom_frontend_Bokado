import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChallengeDto, Challenge } from '../types/challenge';
import { fetchAllChallenges } from '../api/usechallenges';
import { challengeApi }       from '../api/challenges';

interface UserChallengesState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
}

const initialState: UserChallengesState = {
  challenges: [],
  loading: false,
  error: null,
};

export const fetchChallenges = createAsyncThunk(
  'userChallenges/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllChallenges();
      return data.map((c: ChallengeDto) => ({
        ...c,
        isCompleted: !!c.completedAt,
      })) as Challenge[];
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : 'Помилка завантаження');
    }
  }
);

export const completeChallenge = createAsyncThunk(
  'userChallenges/completeChallenge',
  async (challengeId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { userChallenges: UserChallengesState };
      const challenge = state.userChallenges.challenges.find(
        c => c.challengeId === challengeId
      );

      if (!challenge)            throw new Error('Челендж не знайдено');
      if (challenge.isCompleted) throw new Error('Челендж вже виконаний');

      const response = await challengeApi.checkChallenge(challengeId);
      return { challengeId, message: response.message };
    } catch (e: unknown) {
      return rejectWithValue(e instanceof Error ? e.message : 'Помилка виконання');
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action: PayloadAction<Challenge[]>) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(completeChallenge.pending, (state) => {
        state.error = null;
      })
      .addCase(completeChallenge.fulfilled, (state, action) => {
        const { challengeId } = action.payload;
        state.challenges = state.challenges.map(c =>
          c.challengeId === challengeId
            ? { ...c, completedAt: new Date().toISOString(), isCompleted: true }
            : c
        );
      })
      .addCase(completeChallenge.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userChallengesSlice.actions;
export default userChallengesSlice.reducer;