export interface User {
  userId: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  birthDate: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}