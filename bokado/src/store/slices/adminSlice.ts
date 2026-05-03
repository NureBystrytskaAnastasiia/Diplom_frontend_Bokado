import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchAllUsers, banUser, unbanUser,
  fetchAllChallenges, fetchUserStats, fetchChallengeStats,
  selectChallenges, subscribe, unsubscribe
} from '../../api/admin';
import type { UserDetailInfoDto, Challenge, Stats } from '../../types/admin';

// Добавляем правильный тип для userStats
interface UserInfo {
  userId: number;
  username: string;
  birthDate: string;
  city?: string;
  status?: string;
  level: number | string;
  isPremium: boolean;
}

interface UserStat {
  [date: string]: UserInfo[];
}

interface AdminState {
  users: UserDetailInfoDto[];
  challenges: Challenge[];
  userStats: UserStat[] | null; // Исправлено: это массив объектов, а не Stats
  challengeStats: Stats | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  challenges: [],
  userStats: null,
  challengeStats: null,
  loading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk('admin/getAllUsers', fetchAllUsers);
export const banUserById = createAsyncThunk('admin/banUser', banUser);
export const unbanUserById = createAsyncThunk('admin/unbanUser', unbanUser);
export const getAllChallenges = createAsyncThunk('admin/getAllChallenges', fetchAllChallenges);
export const getUserStats = createAsyncThunk<UserStat[], void>(
  'admin/getUserStats', 
  async () => {
    const data = await fetchUserStats();
    // Если данные приходят в другом формате, преобразуем их
    if (Array.isArray(data)) {
      return data as UserStat[];
    }
    // Если это объект Stats, преобразуем в нужный формат
    return Object.entries(data).map(([date, value]) => ({
      [date]: Array.isArray(value) ? value : []
    })) as UserStat[];
  }
);
export const getChallengeStats = createAsyncThunk('admin/getChallengeStats', fetchChallengeStats);
export const selectAdminChallenges = createAsyncThunk('admin/selectChallenges', selectChallenges);
export const subscribeUser = createAsyncThunk('admin/subscribeUser', subscribe);
export const unsubscribeUser = createAsyncThunk('admin/unsubscribeUser', unsubscribe);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getAllUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; })
      .addCase(getAllUsers.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch users'; })

      .addCase(banUserById.fulfilled, (state, action) => {
        const user = state.users.find(u => u.userId === action.meta.arg);
        if (user) user.isBanned = true;
      })
      .addCase(unbanUserById.fulfilled, (state, action) => {
        const user = state.users.find(u => u.userId === action.meta.arg);
        if (user) user.isBanned = false;
      })

      .addCase(subscribeUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u.userId === action.meta.arg);
        if (user) user.isPremium = true;
      })
      .addCase(unsubscribeUser.fulfilled, (state, action) => {
        const user = state.users.find(u => u.userId === action.meta.arg);
        if (user) user.isPremium = false;
      })

      .addCase(getAllChallenges.fulfilled, (state, action) => {
        state.challenges = action.payload;
      })
      .addCase(getUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
      })
      .addCase(getChallengeStats.fulfilled, (state, action) => {
        state.challengeStats = action.payload;
      })

      .addCase(selectAdminChallenges.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to select challenges';
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to subscribe';
      })
      .addCase(unsubscribeUser.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to unsubscribe';
      });
  },
});


export default adminSlice.reducer;