import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';
import { STATS } from '../../constants/landingData';
import { fetchEvents } from '../../../events/api/events';
import type { Event } from '../../../events/types/event';
import AuthPromptModal from '../../../../shared/components/AuthPromptModal/AuthPromptModal';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then((data) => setEvents(data.slice(0, 3)))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' });

  return (
    <section className="hero">
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />
      <div className="hero__orb hero__orb--3" aria-hidden="true" />

      <div className="container hero__inner">
        {/* Лівий блок */}
        <div className="hero__content">
          <motion.div
            className="hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <span className="hero__badge-dot" aria-hidden="true" />
            Перша українська платформа знайомств
          </motion.div>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            Знайди <em>своїх</em><br />людей з<br />
            <span className="hero__title-brand">Bokado</span>
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            Спілкуйся, вступай до груп за інтересами,<br />
            виконуй челенджі та зустрічайся на подіях.
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Спробувати безкоштовно <FiArrowRight />
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/login')}>
              Увійти
            </button>
          </motion.div>

          <motion.div
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.8 }}
          >
            {STATS.map((s) => (
              <div className="hero__stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Правий блок — реальні події */}
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, x: 60, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="hero__phone">
            <div className="mock-topbar">
              <div className="mock-logo">B</div>
              <div className="mock-topbar__title">Найближчі події</div>
              <div className="mock-notif" />
            </div>

            {loading ? (
              <>
                <div className="mock-skeleton" />
                <div className="mock-skeleton" />
                <div className="mock-skeleton" />
              </>
            ) : events.length > 0 ? (
              events.map((event) => (
                <div
                  key={event.eventId}
                  className="mock-event"
                  onClick={() => setModalOpen(true)}
                >
                  <div className="mock-event__date">
                    <FiCalendar size={11} />
                    {formatDate(event.date)}
                  </div>
                  <div className="mock-event__info">
                    <div className="mock-event__name">{event.title}</div>
                    <div className="mock-event__meta">
                      {event.city && <span><FiMapPin size={10} />{event.city}</span>}
                      {event.participants && (
                        <span><FiUsers size={10} />{event.participants.length} / {event.maximum}</span>
                      )}
                    </div>
                  </div>
                  <div className="mock-event__btn">Детальніше</div>
                </div>
              ))
            ) : (
              <>
                <div className="mock-event" onClick={() => setModalOpen(true)}>
                  <div className="mock-event__date"><FiCalendar size={11} />Незабаром</div>
                  <div className="mock-event__info">
                    <div className="mock-event__name">Open Mic Night</div>
                    <div className="mock-event__meta"><span><FiMapPin size={10} />Київ</span></div>
                  </div>
                  <div className="mock-event__btn">Детальніше</div>
                </div>
                <div className="mock-event" onClick={() => setModalOpen(true)}>
                  <div className="mock-event__date"><FiCalendar size={11} />Незабаром</div>
                  <div className="mock-event__info">
                    <div className="mock-event__name">Ранковий забіг</div>
                    <div className="mock-event__meta"><span><FiMapPin size={10} />Гідропарк</span></div>
                  </div>
                  <div className="mock-event__btn">Детальніше</div>
                </div>
              </>
            )}

            <button className="mock-see-all" onClick={() => setModalOpen(true)}>
              Всі події →
            </button>
          </div>
        </motion.div>
      </div>

      <div className="hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7F4FD" />
        </svg>
      </div>

      <AuthPromptModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default HeroSection;