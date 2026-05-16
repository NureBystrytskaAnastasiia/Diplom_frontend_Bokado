// src/features/posts/components/PostsSection.tsx
import React, { useEffect } from 'react';
import { FiMessageCircle, FiAlertCircle } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { fetchUserPosts, clearPosts } from '../store/postsSlice';
import PostCreate from './PostCreate';
import PostCard from './PostCard';

interface Props {
  profileUserId: number;
  isOwn: boolean;
}

const PostsSection: React.FC<Props> = ({ profileUserId, isOwn }) => {
  const dispatch = useAppDispatch();
  const { items, isLoading, error, loadedForUserId } = useAppSelector(s => s.posts);

  useEffect(() => {
    // завантажуємо лише якщо ще не завантажено для цього юзера
    if (loadedForUserId !== profileUserId) {
      dispatch(fetchUserPosts(profileUserId));
    }

    // очищаємо при виході зі сторінки
    return () => {
      dispatch(clearPosts());
    };
  }, [profileUserId, dispatch]);

  return (
    <div className="posts-section">

      {/* Форма створення — лише власний профіль */}
      {isOwn && <PostCreate />}

      {/* Стан завантаження */}
      {isLoading && (
        <div className="posts-section__loading">
          <span className="posts-spinner" />
          Завантаження публікацій...
        </div>
      )}

      {/* Помилка */}
      {!isLoading && error && (
        <div className="posts-section__error">
          <FiAlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Порожньо */}
      {!isLoading && !error && items.length === 0 && (
        <div className="posts-section__empty">
          <FiMessageCircle size={36} />
          <p>
            {isOwn
              ? 'У вас ще немає публікацій. Поділіться чимось!'
              : 'Поки немає публікацій.'}
          </p>
        </div>
      )}

      {/* Список постів */}
      {!isLoading && !error && items.length > 0 && (
        <div className="posts-list">
          {items.map(post => (
            <PostCard key={post.postId} post={post} />
          ))}
        </div>
      )}

    </div>
  );
};

export default PostsSection;