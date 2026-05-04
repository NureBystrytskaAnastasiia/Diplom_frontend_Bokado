import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import { registerUser } from '../../store/authSlice';
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
const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', username: '', birthDate: '',
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const localDate = new Date(formData.birthDate);
    const utcDate   = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
    const result = await dispatch(registerUser({
      email:     formData.email,
      password:  formData.password,
      username:  formData.username,
      birthDate: utcDate.toISOString(),
    }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/dashboard');
  };

  return (
    <AuthLayout mode="register">
      <motion.div
        className="auth-form-wrap"
        key="register"
        variants={formVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <div className="auth-form__head">
          <h1 className="auth-form__title">Створи акаунт</h1>
          <p className="auth-form__sub">Приєднуйся до Bokado — це безкоштовно</p>
        </div>

        {error && <div className="auth-form__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field">
            <label htmlFor="username" className="auth-field__label">Нікнейм</label>
            <div className="auth-field__wrap">
              <FiUser className="auth-field__icon" size={16} />
              <input
                id="username"
                name="username"
                type="text"
                className="auth-field__input"
                placeholder="твій_нікнейм"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={20}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-field__label">Email</label>
            <div className="auth-field__wrap">
              <FiMail className="auth-field__icon" size={16} />
              <input
                id="reg-email"
                name="email"
                type="email"
                className="auth-field__input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-field__label">Пароль</label>
            <div className="auth-field__wrap">
              <FiLock className="auth-field__icon" size={16} />
              <input
                id="reg-password"
                name="password"
                type="password"
                className="auth-field__input"
                placeholder="мінімум 6 символів"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="birthDate" className="auth-field__label">Дата народження</label>
            <div className="auth-field__wrap">
              <FiCalendar className="auth-field__icon" size={16} />
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                className="auth-field__input auth-field__input--date"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-form__submit btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Завантаження...' : (
              <><span>Зареєструватись</span><FiArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="auth-form__switch">
          Вже маєш акаунт?{' '}
          <Link to="/login" className="auth-form__switch-link">
            Увійти
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
};

export default RegisterPage;