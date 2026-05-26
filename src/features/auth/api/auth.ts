import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth';

const API_URL = `${import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app'}/api/auth`;

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
  return response.data;
};

export const resetPassword = async (email: string): Promise<void> => {
  await axios.post(`${API_URL}/reset-password`, email, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const loginWithGoogle = async (userId: number, token: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/login-with-google`, {
    userId,
    token
  });
  return response.data;
};