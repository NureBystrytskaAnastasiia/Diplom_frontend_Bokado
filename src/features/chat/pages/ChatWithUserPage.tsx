import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import {
  getChatMessages, sendMessage, deleteMessage,
  sendVoiceMessage, markChatAsRead as markChatAsReadApi,
} from '../api/chat';
import { fetchChats } from '../store/chatSlice';
import type { Message } from '../types/chat';
import ChatHeader from '../components/ChatHeader/ChatHeader';
import MessagesList from '../components/MessagesList';
import MessageInput from '../components/MessageInput';
import { useChatHub } from '../hooks/useChatHub';
import './ChatWithUserPage.css';

const TYPING_STOP_DELAY = 2500;

const ChatRoomPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch   = useAppDispatch();
  const { user }   = useAppSelector((s) => s.auth);
  const { chats }  = useAppSelector((s) => s.chat);

  const currentChat = chats.find(c => c.chatId === Number(chatId)) ?? null;
  const otherUserId = currentChat?.secondMember?.userId;

  // Якщо потрапили сюди напряму (наприклад, адмін відкрив support-чат зі свого
  // SupportPanel і одразу перейшов на /chat/:id) — список чатів у сторі порожній
  // або не містить цей чат, тому шапка застрягне в скелетоні. Підвантажуємо.
  // Прапор — щоб не спамити fetch у циклі. Скидаємо його при зміні chatId,
  // щоб для нового чату спроба була ще раз.
  const triedFetchRef = useRef(false);
  useEffect(() => { triedFetchRef.current = false; }, [chatId]);
  useEffect(() => {
    if (!chatId) return;
    if (!currentChat && !triedFetchRef.current) {
      triedFetchRef.current = true;
      dispatch(fetchChats());
    }
  }, [chatId, currentChat, dispatch]);

  const [messages, setMessages]       = useState<Message[]>([]);
  const [newMessage, setNewMessage]   = useState('');
  const [file, setFile]               = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading]         = useState(false);

  const [isRecording, setIsRecording]                     = useState(false);
  const [mediaRecorder, setMediaRecorder]                 = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime]                 = useState(0);
  const [showRecordingControls, setShowRecordingControls] = useState(false);

  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  const messagesEndRef       = useRef<HTMLDivElement>(document.createElement('div'));
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typingTimeoutRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingSentRef      = useRef(false);

  /* ── SignalR ──────────────────────────────────────────────────────── */
  const handleTyping = useCallback(
    (incomingChatId: number, userId: number, typing: boolean) => {
      if (incomingChatId !== Number(chatId) || userId === user?.userId) return;
      setIsOtherTyping(typing);
      if (typing) {
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 4000);
      }
    },
    [chatId, user?.userId]
  );

  const handleUserOnlineStatus = useCallback(
    (userId: number, online: boolean) => {
      if (userId === otherUserId) setIsOtherOnline(online);
    },
    [otherUserId]
  );

  // token більше не потрібен тут — з'єднання глобальне з App.tsx
  const { sendTyping } = useChatHub({
    chatId: Number(chatId) || null,
    onTyping: handleTyping,
    onUserOnlineStatus: handleUserOnlineStatus,
  });

  /* ── Повідомлення ─────────────────────────────────────────────────── */
  const fetchMessages = async () => {
    if (!chatId) return;
    try {
      const data = await getChatMessages(Number(chatId));
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !file) return;
    if (loading) return;

    sendTyping(false);
    isTypingSentRef.current = false;
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const messageToSend = newMessage.trim();
    const fileToSend    = file;
    setNewMessage('');
    setFile(null);
    setFilePreview(null);

    setLoading(true);
    try {
      await sendMessage(Number(chatId), messageToSend, fileToSend ?? undefined);
    } catch (error) {
      console.error('Failed to send message', error);
      setNewMessage(messageToSend);
    } finally {
      setLoading(false);
    }
    fetchMessages();
  };

  const handleMessageChange = useCallback(
    (value: string | ((p: string) => string)) => {
      setNewMessage(value);
      if (!isTypingSentRef.current) {
        sendTyping(true);
        isTypingSentRef.current = true;
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
        isTypingSentRef.current = false;
      }, TYPING_STOP_DELAY);
    },
    [sendTyping]
  );

  /* ── Голосові ─────────────────────────────────────────────────────── */
  const handleSendVoiceMessage = async (voiceBlob: Blob) => {
    try {
      const voiceFile = new File([voiceBlob], 'voice_message.mp3', { type: 'audio/mp3' });
      await sendVoiceMessage(Number(chatId), voiceFile);
      fetchMessages();
    } catch (error) {
      console.error('Failed to send voice message', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const voiceBlob = new Blob(chunks, { type: 'audio/mp3' });
        if (chunks.length > 0) handleSendVoiceMessage(voiceBlob);
        stream.getTracks().forEach(t => t.stop());
        setRecordingTime(0);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setShowRecordingControls(true);
      recordingIntervalRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch {
      alert('Не вдалося отримати доступ до мікрофона');
    }
  };

  const stopRecording = (send = true) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      if (!send) {
        mediaRecorder.ondataavailable = null;
        mediaRecorder.stream.getTracks().forEach(t => t.stop());
      } else {
        mediaRecorder.stop();
      }
      setIsRecording(false);
      setShowRecordingControls(false);
      setMediaRecorder(null);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Видалити повідомлення?')) {
      try {
        await deleteMessage(messageId);
        fetchMessages();
      } catch (error) {
        console.error('Failed to delete message', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    fetchMessages();
    if (chatId) markChatAsReadApi(Number(chatId));
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (mediaRecorder?.state === 'recording') stopRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [mediaRecorder]);

  return (
    <div className="chat-room">
      <ChatHeader
        chat={currentChat}
        isOtherOnline={isOtherOnline}
        isOtherTyping={isOtherTyping}
      />
      <MessagesList
        messages={messages}
        userId={user?.userId}
        onDeleteMessage={handleDeleteMessage}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={handleMessageChange}
        file={file}
        setFile={setFile}
        filePreview={filePreview}
        setFilePreview={setFilePreview}
        loading={loading}
        isRecording={isRecording}
        showRecordingControls={showRecordingControls}
        recordingTime={recordingTime}
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default ChatRoomPage;