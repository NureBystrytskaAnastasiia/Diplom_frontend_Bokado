import React, { useState } from 'react';
import { resetPassword } from '../../api/auth';
import '../../styles/Register.css';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!email.trim()) {
      setError('Поле електронної пошти не може бути пустим.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email);
      setMessage('Посилання для скидання надіслано на вашу електронну адресу.');
    } catch (err: any) {
      if (err.response?.data?.errors?.email) {
        setError(err.response.data.errors.email[0]);
      } else if (err.response?.data?.title) {
        setError(err.response.data.title);
      } else {
        setError('Не вдалося скинути пароль. Спробуйте пізніше.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-modal">
      <div className="forgot-password-container">
        <h2>Відновлення паролю</h2>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Пошта:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Відправка...
              </>
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;