import React from 'react';
import { FiUsers, FiTrash2 } from 'react-icons/fi';
import type { Chat } from '../../types/chat';
import './ChatItem.css';

const API_BASE = 'https://localhost:7192';

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return 'Зараз';
  if (diffHours < 24) return date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  if (diffHours < 48) return 'Вчора';
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });
};

const ChatItem: React.FC<ChatItemProps> = ({ chat, isActive, onClick, onDelete }) => {
  const isGroup   = chat.isGroup;
  const name      = isGroup ? (chat.groupName ?? 'Група') : (chat.secondMember?.username ?? 'Невідомий');
  const avatarUrl = !isGroup ? chat.secondMember?.avatarUrl : null;
  const preview   = chat.lastMessage?.text || 'Натисніть щоб відкрити';
  const time      = formatTime(chat.lastMessage?.sentAt || chat.createdAt);

  return (
    <div className={`chat-item ${isActive ? 'chat-item--active' : ''}`} onClick={onClick}>
      <div className="chat-item__avatar">
        {avatarUrl ? (
          <img
            src={`${API_BASE}${avatarUrl}`}
            alt={name}
            className="chat-item__avatar-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className={`chat-item__avatar-fallback ${isGroup ? 'chat-item__avatar-fallback--group' : ''}`}>
            {isGroup ? <FiUsers size={18} /> : name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="chat-item__content">
        <div className="chat-item__top">
          <span className="chat-item__name">{name}</span>
          <span className="chat-item__time">{time}</span>
        </div>
        <div className="chat-item__bottom">
          <p className="chat-item__preview">{preview}</p>
          {chat.unreadCount && chat.unreadCount > 0 ? (
            <span className="chat-item__badge">{chat.unreadCount}</span>
          ) : null}
        </div>
      </div>

      <button
        className="chat-item__delete"
        onClick={onDelete}
        title="Видалити чат"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
};

export default ChatItem;