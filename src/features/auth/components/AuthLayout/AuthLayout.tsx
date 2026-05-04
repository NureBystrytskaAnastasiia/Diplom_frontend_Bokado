import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  mode: 'login' | 'register';
}

const QUOTES = [
  { text: 'Знайди людей, які розуміють тебе без слів.', author: 'Bokado' },
  { text: 'Справжнє спілкування починається зі спільних інтересів.', author: 'Bokado' },
  { text: 'Твоя спільнота вже чекає на тебе.', author: 'Bokado' },
];

const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, mode }) => (
  <div className="auth-layout">
    {/* Ліва декоративна частина */}
    <div className="auth-layout__left">
      <div className="auth-layout__orb auth-layout__orb--1" aria-hidden="true" />
      <div className="auth-layout__orb auth-layout__orb--2" aria-hidden="true" />

      <div className="auth-layout__left-inner">
        <Link to="/" className="auth-layout__logo">
          <div className="auth-layout__logo-icon">B</div>
          <span>Bokado</span>
        </Link>

        <div className="auth-layout__quote">
          <p className="auth-layout__quote-text">"{quote.text}"</p>
          <span className="auth-layout__quote-author">— {quote.author}</span>
        </div>

        {/* Декоративні кільця */}
        <div className="auth-layout__rings" aria-hidden="true">
          <div className="auth-layout__ring auth-layout__ring--1" />
          <div className="auth-layout__ring auth-layout__ring--2" />
          <div className="auth-layout__ring auth-layout__ring--3" />
        </div>
      </div>
    </div>

    {/* Права частина — форма */}
    <div className="auth-layout__right">
      <div className="auth-layout__tabs">
        <Link
          to="/login"
          className={`auth-layout__tab ${mode === 'login' ? 'auth-layout__tab--active' : ''}`}
        >
          Вхід
        </Link>
        <Link
          to="/register"
          className={`auth-layout__tab ${mode === 'register' ? 'auth-layout__tab--active' : ''}`}
        >
          Реєстрація
        </Link>
      </div>

      {children}
    </div>
  </div>
);

export default AuthLayout;