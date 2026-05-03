import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  chatInfo: any;
  isTyping: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatInfo, isTyping }) => {
  const navigate = useNavigate();

  return (
    <div className="chat-room-header">
      <button className="back-button" onClick={() => navigate('/chats')}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <div className="chat-room-info">
        <div className="chat-room-avatar">
          {chatInfo?.secondMember?.avatarUrl ? (
            <img src={chatInfo.secondMember.avatarUrl} alt="Avatar" />
          ) : (
            <div className="avatar-placeholder">
              {chatInfo?.secondMember?.username?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="chat-room-details">
          <h2 className="chat-room-name">
            {chatInfo?.secondMember?.username || 'Чат'}
          </h2>
          <span className="chat-room-status">
            {isTyping ? 'друкує...' : 'онлайн'}
          </span>
        </div>
      </div>

      <div className="chat-room-actions">
        <button className="action-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 16.92V13a10 10 0 1 0-5.93 9.14" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 12L18 14L22 10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <button className="action-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
            <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
            <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;