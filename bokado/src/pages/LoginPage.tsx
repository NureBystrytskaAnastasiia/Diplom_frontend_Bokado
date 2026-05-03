import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { loginUser } from '../store/slices/authSlice';
import type { AuthResponse } from '../types/auth';
import '../styles/Login.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === 'fulfilled' && result.payload) {
      const payload = result.payload as AuthResponse;
      const user = payload.user;
      navigate(user.isAdmin ? '/admin' : '/dashboard');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <h2 className="login-title">Вхід у систему</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">Пароль:</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Завантаження...' : 'Увійти'}
          </button>
        </form>
        <div className="login-links">
          <p>Не маєте акаунта? <a href="/register">Зареєструватися</a></p>
          <p>Забули пароль? <a href="/forgot-password">Відновити</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
