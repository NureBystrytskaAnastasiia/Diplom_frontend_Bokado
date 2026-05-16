import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiCalendar, FiMapPin, FiUsers,
  FiAlignLeft, FiType, FiInfo, FiSmile,
} from 'react-icons/fi';
import { useAppDispatch } from '../../../shared/hooks/useAuth';
import { createNewEvent } from '../store/eventSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import RichTextEditor from '../components/RichTextEditor';
import '../styles/Events.css';

const CreateEventPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [title,       setTitle]    = useState('');
  const [description, setDesc]     = useState('');
  const [date,        setDate]     = useState('');
  const [city,        setCity]     = useState('');
  const [maximum,     setMaximum]  = useState<number>(10);
  const [loading,     setLoading]  = useState(false);
  const [error,       setError]    = useState<string | null>(null);

  const valid =
    title.trim().length > 0 &&
    date.length > 0 &&
    maximum >= 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(createNewEvent({
        eventDto: {
          title:       title.trim(),
          description: description || undefined,
          date:        new Date(date).toISOString(),
          city:        city.trim() || undefined,
          maximum,
        },
      }));
      if (createNewEvent.fulfilled.match(result)) {
        navigate('/events');
      } else {
        setError((result.payload as string) || 'Не вдалося створити подію');
      }
    } finally {
      setLoading(false);
    }
  };

  // Мінімальна дата = сьогодні
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  const minDate = now.toISOString().slice(0, 16);

  return (
    <AppLayout>
      <div className="ev">
        <div className="ev__create-wrap">

          <header className="ev__create-head">
            <button className="ev__back-btn" onClick={() => navigate('/events')} type="button">
              <FiArrowLeft size={18} />
            </button>
            <div>
              <h1 className="ev__title">Нова подія</h1>
              <p className="ev__subtitle">Заплануй захід для спільноти</p>
            </div>
          </header>

          {error && (
            <div className="ev__form-error">
              <FiInfo size={14} /> {error}
            </div>
          )}

          <form className="ev__form" onSubmit={handleSubmit}>

            <div className="ev__field">
              <label className="ev__label"><FiType size={14} /> Назва події <span className="ev__required">*</span></label>
              <input
                className="ev__input"
                placeholder="Наприклад: Вечір настільних ігор"
                value={title}
                onChange={e => setTitle(e.target.value)}
                maxLength={120}
                required
              />
              <span className="ev__hint">{title.length} / 120</span>
            </div>

            <div className="ev__field">
              <label className="ev__label"><FiAlignLeft size={14} /> Опис</label>
              <RichTextEditor value={description} onChange={setDesc} />
            </div>

            <div className="ev__form-row">
              <div className="ev__field">
                <label className="ev__label"><FiCalendar size={14} /> Дата та час <span className="ev__required">*</span></label>
                <input
                  type="datetime-local"
                  className="ev__input"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={minDate}
                  required
                />
              </div>

              <div className="ev__field">
                <label className="ev__label"><FiMapPin size={14} /> Місто</label>
                <input
                  className="ev__input"
                  placeholder="Харків"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="ev__field">
              <label className="ev__label"><FiUsers size={14} /> Максимум учасників <span className="ev__required">*</span></label>
              <div className="ev__counter">
                <button type="button" className="ev__counter-btn" onClick={() => setMaximum(m => Math.max(2, m - 1))}>−</button>
                <input
                  type="number"
                  className="ev__counter-val"
                  value={maximum}
                  onChange={e => setMaximum(Math.max(2, Math.min(1000, Number(e.target.value))))}
                  min={2}
                  max={1000}
                />
                <button type="button" className="ev__counter-btn" onClick={() => setMaximum(m => Math.min(1000, m + 1))}>+</button>
                <span className="ev__counter-hint">мін. 2 учасники</span>
              </div>
            </div>

            <div className="ev__form-actions">
              <button type="button" className="ev__cancel-btn" onClick={() => navigate('/events')}>
                Скасувати
              </button>
              <button type="submit" className="ev__submit-btn" disabled={!valid || loading}>
                {loading ? (
                  <>
                    <span className="ev__btn-spinner" />
                    Створення...
                  </>
                ) : (
                  <>
                    <FiSmile size={15} /> Створити подію
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateEventPage;
