import axios from 'axios';
import type { UserDetailInfoDto, Challenge, Stats } from '../types/admin';

const BASE_URL = 'https://localhost:7192/api/Admin';

export const fetchAllUsers = async (): Promise<UserDetailInfoDto[]> => {
  const response = await axios.get(`${BASE_URL}/allUsers`);
  return response.data;
};

export const banUser = async (userId: number) => {
  await axios.post(`${BASE_URL}/ban/${userId}`);
};

export const unbanUser = async (userId: number) => {
  await axios.post(`${BASE_URL}/unban/${userId}`);
};

export const fetchAllChallenges = async (): Promise<Challenge[]> => {
  const response = await axios.get(`${BASE_URL}/allChallenges`);
  return response.data;
};

export const fetchUserStats = async (): Promise<Stats> => {
  const response = await axios.get(`${BASE_URL}/stats/Users`);
  return response.data;
};

export const fetchChallengeStats = async (): Promise<Stats> => {
  const response = await axios.get(`${BASE_URL}/stats/Challenges`);
  return response.data;
};

export const selectChallenges = async (challengeIds: number[]) => {
  await axios.post(`${BASE_URL}/select-challenges`, challengeIds);
};

export const subscribe = async (userId: number) => {
  await axios.put(`${BASE_URL}/subscribe`, null, { params: { userId } });
};

export const unsubscribe = async (userId: number) => {
  await axios.delete(`${BASE_URL}/subscribe`, { params: { userId } });
};
