import axios from 'axios';
import type { FriendDto, FriendRequestDto, FriendStatusDto } from '../types/friends';

const BASE = 'https://localhost:7192/api/Friends';

const authHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Пошук користувачів за нікнеймом (мін. 2 символи)
export const searchByUsername = async (query: string): Promise<FriendDto[]> => {
  const { data } = await axios.get(`${BASE}/search/username`, {
    headers: authHeader(),
    params: { query },
  });
  return data;
};

// Статус відносин з конкретним юзером
export const getFriendStatus = async (targetUserId: number): Promise<FriendStatusDto> => {
  const { data } = await axios.get(`${BASE}/status/${targetUserId}`, {
    headers: authHeader(),
  });
  return data;
};

// Надіслати запит на дружбу
export const sendFriendRequest = async (targetUserId: number): Promise<void> => {
  await axios.post(`${BASE}/request/${targetUserId}`, {}, {
    headers: authHeader(),
  });
};

// Прийняти запит
export const acceptFriendRequest = async (requesterId: number): Promise<void> => {
  await axios.post(`${BASE}/request/accept/${requesterId}`, {}, {
    headers: authHeader(),
  });
};

// Відхилити запит
export const declineFriendRequest = async (requesterId: number): Promise<void> => {
  await axios.delete(`${BASE}/request/decline/${requesterId}`, {
    headers: authHeader(),
  });
};

// Вхідні запити (для сторінки /requests)
export const getIncomingRequests = async (): Promise<FriendRequestDto[]> => {
  const { data } = await axios.get(`${BASE}/requests/incoming`, {
    headers: authHeader(),
  });
  return data;
};

// Мої друзі
export const getMyFriends = async (): Promise<FriendDto[]> => {
  const { data } = await axios.get(`${BASE}/my-friends`, {
    headers: authHeader(),
  });
  return data;
};

// Видалити друга
export const removeFriend = async (friendId: number): Promise<void> => {
  await axios.delete(`${BASE}/remove/${friendId}`, {
    headers: authHeader(),
  });
};

// Топ юзери (для discover / dashboard)
export const getTopUsers = async (): Promise<FriendDto[]> => {
  const { data } = await axios.get(`${BASE}/top-users`, {
    headers: authHeader(),
  });
  return data;
};