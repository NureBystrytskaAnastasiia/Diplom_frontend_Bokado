import axios from 'axios';
import { store } from '../../store';
import { logout } from '../../features/auth/store/authSlice';

export const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7192';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Додаємо токен до кожного запиту автоматично
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Якщо 401 — розлогінюємо і редіректимо на /login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;