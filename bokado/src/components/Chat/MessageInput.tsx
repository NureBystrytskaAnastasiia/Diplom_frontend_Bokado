import React, { useRef, useState } from 'react';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import GifPicker, { type TenorImage } from 'gif-picker-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string | ((prev: string) => string)) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
  loading: boolean;
  isRecording: boolean;
  showRecordingControls: boolean;
  recordingTime: number;
  onSendMessage: () => void;
  onStartRecording: () => void;
  onStopRecording: (send: boolean) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  file,
  setFile,
  filePreview,
  setFilePreview,
  loading,
  isRecording,
  showRecordingControls,
  recordingTime,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  onKeyPress
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFilePreview(URL.createObjectURL(selectedFile));
    } else {
      setFilePreview(null);
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev: string) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const onGifClick = (gif: TenorImage) => {
    fetch(gif.url)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'gif.gif', { type: 'image/gif' });
        setFile(file);
        setFilePreview(gif.url);
        setShowGifPicker(false);
      });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      {filePreview && (
        <div className="file-preview-container">
          <div className="file-preview">
            <img src={filePreview} alt="preview" className="preview-image" />
            <button
              className="remove-preview"
              onClick={() => {
                setFile(null);
                setFilePreview(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" />
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="emoji-picker-container">
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            width="100%"
            height={350}
            previewConfig={{ showPreview: false }}
            searchDisabled={false}
            skinTonesDisabled
          />
        </div>
      )}

      {showGifPicker && (
        <div className="gif-picker-container">
          <GifPicker
            tenorApiKey="AIzaSyDTCr5BkrQRF7jJCgahsaEqaqy7mEeRg7I"
            onGifClick={onGifClick}
            width={350}
            height={300}
          />
          <button
            className="close-gif-picker"
            onClick={() => setShowGifPicker(false)}
          >
            Закрити
          </button>
        </div>
      )}

      {showRecordingControls && (
        <div className="recording-controls">
          <div className="recording-timer">
            <div className="recording-indicator"></div>
            <span>{formatRecordingTime(recordingTime)}</span>
          </div>
          <div className="recording-actions">
            <button
              className="recording-cancel"
              onClick={() => onStopRecording(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
            <button
              className="recording-send"
              onClick={() => onStopRecording(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L19 12M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="chat-room-input">
        <div className="input-container">
          <button
            className="input-action-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRecording}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21.44 11.05L12.25 20.54C11.84 20.95 11.84 21.75 12.25 22.16C12.66 22.57 13.46 22.57 13.87 22.16L23.06 13.67" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <button
            className="input-action-button"
            onClick={() => {
              setShowEmojiPicker(!showEmojiPicker);
              setShowGifPicker(false);
            }}
            disabled={isRecording}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M8 14S9.5 16 12 16S16 14 16 14" stroke="currentColor" strokeWidth="2" />
              <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" />
              <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>

          <button
            className="input-action-button"
            onClick={() => {
              setShowGifPicker(!showGifPicker);
              setShowEmojiPicker(false);
            }}
            disabled={isRecording}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z" />
            </svg>
          </button>

          <button
            className={`input-action-button ${isRecording ? 'recording-active' : ''}`}
            onClick={isRecording ? () => onStopRecording(true) : onStartRecording}
            title={isRecording ? 'Завершити запис' : 'Записати голосове повідомлення'}
          >
            {isRecording ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="12" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C10.34 2 9 3.34 9 5V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V5C15 3.34 13.66 2 12 2Z" stroke="currentColor" strokeWidth="2" />
                <path d="M19 10V12C19 16.42 15.42 20 11 20H13C17.42 20 21 16.42 21 12V10" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="20" x2="12" y2="24" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="24" x2="16" y2="24" stroke="currentColor" strokeWidth="2" />
              </svg>
            )}
          </button>

          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder={isRecording ? 'Запис голосового повідомлення...' : 'Введіть повідомлення...'}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              adjustTextareaHeight();
            }}
            onKeyPress={onKeyPress}
            rows={1}
            disabled={isRecording}
          />

          <button
            className={`send-button ${(newMessage.trim() || file) ? 'active' : ''}`}
            onClick={onSendMessage}
            disabled={loading || (!newMessage.trim() && !file) || isRecording}
          >
            {loading ? (
              <div className="send-loading"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" />
                <polygon points="22,2 15,22 11,13 2,9 22,2" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.mp3,.gif,.png,.jpg"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
};

export default MessageInput;
