import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { getChatMessages, sendMessage, deleteMessage, sendVoiceMessage } from '../api/chat';
import type { Message } from '../types/chat';
import ChatHeader from '../components/Chat/ChatHeader';
import MessagesList from '../components/Chat/MessagesList';
import MessageInput from '../components/Chat/MessageInput';
import '../styles/Chat.css';

const ChatRoomPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showRecordingControls, setShowRecordingControls] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(document.createElement('div'));

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

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const voiceBlob = new Blob(chunks, { type: 'audio/mp3' });
        if (chunks.length > 0) {
          handleSendVoiceMessage(voiceBlob);
        }
        stream.getTracks().forEach(track => track.stop());
        setRecordingTime(0);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setShowRecordingControls(true);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording', error);
      alert('Не вдалося отримати доступ до мікрофона');
    }
  };

  const stopRecording = (send: boolean = true) => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }

      if (!send) {
        mediaRecorder.ondataavailable = null;
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      } else {
        mediaRecorder.stop();
      }

      setIsRecording(false);
      setShowRecordingControls(false);
      setMediaRecorder(null);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити це повідомлення?')) {
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
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopRecording(false);
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [mediaRecorder]);

  return (
    <div className="chat-room-container">
      <ChatHeader chatInfo={null} isTyping={false} />
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
