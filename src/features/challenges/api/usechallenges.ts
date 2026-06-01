import axiosInstance from '../../../shared/api/axiosInstance';
import type { Challenge } from '../types/challenge';

export const fetchAllChallenges = async (): Promise<Challenge[]> => {
  const { data } = await axiosInstance.get<Challenge[]>('/api/Admin/allChallenges');
  return data;
};

export const selectChallenges = async (
  challengeIds: number[]
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post<{ message: string }>(
    '/api/Admin/select-challenges',
    challengeIds
  );
  return data;
};
