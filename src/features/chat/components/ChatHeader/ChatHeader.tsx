// src/features/chat/components/ChatHeader/ChatHeader.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiUser } from 'react-icons/fi';
import type { Chat } from '../../types/chat';
import UserCardDrawer from '../UserCardDrawer/UserCardDrawer';
import './ChatHeader.css';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7192';

interface ChatHeaderProps {
  chat: Chat | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isGroup   = !!chat?.isGroup;
  const name      = isGroup ? (chat?.groupName ?? 'Група') : (chat?.secondMember?.username ?? 'Чат');
  const rawAvatar = !isGroup ? chat?.secondMember?.avatarUrl : null;
  const avatarUrl = rawAvatar
    ? (rawAvatar.startsWith('http') ? rawAvatar : `${BASE_URL}${rawAvatar}`)
    : null;

  const subtitle  = isGroup ? 'Груповий чат' : 'Особистий чат';

  const handleAvatarClick = () => {
    // Для особистого чату відкриваємо картку, для групового — не відкриваємо
    if (!isGroup && chat?.secondMember) {
      setDrawerOpen(true);
    }
  };

  return (
    <>
      <div className="chat-header">
        {/* Назад */}
        <button className="chat-header__back" onClick={() => navigate('/chats')}>
          <FiArrowLeft size={20} />
        </button>

        {/* Аватар — клікабельний для особистих чатів */}
        <button
          className={`chat-header__avatar-btn${!isGroup ? ' chat-header__avatar-btn--clickable' : ''}`}
          onClick={handleAvatarClick}
          disabled={isGroup}
          title={!isGroup ? 'Переглянути інформацію' : undefined}
        >
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
        </button>

        {/* Ім'я + підзаголовок — теж клікабельно для особистих */}
        <button
          className={`chat-header__info-btn${!isGroup ? ' chat-header__info-btn--clickable' : ''}`}
          onClick={handleAvatarClick}
          disabled={isGroup}
        >
          <span className="chat-header__name">{name}</span>
          <span className="chat-header__subtitle">{subtitle}</span>
        </button>
      </div>

      {/* Drawer з інформацією про юзера */}
      {drawerOpen && chat?.secondMember && (
        <UserCardDrawer
          user={chat.secondMember}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
};

export default ChatHeader;