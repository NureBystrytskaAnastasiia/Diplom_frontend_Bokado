export interface FriendDto {
  userId: number;    
  username: string;  
  avatarUrl: string | null;
  bio: string;
}

export interface UserSwipeDto {
  swipeId: number;   // Додаємо swipeId для прийняття заявки
  userId: number;    
  username: string;  
  avatarUrl: string | null;
  bio: string;
  swipedAt: string; // ISO string від бекенду
}

export interface SwipeResponse {
  success: boolean;
  message?: string;
}

export interface AcceptSwipeResponse {
  success: boolean;
}

export interface TopUser {
  userId: number;    
  username: string;  
  avatarUrl: string | null;
  bio: string;
}

export interface WhoLikedMeResponse {
  users: UserSwipeDto[];
}

export interface SearchResponse {
  users: FriendDto[];
}

export interface MyFriendsResponse {
  friends: FriendDto[];
}
export interface FriendDto {
  userId: number;
  username: string;
}
