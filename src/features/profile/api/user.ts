import axios from 'axios';
import type { UserProfile, UserDetailInfo, UpdateProfileRequest, Interest } from '../types/user';

const API_URL = 'https://localhost:7192/api/users';

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

export const getDetailedUserInfo = async (userId: number): Promise<UserDetailInfo> => {
  const response = await axios.get(`${API_URL}/GetDetail/${userId}`);
  return response.data;
};

export const updateUserProfile = async (
  userId: number,
  data: UpdateProfileRequest
): Promise<void> => {
  const formData = new FormData();

  if (data.userIcon) formData.append('userIcon', data.userIcon);
  formData.append('username',  data.username);
  formData.append('birthDate', data.birthDate);

  if (data.bio)      formData.append('bio',      data.bio);
  if (data.status)   formData.append('status',   data.status);
  if (data.password) formData.append('password', data.password);
  if (data.city)     formData.append('city',     data.city);

  if (data.userInterests && data.userInterests.length > 0) {
    data.userInterests.forEach((name, index) => {
      formData.append(`userInterests[${index}]`, name);
    });
  }

  await axios.put(`${API_URL}/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAvailableInterests = async (): Promise<Interest[]> => {
  const response = await axios.get('https://localhost:7192/api/Interest');
  return response.data;
};