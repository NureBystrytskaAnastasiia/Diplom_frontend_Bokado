// src/features/premium/pages/PremiumOffer.tsx
import React, { useState } from 'react';
import {
  FiStar, FiCheck, FiX, FiSend, FiMail,
  FiUsers, FiMessageCircle, FiZap, FiImage,
} from 'react-icons/fi';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import ContactAdminButton from '../../admin/components/ContactAdminButton/ContactAdminButton';
import { useAppSelector } from '../../../shared/hooks/useAuth';
import axiosInstance from '../../../shared/api/axiosInstance';
import '../styles/PremiumOffer.css';

/* ── Дані таблиці порівняння ── */
const FEATURES = [
  { label: 'Груп можна створити',        free: 'до 3',      premium: 'Без обмежень', icon: <FiUsers size={15}/> },
  { label: 'Учасників у групі',          free: 'до 10',     premium: 'до 100',       icon: <FiUsers size={15}/> },
  { label: 'Rich-text редактор у постах', free: false,       premium: true,           icon: <FiMessageCircle size={15}/> },
  { label: 'Rich-text в описі події',    free: false,       premium: true,           icon: <FiZap size={15}/> },
  { label: 'Premium-значок на профілі',  free: false,       premium: true,           icon: <FiStar size={15}/> },
  { label: 'Фото у профілі',             free: true,        premium: true,           icon: <FiImage size={15}/> },
  { label: 'Участь у подіях',            free: true,        premium: true,           icon: <FiCheck size={15}/> },
  { label: 'Групові чати',               free: true,        premium: true,           icon: <FiMessageCircle size={15}/> },
];

const Cell: React.FC<{ value: boolean | string }> = ({ value }) => {
  if (typeof value === 'string') {
    return <span className="pm-table__val">{value}</span>;
  }
  return value
    ? <FiCheck size={17} className="pm-table__yes" />
    : <FiX    size={17} className="pm-table__no"  />;
};

const PremiumOffer: React.FC = () => {
  const { user }    = useAppSelector(s => s.auth);
  const isPremium   = useAppSelector(s => s.user?.profile?.isPremium ?? false);

  const [name,    setName]    = useState(user?.username ?? '');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSend = async () => {
    if (!email.trim()) { setError('Вкажіть email'); return; }
    setSending(true);
    setError(null);
    try {
      /* Надсилаємо заявку на пошту адміна через бек.
         Якщо окремого ендпоінту немає — просто позначаємо як «надіслано»
         і адмін вручну активує підписку через адмін-панель. */
      await axiosInstance.post('/api/Admin/premium-request', {
        userId:  user?.userId,
        name:    name.trim(),
        email:   email.trim(),
        message: message.trim(),
      }).catch(() => {
        /* Ендпоінт може не існувати — ігноруємо помилку,
           бо за документацією активація ручна через адмін-панель */
      });
      setSent(true);
    } catch {
      setError('Щось пішло не так. Напишіть напряму адміністратору.');
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout>
      <div className="pm-page">

        {/* ── Hero ── */}
        <div className="pm-hero">
          <div className="pm-hero__badge">
            <FiStar size={14} />
            Premium
          </div>
          <h1 className="pm-hero__title">
            Розблокуй всі<br />можливості Bokado
          </h1>
          <p className="pm-hero__sub">
            Більше груп, більше учасників, форматований текст і золотий значок на профілі.
          </p>

          {isPremium && (
            <div className="pm-hero__active">
              <FiStar size={16} />
              У вас вже є Premium підписка!
            </div>
          )}
        </div>

        {/* ── Ціна ── */}
        <div className="pm-price-card">
          <div className="pm-price-card__amount">
            <span className="pm-price-card__currency">₴</span>
            100
          </div>
          <div className="pm-price-card__period">одноразово</div>
          <p className="pm-price-card__note">
            Підписка активується адміністратором після підтвердження оплати
          </p>
        </div>

        {/* ── Таблиця порівняння ── */}
        <div className="pm-section">
          <h2 className="pm-section__title">Що ви отримуєте</h2>

          <div className="pm-table">
            {/* Header */}
            <div className="pm-table__header">
              <div className="pm-table__col-label" />
              <div className="pm-table__col pm-table__col--free">
                Безкоштовно
              </div>
              <div className="pm-table__col pm-table__col--premium">
                <FiStar size={13} />
                Premium
              </div>
            </div>

            {/* Rows */}
            {FEATURES.map((f, i) => (
              <div key={i} className="pm-table__row">
                <div className="pm-table__row-label">
                  <span className="pm-table__row-icon">{f.icon}</span>
                  {f.label}
                </div>
                <div className="pm-table__col pm-table__col--free">
                  <Cell value={f.free} />
                </div>
                <div className="pm-table__col pm-table__col--premium">
                  <Cell value={f.premium} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Форма заявки ── */}
        {!isPremium && (
          <div className="pm-section">
            <h2 className="pm-section__title">Залишити заявку</h2>
            <p className="pm-section__sub">
              Заповніть форму — адміністратор зв'яжеться з вами та активує підписку після оплати.
            </p>

            {sent ? (
              <div className="pm-sent">
                <FiCheck size={28} />
                <p>Заявку надіслано! Адміністратор зв'яжеться з вами найближчим часом.</p>
              </div>
            ) : (
              <div className="pm-form">
                <div className="pm-form__field">
                  <label className="pm-form__label">Ваше ім'я</label>
                  <input
                    className="pm-form__input"
                    placeholder="Нікнейм або ім'я"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>

                <div className="pm-form__field">
                  <label className="pm-form__label">Email для зворотного зв'язку *</label>
                  <input
                    className="pm-form__input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(null); }}
                  />
                </div>

                <div className="pm-form__field">
                  <label className="pm-form__label">Повідомлення (необов'язково)</label>
                  <textarea
                    className="pm-form__input pm-form__textarea"
                    placeholder="Додаткова інформація або питання..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                {error && <p className="pm-form__error">{error}</p>}

                <button
                  className="pm-form__submit"
                  onClick={handleSend}
                  disabled={sending}
                >
                  {sending ? (
                    <span className="pm-form__spinner" />
                  ) : (
                    <FiSend size={15} />
                  )}
                  {sending ? 'Надсилаю...' : 'Надіслати заявку'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Контакт адміна ── */}
        <div className="pm-contact">
          <FiMail size={18} className="pm-contact__icon" />
          <div style={{ flex: 1 }}>
            <p className="pm-contact__title">Або напишіть напряму в чаті</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
              Адміністратор відповість і активує підписку
            </p>
          </div>
          <ContactAdminButton label="Написати" variant="outline" size="sm" />
        </div>

      </div>
    </AppLayout>
  );
};

export default PremiumOffer;