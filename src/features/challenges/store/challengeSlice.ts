// store/challengesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Challenge } from '../types/challenge';
// Використовуємо адмін-API, а не заглушки:
//  - fetchAllChallenges → /api/Admin/allChallenges (повертає всі челенджі з isActive)
//  - selectChallenges   → POST /api/Admin/select-challenges (реально зберігає вибір)
import {
  fetchAllChallenges as fetchAllChallengesAdmin,
  selectChallenges   as selectChallengesAdmin,
} from '../../admin/api/admin';

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

export const loadAllChallenges = createAsyncThunk(
  'challenges/loadAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllChallengesAdmin();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateSelectedChallenges = createAsyncThunk(
  'challenges/select',
  async (challengeIds: number[], { rejectWithValue }) => {
    try {
      await selectChallengesAdmin(challengeIds);
      return { challengeIds, message: 'ok' };
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
        state.challenges = action.payload.map(c => ({ ...c, isCompleted: false })) as Challenge[];
        // Обираємо тільки ті челенджі, які реально активні на беку.
        // Якщо поле isActive відсутнє (сумісність з старим форматом) — вважаємо активним.
        state.selectedChallengeIds = action.payload
          .filter((c: any) => c.isActive !== false)
          .map((c) => c.challengeId);
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