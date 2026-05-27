// src/features/premium/pages/PremiumOffer.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FiStar, FiCheck, FiX, FiMail,
  FiUsers, FiMessageCircle, FiZap, FiImage, FiShield, FiCreditCard,
} from 'react-icons/fi';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import ContactAdminButton from '../../admin/components/ContactAdminButton/ContactAdminButton';
import { useAppSelector } from '../../../shared/hooks/useAuth';
import axiosInstance from '../../../shared/api/axiosInstance';
import '../styles/PremiumOffer.css';

const FEATURES = [
  { label: 'Груп можна створити',         free: 'до 3',  premium: 'Без обмежень', icon: <FiUsers size={15}/> },
  { label: 'Учасників у групі',           free: 'до 10', premium: 'до 100',       icon: <FiUsers size={15}/> },
  { label: 'Rich-text редактор у постах', free: false,   premium: true,           icon: <FiMessageCircle size={15}/> },
  { label: 'Rich-text в описі події',     free: false,   premium: true,           icon: <FiZap size={15}/> },
  { label: 'Premium-значок на профілі',   free: false,   premium: true,           icon: <FiStar size={15}/> },
  { label: 'Фото у профілі',              free: true,    premium: true,           icon: <FiImage size={15}/> },
  { label: 'Участь у подіях',             free: true,    premium: true,           icon: <FiCheck size={15}/> },
  { label: 'Групові чати',                free: true,    premium: true,           icon: <FiMessageCircle size={15}/> },
];

const Cell: React.FC<{ value: boolean | string }> = ({ value }) => {
  if (typeof value === 'string') return <span className="pm-table__val">{value}</span>;
  return value
    ? <FiCheck size={17} className="pm-table__yes" />
    : <FiX    size={17} className="pm-table__no"  />;
};

const PremiumOffer: React.FC = () => {
  const { user }  = useAppSelector(s => s.auth);
  const isPremium = useAppSelector(s => s.user?.profile?.isPremium ?? false);

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);
  const [success,  setSuccess]  = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const dataRef = useRef<HTMLInputElement>(null);
  const signRef = useRef<HTMLInputElement>(null);

  // Перевіряємо чи повернулись після успішної оплати
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') setSuccess(true);
  }, []);

  const handlePay = async () => {
    if (!user?.userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post('/api/LiqPay/create-payment', {
        userId: user.userId,
      });
      const { data, signature } = res.data;

      // Вставляємо data і signature в форму і сабмітимо
      if (dataRef.current) dataRef.current.value = data;
      if (signRef.current) signRef.current.value = signature;
      formRef.current?.submit();
    } catch {
      setError('Помилка при створенні платежу. Спробуйте ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      {/* Прихована форма для LiqPay */}
      <form
        ref={formRef}
        method="POST"
        action="https://www.liqpay.ua/api/3/checkout"
        acceptCharset="utf-8"
        style={{ display: 'none' }}
      >
        <input ref={dataRef}  type="hidden" name="data"      />
        <input ref={signRef}  type="hidden" name="signature" />
      </form>

      <div className="pm-page">

        {/* Hero */}
        <div className="pm-hero">
          <div className="pm-hero__badge"><FiStar size={14} /> Premium</div>
          <h1 className="pm-hero__title">Розблокуй всі<br />можливості Bokado</h1>
          <p className="pm-hero__sub">
            Більше груп, більше учасників, форматований текст і золотий значок на профілі.
          </p>
          {isPremium && (
            <div className="pm-hero__active"><FiStar size={16} /> У вас вже є Premium підписка!</div>
          )}
        </div>

        {/* Ціна */}
        <div className="pm-price-card">
          <div className="pm-price-card__amount">
            <span className="pm-price-card__currency">₴</span>100
          </div>
          <div className="pm-price-card__period">одноразово</div>
          <p className="pm-price-card__note">
            Підписка активується автоматично після підтвердження оплати
          </p>
        </div>

        {/* Таблиця */}
        <div className="pm-section">
          <h2 className="pm-section__title">Що ви отримуєте</h2>
          <div className="pm-table">
            <div className="pm-table__header">
              <div className="pm-table__col-label" />
              <div className="pm-table__col pm-table__col--free">Безкоштовно</div>
              <div className="pm-table__col pm-table__col--premium"><FiStar size={13} /> Premium</div>
            </div>
            {FEATURES.map((f, i) => (
              <div key={i} className="pm-table__row">
                <div className="pm-table__row-label">
                  <span className="pm-table__row-icon">{f.icon}</span>{f.label}
                </div>
                <div className="pm-table__col pm-table__col--free"><Cell value={f.free} /></div>
                <div className="pm-table__col pm-table__col--premium"><Cell value={f.premium} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Оплата */}
        {!isPremium && (
          <div className="pm-section">
            <h2 className="pm-section__title">Оплатити</h2>

            {success ? (
              <div className="pm-sent">
                <FiCheck size={28} />
                <p>Оплату прийнято! Підписка активована автоматично. Перезайдіть в акаунт.</p>
              </div>
            ) : (
              <>
                {error && <p className="pm-form__error">{error}</p>}

                <button
                  className="pm-liqpay-btn"
                  onClick={handlePay}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="pm-form__spinner" />
                  ) : (
                    <FiCreditCard size={18} />
                  )}
                  {loading ? 'Завантаження...' : 'Оплатити ₴100 через LiqPay'}
                </button>

                <div className="pm-security">
                  <FiShield size={14} />
                  <span>Захищена оплата через LiqPay. Visa, Mastercard, Google Pay, Apple Pay.</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Контакт адміна */}
        <div className="pm-contact">
          <FiMail size={18} className="pm-contact__icon" />
          <div style={{ flex: 1 }}>
            <p className="pm-contact__title">Є питання?</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginTop: 4 }}>
              Напишіть адміністратору — він допоможе
            </p>
          </div>
          <ContactAdminButton label="Написати" variant="outline" size="sm" />
        </div>

      </div>
    </AppLayout>
  );
};

export default PremiumOffer;