import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight } from 'react-icons/fi';
import './AuthPromptModal.css';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthPromptModal: React.FC<AuthPromptModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="auth-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Модалка */}
          <motion.div
            className="auth-modal"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Необхідна авторизація"
          >
            <button
              className="auth-modal__close"
              onClick={onClose}
              aria-label="Закрити"
            >
              <FiX size={18} />
            </button>

            <div className="auth-modal__icon" aria-hidden="true">🔐</div>

            <h2 className="auth-modal__title">
              Для цього потрібен акаунт
            </h2>

            <p className="auth-modal__sub">
              Зареєструйся безкоштовно щоб переглядати події,
              вступати до груп та знаходити нових друзів.
            </p>

            <div className="auth-modal__actions">
              <button
                className="btn btn-primary auth-modal__btn"
                onClick={handleRegister}
              >
                Зареєструватись <FiArrowRight size={16} />
              </button>
              <button
                className="btn auth-modal__btn--ghost"
                onClick={handleLogin}
              >
                Вже маю акаунт
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthPromptModal;