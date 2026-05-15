import React from 'react';
import { FiUser, FiCheck, FiX } from 'react-icons/fi';
import type { FriendRequestDto } from '../../../friends/types/friends';
import './FriendRequestCard.css';

const API_BASE = 'https://localhost:7192';

interface FriendRequestCardProps {
  request: FriendRequestDto;
  onAccept: (userId: number) => void;
  onDecline: (userId: number) => void;
  isLoading?: boolean;
}

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
};

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  isLoading = false,
}) => (
  <div className="friend-request-card">
    {request.avatarUrl ? (
      <img
        src={`${API_BASE}${request.avatarUrl}`}
        alt={request.username}
        className="friend-request-card__avatar"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    ) : (
      <div className="friend-request-card__avatar-fallback">
        <FiUser />
      </div>
    )}

    <div className="friend-request-card__info">
      <div className="friend-request-card__name">{request.username}</div>
      {request.city && (
        <div className="friend-request-card__city">{request.city}</div>
      )}
      <div className="friend-request-card__date">
        Надіслано {formatDate(request.sentAt)}
      </div>
    </div>

    <div className="friend-request-card__actions">
      <button
        className="friend-request-card__btn friend-request-card__btn--decline"
        onClick={() => onDecline(request.userId)}
        disabled={isLoading}
        title="Відхилити"
      >
        <FiX size={15} />
        Відхилити
      </button>
      <button
        className="friend-request-card__btn friend-request-card__btn--accept"
        onClick={() => onAccept(request.userId)}
        disabled={isLoading}
        title="Прийняти"
      >
        <FiCheck size={15} />
        Прийняти
      </button>
    </div>
  </div>
);

export default FriendRequestCard;