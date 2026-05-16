// src/features/chat/components/MessageInput.tsx
import React, { useRef, useState } from 'react';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import GifPicker, { type TenorImage } from 'gif-picker-react';
import {
  FiSmile, FiImage, FiX, FiSend, FiMic, FiSquare,
} from 'react-icons/fi';

interface MessageInputProps {
  newMessage:            string;
  setNewMessage:         (v: string | ((p: string) => string)) => void;
  file:                  File | null;
  setFile:               (f: File | null) => void;
  filePreview:           string | null;
  setFilePreview:        (p: string | null) => void;
  loading:               boolean;
  isRecording:           boolean;
  showRecordingControls: boolean;
  recordingTime:         number;
  onSendMessage:         () => void;
  onStartRecording:      () => void;
  onStopRecording:       (send: boolean) => void;
  onKeyPress:            (e: React.KeyboardEvent) => void;
}

const TENOR_KEY = 'AIzaSyDTCr5BkrQRF7jJCgahsaEqaqy7mEeRg7I';

const fmtTime = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage, setNewMessage,
  file, setFile,
  filePreview, setFilePreview,
  loading, isRecording, showRecordingControls, recordingTime,
  onSendMessage, onStartRecording, onStopRecording, onKeyPress,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif,   setShowGif]   = useState(false);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFilePreview(f && f.type.startsWith('image/') ? URL.createObjectURL(f) : null);
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onEmojiClick = (data: EmojiClickData) => {
    setNewMessage((p: string) => p + data.emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  const onGifClick = (gif: TenorImage) => {
    fetch(gif.url)
      .then(r => r.blob())
      .then(blob => {
        const gifFile = new File([blob], 'gif.gif', { type: 'image/gif' });
        setFile(gifFile);
        setFilePreview(gif.url);
        setShowGif(false);
      });
  };

  const canSend = (newMessage.trim().length > 0 || file !== null) && !isRecording;

  return (
    <>
      {/* Прев'ю файлу */}
      {filePreview && (
        <div className="file-preview-container">
          <div className="file-preview">
            <img src={filePreview} alt="preview" className="preview-image" />
            <button className="remove-preview" onClick={clearFile} title="Прибрати">
              <FiX size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            width="100%"
            height={340}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
          />
        </div>
      )}

      {/* GIF picker */}
      {showGif && (
        <div className="gif-picker-container">
          <GifPicker
            tenorApiKey={TENOR_KEY}
            onGifClick={onGifClick}
            width={350}
            height={300}
          />
          <button className="close-gif-picker" onClick={() => setShowGif(false)}>
            Закрити
          </button>
        </div>
      )}

      {/* Запис голосу */}
      {showRecordingControls && (
        <div className="recording-controls">
          <div className="recording-timer">
            <span className="recording-indicator" />
            <span>{fmtTime(recordingTime)}</span>
          </div>
          <div className="recording-actions">
            <button className="recording-cancel" onClick={() => onStopRecording(false)} title="Скасувати">
              <FiX size={18} />
            </button>
            <button className="recording-send" onClick={() => onStopRecording(true)} title="Надіслати">
              <FiSend size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Панель вводу */}
      <div className="chat-room-input">
        <div className="input-container">

          {/* Фото */}
          <button
            className="input-action-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording}
            title="Прикріпити фото"
          >
            <FiImage size={19} />
          </button>

          {/* Emoji */}
          <button
            className="input-action-button"
            onClick={() => { setShowEmoji(p => !p); setShowGif(false); }}
            disabled={isRecording}
            title="Emoji"
          >
            <FiSmile size={19} />
          </button>

          {/* GIF */}
          <button
            className="input-action-button gif-btn"
            onClick={() => { setShowGif(p => !p); setShowEmoji(false); }}
            disabled={isRecording}
            title="GIF"
          >
            <span className="gif-label">GIF</span>
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder={isRecording ? 'Йде запис...' : 'Повідомлення...'}
            value={newMessage}
            onChange={(e) => { setNewMessage(e.target.value); adjustHeight(); }}
            onKeyPress={onKeyPress}
            rows={1}
            disabled={isRecording}
          />

          {/* Мікрофон */}
          <button
            className={`input-action-button${isRecording ? ' recording-active' : ''}`}
            onClick={isRecording ? () => onStopRecording(true) : onStartRecording}
            title={isRecording ? 'Зупинити запис' : 'Записати голосове'}
          >
            {isRecording ? <FiSquare size={18} /> : <FiMic size={18} />}
          </button>

          {/* Відправити */}
          <button
            className={`send-button${canSend ? ' active' : ''}`}
            onClick={onSendMessage}
            disabled={loading || !canSend}
            title="Надіслати"
          >
            {loading
              ? <div className="send-loading" />
              : <FiSend size={17} />
            }
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,audio/mp3"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
};

export default MessageInput;