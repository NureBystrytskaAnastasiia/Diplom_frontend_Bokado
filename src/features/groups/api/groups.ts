import axiosInstance from '../../../shared/api/axiosInstance';
import type { GetGroupDto, CreateGroupDto, UpdateGroupDto } from '../types/group';

export const getGroups = async (): Promise<GetGroupDto[]> => {
  const { data } = await axiosInstance.get<GetGroupDto[]>('/api/Group');
  return data;
};

export const getGroup = async (groupId: number): Promise<GetGroupDto> => {
  const { data } = await axiosInstance.get<GetGroupDto>(`/api/Group/${groupId}`);
  return data;
};

export const getRecommendations = async (): Promise<GetGroupDto[]> => {
  const { data } = await axiosInstance.get<GetGroupDto[]>('/api/Group/recommendations');
  return data;
};

export const startGroupCall = async (groupId: number): Promise<string> => {
  const { data } = await axiosInstance.post<{ meetLink: string }>(
    `/api/Group/${groupId}/call`
  );
  return data.meetLink;
};

export const createGroup = async (dto: CreateGroupDto): Promise<GetGroupDto> => {
  const { data } = await axiosInstance.post<GetGroupDto>('/api/Group', dto);
  return data;
};

export const updateGroup = async (groupId: number, dto: UpdateGroupDto): Promise<void> => {
  await axiosInstance.put(`/api/Group/${groupId}`, dto);
};

export const deleteGroup = async (groupId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Group/${groupId}`);
};

export const joinGroup = async (groupId: number): Promise<void> => {
  await axiosInstance.post(`/api/Group/${groupId}/join`);
};

export const leaveGroup = async (groupId: number): Promise<void> => {
  await axiosInstance.post(`/api/Group/${groupId}/leave`);
};

export const kickMember = async (groupId: number, targetUserId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Group/${groupId}/kick/${targetUserId}`);
};

export const assignAdmin = async (groupId: number, targetUserId: number): Promise<void> => {
  await axiosInstance.put(`/api/Group/${groupId}/admin/${targetUserId}`);
};

export const closeGroup = async (groupId: number): Promise<void> => {
  await axiosInstance.post(`/api/Group/${groupId}/close`);
};

