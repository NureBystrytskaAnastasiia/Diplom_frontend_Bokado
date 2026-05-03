import axios from 'axios';
import type { UserProfile, UserDetailInfo, UpdateProfileRequest, Interest } from '../types/user';

const API_URL = 'https://localhost:7192/api/users';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[Axios Interceptor] Token додано до заголовка');
  } else {
    console.warn('[Axios Interceptor] Токен не знайдено');
  }
  return config;
});

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  console.log(`[getUserProfile] Отримання профілю користувача з ID: ${userId}`);
  const response = await axios.get(`${API_URL}/${userId}`);
  console.log('[getUserProfile] Отримано дані:', response.data);
  return response.data;
};

export const getDetailedUserInfo = async (userId: number): Promise<UserDetailInfo> => {
  console.log(`[getDetailedUserInfo] Отримання детальної інформації користувача з ID: ${userId}`);
  const response = await axios.get(`${API_URL}/GetDetail/${userId}`);
  console.log('[getDetailedUserInfo] Отримано дані:', response.data);
  return response.data;
};

export const updateUserProfile = async (
  userId: number,
  data: UpdateProfileRequest
): Promise<void> => {
  console.log(`[updateUserProfile] Оновлення профілю користувача з ID: ${userId}`);
  console.log('[updateUserProfile] Дані для оновлення:', data);

  const formData = new FormData();

  if (data.userIcon) {
    formData.append('userIcon', data.userIcon);
    console.log('[updateUserProfile] Додано аватар');
  }

  formData.append('username', data.username);
  formData.append('birthDate', data.birthDate);

  if (data.bio) {
    formData.append('bio', data.bio);
  }
  if (data.status) {
    formData.append('status', data.status);
  }
  if (data.password) {
    formData.append('password', data.password);
  }
  if (data.city) {
    formData.append('city', data.city);
  }

  if (data.userInterests && data.userInterests.length > 0) {
    data.userInterests.forEach((name: string, index: number) => {
      formData.append(`userInterests[${index}]`, name);
      console.log(`[updateUserProfile] Додано інтерес: ${name}`);
    });
  }

  try {
    const response = await axios.put(`${API_URL}/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('[updateUserProfile] Профіль оновлено успішно', response.status);
  } catch (error) {
    console.error('[updateUserProfile] Помилка оновлення профілю:', error);
    throw error;
  }
};

export const getAvailableInterests = async (): Promise<Interest[]> => {
  console.log('[getAvailableInterests] Отримання списку інтересів');
  const response = await axios.get('https://localhost:7192/api/Interest');
  console.log('[getAvailableInterests] Отримано інтереси:', response.data);
  return response.data;
};
