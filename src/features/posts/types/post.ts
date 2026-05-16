export interface Post {
  postId: number;
  userId: number;
  authorUsername: string;
  authorAvatarUrl: string | null;
  text: string | null;
  imageUrl: string | null;
  createdAt: string;
  likesCount: number;
  isLikedByMe: boolean;
}

export interface CreatePostData {
  text?: string;
  image?: File;
}

export interface PostsState {
  // пости поточного профілю що переглядається
  items: Post[];
  isLoading: boolean;
  error: string | null;

  // стан створення
  isCreating: boolean;
  createError: string | null;

  // для якого userId завантажені пости
  loadedForUserId: number | null;
}