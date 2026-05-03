import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Challenge, ChallengeDto } from '../../types/challenge';
import { challengeApi } from '../../api/usechallenges';

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
      const challengesData = await challengeApi.getChallenges(token);
      
      // Перетворюємо ChallengeDto в Challenge з додаванням isCompleted
      const challenges: Challenge[] = challengesData.map(challenge => ({
        ...challenge,
        isCompleted: !!challenge.completedAt
      }));
      
      return challenges;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const completeChallenge = createAsyncThunk(
  'userChallenges/completeChallenge',
  async ({ challengeId, token }: { challengeId: number; token: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { userChallenges: ChallengesState };
      const challenge = state.userChallenges.challenges.find(c => c.challengeId === challengeId);
      
      if (!challenge) {
        throw new Error('Challenge not found');
      }
      
      if (challenge.isCompleted) {
        throw new Error('Challenge already completed');
      }
      
      const response = await challengeApi.checkChallenge(challengeId, token);
      return { challengeId, message: response.message };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const userChallengesSlice = createSlice({
  name: 'userChallenges',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
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
      
      // Complete challenge
      .addCase(completeChallenge.pending, (state) => {
        state.error = null;
      })
      .addCase(completeChallenge.fulfilled, (state, action) => {
        const { challengeId } = action.payload;
        state.challenges = state.challenges.map(challenge => 
          challenge.challengeId === challengeId
            ? { 
                ...challenge, 
                completedAt: new Date().toISOString(),
                isCompleted: true
              }
            : challenge
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