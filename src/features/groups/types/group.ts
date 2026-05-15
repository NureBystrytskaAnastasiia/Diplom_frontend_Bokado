export type GroupStatus = 'Open' | 'Closed';

export type GroupMemberRole = 'Member' | 'Admin' | 'Owner' | 0 | 1 | 2;

export interface GroupInterestDto {
  interestId: number;
  name: string;
}

export interface GroupMemberDto {
  userId: number;
  username: string;
  avatarUrl: string | null;
  role: GroupMemberRole;
}

export interface GroupCreatorDto {
  userId: number;
  username: string;
  avatarUrl: string | null;
}

export interface GetGroupDto {
  groupId: number;
  name: string;
  description: string | null;
  city: string;
  status: GroupStatus;
  creatorId: number;
  chatId: number;
  maxMembers: number;
  createdAt: string;
  creator: GroupCreatorDto;
  members: GroupMemberDto[];
  interests: GroupInterestDto[];
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  city: string;
  interestIds: number[];
}

export interface UpdateGroupDto {
  name?: string;
  description?: string;
  city?: string;
}