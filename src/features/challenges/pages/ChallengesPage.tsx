import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  FiTarget, FiStar, FiCheckCircle, FiClock, FiSearch,
  FiX, FiAlertCircle, FiAward, FiTrendingUp, FiZap, FiUsers, FiInfo,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import {
  fetchChallenges, completeChallenge, clearError,
} from '../store/usechallengesSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import ChallengeDetailsModal from '../components/ChallengeDetailsModal';
import FailedConditionsModal from '../components/FailedConditionsModal';
import type { Challenge } from '../types/challenge';
import '../styles/Challenges.css';

type FilterKey = 'all' | 'active' | 'done';

const ChallengesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const token    = useAppSelector(s => s.auth.token);
  const { challenges, loading, error } = useAppSelector(s => s.userChallenges);

  const [busy,            setBusy]         = useState<Set<number>>(new Set());
  const [toast,           setToast]        = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [filter,          setFilter]       = useState<FilterKey>('all');
  const [search,          setSearch]       = useState('');
  const [detailsItem,     setDetailsItem]  = useState<Challenge | null>(null);
  const [failedItem,      setFailedItem]   = useState<Challenge | null>(null);

  // ── Toast
  const showToast = useCallback((text: string, type: 'success' | 'error') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ── Init
  useEffect(() => {
    if (token) dispatch(fetchChallenges(token));
  }, [dispatch, token]);

  // ── Error → toast (тільки якщо це не "failed conditions")
  useEffect(() => {
    if (error) {
      const lower = error.toLowerCase();
      const isFailed = lower.includes('failed') || lower.includes('умови') ||
                       lower.includes('conditions') || lower.includes('400');
      if (!isFailed) {
        showToast(error, 'error');
      }
      const t = setTimeout(() => dispatch(clearError()), 4500);
      return () => clearTimeout(t);
    }
  }, [error, dispatch, showToast]);

  // ── Complete
  const handleComplete = async (challenge: Challenge) => {
    if (!token || busy.has(challenge.challengeId)) return;
    setBusy(p => new Set(p).add(challenge.challengeId));
    try {
      const res = await dispatch(completeChallenge({ challengeId: challenge.challengeId, token }));
      if (completeChallenge.fulfilled.match(res)) {
        showToast(`🎉 +${challenge.reward} балів! Челендж виконано`, 'success');
        dispatch(fetchChallenges(token));
      } else {
        // Перевіряємо чи це "умови не виконані"
        const errMsg = (res.payload as string ?? '').toLowerCase();
        const isFailed = errMsg.includes('failed') || errMsg.includes('умови') || errMsg.includes('conditions');
        if (isFailed) {
          setFailedItem(challenge); // показуємо модалку умов
        } else {
          showToast((res.payload as string) || 'Помилка', 'error');
        }
      }
    } finally {
      setBusy(p => { const n = new Set(p); n.delete(challenge.challengeId); return n; });
    }
  };

  // ── Stats
  const done       = challenges.filter(c => c.isCompleted);
  const active     = challenges.filter(c => !c.isCompleted);
  const totalReward = done.reduce((s, c) => s + c.reward, 0);
  const pct = challenges.length > 0
    ? Math.round((done.length / challenges.length) * 100)
    : 0;

  // ── Filter + search
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return challenges.filter(c => {
      if (filter === 'active' && c.isCompleted) return false;
      if (filter === 'done'   && !c.isCompleted) return false;
      if (q) {
        const txt = `${c.title} ${c.description}`.toLowerCase();
        if (!txt.includes(q)) return false;
      }
      return true;
    });
  }, [challenges, filter, search]);

  return (
    <AppLayout>
      <div className="ch">

        {/* Toast */}
        {toast && (
          <div className={`ch__toast ch__toast--${toast.type}`}>
            {toast.type === 'success' ? <FiCheckCircle size={15} /> : <FiAlertCircle size={15} />}
            <span>{toast.text}</span>
            <button onClick={() => setToast(null)} className="ch__toast-close"><FiX size={13} /></button>
          </div>
        )}

        {/* Header */}
        <header className="ch__header">
          <div className="ch__header-left">
            <h1 className="ch__title">Челенджі</h1>
            <p className="ch__subtitle">Виконуй завдання, отримуй бали та підвищуй свій рівень</p>
          </div>
        </header>

        {/* Hero progress card */}
        {challenges.length > 0 && (
          <section className="ch__hero-card">
            <div className="ch__hero-left">
              <div className="ch__hero-icon"><FiZap size={22} /></div>
              <div>
                <span className="ch__hero-label">Ваш прогрес</span>
                <span className="ch__hero-value">{done.length} / {challenges.length}</span>
                <span className="ch__hero-sub">{pct}% челенджів виконано</span>
              </div>
            </div>

            <div className="ch__hero-progress">
              <div className="ch__hero-progress-bar">
                <div className="ch__hero-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="ch__hero-stats">
                <div className="ch__hero-stat">
                  <FiTarget size={13} />
                  <span><strong>{active.length}</strong> активних</span>
                </div>
                <div className="ch__hero-stat">
                  <FiAward size={13} />
                  <span><strong>{done.length}</strong> виконано</span>
                </div>
                <div className="ch__hero-stat">
                  <FiStar size={13} />
                  <span><strong>{totalReward}</strong> балів</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Toolbar */}
        <div className="ch__toolbar">
          <div className="ch__search-wrap">
            <FiSearch size={15} className="ch__search-icon" />
            <input
              className="ch__search"
              placeholder="Пошук за назвою або описом..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="ch__search-clear" onClick={() => setSearch('')}>
                <FiX size={13} />
              </button>
            )}
          </div>

          <div className="ch__filters">
            <button
              className={`ch__filter-btn ${filter === 'all' ? 'ch__filter-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Усі ({challenges.length})
            </button>
            <button
              className={`ch__filter-btn ${filter === 'active' ? 'ch__filter-btn--active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Активні ({active.length})
            </button>
            <button
              className={`ch__filter-btn ${filter === 'done' ? 'ch__filter-btn--active' : ''}`}
              onClick={() => setFilter('done')}
            >
              Виконані ({done.length})
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="ch__loading">
            <div className="ch__spinner" /> Завантаження челенджів...
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="ch__grid">
            {filtered.map(ch => (
              <ChallengeCard
                key={ch.challengeId}
                ch={ch}
                busy={busy.has(ch.challengeId)}
                onComplete={() => handleComplete(ch)}
                onDetails={() => setDetailsItem(ch)}
              />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="ch__empty">
            <FiTarget size={42} className="ch__empty-icon" />
            <p>Челенджів не знайдено</p>
            <span>
              {search
                ? 'Спробуй інший пошуковий запит'
                : filter === 'done'
                  ? 'Ще немає виконаних челенджів. Час починати!'
                  : 'Немає активних челенджів'}
            </span>
          </div>
        )}

      </div>

      {/* Modals */}
      {detailsItem && (
        <ChallengeDetailsModal
          challenge={detailsItem}
          busy={busy.has(detailsItem.challengeId)}
          onComplete={() => { handleComplete(detailsItem); }}
          onClose={() => setDetailsItem(null)}
        />
      )}
      {failedItem && (
        <FailedConditionsModal
          challenge={failedItem}
          onClose={() => setFailedItem(null)}
        />
      )}
    </AppLayout>
  );
};

/* ============================================================
   ChallengeCard
   ============================================================ */
interface CardProps {
  ch: Challenge;
  busy: boolean;
  onComplete: () => void;
  onDetails: () => void;
}

const ChallengeCard: React.FC<CardProps> = ({ ch, busy, onComplete, onDetails }) => {
  const completionRate = ch.completionRate ?? 0;

  return (
    <article
      className={`ch__card ${ch.isCompleted ? 'ch__card--done' : ''}`}
      onClick={onDetails}
    >
      {/* Кольорова смужка */}
      <span className="ch__card-stripe" />

      {/* Done ribbon */}
      {ch.isCompleted && (
        <div className="ch__done-ribbon">
          <FiAward size={11} /> Виконано
        </div>
      )}

      {/* Icon + reward */}
      <div className="ch__card-head">
        <div className={`ch__card-icon ${ch.isCompleted ? 'ch__card-icon--done' : ''}`}>
          {ch.isCompleted ? <FiAward size={18} /> : <FiTarget size={18} />}
        </div>
        <div className="ch__card-reward">
          <FiStar size={11} />
          <span>{ch.reward}</span>
        </div>
      </div>

      {/* Title + desc */}
      <div className="ch__card-body">
        <h3 className="ch__card-title">{ch.title}</h3>
        <p className="ch__card-desc">{ch.description}</p>
      </div>

      {/* Completion rate */}
      {completionRate > 0 && (
        <div className="ch__card-rate">
          <FiUsers size={11} />
          <span>{completionRate}% користувачів виконали</span>
        </div>
      )}

      {/* Footer */}
      <div className="ch__card-footer">
        {ch.isCompleted ? (
          <div className="ch__completed-info">
            <FiClock size={11} />
            <span>
              {ch.completedAt
                ? new Date(ch.completedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Виконано'}
            </span>
          </div>
        ) : (
          <button
            className="ch__complete-btn"
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            disabled={busy}
          >
            {busy ? (
              <>
                <span className="ch__btn-spinner" />
                Перевірка...
              </>
            ) : (
              <>
                <FiCheckCircle size={13} /> Завершити
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
};

export default ChallengesPage;
