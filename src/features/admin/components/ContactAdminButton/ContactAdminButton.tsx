// src/features/admin/components/ContactAdminButton/ContactAdminButton.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import axiosInstance from '../../../../shared/api/axiosInstance';
import './ContactAdminButton.css';

interface Props {
  label?:   string;
  variant?: 'primary' | 'outline';
  size?:    'sm' | 'md';
}

const ContactAdminButton: React.FC<Props> = ({
  label   = 'Написати адміністратору',
  variant = 'primary',
  size    = 'md',
}) => {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [done,    setDone]    = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      // Отримуємо список всіх юзерів — знаходимо першого адміна
      // (або можна зробити окремий endpoint GET /api/users/admins)
      const { data: users } = await axiosInstance.get<{ userId: number; isAdmin: boolean }[]>(
        '/api/users/all'
      );
      const admin = users.find(u => u.isAdmin);

      if (!admin) {
        setError('Адміністратор недоступний');
        return;
      }

      // Створюємо особистий чат з адміном
      const { data: chat } = await axiosInstance.post(
        `/api/Chat/Create?withUserId=${admin.userId}`,
        {}
      );

      setDone(true);
      setTimeout(() => navigate(`/chat/${chat.chatId}`), 600);
    } catch {
      setError('Не вдалось відкрити чат. Спробуйте пізніше.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cab-wrap">
      <button
        className={`cab-btn cab-btn--${variant} cab-btn--${size}${done ? ' cab-btn--done' : ''}`}
        onClick={handleClick}
        disabled={loading || done}
      >
        {loading ? (
          <span className="cab-spinner" />
        ) : done ? (
          <FiCheckCircle size={16} />
        ) : (
          <FiMessageCircle size={16} />
        )}
        {done ? 'Чат відкрито!' : label}
      </button>

      {error && <p className="cab-error">{error}</p>}
    </div>
  );
};

export default ContactAdminButton;