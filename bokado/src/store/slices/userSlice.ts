import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { UserProfile, UserDetailInfo, UpdateProfileRequest } from '../../types/user';
import { getUserProfile, getDetailedUserInfo, updateUserProfile } from '../../api/user';

interface UserState {
  profile: UserProfile | null;
  detailedInfo: UserDetailInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  detailedInfo: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await getUserProfile(userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const fetchDetailedUserInfo = createAsyncThunk(
  'user/fetchDetailedInfo',
  async (userId: number, { rejectWithValue }) => {
    try {
      return await getDetailedUserInfo(userId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch detailed info');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { userId, data }: { userId: number; data: UpdateProfileRequest },
    { rejectWithValue }
  ) => {
    try {
      await updateUserProfile(userId, data);
      const updatedProfile = await getUserProfile(userId);
      return updatedProfile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.detailedInfo = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDetailedUserInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailedUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detailedInfo = action.payload;
      })
      .addCase(fetchDetailedUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        
        if (state.detailedInfo) {
          state.detailedInfo = {
            ...state.detailedInfo,
            ...action.payload
          };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearUserData } = userSlice.actions;
export default userSlice.reducer;