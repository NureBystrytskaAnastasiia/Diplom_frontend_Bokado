import axios from 'axios';
import type { Challenge } from '../types/challenge';

const API_BASE_URL = 'https://localhost:7192/api/Admin';


export const fetchAllChallenges = async (): Promise<Challenge[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_BASE_URL}/allChallenges`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const selectChallenges = async (challengeIds: number[]): Promise<{ message: string }> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_BASE_URL}/select-challenges`, challengeIds, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
