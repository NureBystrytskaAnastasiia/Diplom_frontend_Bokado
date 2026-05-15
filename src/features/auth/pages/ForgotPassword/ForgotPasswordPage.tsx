import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { resetPassword } from '../../api/auth';
import AuthLayout from '../../components/AuthLayout/AuthLayout';
import '../../styles/AuthForm.css';

const formVariants = {
  initial: { opacity: 0, x: 60, filter: 'blur(4px)' },
  animate: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0, x: -40, filter: 'blur(4px)',
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] },
  },
};

const successVariants = {
  initial: { opacity: 0, scale: 0.88, filter: 'blur(4px)' },
  animate: {
    opacity: 1, scale: 1, filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [sent, setSent]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Введи електронну адресу.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.title) {
        setError(err.response.data.title);
      } else {
        setError('Не вдалося надіслати лист. Спробуй пізніше.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
      <AnimatePresence mode="wait">

        {/* Стан успіху */}
        {sent ? (
          <motion.div
            key="success"
            className="auth-form-wrap"
            variants={successVariants}
            initial="initial"
            animate="animate"
          >
            <div className="forgot-success">
              <div className="forgot-success__icon">
                <FiCheckCircle size={48} />
              </div>
              <h1 className="auth-form__title">Лист надіслано! 📬</h1>
              <p className="auth-form__sub">
                Ми надіслали посилання для відновлення паролю на{' '}
                <strong>{email}</strong>. Перевір папку "Вхідні" або "Спам".
              </p>
              <button
                className="btn btn-primary auth-form__submit"
                onClick={() => { setSent(false); setEmail(''); }}
              >
                Надіслати ще раз
              </button>
              <Link to="/login" className="auth-form__switch-link forgot-back">
                <FiArrowLeft size={14} />
                Повернутись до входу
              </Link>
            </div>
          </motion.div>

        ) : (

          /* Стан форми */
          <motion.div
            key="form"
            className="auth-form-wrap"
            variants={formVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="auth-form__head">
              <h1 className="auth-form__title">Забули пароль? 🔑</h1>
              <p className="auth-form__sub">
                Введи свій email — надішлемо посилання для відновлення.
              </p>
            </div>

            {error && <div className="auth-form__error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form" noValidate>
              <div className="auth-field">
                <label htmlFor="forgot-email" className="auth-field__label">Email</label>
                <div className="auth-field__wrap">
                  <FiMail className="auth-field__icon" size={16} />
                  <input
                    id="forgot-email"
                    type="email"
                    className="auth-field__input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                className="auth-form__submit btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Надсилаємо...' : (
                  <><span>Надіслати посилання</span><FiArrowRight size={16} /></>
                )}
              </button>
            </form>

            <Link to="/login" className="auth-form__switch forgot-back">
              <FiArrowLeft size={14} />
              Повернутись до входу
            </Link>
          </motion.div>

        )}
      </AnimatePresence>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;