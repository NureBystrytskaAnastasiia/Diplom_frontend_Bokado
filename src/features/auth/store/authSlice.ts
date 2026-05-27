import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, loginWithGoogle } from '../api/auth';
import type { AuthState, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

// Переклад помилок бекенду
const translateAuthError = (msg: string): string => {
  const map: Record<string, string> = {
    'Invalid credentials':         'Невірний email або пароль',
    'User already exists':         'Користувач з таким email вже існує',
    'Email already taken':         'Цей email вже зайнятий',
    'Username already taken':      'Цей нікнейм вже зайнятий',
    'Invalid email or password':   'Невірний email або пароль',
    'User not found':              'Користувача не знайдено',
    'Registration failed':         'Помилка реєстрації',
    'Login failed':                'Помилка входу',
    'Google login failed':         'Помилка входу через Google',
  };
  return map[msg] ?? msg;
};

// Функція для отримання даних із localStorage
const loadUserFromLocalStorage = (): { user: AuthState['user']; token: string | null } => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    return { user, token };
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return { user: null, token: null };
  }
};

// Ініціалізація стану
const { user, token } = loadUserFromLocalStorage();

const initialState: AuthState = {
  user,
  token,
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      const msg = error.response?.data;
      const uk = typeof msg === 'string' ? translateAuthError(msg) : 'Невірний email або пароль';
      return rejectWithValue(uk);
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterRequest, { rejectValue: string }>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      const msg = error.response?.data;
      const uk = typeof msg === 'string' ? translateAuthError(msg) : 'Помилка реєстрації';
      return rejectWithValue(uk);
    }
  }
);

// Google Login Thunk
export const loginWithGoogleUser = createAsyncThunk<
  AuthResponse,
  string,
  { rejectValue: string }
>(
  'auth/loginWithGoogle',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await loginWithGoogle(idToken);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      const msg = error.response?.data;
      const uk = typeof msg === 'string' ? translateAuthError(msg) : 'Помилка входу через Google';
      return rejectWithValue(uk);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Google Login
      .addCase(loginWithGoogleUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithGoogleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;