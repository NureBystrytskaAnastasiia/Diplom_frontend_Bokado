import axiosInstance from '../../../shared/api/axiosInstance';
import type { UserDetailInfoDto, Challenge, Stats } from '../types/admin';

const BASE = '/api/Admin';

export const fetchAllUsers    = async (): Promise<UserDetailInfoDto[]> =>
  (await axiosInstance.get(`${BASE}/allUsers`)).data;

export const banUser          = async (userId: number) =>
  axiosInstance.post(`${BASE}/ban/${userId}`);

export const unbanUser        = async (userId: number) =>
  axiosInstance.post(`${BASE}/unban/${userId}`);

export const fetchAllChallenges = async (): Promise<Challenge[]> =>
  (await axiosInstance.get(`${BASE}/allChallenges`)).data;

export const fetchUserStats   = async (): Promise<Stats> =>
  (await axiosInstance.get(`${BASE}/stats/Users`)).data;

export const fetchChallengeStats = async (): Promise<Stats> =>
  (await axiosInstance.get(`${BASE}/stats/Challenges`)).data;

export const selectChallenges = async (challengeIds: number[]) =>
  axiosInstance.post(`${BASE}/select-challenges`, challengeIds);

export const subscribe        = async (userId: number) =>
  axiosInstance.put(`${BASE}/subscribe`, null, { params: { userId } });

export const unsubscribe      = async (userId: number) =>
  axiosInstance.delete(`${BASE}/subscribe`, { params: { userId } });
