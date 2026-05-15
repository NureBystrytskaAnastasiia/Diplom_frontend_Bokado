import React, { useState, useEffect } from 'react';
import { FiX, FiMessageSquare } from 'react-icons/fi';
import type { FriendDto } from '../../../friends/types/friends';
import './CreateChatModal.css';

interface CreateChatModalProps {
  friends: FriendDto[];
  onClose: () => void;
  onCreate: (userId: number) => void;
  isLoading?: boolean;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
  friends,
  onClose,
  onCreate,
  isLoading,
}) => {
  const [search, setSearch] = useState('');

  const filtered = friends.filter(f =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="create-chat-modal__overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="create-chat-modal">
        <div className="create-chat-modal__header">
          <h2 className="create-chat-modal__title">Новий чат</h2>
          <button className="create-chat-modal__close" onClick={onClose}><FiX size={18} /></button>
        </div>

        <input
          className="create-chat-modal__search"
          placeholder="Пошук друзів..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div className="create-chat-modal__list">
          {filtered.length === 0 && (
            <div className="create-chat-modal__empty">Друзів не знайдено</div>
          )}
          {filtered.map((friend) => (
            <button
              key={friend.userId}
              className="create-chat-modal__friend"
              onClick={() => { onCreate(friend.userId); onClose(); }}
              disabled={isLoading}
            >
              <div className="create-chat-modal__friend-avatar">
                {friend.username.charAt(0).toUpperCase()}
              </div>
              <div className="create-chat-modal__friend-info">
                <span className="create-chat-modal__friend-name">{friend.username}</span>
                {friend.city && <span className="create-chat-modal__friend-city">{friend.city}</span>}
              </div>
              <FiMessageSquare size={16} className="create-chat-modal__friend-icon" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateChatModal;