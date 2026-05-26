import axios from 'axios';
import type { Challenge } from '../types/challenge';

const API_BASE_URL = `${import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app'}/api/Admin`;


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