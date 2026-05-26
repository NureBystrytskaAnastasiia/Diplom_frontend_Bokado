import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiCalendar, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
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

/* ── Валідатори ── */
const validateUsername = (v: string) => {
  if (!v) return "Введи нікнейм";
  if (v.length < 3) return "Мінімум 3 символи";
  if (v.length > 20) return "Максимум 20 символів";
  if (!/^[a-zA-Zа-яА-ЯіІїЇєЄёЁ0-9_]+$/.test(v)) return "Лише літери, цифри та _";
  return "";
};
const validateEmail = (v: string) => {
  if (!v) return "Введи email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Невірний формат email";
  return "";
};
const validatePassword = (v: string) => {
  if (!v) return "Введи пароль";
  if (v.length < 6) return "Мінімум 6 символів";
  return "";
};
const validateBirthDate = (v: string) => {
  if (!v) return "Вкажи дату народження";
  const d = new Date(v);
  const age = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  if (age < 13) return "Потрібно мінімум 13 років";
  if (age > 120) return "Перевір дату";
  return "";
};

/* ── Сила пароля ── */
const getPasswordStrength = (v: string): { score: number; label: string; color: string } => {
  if (!v) return { score: 0, label: '', color: '' };
  let score = 0;
  if (v.length >= 6) score++;
  if (v.length >= 10) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  if (score <= 1) return { score, label: 'Слабкий',   color: '#EF4444' };
  if (score <= 2) return { score, label: 'Середній',  color: '#F59E0B' };
  if (score <= 3) return { score, label: 'Хороший',   color: '#10B981' };
  return               { score, label: 'Відмінний',  color: '#7C4DFF' };
};

type Fields = 'username' | 'email' | 'password' | 'birthDate';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '', username: '', birthDate: '' });
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched]   = useState<Record<Fields, boolean>>({
    username: false, email: false, password: false, birthDate: false,
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const errors = {
    username:  validateUsername(formData.username),
    email:     validateEmail(formData.email),
    password:  validatePassword(formData.password),
    birthDate: validateBirthDate(formData.birthDate),
  };
  const strength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleBlur = (field: Fields) =>
    setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true, birthDate: true });
    if (Object.values(errors).some(Boolean)) return;
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

  const fieldClass = (field: Fields) => {
    const base = 'auth-field__input';
    if (!touched[field] || !formData[field]) return base;
    return errors[field]
      ? `${base} auth-field__input--error`
      : `${base} auth-field__input--valid`;
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

          {/* Нікнейм */}
          <div className="auth-field">
            <label htmlFor="username" className="auth-field__label">Нікнейм</label>
            <div className="auth-field__wrap">
              <FiUser className="auth-field__icon" size={16} />
              <input
                id="username" name="username" type="text"
                className={fieldClass('username')}
                placeholder="твій_нікнейм"
                value={formData.username}
                onChange={handleChange}
                onBlur={() => handleBlur('username')}
                required minLength={3} maxLength={20}
                autoComplete="username"
              />
              {touched.username && !errors.username && formData.username && (
                <span className="auth-field__check" aria-hidden="true">✓</span>
              )}
            </div>
            {touched.username && errors.username && (
              <p className="auth-field__hint auth-field__hint--error">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-field__label">Email</label>
            <div className="auth-field__wrap">
              <FiMail className="auth-field__icon" size={16} />
              <input
                id="reg-email" name="email" type="email"
                className={fieldClass('email')}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                required autoComplete="email"
              />
              {touched.email && !errors.email && formData.email && (
                <span className="auth-field__check" aria-hidden="true">✓</span>
              )}
            </div>
            {touched.email && errors.email && (
              <p className="auth-field__hint auth-field__hint--error">{errors.email}</p>
            )}
          </div>

          {/* Пароль */}
          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-field__label">Пароль</label>
            <div className="auth-field__wrap">
              <FiLock className="auth-field__icon" size={16} />
              <input
                id="reg-password" name="password"
                type={showPass ? 'text' : 'password'}
                className={fieldClass('password')}
                placeholder="мінімум 6 символів"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                required minLength={6}
                autoComplete="new-password"
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
            {touched.password && errors.password && (
              <p className="auth-field__hint auth-field__hint--error">{errors.password}</p>
            )}
            {/* Сила пароля */}
            {formData.password && (
              <div className="auth-field__strength">
                <div className="auth-field__strength-bars">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="auth-field__strength-bar"
                      style={{
                        background: i <= strength.score ? strength.color : 'var(--clr-border, #E4DCF5)',
                        transition: 'background 0.25s',
                      }}
                    />
                  ))}
                </div>
                <span className="auth-field__strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Дата народження */}
          <div className="auth-field">
            <label htmlFor="birthDate" className="auth-field__label">Дата народження</label>
            <div className="auth-field__wrap">
              <FiCalendar className="auth-field__icon" size={16} />
              <input
                id="birthDate" name="birthDate" type="date"
                className={`${fieldClass('birthDate')} auth-field__input--date`}
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={() => handleBlur('birthDate')}
                required
              />
            </div>
            {touched.birthDate && errors.birthDate && (
              <p className="auth-field__hint auth-field__hint--error">{errors.birthDate}</p>
            )}
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