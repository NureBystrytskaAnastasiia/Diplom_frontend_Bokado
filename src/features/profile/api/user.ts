import axiosInstance from '../../../shared/api/axiosInstance';
import type { UserProfile, UserDetailInfo, UpdateProfileRequest, Interest } from '../types/user';

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const { data } = await axiosInstance.get<UserProfile>(`/api/users/${userId}`);
  return data;
};

export const getDetailedUserInfo = async (userId: number): Promise<UserDetailInfo> => {
  const { data } = await axiosInstance.get<UserDetailInfo>(`/api/users/GetDetail/${userId}`);
  return data;
};

export const updateUserProfile = async (
  userId: number,
  profileData: UpdateProfileRequest
): Promise<void> => {
  const formData = new FormData();

  if (profileData.userIcon)  formData.append('userIcon',  profileData.userIcon);
  formData.append('username',  profileData.username);
  formData.append('birthDate', profileData.birthDate);
  if (profileData.bio)      formData.append('bio',      profileData.bio);
  if (profileData.status)   formData.append('status',   profileData.status);
  if (profileData.password) formData.append('password', profileData.password);
  if (profileData.city)     formData.append('city',     profileData.city);

  profileData.userInterests?.forEach((name, index) => {
    formData.append(`userInterests[${index}]`, name);
  });

  await axiosInstance.put(`/api/users/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAvailableInterests = async (): Promise<Interest[]> => {
  const { data } = await axiosInstance.get<Interest[]>('/api/Interest');
  return data;
};
