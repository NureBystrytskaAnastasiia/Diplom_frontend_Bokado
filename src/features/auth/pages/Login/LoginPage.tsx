import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import { loginUser } from '../../store/authSlice';
import type { AuthResponse } from '../../types/auth';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import '../../styles/AuthForm.css';

const formVariants = {
  initial: { opacity: 0, x: 40, filter: 'blur(4px)' },
  animate: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0, x: -40, filter: 'blur(4px)',
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] }
  },
};

const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled' && result.payload) {
      const user = (result.payload as AuthResponse).user;
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    }
  };

  return (
    <AuthLayout mode="login">
      <motion.div
        className="auth-form-wrap"
        key="login"
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="auth-form__head">
          <h1 className="auth-form__title">З поверненням</h1>
          <p className="auth-form__sub">Введи дані щоб увійти в акаунт</p>
        </div>

        {error && <div className="auth-form__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="email" className="auth-field__label">Email</label>
            <div className="auth-field__wrap">
              <FiMail className="auth-field__icon" size={16} />
              <input
                id="email"
                type="email"
                className="auth-field__input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-field__label-row">
              <label htmlFor="password" className="auth-field__label">Пароль</label>
              <Link to="/forgot-password" className="auth-field__forgot">Забули пароль?</Link>
            </div>
            <div className="auth-field__wrap">
              <FiLock className="auth-field__icon" size={16} />
              <input
                id="password"
                type="password"
                className="auth-field__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-form__submit btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : (
              <><span>Увійти</span><FiArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="auth-form__switch">
          Немає акаунту?{' '}
          <Link to="/register" className="auth-form__switch-link">
            Зареєструватись
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default LoginPage;