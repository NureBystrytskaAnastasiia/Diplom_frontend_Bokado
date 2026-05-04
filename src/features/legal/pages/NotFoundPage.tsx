import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiHome } from 'react-icons/fi';
import CatAnimation from '../components/CatAnimation/CatAnimation';
import '../styles/NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found">
      <div className="not-found__orb not-found__orb--1" aria-hidden="true" />
      <div className="not-found__orb not-found__orb--2" aria-hidden="true" />
      <div className="not-found__orb not-found__orb--3" aria-hidden="true" />

      <div className="container not-found__inner">
        <motion.div
          className="not-found__content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Велике 404 */}
          <motion.div
            className="not-found__code"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            aria-hidden="true"
          >
            404
          </motion.div>

          {/* Котик */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <CatAnimation />
          </motion.div>

          <motion.h1
            className="not-found__title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Сторінку не знайдено
          </motion.h1>

          <motion.p
            className="not-found__sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
          >
            Схоже, ця сторінка переїхала або ніколи не існувала.<br />
            Але твої люди точно десь тут — просто не на цій адресі.
          </motion.p>

          <motion.div
            className="not-found__actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <FiHome size={16} />
              На головну
            </button>
            <button className="btn not-found__back" onClick={() => navigate(-1)}>
              <FiArrowLeft size={16} />
              Назад
            </button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFoundPage;