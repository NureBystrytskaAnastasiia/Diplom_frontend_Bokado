import React from 'react';
import type { Message } from '../../types/chat';

interface MessagesListProps {
  messages: Message[];
  userId?: number;
  onDeleteMessage: (messageId: number) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessagesList: React.FC<MessagesListProps> = ({ 
  messages, 
  userId, 
  onDeleteMessage,
  messagesEndRef 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
const sortedMessages = [...messages].sort(
  (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сьогодні';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчора';
    } else {
      return date.toLocaleDateString('uk-UA');
    }
  };

  const isImageFile = (url: string) => {
    return url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  };

  const isAudioFile = (url: string) => {
    return url.match(/\.(mp3|wav|ogg|m4a)$/i);
  };

  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = formatDate(message.sentAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="chat-room-messages">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="date-separator">
            <span>{date}</span>
          </div>
          
          {dateMessages.map((msg) => {
            const isOwnMessage = msg.senderId === userId;
            
            return (
              <div 
                key={msg.messageId} 
                className={`message ${isOwnMessage ? 'message-own' : 'message-other'}`}
              >
                {!isOwnMessage && (
                  <div className="message-avatar">
                    <div className="avatar-small">
                      {msg.senderUsername?.charAt(0).toUpperCase() || '?'}
                    </div>
                  </div>
                )}
                
                <div className="message-content">
                  {!isOwnMessage && (
                    <div className="message-sender">{msg.senderUsername}</div>
                  )}
                  
                  <div className="message-bubble">
                    {msg.text && <div className="message-text">{msg.text}</div>}
                    
                    {msg.attachedFileUrl && (
                      <div className="message-attachment">
                        {isImageFile(msg.attachedFileUrl) ? (
                          <img
                            src={msg.attachedFileUrl}
                            alt="attachment"
                            className="attachment-image"
                            onClick={() => window.open(msg.attachedFileUrl, '_blank')}
                            style={{
                              maxWidth: '300px',
                              maxHeight: '300px',
                              borderRadius: '8px',
                              cursor: 'pointer'
                            }}
                          />
                        ) : isAudioFile(msg.attachedFileUrl) ? (
                          <audio 
                            controls 
                            className="attachment-audio"
                            style={{ width: '250px' }}
                          >
                            <source src={msg.attachedFileUrl} type="audio/mpeg" />
                            Ваш браузер не підтримує аудіо елементи.
                          </audio>
                        ) : (
                          <a
                            href={msg.attachedFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-file"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M21.44 11.05L12.25 20.54C11.84 20.95 11.84 21.75 12.25 22.16C12.66 22.57 13.46 22.57 13.87 22.16L23.06 13.67" stroke="currentColor" strokeWidth="2"/>
                              <path d="M8.5 2.44L21.44 11.05L12.25 20.54L-.69 11.93L8.5 2.44Z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Відкрити файл
                          </a>
                        )}
                      </div>
                    )}
                    
                    <div className="message-time">{formatTime(msg.sentAt)}</div>
                  </div>
                  
                  {isOwnMessage && (
                    <button
                      className="message-delete"
                      onClick={() => onDeleteMessage(msg.messageId)}
                      title="Видалити повідомлення"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6H21M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6H19Z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;