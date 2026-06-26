import axiosInstance from '../../../shared/api/axiosInstance';
import type { FriendDto, FriendRequestDto, FriendStatusDto } from '../types/friends';

export const searchByUsername = async (query: string): Promise<FriendDto[]> => {
  const { data } = await axiosInstance.get<FriendDto[]>('/api/Friends/search/username', {
    params: { query },
  });
  return data;
};
export const sendFriendRequest = async (targetUserId: number): Promise<void> => {
  await axiosInstance.post(`/api/Friends/request/${targetUserId}`);
};


export const getFriendStatus = async (targetUserId: number): Promise<FriendStatusDto> => {
  const { data } = await axiosInstance.get<FriendStatusDto>(
    `/api/Friends/status/${targetUserId}`
  );
  return data;
};



export const acceptFriendRequest = async (requesterId: number): Promise<void> => {
  await axiosInstance.post(`/api/Friends/request/accept/${requesterId}`);
};

export const declineFriendRequest = async (requesterId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Friends/request/decline/${requesterId}`);
};

export const getIncomingRequests = async (): Promise<FriendRequestDto[]> => {
  const { data } = await axiosInstance.get<FriendRequestDto[]>(
    '/api/Friends/requests/incoming'
  );
  return data;
};

export const getMyFriends = async (): Promise<FriendDto[]> => {
  const { data } = await axiosInstance.get<FriendDto[]>('/api/Friends/my-friends');
  return data;
};

export const removeFriend = async (friendId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Friends/remove/${friendId}`);
};

export const getTopUsers = async (): Promise<FriendDto[]> => {
  const { data } = await axiosInstance.get<FriendDto[]>('/api/Friends/top-users');
  return data;
};
