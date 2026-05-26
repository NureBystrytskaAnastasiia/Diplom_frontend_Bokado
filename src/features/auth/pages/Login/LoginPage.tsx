import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
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

const validateEmail = (v: string) => {
  if (!v) return 'Введи email';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Невірний формат email';
  return '';
};
const validatePassword = (v: string) => {
  if (!v) return 'Введи пароль';
  if (v.length < 6) return 'Мінімум 6 символів';
  return '';
};

const LoginPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched]   = useState({ email: false, password: false });
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const emailErr    = touched.email    ? validateEmail(email)       : '';
  const passwordErr = touched.password ? validatePassword(password) : '';

  const handleBlur = (field: 'email' | 'password') =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (validateEmail(email) || validatePassword(password)) return;
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled' && result.payload) {
      const user = (result.payload as AuthResponse).user;
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    }
  };

  const fieldClass = (err: string, val: string, isTouched: boolean) => {
    const base = 'auth-field__input';
    if (!isTouched || !val) return base;
    return err ? `${base} auth-field__input--error` : `${base} auth-field__input--valid`;
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
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="email" className="auth-field__label">Email</label>
            <div className="auth-field__wrap">
              <FiMail className="auth-field__icon" size={16} />
              <input
                id="email"
                type="email"
                className={fieldClass(emailErr, email, touched.email)}
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                required
                autoComplete="email"
              />
              {touched.email && !emailErr && email && (
                <span className="auth-field__check" aria-hidden="true">✓</span>
              )}
            </div>
            {emailErr && <p className="auth-field__hint auth-field__hint--error">{emailErr}</p>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-field__label-row">
              <label htmlFor="password" className="auth-field__label">Пароль</label>
              <Link to="/forgot-password" className="auth-field__forgot">Забули пароль?</Link>
            </div>
            <div className="auth-field__wrap">
              <FiLock className="auth-field__icon" size={16} />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                className={fieldClass(passwordErr, password, touched.password)}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-field__eye"
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
                aria-label={showPass ? 'Сховати пароль' : 'Показати пароль'}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {passwordErr && <p className="auth-field__hint auth-field__hint--error">{passwordErr}</p>}
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