// src/features/posts/components/PostCard.tsx
import React from 'react';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { deletePost, likePost, unlikePost } from '../store/postsSlice';
import { BASE_URL } from '../../../shared/api/axiosInstance';
import type { Post } from '../types/post';

interface Props {
  post: Post;
}

const resolveUrl = (url: string | null) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('uk-UA', {
    day:    'numeric',
    month:  'long',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });

const PostCard: React.FC<Props> = ({ post }) => {
  const dispatch   = useAppDispatch();
  const currentUser = useAppSelector(s => s.auth.user);

  // userId з токена може прийти як string або number — приводимо до number
  const currentId = currentUser ? Number(currentUser.userId) : null;
  const isOwn     = currentId !== null && currentId === post.userId;
  const isAdmin   = currentUser?.isAdmin ?? false;
  const canDelete  = isOwn || isAdmin;

  const avatarUrl = resolveUrl(post.authorAvatarUrl);
  const imgUrl    = resolveUrl(post.imageUrl);

  const handleLike = () => {
    if (post.isLikedByMe) {
      dispatch(unlikePost(post.postId));
    } else {
      dispatch(likePost(post.postId));
    }
  };

  const handleDelete = () => {
    dispatch(deletePost(post.postId));
  };

  return (
    <article className="post-card">

      {/* Header */}
      <div className="post-card__header">
        <div className="post-card__author">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={post.authorUsername}
              className="post-card__avatar"
            />
          ) : (
            <div className="post-card__avatar post-card__avatar--fallback">
              {post.authorUsername.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="post-card__author-info">
            <span className="post-card__username">{post.authorUsername}</span>
            <span className="post-card__date">{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {canDelete && (
          <button
            className="post-card__delete"
            onClick={handleDelete}
            title="Видалити пост"
          >
            <FiTrash2 size={15} />
          </button>
        )}
      </div>

      {/* Text */}
      {post.text && (
        <div
          className="post-card__text"
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
      )}

      {/* Image */}
      {imgUrl && (
        <div className="post-card__image-wrap">
          <img src={imgUrl} alt="публікація" className="post-card__image" />
        </div>
      )}

      {/* Footer */}
      <div className="post-card__footer">
        <button
          className={`post-card__like-btn${post.isLikedByMe ? ' post-card__like-btn--active' : ''}`}
          onClick={handleLike}
          title={post.isLikedByMe ? 'Забрати лайк' : 'Лайкнути'}
        >
          <FiHeart size={15} />
          <span>{post.likesCount}</span>
        </button>
      </div>

    </article>
  );
};

export default PostCard;