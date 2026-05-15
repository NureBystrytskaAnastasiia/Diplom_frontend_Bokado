import axios from 'axios';
import type { GetGroupDto, CreateGroupDto, UpdateGroupDto } from '../types/group';

const BASE = 'https://localhost:7192/api/Group';

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const getGroups = async (): Promise<GetGroupDto[]> => {
  const { data } = await axios.get(BASE);
  return data;
};

export const getGroup = async (groupId: number): Promise<GetGroupDto> => {
  const { data } = await axios.get(`${BASE}/${groupId}`);
  return data;
};

export const getRecommendations = async (): Promise<GetGroupDto[]> => {
  const { data } = await axios.get(`${BASE}/recommendations`, {
    headers: authHeader(),
  });
  return data;
};

export const createGroup = async (dto: CreateGroupDto): Promise<GetGroupDto> => {
  const { data } = await axios.post(BASE, dto, { headers: authHeader() });
  return data;
};

export const updateGroup = async (groupId: number, dto: UpdateGroupDto): Promise<void> => {
  await axios.put(`${BASE}/${groupId}`, dto, { headers: authHeader() });
};

export const deleteGroup = async (groupId: number): Promise<void> => {
  await axios.delete(`${BASE}/${groupId}`, { headers: authHeader() });
};

export const joinGroup = async (groupId: number): Promise<void> => {
  await axios.post(`${BASE}/${groupId}/join`, {}, { headers: authHeader() });
};

export const leaveGroup = async (groupId: number): Promise<void> => {
  await axios.post(`${BASE}/${groupId}/leave`, {}, { headers: authHeader() });
};

export const kickMember = async (groupId: number, targetUserId: number): Promise<void> => {
  await axios.delete(`${BASE}/${groupId}/kick/${targetUserId}`, { headers: authHeader() });
};

export const assignAdmin = async (groupId: number, targetUserId: number): Promise<void> => {
  await axios.put(`${BASE}/${groupId}/admin/${targetUserId}`, {}, { headers: authHeader() });
};

export const closeGroup = async (groupId: number): Promise<void> => {
  await axios.post(`${BASE}/${groupId}/close`, {}, { headers: authHeader() });
};

export const startGroupCall = async (groupId: number): Promise<string> => {
  const { data } = await axios.post(`${BASE}/${groupId}/call`, {}, { headers: authHeader() });
  return data.meetLink;
};