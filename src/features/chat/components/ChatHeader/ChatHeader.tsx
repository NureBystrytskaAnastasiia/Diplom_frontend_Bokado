import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUsers, FiUser } from 'react-icons/fi';
import type { Chat } from '../../types/chat';
import './ChatHeader.css';

const API_BASE = 'https://localhost:7192';

interface ChatHeaderProps {
  chat: Chat | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const navigate = useNavigate();

  const isGroup  = chat?.isGroup;
  const name     = isGroup ? (chat?.groupName ?? 'Група') : (chat?.secondMember?.username ?? 'Чат');
  const avatarUrl = !isGroup ? chat?.secondMember?.avatarUrl : null;
  const subtitle = isGroup ? 'Груповий чат' : 'особистий чат';

  return (
    <div className="chat-header">
      <button className="chat-header__back" onClick={() => navigate('/chats')}>
        <FiArrowLeft size={20} />
      </button>

      <div className="chat-header__avatar">
        {avatarUrl ? (
          <img
            src={`${API_BASE}${avatarUrl}`}
            alt={name}
            className="chat-header__avatar-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className={`chat-header__avatar-fallback ${isGroup ? 'chat-header__avatar-fallback--group' : ''}`}>
            {isGroup ? <FiUsers size={18} /> : <FiUser size={18} />}
          </div>
        )}
      </div>

      <div className="chat-header__info">
        <span className="chat-header__name">{name}</span>
        <span className="chat-header__subtitle">{subtitle}</span>
      </div>
    </div>
  );
};

export default ChatHeader;