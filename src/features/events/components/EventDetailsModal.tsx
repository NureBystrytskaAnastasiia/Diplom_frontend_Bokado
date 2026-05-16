import React from 'react';
import {
  FiX, FiCalendar, FiMapPin, FiUsers, FiUser,
  FiClock, FiCheckCircle, FiLogOut, FiEdit2,
} from 'react-icons/fi';
import type { Event } from '../types/event';

interface Props {
  event: Event;
  currentUserId?: number;
  joined: boolean;
  onJoin: () => void;
  onQuit: () => void;
  onEdit: () => void;
  onClose: () => void;
}

const EventDetailsModal: React.FC<Props> = ({
  event, currentUserId, joined, onJoin, onQuit, onEdit, onClose,
}) => {
  const isOwner = event.creatorId === currentUserId;
  const count   = event.participants?.length ?? 0;
  const isFull  = count >= event.maximum;
  const isPast  = new Date(event.date) < new Date();
  const pct     = Math.min((count / event.maximum) * 100, 100);

  const dateObj  = new Date(event.date);
  const fullDate = dateObj.toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="ev-modal__overlay" onClick={onClose}>
      <div className="ev-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ev-modal__header">
          <div className="ev-modal__head-titles">
            <div className="ev-modal__badges">
              {isOwner && <span className="ev__badge ev__badge--owner"><FiUser size={10} /> Ваша</span>}
              {joined && !isOwner && <span className="ev__badge ev__badge--joined"><FiCheckCircle size={10} /> Учасник</span>}
              {isPast && <span className="ev__badge ev__badge--past">Минула</span>}
            </div>
            <h2 className="ev-modal__title">{event.title}</h2>
          </div>
          <button className="ev-modal__close" onClick={onClose}><FiX size={18} /></button>
        </div>

        {/* Info grid */}
        <div className="ev-modal__info">
          <div className="ev-modal__info-item">
            <span className="ev-modal__info-icon"><FiCalendar size={14} /></span>
            <div>
              <span className="ev-modal__info-lbl">Дата та час</span>
              <span className="ev-modal__info-val">{fullDate}</span>
            </div>
          </div>
          {event.city && (
            <div className="ev-modal__info-item">
              <span className="ev-modal__info-icon"><FiMapPin size={14} /></span>
              <div>
                <span className="ev-modal__info-lbl">Місто</span>
                <span className="ev-modal__info-val">{event.city}</span>
              </div>
            </div>
          )}
          <div className="ev-modal__info-item">
            <span className="ev-modal__info-icon"><FiUser size={14} /></span>
            <div>
              <span className="ev-modal__info-lbl">Організатор</span>
              <span className="ev-modal__info-val">{event.creator?.username ?? `#${event.creatorId}`}</span>
            </div>
          </div>
          <div className="ev-modal__info-item">
            <span className="ev-modal__info-icon"><FiClock size={14} /></span>
            <div>
              <span className="ev-modal__info-lbl">Створено</span>
              <span className="ev-modal__info-val">
                {new Date(event.createdAt).toLocaleDateString('uk-UA')}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <div className="ev-modal__section">
            <h3 className="ev-modal__section-title">Опис</h3>
            <div
              className="ev-modal__desc"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        )}

        {/* Participants */}
        <div className="ev-modal__section">
          <h3 className="ev-modal__section-title">
            <FiUsers size={14} /> Учасники ({count} / {event.maximum})
          </h3>
          <div className="ev-modal__progress">
            <div className="ev-modal__progress-fill" style={{ width: `${pct}%` }} />
          </div>

          {event.participants && event.participants.length > 0 && (
            <div className="ev-modal__participants">
              {event.participants.slice(0, 8).map(p => (
                <div key={p.userId} className="ev-modal__participant" title={p.user?.username}>
                  {(p.user?.username ?? '?').charAt(0).toUpperCase()}
                </div>
              ))}
              {event.participants.length > 8 && (
                <div className="ev-modal__participant ev-modal__participant--more">
                  +{event.participants.length - 8}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ev-modal__footer">
          {isOwner && !isPast && (
            <button className="ev-modal__btn ev-modal__btn--edit" onClick={onEdit}>
              <FiEdit2 size={14} /> Редагувати
            </button>
          )}
          {!isOwner && !isPast && (
            joined ? (
              <button className="ev-modal__btn ev-modal__btn--quit" onClick={onQuit}>
                <FiLogOut size={14} /> Покинути подію
              </button>
            ) : isFull ? (
              <button className="ev-modal__btn ev-modal__btn--disabled" disabled>
                Місць немає
              </button>
            ) : (
              <button className="ev-modal__btn ev-modal__btn--join" onClick={onJoin}>
                <FiCheckCircle size={14} /> Приєднатись
              </button>
            )
          )}
          <button className="ev-modal__btn ev-modal__btn--cancel" onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
