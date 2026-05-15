export interface FriendDto {
  userId: number;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
}

export interface FriendRequestDto {
  friendRequestId: number;
  userId: number;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  sentAt: string;
}

export type FriendStatus = 'none' | 'pending_sent' | 'pending_received' | 'friends';

export interface FriendStatusDto {
  status: FriendStatus;
}