import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, register, loginWithGoogle } from '../api/auth';
import type { AuthState, LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

const translateAuthError = (msg: string): string => {
  const map: Record<string, string> = {
    'Invalid credentials':       'Невірний email або пароль',
    'User already exists':       'Користувач з таким email вже існує',
    'Email already taken':       'Цей email вже зайнятий',
    'Username already taken':    'Цей нікнейм вже зайнятий',
    'Invalid email or password': 'Невірний email або пароль',
    'User not found':            'Користувача не знайдено',
    'Registration failed':       'Помилка реєстрації',
    'Login failed':              'Помилка входу',
    'Google login failed':       'Помилка входу через Google',
  };
  return map[msg] ?? msg;
};

const loadUserFromLocalStorage = (): { user: AuthState['user']; token: string | null } => {
  try {
    const user  = JSON.parse(localStorage.getItem('user') || 'null');
    const token = localStorage.getItem('token');
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
};

const { user, token } = loadUserFromLocalStorage();

const initialState: AuthState = {
  user,
  token,
  isLoading: false,
  error: null,
};

const extractError = (error: unknown, fallback: string): string => {
  const e = error as { response?: { data?: unknown } };
  const msg = e.response?.data;
  return typeof msg === 'string' ? translateAuthError(msg) : fallback;
};

export const loginUser = createAsyncThunk<AuthResponse, LoginRequest, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractError(error, 'Невірний email або пароль'));
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
    } catch (error: unknown) {
      return rejectWithValue(extractError(error, 'Помилка реєстрації'));
    }
  }
);

export const loginWithGoogleUser = createAsyncThunk<AuthResponse, string, { rejectValue: string }>(
  'auth/loginWithGoogle',
  async (idToken, { rejectWithValue }) => {
    try {
      const response = await loginWithGoogle(idToken);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: unknown) {
      return rejectWithValue(extractError(error, 'Помилка входу через Google'));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user  = null;
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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user  = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Помилка входу';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user  = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Помилка реєстрації';
      })

      .addCase(loginWithGoogleUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user  = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginWithGoogleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Помилка входу через Google';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;