// src/features/chat/components/ChatHeader/ChatHeader.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiUser } from 'react-icons/fi';
import type { Chat } from '../../types/chat';
import UserCardDrawer from '../UserCardDrawer/UserCardDrawer';
import './ChatHeader.css';

const BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app';

interface ChatHeaderProps {
  chat: Chat | null;
  isOtherOnline?: boolean;
  isOtherTyping?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chat,
  isOtherOnline = false,
  isOtherTyping = false,
}) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Поки чат не завантажився — показуємо скелетон
  if (!chat) {
    return (
      <div className="chat-header">
        <button className="chat-header__back" onClick={() => navigate('/chats')}>
          <FiArrowLeft size={20} />
        </button>
        <div className="chat-header__avatar-btn">
          <div className="chat-header__avatar-fallback chat-header__avatar-fallback--skeleton" />
        </div>
        <div className="chat-header__info-btn">
          <span className="chat-header__skeleton chat-header__skeleton--name" />
          <span className="chat-header__skeleton chat-header__skeleton--sub" />
        </div>
      </div>
    );
  }

  const isGroup   = !!chat.isGroup;
  const name      = isGroup ? (chat.groupName ?? 'Група') : (chat.secondMember?.username ?? '');
  const rawAvatar = !isGroup ? chat.secondMember?.avatarUrl : null;
  const avatarUrl = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `${BASE_URL}${rawAvatar}`)
    : null;

  let subtitle: React.ReactNode;
  if (!isGroup && isOtherTyping) {
    subtitle = (
      <span className="chat-header__typing">
        <span className="chat-header__typing-dots">
          <span /><span /><span />
        </span>
        друкує...
      </span>
    );
  } else if (!isGroup && isOtherOnline) {
    subtitle = <span className="chat-header__online-label">онлайн</span>;
  } else {
    subtitle = isGroup ? 'Груповий чат' : 'Особистий чат';
  }

  const handleAvatarClick = () => {
    if (!isGroup && chat.secondMember) setDrawerOpen(true);
  };

  return (
    <>
      <div className="chat-header">
        <button className="chat-header__back" onClick={() => navigate('/chats')}>
          <FiArrowLeft size={20} />
        </button>

        <button
          className={`chat-header__avatar-btn${!isGroup ? ' chat-header__avatar-btn--clickable' : ''}`}
          onClick={handleAvatarClick}
          disabled={isGroup}
        >
          <div className="chat-header__avatar-wrap">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="chat-header__avatar-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            ) : (
              <div className={`chat-header__avatar-fallback${isGroup ? ' chat-header__avatar-fallback--group' : ''}`}>
                {isGroup ? <FiUsers size={18} /> : <FiUser size={18} />}
              </div>
            )}
            {!isGroup && isOtherOnline && (
              <span className="chat-header__online-dot" />
            )}
          </div>
        </button>

        <button
          className={`chat-header__info-btn${!isGroup ? ' chat-header__info-btn--clickable' : ''}`}
          onClick={handleAvatarClick}
          disabled={isGroup}
        >
          <span className="chat-header__name">{name}</span>
          <span className="chat-header__subtitle">{subtitle}</span>
        </button>
      </div>

      {drawerOpen && chat.secondMember && (
        <UserCardDrawer user={chat.secondMember} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
};

export default ChatHeader;