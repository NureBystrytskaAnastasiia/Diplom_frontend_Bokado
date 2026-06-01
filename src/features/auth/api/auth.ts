import axiosInstance from '../../../shared/api/axiosInstance';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};

export const resetPassword = async (email: string): Promise<void> => {
  await axiosInstance.post('/api/auth/reset-password', email, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const loginWithGoogle = async (idToken: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/auth/login-with-google', { idToken });
  return response.data;
};
