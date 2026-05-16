// src/features/posts/store/postsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PostsState, CreatePostData } from '../types/post';
import {
  apiGetUserPosts,
  apiCreatePost,
  apiDeletePost,
  apiLikePost,
  apiUnlikePost,
} from '../api/posts';

// ─── Initial state ────────────────────────────────────────

const initialState: PostsState = {
  items: [],
  isLoading: false,
  error: null,
  isCreating: false,
  createError: null,
  loadedForUserId: null,
};

// ─── Thunks ───────────────────────────────────────────────

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (userId: number, { rejectWithValue }) => {
    try {
      const posts = await apiGetUserPosts(userId);
      return { userId, posts };
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || 'Не вдалось завантажити публікації'
      );
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data: CreatePostData, { rejectWithValue }) => {
    try {
      return await apiCreatePost(data);
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || 'Не вдалось опублікувати пост'
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      await apiDeletePost(postId);
      return postId;
    } catch (e: any) {
      return rejectWithValue(
        e.response?.data?.message || 'Не вдалось видалити пост'
      );
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      await apiLikePost(postId);
      return postId;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Помилка лайку');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (postId: number, { rejectWithValue }) => {
    try {
      await apiUnlikePost(postId);
      return postId;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || 'Помилка анлайку');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.items = [];
      state.error = null;
      state.loadedForUserId = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // ── Fetch posts ──────────────────────────────────
      .addCase(fetchUserPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.posts;
        state.loadedForUserId = action.payload.userId;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── Create post ──────────────────────────────────
      .addCase(createPost.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isCreating = false;
        // новий пост додаємо на початок стрічки
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload as string;
      })

      // ── Delete post ──────────────────────────────────
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p.postId !== action.payload);
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ── Like ─────────────────────────────────────────
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.items.find(p => p.postId === action.payload);
        if (post) {
          post.isLikedByMe = true;
          post.likesCount += 1;
        }
      })

      // ── Unlike ───────────────────────────────────────
      .addCase(unlikePost.fulfilled, (state, action) => {
        const post = state.items.find(p => p.postId === action.payload);
        if (post) {
          post.isLikedByMe = false;
          post.likesCount = Math.max(0, post.likesCount - 1);
        }
      });
  },
});

export const { clearPosts, clearCreateError } = postsSlice.actions;
export default postsSlice.reducer;