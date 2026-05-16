import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar, FiMapPin, FiUsers, FiPlus, FiSearch,
  FiUser, FiClock, FiCheckCircle, FiX, FiAlertCircle,
  FiMoreVertical, FiEdit2, FiEye, FiLogOut, FiUserCheck,
  FiCalendar as FiCal,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import {
  loadEvents,
  joinExistingEvent,
  quitExistingEvent,
  initializeUserParticipation,
  clearEventError,
} from '../store/eventSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import EventDetailsModal from '../components/EventDetailsModal';
import EditEventModal from '../components/EditEventModal';
import type { Event } from '../types/event';
import '../styles/Events.css';

type FilterKey = 'all' | 'mine' | 'joined' | 'available';

const EventsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { events, loading, error, userParticipation } = useAppSelector(s => s.events);
  const { user } = useAppSelector(s => s.auth);

  const [toast, setToast]                 = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [processing, setProcessing]       = useState<Record<number, boolean>>({});
  const [filter, setFilter]               = useState<FilterKey>('all');
  const [search, setSearch]               = useState('');
  const [menuOpenId, setMenuOpenId]       = useState<number | null>(null);
  const [detailsEvent, setDetailsEvent]   = useState<Event | null>(null);
  const [editEvent, setEditEvent]         = useState<Event | null>(null);

  // ── Toast helper ──
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3800);
  };

  // ── Load ──
  const load = useCallback(async () => {
    const res = await dispatch(loadEvents());
    if (loadEvents.fulfilled.match(res) && user) {
      dispatch(initializeUserParticipation({ events: res.payload, currentUserId: user.userId }));
    }
  }, [dispatch, user]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearEventError());
    }
  }, [error, dispatch]);

  // Закриваємо меню при кліку по сторінці
  useEffect(() => {
    const onClick = () => setMenuOpenId(null);
    if (menuOpenId !== null) {
      window.addEventListener('click', onClick);
      return () => window.removeEventListener('click', onClick);
    }
  }, [menuOpenId]);

  // ── Actions ──
  const handleJoin = async (eventId: number) => {
    if (!user) { showToast('Спочатку увійдіть в акаунт', 'error'); return; }
    setProcessing(p => ({ ...p, [eventId]: true }));
    try {
      await dispatch(joinExistingEvent(eventId)).unwrap();
      showToast('Ви приєдналися до події 🎉', 'success');
    } catch (e: any) {
      showToast(e?.toString() || 'Помилка', 'error');
    } finally {
      setProcessing(p => ({ ...p, [eventId]: false }));
    }
  };

  const handleQuit = async (eventId: number) => {
    if (!window.confirm('Покинути цю подію?')) return;
    setProcessing(p => ({ ...p, [eventId]: true }));
    try {
      await dispatch(quitExistingEvent(eventId)).unwrap();
      showToast('Ви покинули подію', 'info');
    } catch (e: any) {
      showToast(e?.toString() || 'Помилка', 'error');
    } finally {
      setProcessing(p => ({ ...p, [eventId]: false }));
    }
  };

  // ── Filter + search ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events.filter(ev => {
      // filter
      if (filter === 'mine'      && ev.creatorId !== user?.userId)      return false;
      if (filter === 'joined'    && !userParticipation[ev.eventId])     return false;
      if (filter === 'available' && (ev.participants?.length ?? 0) >= ev.maximum) return false;
      // search
      if (q) {
        const txt = `${ev.title} ${ev.city ?? ''} ${ev.creator?.username ?? ''}`.toLowerCase();
        if (!txt.includes(q)) return false;
      }
      return true;
    });
  }, [events, filter, search, user, userParticipation]);

  const upcoming = filtered.filter(e => new Date(e.date) >= new Date())
                           .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past     = filtered.filter(e => new Date(e.date) <  new Date())
                           .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Stats
  const myCount     = events.filter(e => e.creatorId === user?.userId).length;
  const joinedCount = events.filter(e => userParticipation[e.eventId] && e.creatorId !== user?.userId).length;

  return (
    <AppLayout>
      <div className="ev">

        {/* ─── Toast ─── */}
        {toast && (
          <div className={`ev__toast ev__toast--${toast.type}`}>
            {toast.type === 'success' && <FiCheckCircle size={15} />}
            {toast.type === 'error'   && <FiAlertCircle size={15} />}
            {toast.type === 'info'    && <FiCal size={15} />}
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ev__toast-close"><FiX size={13} /></button>
          </div>
        )}

        {/* ─── Header ─── */}
        <header className="ev__header">
          <div className="ev__header-left">
            <h1 className="ev__title">Події</h1>
            <p className="ev__subtitle">Знаходь цікаві заходи та приєднуйся до спільноти</p>
          </div>
          <Link to="/events/create" className="ev__create-btn">
            <FiPlus size={16} /> Створити подію
          </Link>
        </header>

        {/* ─── Stats strip ─── */}
        <div className="ev__stats">
          <div className="ev__stat">
            <span className="ev__stat-icon ev__stat-icon--purple"><FiCalendar size={15} /></span>
            <div className="ev__stat-body">
              <span className="ev__stat-val">{events.length}</span>
              <span className="ev__stat-lbl">Всього</span>
            </div>
          </div>
          <div className="ev__stat">
            <span className="ev__stat-icon ev__stat-icon--green"><FiUserCheck size={15} /></span>
            <div className="ev__stat-body">
              <span className="ev__stat-val">{joinedCount}</span>
              <span className="ev__stat-lbl">Приєднався</span>
            </div>
          </div>
          <div className="ev__stat">
            <span className="ev__stat-icon ev__stat-icon--amber"><FiUser size={15} /></span>
            <div className="ev__stat-body">
              <span className="ev__stat-val">{myCount}</span>
              <span className="ev__stat-lbl">Мої</span>
            </div>
          </div>
        </div>

        {/* ─── Toolbar: search + filters ─── */}
        <div className="ev__toolbar">
          <div className="ev__search-wrap">
            <FiSearch size={15} className="ev__search-icon" />
            <input
              className="ev__search"
              placeholder="Пошук за назвою, містом або автором..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="ev__search-clear" onClick={() => setSearch('')}>
                <FiX size={13} />
              </button>
            )}
          </div>

          <div className="ev__filters">
            {([
              ['all',       'Усі'],
              ['available', 'Доступні'],
              ['joined',    'Я учасник'],
              ['mine',      'Мої'],
            ] as Array<[FilterKey, string]>).map(([k, label]) => (
              <button
                key={k}
                className={`ev__filter-btn ${filter === k ? 'ev__filter-btn--active' : ''}`}
                onClick={() => setFilter(k)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Loading ─── */}
        {loading && (
          <div className="ev__loading">
            <div className="ev__spinner" /> Завантаження подій...
          </div>
        )}

        {/* ─── Upcoming ─── */}
        {!loading && upcoming.length > 0 && (
          <section className="ev__section">
            <div className="ev__section-head">
              <h2 className="ev__section-title"><FiClock size={14} /> Найближчі</h2>
              <span className="ev__section-count">{upcoming.length}</span>
            </div>
            <div className="ev__grid">
              {upcoming.map(ev => (
                <EventCard
                  key={ev.eventId}
                  ev={ev}
                  user={user}
                  joined={userParticipation[ev.eventId] || false}
                  busy={!!processing[ev.eventId]}
                  menuOpen={menuOpenId === ev.eventId}
                  onMenuToggle={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === ev.eventId ? null : ev.eventId); }}
                  onMenuClose={() => setMenuOpenId(null)}
                  onJoin={() => handleJoin(ev.eventId)}
                  onQuit={() => handleQuit(ev.eventId)}
                  onView={() => setDetailsEvent(ev)}
                  onEdit={() => setEditEvent(ev)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Past ─── */}
        {!loading && past.length > 0 && (
          <section className="ev__section">
            <div className="ev__section-head">
              <h2 className="ev__section-title ev__section-title--muted"><FiClock size={14} /> Минулі</h2>
              <span className="ev__section-count">{past.length}</span>
            </div>
            <div className="ev__grid ev__grid--past">
              {past.map(ev => (
                <EventCard
                  key={ev.eventId}
                  ev={ev}
                  user={user}
                  joined={userParticipation[ev.eventId] || false}
                  busy={false}
                  menuOpen={false}
                  isPast
                  onMenuToggle={() => {}}
                  onMenuClose={() => {}}
                  onJoin={() => {}}
                  onQuit={() => {}}
                  onView={() => setDetailsEvent(ev)}
                  onEdit={() => setEditEvent(ev)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ─── Empty ─── */}
        {!loading && filtered.length === 0 && (
          <div className="ev__empty">
            <FiCalendar size={42} className="ev__empty-icon" />
            <p>Подій не знайдено</p>
            <span>
              {search
                ? 'Спробуй інший пошуковий запит'
                : 'Спробуй інший фільтр або створи власну подію'}
            </span>
            <Link to="/events/create" className="ev__empty-btn">
              <FiPlus size={13} /> Створити першу
            </Link>
          </div>
        )}

      </div>

      {/* ─── Modals ─── */}
      {detailsEvent && (
        <EventDetailsModal
          event={detailsEvent}
          currentUserId={user?.userId}
          joined={userParticipation[detailsEvent.eventId] || false}
          onJoin={() => handleJoin(detailsEvent.eventId)}
          onQuit={() => handleQuit(detailsEvent.eventId)}
          onEdit={() => { setEditEvent(detailsEvent); setDetailsEvent(null); }}
          onClose={() => setDetailsEvent(null)}
        />
      )}
      {editEvent && (
        <EditEventModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSuccess={() => { setEditEvent(null); showToast('Подію оновлено', 'success'); }}
        />
      )}
    </AppLayout>
  );
};

/* =========================================================
   EventCard
   ========================================================= */
interface EventCardProps {
  ev: Event;
  user: any;
  joined: boolean;
  busy: boolean;
  isPast?: boolean;
  menuOpen: boolean;
  onMenuToggle: (e: React.MouseEvent) => void;
  onMenuClose: () => void;
  onJoin: () => void;
  onQuit: () => void;
  onView: () => void;
  onEdit: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  ev, user, joined, busy, isPast,
  menuOpen, onMenuToggle, onMenuClose,
  onJoin, onQuit, onView, onEdit,
}) => {
  const isOwner = ev.creatorId === user?.userId;
  const count   = ev.participants?.length ?? 0;
  const isFull  = count >= ev.maximum;
  const pct     = Math.min((count / ev.maximum) * 100, 100);

  const dateObj = new Date(ev.date);
  const day     = dateObj.toLocaleDateString('uk-UA', { day: 'numeric' });
  const month   = dateObj.toLocaleDateString('uk-UA', { month: 'short' }).replace('.', '');
  const time    = dateObj.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

  return (
    <article
      className={`ev__card ${joined ? 'ev__card--joined' : ''} ${isOwner ? 'ev__card--owner' : ''} ${isPast ? 'ev__card--past' : ''}`}
      onClick={onView}
    >
      {/* Кольорова смужка-індикатор ліворуч */}
      <span className="ev__card-stripe" />

      {/* Дата-чіп */}
      <div className="ev__date-chip">
        <span className="ev__date-day">{day}</span>
        <span className="ev__date-month">{month}</span>
      </div>

      <div className="ev__card-body">
        <div className="ev__card-top">
          <div className="ev__card-titles">
            <h3 className="ev__card-title">{ev.title}</h3>
            <div className="ev__card-meta">
              <span><FiClock size={11} /> {time}</span>
              {ev.city && <span><FiMapPin size={11} /> {ev.city}</span>}
            </div>
          </div>

          {/* Меню для creator */}
          {isOwner && !isPast && (
            <div className="ev__menu-wrap" onClick={(e) => e.stopPropagation()}>
              <button className="ev__menu-btn" onClick={onMenuToggle}>
                <FiMoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="ev__menu">
                  <button onClick={() => { onView(); onMenuClose(); }}><FiEye size={13} /> Деталі</button>
                  <button onClick={() => { onEdit(); onMenuClose(); }}><FiEdit2 size={13} /> Редагувати</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="ev__badges">
          {isOwner    && <span className="ev__badge ev__badge--owner"><FiUser size={10} /> Ваша подія</span>}
          {joined && !isOwner && <span className="ev__badge ev__badge--joined"><FiCheckCircle size={10} /> Ви учасник</span>}
          {isFull && !joined && !isOwner && !isPast && <span className="ev__badge ev__badge--full">Місць немає</span>}
        </div>

        {/* Participants */}
        <div className="ev__participants">
          <div className="ev__participants-info">
            <FiUsers size={12} />
            <span>{count} з {ev.maximum} учасників</span>
          </div>
          <div className="ev__progress">
            <div className="ev__progress-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Creator + action */}
        <div className="ev__card-footer">
          <span className="ev__creator">
            <span className="ev__creator-avatar">
              {(ev.creator?.username ?? '?').charAt(0).toUpperCase()}
            </span>
            <span className="ev__creator-name">{ev.creator?.username ?? `#${ev.creatorId}`}</span>
          </span>

          {!isOwner && !isPast && (
            joined ? (
              <button
                className="ev__action-btn ev__action-btn--quit"
                onClick={(e) => { e.stopPropagation(); onQuit(); }}
                disabled={busy}
              >
                <FiLogOut size={12} /> {busy ? '...' : 'Покинути'}
              </button>
            ) : isFull ? null : (
              <button
                className="ev__action-btn ev__action-btn--join"
                onClick={(e) => { e.stopPropagation(); onJoin(); }}
                disabled={busy}
              >
                {busy ? '...' : 'Приєднатись'}
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
};

export default EventsPage;
