import axiosInstance from '../../../shared/api/axiosInstance';
import type { Post, CreatePostData } from '../types/post';

export const apiGetUserPosts = async (userId: number): Promise<Post[]> => {
  const res = await axiosInstance.get(`/api/Post/user/${userId}`);
  return res.data;
};

export const apiCreatePost = async (data: CreatePostData): Promise<Post> => {
  const form = new FormData();
  if (data.text)  form.append('text',  data.text);
  if (data.image) form.append('image', data.image);

  const res = await axiosInstance.post('/api/Post', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const apiDeletePost = async (postId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Post/${postId}`);
};

export const apiLikePost = async (postId: number): Promise<void> => {
  await axiosInstance.post(`/api/Post/${postId}/like`);
};

export const apiUnlikePost = async (postId: number): Promise<void> => {
  await axiosInstance.delete(`/api/Post/${postId}/like`);
};