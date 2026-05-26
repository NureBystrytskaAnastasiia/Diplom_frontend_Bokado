import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiArrowRight, FiMapPin, FiUsers, FiClock, FiPlus } from 'react-icons/fi';
import type { Event } from '../../events/types/event';

interface Props {
  events: Event[];
  userParticipation: Record<number, boolean>;
  loading: boolean;
  onJoin: (e: React.MouseEvent, eventId: number) => void;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const EventsCard: React.FC<Props> = ({ events, userParticipation, loading, onJoin }) => {
  const navigate = useNavigate();

  return (
    <section className="db__card db__card--events">
      <div className="db__card-head">
        <div className="db__card-title">
          <span className="db__card-icon db__card-icon--purple"><FiCalendar size={16} /></span>
          Найближчі події
        </div>
        <Link to="/events" className="db__see-all">
          Всі події <FiArrowRight size={13} />
        </Link>
      </div>

      <div className="db__events-list">
        {loading
          ? [1, 2, 3].map(i => <div key={i} className="db__event-skeleton" />)
          : events.length === 0
            ? (
              <div className="db__empty">
                <FiCalendar size={28} className="db__empty-icon" />
                <span>Немає найближчих подій</span>
                <Link to="/events/create" className="db__empty-btn"><FiPlus size={13} /> Створити</Link>
              </div>
            )
            : events.map(ev => {
              const joined = userParticipation[ev.eventId];
              const count  = ev.participants?.length ?? 0;
              return (
                <div key={ev.eventId} className="db__event" onClick={() => navigate('/events')}>
                  <div className="db__event-dot" />
                  <div className="db__event-body">
                    <div className="db__event-top">
                      <span className="db__event-title">{ev.title}</span>
                      <button
                        className={`db__event-btn ${joined ? 'db__event-btn--joined' : ''}`}
                        onClick={(e) => onJoin(e, ev.eventId)}
                      >
                        {joined ? 'Вийти' : 'Приєднатись'}
                      </button>
                    </div>
                    <div className="db__event-meta">
                      <span><FiClock size={11} /> {formatDate(ev.date)}</span>
                      {ev.city && <span><FiMapPin size={11} /> {ev.city}</span>}
                      <span><FiUsers size={11} /> {count}/{ev.maximum}</span>
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>

      <Link to="/events/create" className="db__add-btn">
        <FiPlus size={14} /> Нова подія
      </Link>
    </section>
  );
};

export default EventsCard;