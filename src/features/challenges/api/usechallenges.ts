import type { ChallengeDto, CheckChallengeResponse } from '../types/challenge';

const API_BASE_URL = 'https://localhost:7192/api/Challenge';

export const challengeApi = {
  async getChallenges(token: string): Promise<ChallengeDto[]> {
    const response = await fetch(`${API_BASE_URL}/challenges`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch challenges: ${response.status} ${errorText}`);
    }
    
    return response.json();
  },

  async checkChallenge(challengeId: number, token: string): Promise<CheckChallengeResponse> {
    const response = await fetch(`${API_BASE_URL}/check/${challengeId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Failed to check challenge: ${response.status}`);
    }
    
    return response.json();
  }
};