// src/features/chat/components/MessagesList.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import type { Message } from '../types/chat';
import { BASE_URL } from '../../../shared/api/axiosInstance';


interface MessagesListProps {
  messages:        Message[];
  userId?:         number;
  onDeleteMessage: (messageId: number) => void;
  messagesEndRef:  React.RefObject<HTMLDivElement>;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

const formatDate = (iso: string) => {
  const date      = new Date(iso);
  const today     = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString())     return 'Сьогодні';
  if (date.toDateString() === yesterday.toDateString()) return 'Вчора';
  return date.toLocaleDateString('uk-UA');
};

const resolveUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
const isAudioUrl = (url: string) => /\.(mp3|wav|ogg|m4a|webm)$/i.test(url);

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  userId,
  onDeleteMessage,
  messagesEndRef,
}) => {
  const containerRef    = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [newCount, setNewCount]           = useState(0);
  const prevLengthRef   = useRef(messages.length);
  const isNearBottomRef = useRef(true);

  const checkScrollPosition = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 80;
    setShowScrollBtn(distanceFromBottom > 200);
  }, []);

  useEffect(() => {
    const diff = messages.length - prevLengthRef.current;
    if (diff > 0 && !isNearBottomRef.current) {
      setNewCount(c => c + diff);
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setNewCount(0);
  };

  const sorted = [...messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

  const groups: { date: string; msgs: Message[] }[] = [];
  for (const msg of sorted) {
    const d    = formatDate(msg.sentAt);
    const last = groups[groups.length - 1];
    if (!last || last.date !== d) {
      groups.push({ date: d, msgs: [msg] });
    } else {
      last.msgs.push(msg);
    }
  }

  return (
    <div
      className="chat-room-messages"
      ref={containerRef}
      onScroll={checkScrollPosition}
    >
      {groups.map(({ date, msgs }) => (
        <div key={date}>
          <div className="date-separator"><span>{date}</span></div>

          {msgs.map((msg) => {
            const isOwn     = Number(msg.senderId) === Number(userId);
            const avatarUrl = resolveUrl(msg.senderAvatarUrl ?? msg.sender?.avatarUrl);
            const attachUrl = resolveUrl(msg.attachment);
            const initials  = (msg.senderUsername ?? '?').charAt(0).toUpperCase();

            return (
              <div
                key={msg.messageId}
                className={`message ${isOwn ? 'message-own' : 'message-other'}`}
              >
                {!isOwn && (
                  <div className="message-avatar">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={msg.senderUsername}
                        className="avatar-small avatar-small--img"
                        onError={(e) => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = 'none';
                          el.nextElementSibling?.removeAttribute('style');
                        }}
                      />
                    ) : null}
                    <div
                      className="avatar-small"
                      style={avatarUrl ? { display: 'none' } : undefined}
                    >
                      {initials}
                    </div>
                  </div>
                )}

                <div className="message-content">
                  {!isOwn && (
                    <div className="message-sender">{msg.senderUsername}</div>
                  )}

                  <div className="message-bubble">
                    {msg.text && (
                      <div className="message-text">{msg.text}</div>
                    )}

                    {attachUrl && (
                      <div className="message-attachment">
                        {isImageUrl(attachUrl) ? (
                          <img
                            src={attachUrl}
                            alt="вкладення"
                            className="attachment-image"
                            onClick={() => window.open(attachUrl, '_blank')}
                          />
                        ) : isAudioUrl(attachUrl) ? (
                          <audio controls className="attachment-audio">
                            <source src={attachUrl} />
                          </audio>
                        ) : (
                          <a
                            href={attachUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-file"
                          >
                            📎 Відкрити файл
                          </a>
                        )}
                      </div>
                    )}

                    <div className="message-time">{formatTime(msg.sentAt)}</div>
                  </div>

                  {isOwn && (
                    <button
                      className="message-delete"
                      onClick={() => onDeleteMessage(msg.messageId)}
                      title="Видалити"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M3 6H21M8 6V4C8 3.45 8.45 3 9 3H15C15.55 3 16 3.45 16 4V6M19 6V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V6H19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
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

      {showScrollBtn && (
        <button
          className="scroll-to-bottom"
          onClick={scrollToBottom}
          title="До останніх повідомлень"
        >
          <FiChevronDown size={20} />
          {newCount > 0 && (
            <span className="scroll-to-bottom__badge">
              {newCount > 99 ? '99+' : newCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default MessagesList;