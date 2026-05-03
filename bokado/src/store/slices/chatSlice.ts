import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatState, Chat, Message } from '../../types/chat';
import {
  getChats,
  createChat,
  getUsers,
  deleteMessage as apiDeleteMessage,
  deleteChat as apiDeleteChat,
} from '../../api/chat';

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
  onlineUsers: [],
  typingUsers: {},
};

// Завантажити всі чати
export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
  return await getChats();
});

// Завантажити користувачів (за потреби)
export const fetchUsers = createAsyncThunk('chat/fetchUsers', async () => {
  return await getUsers();
});

// Створити новий чат з користувачем
export const createNewChat = createAsyncThunk(
  'chat/createNewChat',
  async (withUserId: number, { rejectWithValue }) => {
    try {
      const chat = await createChat(withUserId);
      return chat;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Видалити повідомлення по id
export const deleteMessage = createAsyncThunk<
  number, // повертаємо id видаленого повідомлення
  number, // параметр - id повідомлення для видалення
  { rejectValue: string }
>(
  'chat/deleteMessage',
  async (messageId, { rejectWithValue }) => {
    try {
      await apiDeleteMessage(messageId);
      return messageId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete message');
    }
  }
);

// Видалити чат по chatId
export const deleteChatThunk = createAsyncThunk<
  number, // повертаємо id видаленого чату
  number, // параметр - id чату для видалення
  { rejectValue: string }
>(
  'chat/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await apiDeleteChat(chatId);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete chat');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat(state, action: PayloadAction<Chat | null>) {
      state.currentChat = action.payload;
    },
    setMessages(state, action: PayloadAction<Message[]>) {
      state.messages = action.payload;
    },
    markChatAsRead(state, action: PayloadAction<number>) {
      const chatId = action.payload;
      const chat = state.chats.find((c) => c.chatId === chatId);
      if (chat) {
        chat.unreadCount = 0;
        if (chat.lastMessage) {
          chat.lastMessage.isRead = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load chats';
      })
      .addCase(createNewChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        state.chats.push(action.payload);
      })
      .addCase(deleteMessage.fulfilled, (state, action: PayloadAction<number>) => {
        state.messages = state.messages.filter(
          (msg) => msg.messageId !== action.payload
        );
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete message';
      })
      .addCase(deleteChatThunk.fulfilled, (state, action: PayloadAction<number>) => {
        state.chats = state.chats.filter((chat) => chat.chatId !== action.payload);

        if (state.currentChat?.chatId === action.payload) {
          state.currentChat = null;
          state.messages = [];
        }
      })
      .addCase(deleteChatThunk.rejected, (state, action) => {
        state.error = action.payload || 'Failed to delete chat';
      });
  },
});

export const { setCurrentChat, setMessages, markChatAsRead } = chatSlice.actions;
export default chatSlice.reducer;
