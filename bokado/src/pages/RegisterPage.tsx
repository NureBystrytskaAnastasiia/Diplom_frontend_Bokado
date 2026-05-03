import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAuth';
import { registerUser } from '../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    birthDate: '',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const localDate = new Date(formData.birthDate); 
    const utcDate = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000); 
    const birthDateIso = utcDate.toISOString(); 

    const dto = {
      email: formData.email,
      password: formData.password,
      username: formData.username,
      birthDate: birthDateIso, 
    };

    const result = await dispatch(registerUser(dto));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
  <div className="register-container">
    <div className="register-card">
      <h2 className="register-title">Реєстрація</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label className="form-label">Ім'я:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-input"
            required
            minLength={3}
            maxLength={20}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Пошта:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            required
            minLength={6}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Дата народження:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Зареєструватися'}
        </button>
      </form>
      
      <p className="login-link">
        AВже маєте акаут? <a href="/login">Вхід</a>
      </p>
    </div>
  </div>
);
};

export default RegisterPage;
