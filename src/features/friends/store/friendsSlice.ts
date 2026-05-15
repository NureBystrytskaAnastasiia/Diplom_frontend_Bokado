import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FriendDto, FriendRequestDto, FriendStatus } from '../types/friends';
import {
  searchByUsername,
  getFriendStatus,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getIncomingRequests,
  getMyFriends,
  removeFriend,
  getTopUsers,
} from '../api/friends';

interface FriendsState {
  // Пошук
  searchResults: FriendDto[];
  searchLoading: boolean;

  // Статуси (userId -> status)
  statuses: Record<number, FriendStatus>;

  // Запити (сторінка /requests)
  incomingRequests: FriendRequestDto[];
  requestsLoading: boolean;

  // Мої друзі
  myFriends: FriendDto[];

  // Топ юзери
  topUsers: FriendDto[];

  // Загальне
  loading: boolean;
  error: string | null;
}

const initialState: FriendsState = {
  searchResults: [],
  searchLoading: false,
  statuses: {},
  incomingRequests: [],
  requestsLoading: false,
  myFriends: [],
  topUsers: [],
  loading: false,
  error: null,
};

// ─── Thunks ───────────────────────────────────────────────

export const searchUsers = createAsyncThunk(
  'friends/searchUsers',
  async (query: string, thunkAPI) => {
    try {
      return await searchByUsername(query);
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка пошуку');
    }
  }
);

export const loadFriendStatus = createAsyncThunk(
  'friends/loadFriendStatus',
  async (targetUserId: number, thunkAPI) => {
    try {
      const data = await getFriendStatus(targetUserId);
      return { userId: targetUserId, status: data.status };
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка статусу');
    }
  }
);

export const sendRequest = createAsyncThunk(
  'friends/sendRequest',
  async (targetUserId: number, thunkAPI) => {
    try {
      await sendFriendRequest(targetUserId);
      return targetUserId;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка надсилання запиту');
    }
  }
);

export const acceptRequest = createAsyncThunk(
  'friends/acceptRequest',
  async (requesterId: number, thunkAPI) => {
    try {
      await acceptFriendRequest(requesterId);
      return requesterId;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка прийняття запиту');
    }
  }
);

export const declineRequest = createAsyncThunk(
  'friends/declineRequest',
  async (requesterId: number, thunkAPI) => {
    try {
      await declineFriendRequest(requesterId);
      return requesterId;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка відхилення запиту');
    }
  }
);

export const loadIncomingRequests = createAsyncThunk(
  'friends/loadIncomingRequests',
  async (_, thunkAPI) => {
    try {
      return await getIncomingRequests();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка завантаження запитів');
    }
  }
);

export const loadMyFriends = createAsyncThunk(
  'friends/loadMyFriends',
  async (_, thunkAPI) => {
    try {
      return await getMyFriends();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка завантаження друзів');
    }
  }
);

export const removeFriendById = createAsyncThunk(
  'friends/removeFriendById',
  async (friendId: number, thunkAPI) => {
    try {
      await removeFriend(friendId);
      return friendId;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка видалення друга');
    }
  }
);

export const loadTopUsers = createAsyncThunk(
  'friends/loadTopUsers',
  async (_, thunkAPI) => {
    try {
      return await getTopUsers();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || 'Помилка топ юзерів');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSearch: (state) => { state.searchResults = []; },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchUsers.pending, (state) => { state.searchLoading = true; state.error = null; })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload as string;
      })

      // Status
      .addCase(loadFriendStatus.fulfilled, (state, action) => {
        state.statuses[action.payload.userId] = action.payload.status;
      })

      // Send request → оновлюємо статус локально
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.statuses[action.payload] = 'pending_sent';
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Accept request
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.incomingRequests = state.incomingRequests.filter(
          r => r.userId !== action.payload
        );
        state.statuses[action.payload] = 'friends';
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Decline request
      .addCase(declineRequest.fulfilled, (state, action) => {
        state.incomingRequests = state.incomingRequests.filter(
          r => r.userId !== action.payload
        );
      })
      .addCase(declineRequest.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Incoming requests
      .addCase(loadIncomingRequests.pending, (state) => { state.requestsLoading = true; })
      .addCase(loadIncomingRequests.fulfilled, (state, action) => {
        state.requestsLoading = false;
        state.incomingRequests = action.payload;
      })
      .addCase(loadIncomingRequests.rejected, (state, action) => {
        state.requestsLoading = false;
        state.error = action.payload as string;
      })

      // My friends
      .addCase(loadMyFriends.fulfilled, (state, action) => {
        state.myFriends = action.payload;
      })
      .addCase(loadMyFriends.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove friend
      .addCase(removeFriendById.fulfilled, (state, action) => {
        state.myFriends = state.myFriends.filter(f => f.userId !== action.payload);
        state.statuses[action.payload] = 'none';
      })
      .addCase(removeFriendById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Top users
      .addCase(loadTopUsers.fulfilled, (state, action) => {
        state.topUsers = action.payload;
      })
      .addCase(loadTopUsers.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSearch } = friendsSlice.actions;
export default friendsSlice.reducer;