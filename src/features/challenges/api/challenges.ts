import axiosInstance from '../../../shared/api/axiosInstance';
import type { ChallengeDto, CheckChallengeResponse } from '../types/challenge';

export const challengeApi = {
  async getChallenges(): Promise<ChallengeDto[]> {
    const { data } = await axiosInstance.get<ChallengeDto[]>('/api/Challenge/challenges');
    return data;
  },

  async checkChallenge(challengeId: number): Promise<CheckChallengeResponse> {
    const { data } = await axiosInstance.post<CheckChallengeResponse>(
      `/api/Challenge/check/${challengeId}`
    );
    return data;
  },
};
