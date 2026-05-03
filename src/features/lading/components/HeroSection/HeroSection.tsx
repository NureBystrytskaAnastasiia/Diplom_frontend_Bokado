import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { STATS } from '../../constants/landingData';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* Декоративні фонові кулі */}
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />
      <div className="hero__orb hero__orb--3" aria-hidden="true" />

      <div className="container hero__inner">
        {/* Лівий блок */}
        <div className="hero__content">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="hero__badge-dot" aria-hidden="true" />
            Перша українська платформа знайомств
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Знайди <em>своїх</em><br />людей з<br />
            <span className="hero__title-brand">Bokado</span>
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            Спілкуйся, вступай до груп за інтересами,<br />
            виконуй челенджі та зустрічайся на подіях.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Спробувати безкоштовно <FiArrowRight />
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>
              Увійти
            </button>
          </motion.div>

          {/* Статистика */}
          <motion.div
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8 }}
          >
            {STATS.map((s) => (
              <div className="hero__stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Правий блок — mock UI */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="hero__phone">
            {/* Топ-бар */}
            <div className="mock-topbar">
              <div className="mock-logo">B</div>
              <div className="mock-topbar__title">Відкрити</div>
              <div className="mock-notif" />
            </div>

            {/* Картка групи */}
            <div className="mock-card">
              <div className="mock-card__icon" style={{ background: '#EDE7F6', fontSize: '1.5rem' }}>🎵</div>
              <div className="mock-card__info">
                <div className="mock-card__name">Indie Sound</div>
                <div className="mock-card__sub">Музика • 7 / 10</div>
              </div>
              <div className="mock-card__btn">Вступити</div>
            </div>

            <div className="mock-card">
              <div className="mock-card__icon" style={{ background: '#FCE4EC', fontSize: '1.5rem' }}>🏃</div>
              <div className="mock-card__info">
                <div className="mock-card__name">Run Kyiv</div>
                <div className="mock-card__sub">Спорт • 5 / 10</div>
              </div>
              <div className="mock-card__btn">Вступити</div>
            </div>

            {/* Челендж */}
            <div className="mock-challenge">
              <span className="mock-challenge__emoji">💧</span>
              <div className="mock-challenge__info">
                <div className="mock-challenge__name">Випий 2л води</div>
                <div className="mock-challenge__bar">
                  <div className="mock-challenge__fill" style={{ width: '60%' }} />
                </div>
              </div>
              <span className="mock-challenge__pts">+15</span>
            </div>

            {/* Онлайн-друзі */}
            <div className="mock-friends">
              <div className="mock-friend" style={{ background: '#EDE7F6', color: '#7C4DFF' }}>МК</div>
              <div className="mock-friend" style={{ background: '#FCE4EC', color: '#CE93D8' }}>ДС</div>
              <div className="mock-friend" style={{ background: '#F3E5F5', color: '#9575CD' }}>ОТ</div>
              <div className="mock-friend mock-friend--more">+5</div>
              <span className="mock-friends__label">онлайн зараз</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Хвиля внизу */}
      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7F4FD" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
