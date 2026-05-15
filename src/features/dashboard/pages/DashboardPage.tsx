import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiCalendar, FiTarget, FiUsers, FiArrowRight,
  FiMapPin, FiStar, FiPlus, FiCheckCircle, FiClock,
  FiTrendingUp, FiRefreshCw,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import { loadEvents, joinExistingEvent, quitExistingEvent, initializeUserParticipation } from '../../events/store/eventSlice';
import { fetchChallenges, completeChallenge } from '../../challenges/store/usechallengesSlice';
import { loadRecommendations, joinGroupById } from '../../groups/store/groupsSlice';
import { useCats } from '../../../hooks/useCat';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import '../styles/Dashboard.css';

const DashboardPage: React.FC = () => {
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();
  const { user, token } = useAppSelector((s) => s.auth);
  const { events, userParticipation } = useAppSelector((s) => s.events);
  const { challenges } = useAppSelector((s) => s.userChallenges);
  const { recommendations, actionLoading } = useAppSelector((s) => s.groups);
  const { cats, loading: catsLoading, refetch: refetchCats } = useCats(3);

  useEffect(() => {
    dispatch(loadEvents());
    if (token) dispatch(fetchChallenges(token));
    dispatch(loadRecommendations());
  }, [dispatch, token]);

  useEffect(() => {
    if (events.length && user) {
      dispatch(initializeUserParticipation({ events, currentUserId: user.userId }));
    }
  }, [events, user, dispatch]);

  // Найближчі 3 події
  const upcomingEvents = [...events]
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Активні челенджі (не завершені)
  const activeChalls = challenges.filter(c => !c.isCompleted).slice(0, 3);
  const doneChalls   = challenges.filter(c => c.isCompleted).length;

  // Рекомендовані групи — 3 шт
  const recGroups = recommendations.slice(0, 3);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const handleJoinEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    if (userParticipation[eventId]) {
      dispatch(quitExistingEvent(eventId));
    } else {
      dispatch(joinExistingEvent(eventId));
    }
  };

  const handleCompleteChallenge = (e: React.MouseEvent, challengeId: number) => {
    e.stopPropagation();
    if (token) dispatch(completeChallenge({ challengeId, token }));
  };

  const handleJoinGroup = (e: React.MouseEvent, groupId: number) => {
    e.stopPropagation();
    dispatch(joinGroupById(groupId));
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Доброго ранку';
    if (h < 18) return 'Доброго дня';
    return 'Доброго вечора';
  };

  return (
    <AppLayout>
      <div className="db">

        {/* ── Hero ── */}
        <header className="db__hero">
          <div className="db__hero-left">
            <p className="db__greeting">{greeting()},</p>
            <h1 className="db__name">{user?.username ?? '...'} 👋</h1>
            <p className="db__subtitle">Ось що відбувається сьогодні</p>
          </div>
          <div className="db__hero-stats">
            <div className="db__stat">
              <span className="db__stat-val">{events.length}</span>
              <span className="db__stat-lbl">Подій</span>
            </div>
            <div className="db__stat">
              <span className="db__stat-val">{doneChalls}</span>
              <span className="db__stat-lbl">Виконано</span>
            </div>
            <div className="db__stat">
              <span className="db__stat-val">{challenges.length}</span>
              <span className="db__stat-lbl">Челенджів</span>
            </div>
          </div>
        </header>

        {/* ── Grid layout ── */}
        <div className="db__grid">

          {/* ══ ПОДІЇ ══ */}
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
              {upcomingEvents.length === 0 && (
                <div className="db__empty">
                  <FiCalendar size={28} className="db__empty-icon" />
                  <span>Немає найближчих подій</span>
                  <Link to="/events/create" className="db__empty-btn"><FiPlus size={13} /> Створити</Link>
                </div>
              )}
              {upcomingEvents.map(ev => {
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
                          onClick={(e) => handleJoinEvent(e, ev.eventId)}
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
              })}
            </div>

            <Link to="/events/create" className="db__add-btn">
              <FiPlus size={14} /> Нова подія
            </Link>
          </section>

          {/* ══ ЧЕЛЕНДЖІ ══ */}
          <section className="db__card db__card--challenges">
            <div className="db__card-head">
              <div className="db__card-title">
                <span className="db__card-icon db__card-icon--amber"><FiTarget size={16} /></span>
                Мої челенджі
              </div>
              <Link to="/challenges" className="db__see-all">
                Всі <FiArrowRight size={13} />
              </Link>
            </div>

            {/* Progress bar */}
            {challenges.length > 0 && (
              <div className="db__progress-wrap">
                <div className="db__progress-bar">
                  <div
                    className="db__progress-fill"
                    style={{ width: `${Math.round((doneChalls / challenges.length) * 100)}%` }}
                  />
                </div>
                <span className="db__progress-label">
                  <FiTrendingUp size={11} /> {doneChalls} з {challenges.length} виконано
                </span>
              </div>
            )}

            <div className="db__challs-list">
              {activeChalls.length === 0 && (
                <div className="db__empty">
                  <FiTarget size={28} className="db__empty-icon" />
                  <span>Немає активних челенджів</span>
                  <Link to="/challenges" className="db__empty-btn">Обрати челенджі</Link>
                </div>
              )}
              {activeChalls.map(ch => (
                <div key={ch.challengeId} className="db__chall">
                  <div className="db__chall-info">
                    <span className="db__chall-title">{ch.title}</span>
                    <span className="db__chall-desc">{ch.description}</span>
                  </div>
                  <div className="db__chall-right">
                    <span className="db__chall-reward">
                      <FiStar size={11} /> {ch.reward}
                    </span>
                    <button
                      className="db__chall-done"
                      onClick={(e) => handleCompleteChallenge(e, ch.challengeId)}
                      title="Відмітити виконаним"
                    >
                      <FiCheckCircle size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══ РЕКОМЕНДОВАНІ ГРУПИ ══ */}
          <section className="db__card db__card--groups">
            <div className="db__card-head">
              <div className="db__card-title">
                <span className="db__card-icon db__card-icon--green"><FiUsers size={16} /></span>
                Рекомендовані групи
              </div>
              <Link to="/groups" className="db__see-all">
                Всі <FiArrowRight size={13} />
              </Link>
            </div>

            <div className="db__groups-list">
              {recGroups.length === 0 && (
                <div className="db__empty">
                  <FiUsers size={28} className="db__empty-icon" />
                  <span>Немає рекомендацій</span>
                </div>
              )}
              {recGroups.map(g => {
                const isMember = g.members.some(m => m.userId === user?.userId);
                return (
                  <div key={g.groupId} className="db__group" onClick={() => navigate(`/groups/${g.groupId}`)}>
                    <div className="db__group-avatar">
                      {g.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="db__group-info">
                      <span className="db__group-name">{g.name}</span>
                      <div className="db__group-meta">
                        {g.city && <span><FiMapPin size={10} /> {g.city}</span>}
                        <span><FiUsers size={10} /> {g.members.length}/{g.maxMembers}</span>
                        {g.interests.slice(0, 2).map(i => (
                          <span key={i.interestId} className="db__group-tag">{i.name}</span>
                        ))}
                      </div>
                    </div>
                    {!isMember && (
                      <button
                        className="db__group-join"
                        onClick={(e) => handleJoinGroup(e, g.groupId)}
                        disabled={actionLoading}
                      >
                        <FiPlus size={14} />
                      </button>
                    )}
                    {isMember && (
                      <span className="db__group-member">В групі</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

        {/* ── Котики дня ── */}
        <section className="db__card db__card--cats">
          <div className="db__card-head">
            <div className="db__card-title">
              <span className="db__card-icon db__card-icon--pink">🐱</span>
              Котики дня
            </div>
            <button className="db__cats-refresh" onClick={refetchCats}>
              <FiRefreshCw size={13} /> Нові котики
            </button>
          </div>
          <div className="db__cats-grid">
            {catsLoading
              ? [1,2,3].map(i => <div key={i} className="db__cat-skeleton" />)
              : cats.map(cat => (
                  <div key={cat.id} className="db__cat">
                    <img
                      src={cat.url}
                      alt="котик"
                      className="db__cat-img"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
                      }}
                    />
                  </div>
                ))
            }
          </div>
        </section>

      </div>
    </AppLayout>
  );
};

export default DashboardPage;
