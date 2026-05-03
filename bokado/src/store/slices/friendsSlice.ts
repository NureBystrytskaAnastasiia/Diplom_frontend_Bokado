import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FriendDto, TopUser, UserSwipeDto } from '../../types/friends';
import {
  fetchUsersForSwipe,
  swipeUser,
  getWhoLikedMe,
  getTopUsers,
  getMyFriends,
  removeFriend,
  acceptSwipe,
  getILikedUsers,
  removeLike,
} from '../../api/friends';

interface FriendsState {
  swipeUsers: FriendDto[];
  topUsers: TopUser[]; 
  whoLikedMe: UserSwipeDto[];
  iLikedUsers: UserSwipeDto[];
  myFriends: FriendDto[];
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  swipeUsers: [],
  topUsers: [],
  whoLikedMe: [],
  iLikedUsers: [],
  myFriends: [],
  loading: false,
  error: null,
};

export const loadSwipeUsers = createAsyncThunk('friends/loadSwipeUsers', async (_, thunkAPI) => {
  try {
    const data = await fetchUsersForSwipe();
    console.log('Redux loaded swipeUsers:', data);
    return data;
  } catch (error: any) {
    console.error('Failed to load swipe users:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch swipe users');
  }
});

export const likeOrPassUser = createAsyncThunk(
  'friends/likeOrPassUser',
  async ({ targetUserId, action }: { targetUserId: number; action: 'like' | 'pass' }, thunkAPI) => {
    try {
      await swipeUser(targetUserId, action);
      return targetUserId;
    } catch (error: any) {
      console.error('Swipe failed:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Swipe failed');
    }
  }
);

export const loadWhoLikedMe = createAsyncThunk('friends/loadWhoLikedMe', async (_, thunkAPI) => {
  try {
    const data = await getWhoLikedMe();
    console.log('Who liked me loaded:', data);
    return data;
  } catch (error: any) {
    console.error('Failed to load who liked me:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch who liked me');
  }
});

export const loadILikedUsers = createAsyncThunk('friends/loadILikedUsers', async (_, thunkAPI) => {
  try {
    const data = await getILikedUsers();
    console.log('I liked users loaded:', data);
    return data;
  } catch (error: any) {
    console.error('Failed to load I liked users:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch I liked users');
  }
});

export const removeLikeById = createAsyncThunk(
  'friends/removeLikeById',
  async (swipeId: number, thunkAPI) => {
    try {
      await removeLike(swipeId);
      return swipeId;
    } catch (error: any) {
      console.error('Failed to remove like:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove like');
    }
  }
);

export const loadTopUsers = createAsyncThunk('friends/loadTopUsers', async (_, thunkAPI) => {
  try {
    const data = await getTopUsers();
    console.log('Top users loaded:', data);
    return data;
  } catch (error: any) {
    console.error('Failed to load top users:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch top users');
  }
});

export const loadMyFriends = createAsyncThunk('friends/loadMyFriends', async (_, thunkAPI) => {
  try {
    const data = await getMyFriends();
    console.log('My friends loaded:', data);
    return data;
  } catch (error: any) {
    console.error('Failed to load friends:', error);
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch friends');
  }
});

export const removeFriendById = createAsyncThunk(
  'friends/removeFriendById',
  async (friendId: number, thunkAPI) => {
    try {
      await removeFriend(friendId);
      return friendId;
    } catch (error: any) {
      console.error('Failed to remove friend:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove friend');
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friends/acceptFriendRequest',
  async (swipeId: number, thunkAPI) => {
    try {
      await acceptSwipe(swipeId);
      return swipeId;
    } catch (error: any) {
      console.error('Failed to accept friend request:', error);
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to accept friend request');
    }
  }
);

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetSwipeUsers: (state) => {
      state.swipeUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSwipeUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadSwipeUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.swipeUsers = action.payload;
      })
      .addCase(loadSwipeUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(likeOrPassUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(likeOrPassUser.fulfilled, (state, action) => {
        state.loading = false;
        state.swipeUsers = state.swipeUsers.filter(user => user.userId !== action.payload);
      })
      .addCase(likeOrPassUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loadWhoLikedMe.fulfilled, (state, action) => {
        state.whoLikedMe = action.payload;
      })
      .addCase(loadWhoLikedMe.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(loadILikedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.iLikedUsers = action.payload.map(user => ({
          userId: user.userId,
          username: user.username || 'Анонімний користувач',
          avatarUrl: user.avatarUrl || null,
          bio: user.bio || '',
          swipeId: user.swipeId,
          swipedAt: user.swipedAt || user.swipedAt || new Date().toISOString()  // виправлено!
        }));
      })
      .addCase(loadILikedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeLikeById.fulfilled, (state, action) => {
        state.iLikedUsers = state.iLikedUsers.filter(user => user.swipeId !== action.payload);
      })
      .addCase(removeLikeById.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(loadTopUsers.fulfilled, (state, action) => {
        state.topUsers = action.payload;
      })
      .addCase(loadTopUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(loadMyFriends.fulfilled, (state, action) => {
        state.myFriends = action.payload;
      })
      .addCase(loadMyFriends.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFriendById.fulfilled, (state, action) => {
        state.myFriends = state.myFriends.filter(friend => friend.userId !== action.payload);
      })
      .addCase(removeFriendById.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.whoLikedMe = state.whoLikedMe.filter(user => user.swipeId !== action.payload);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetSwipeUsers } = friendsSlice.actions;
export default friendsSlice.reducer;
