import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../shared/hooks/useAuth';
import { getChatMessages, sendMessage, deleteMessage, sendVoiceMessage, markChatAsRead as markChatAsReadApi } from '../api/chat';
import type { Message } from '../types/chat';
import ChatHeader from '../components/ChatHeader/ChatHeader';
import MessagesList from '../components/MessagesList';
import MessageInput from '../components/MessageInput';
import './ChatWithUserPage.css';

const ChatRoomPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user }   = useAppSelector((s) => s.auth);
  const { chats }  = useAppSelector((s) => s.chat);

  // Знаходимо поточний чат зі store щоб показати правильну назву
  const currentChat = chats.find(c => c.chatId === Number(chatId)) ?? null;

  const [messages, setMessages]                     = useState<Message[]>([]);
  const [newMessage, setNewMessage]                 = useState('');
  const [file, setFile]                             = useState<File | null>(null);
  const [filePreview, setFilePreview]               = useState<string | null>(null);
  const [loading, setLoading]                       = useState(false);
  const [isRecording, setIsRecording]               = useState(false);
  const [mediaRecorder, setMediaRecorder]           = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime]           = useState(0);
  const [showRecordingControls, setShowRecordingControls] = useState(false);

  const messagesEndRef      = useRef<HTMLDivElement>(document.createElement('div'));
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setLoading(true);
    try {
      await sendMessage(Number(chatId), newMessage.trim(), file ?? undefined);
      setNewMessage('');
      setFile(null);
      setFilePreview(null);
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setLoading(false);
    }
  };

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
    // Позначаємо чат як прочитаний на беку при відкритті
    if (chatId) {
      markChatAsReadApi(Number(chatId));
    }
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
    };
  }, [mediaRecorder]);

  return (
    <div className="chat-room">
      <ChatHeader chat={currentChat} />
      <MessagesList
        messages={messages}
        userId={user?.userId}
        onDeleteMessage={handleDeleteMessage}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
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