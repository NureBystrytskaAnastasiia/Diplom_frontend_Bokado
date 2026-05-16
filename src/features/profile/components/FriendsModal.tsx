// src/features/profile/components/FriendsModal.tsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUsers, FiMapPin, FiUser } from 'react-icons/fi';
import { BASE_URL } from '../../../shared/api/axiosInstance';
import type { FriendDto } from '../../friends/types/friends';

interface Props {
  friends: FriendDto[];
  onClose: () => void;
}

const FriendsModal: React.FC<Props> = ({ friends, onClose }) => {
  const navigate  = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Закрити при кліку на оверлей
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Закрити по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Блокуємо скрол під модалкою
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const resolveAvatar = (url: string | null) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `${BASE_URL}${url}`;
  };

  const goToProfile = (userId: number) => {
    onClose();
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      className="fm-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className="fm-modal" role="dialog" aria-modal="true" aria-label="Список друзів">

        {/* Header */}
        <div className="fm-header">
          <div className="fm-header__title">
            <FiUsers size={16} />
            <span>Друзі</span>
            <span className="fm-header__count">{friends.length}</span>
          </div>
          <button className="fm-close" onClick={onClose} title="Закрити">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="fm-body">
          {friends.length === 0 ? (
            <div className="fm-empty">
              <FiUsers size={32} />
              <p>Друзів поки немає</p>
            </div>
          ) : (
            <ul className="fm-list">
              {friends.map(friend => {
                const avatar = resolveAvatar(friend.avatarUrl);
                return (
                  <li key={friend.userId} className="fm-item">
                    <button
                      className="fm-item__btn"
                      onClick={() => goToProfile(friend.userId)}
                    >
                      {/* Avatar */}
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={friend.username}
                          className="fm-item__avatar"
                        />
                      ) : (
                        <div className="fm-item__avatar fm-item__avatar--fallback">
                          {friend.username.charAt(0).toUpperCase()}
                        </div>
                      )}

                      {/* Info */}
                      <div className="fm-item__info">
                        <span className="fm-item__name">{friend.username}</span>
                        {friend.city && (
                          <span className="fm-item__city">
                            <FiMapPin size={11} />
                            {friend.city}
                          </span>
                        )}
                        {friend.bio && (
                          <span className="fm-item__bio">{friend.bio}</span>
                        )}
                      </div>

                      {/* Arrow */}
                      <FiUser size={15} className="fm-item__arrow" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default FriendsModal;