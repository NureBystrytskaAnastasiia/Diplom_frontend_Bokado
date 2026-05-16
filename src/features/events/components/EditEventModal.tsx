import React, { useState } from 'react';
import {
  FiX, FiCalendar, FiMapPin, FiAlignLeft, FiType, FiSave,
} from 'react-icons/fi';
import { useAppDispatch } from '../../../shared/hooks/useAuth';
import { updateExistingEvent } from '../store/eventSlice';
import RichTextEditor from './RichTextEditor';
import type { Event } from '../types/event';

interface Props {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
}

const EditEventModal: React.FC<Props> = ({ event, onClose, onSuccess }) => {
  const dispatch = useAppDispatch();

  const [title,       setTitle] = useState(event.title);
  const [description, setDesc]  = useState(event.description ?? '');
  // datetime-local очікує формат YYYY-MM-DDTHH:mm
  const [date, setDate] = useState(
    new Date(event.date).toISOString().slice(0, 16)
  );
  const [city,    setCity]    = useState(event.city ?? '');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    // відправляємо тільки змінені поля
    const data: any = {};
    if (title.trim() !== event.title) data.title = title.trim();
    if (description !== (event.description ?? '')) data.description = description;
    const isoDate = new Date(date).toISOString();
    if (isoDate !== new Date(event.date).toISOString()) data.date = isoDate;
    if (city.trim() !== (event.city ?? '')) data.city = city.trim();

    if (Object.keys(data).length === 0) {
      onClose();
      return;
    }

    try {
      const res = await dispatch(updateExistingEvent({ eventId: event.eventId, data }));
      if (updateExistingEvent.fulfilled.match(res)) {
        onSuccess();
      } else {
        setError((res.payload as string) || 'Не вдалося оновити');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ev-modal__overlay" onClick={onClose}>
      <div className="ev-modal ev-modal--edit" onClick={(e) => e.stopPropagation()}>

        <div className="ev-modal__header">
          <h2 className="ev-modal__title">Редагувати подію</h2>
          <button className="ev-modal__close" onClick={onClose}><FiX size={18} /></button>
        </div>

        {error && (
          <div className="ev__form-error">{error}</div>
        )}

        <form className="ev__form ev__form--modal" onSubmit={handleSubmit}>

          <div className="ev__field">
            <label className="ev__label"><FiType size={14} /> Назва</label>
            <input
              className="ev__input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </div>

          <div className="ev__field">
            <label className="ev__label"><FiAlignLeft size={14} /> Опис</label>
            <RichTextEditor value={description} onChange={setDesc} />
          </div>

          <div className="ev__form-row">
            <div className="ev__field">
              <label className="ev__label"><FiCalendar size={14} /> Дата та час</label>
              <input
                type="datetime-local"
                className="ev__input"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
              />
            </div>
            <div className="ev__field">
              <label className="ev__label"><FiMapPin size={14} /> Місто</label>
              <input
                className="ev__input"
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>
          </div>

          <p className="ev__hint ev__hint--info">
            ℹ️ Максимальну кількість учасників змінити неможливо
          </p>

          <div className="ev__form-actions">
            <button type="button" className="ev__cancel-btn" onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className="ev__submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="ev__btn-spinner" />
                  Збереження...
                </>
              ) : (
                <>
                  <FiSave size={14} /> Зберегти зміни
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
