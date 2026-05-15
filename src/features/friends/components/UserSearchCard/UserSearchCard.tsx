import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiUserPlus, FiCheck, FiArrowRight } from 'react-icons/fi';
import type { FriendDto, FriendStatus } from '../../../friends/types/friends';
import './UserSearchCard.css';

const API_BASE = 'https://localhost:7192';

interface UserSearchCardProps {
  user: FriendDto;
  status: FriendStatus;
  onSendRequest: (userId: number) => void;
  isLoading?: boolean;
}

const statusLabel: Record<FriendStatus, string | null> = {
  none:             null,
  pending_sent:     'Запит надіслано',
  pending_received: 'Хоче дружити',
  friends:          'Вже друзі',
};

const UserSearchCard: React.FC<UserSearchCardProps> = ({
  user,
  status,
  onSendRequest,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const label = statusLabel[status];

  return (
    <div className="user-search-card">
      {/* Avatar */}
      {user.avatarUrl ? (
        <img
          src={`${API_BASE}${user.avatarUrl}`}
          alt={user.username}
          className="user-search-card__avatar"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="user-search-card__avatar-fallback">
          <FiUser />
        </div>
      )}

      {/* Info */}
      <div className="user-search-card__info">
        <div className="user-search-card__name">{user.username}</div>
        {user.city && (
          <div className="user-search-card__city">{user.city}</div>
        )}
        {label && (
          <span className={`user-search-card__status user-search-card__status--${
            status === 'friends' ? 'friends' : 'pending'
          }`}>
            {label}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="user-search-card__actions">
        <button
          className="user-search-card__btn user-search-card__btn--ghost"
          onClick={() => navigate(`/profile/${user.userId}`)}
        >
          <FiArrowRight size={15} />
          Профіль
        </button>

        {status === 'none' && (
          <button
            className="user-search-card__btn user-search-card__btn--primary"
            onClick={() => onSendRequest(user.userId)}
            disabled={isLoading}
          >
            <FiUserPlus size={15} />
            Додати
          </button>
        )}

        {status === 'friends' && (
          <button className="user-search-card__btn user-search-card__btn--ghost" disabled>
            <FiCheck size={15} />
            Друзі
          </button>
        )}
      </div>
    </div>
  );
};

export default UserSearchCard;