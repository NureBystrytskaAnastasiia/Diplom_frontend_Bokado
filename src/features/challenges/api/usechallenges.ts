import type { ChallengeDto, CheckChallengeResponse } from '../types/challenge';

const API_BASE_URL = 'https://localhost:7192/api/Challenge';

/**
 * Дістає повідомлення про помилку з відповіді беку.
 * Формати:
 *  - { errors: [{ description: "..." }] }
 *  - [{ description: "..." }]
 *  - { message: "..." }
 *  - текст
 */
const extractErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = await response.json();
    if (Array.isArray(data) && data[0]?.description) return data[0].description;
    if (data?.errors && Array.isArray(data.errors) && data.errors[0]?.description) {
      return data.errors[0].description;
    }
    if (typeof data?.message === 'string') return data.message;
    if (typeof data === 'string') return data;
  } catch {
    try { return await response.text(); } catch { /* ignore */ }
  }
  return `HTTP ${response.status}`;
};

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
      const msg = await extractErrorMessage(response);
      throw new Error(msg);
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
      const msg = await extractErrorMessage(response);
      throw new Error(msg);
    }
    return response.json();
  },
};
