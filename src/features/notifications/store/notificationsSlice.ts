// src/features/notifications/store/notificationsSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../shared/api/axiosInstance';

export type NotificationType =
  | 'FriendRequest'
  | 'NewMessage'
  | 'EventJoined'
  | 'GroupJoined'
  | 'ChallengeCompleted';

export interface Notification {
  notificationId: number;
  type: NotificationType;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  loading: false,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async () => {
    const res = await axiosInstance.get<Notification[]>('/api/Notification');
    return res.data;
  }
);

export const markRead = createAsyncThunk(
  'notifications/markRead',
  async (id: number) => {
    await axiosInstance.patch(`/api/Notification/${id}/read`);
    return id;
  }
);

export const markAllRead = createAsyncThunk(
  'notifications/markAllRead',
  async () => {
    await axiosInstance.patch('/api/Notification/read-all');
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
        state.loading = false;
      })
      .addCase(markRead.fulfilled, (state, action) => {
        const n = state.items.find(n => n.notificationId === action.payload);
        if (n && !n.isRead) {
          n.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllRead.fulfilled, (state) => {
        state.items.forEach(n => (n.isRead = true));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;