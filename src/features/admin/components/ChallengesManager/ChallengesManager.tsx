import React, { useEffect, useState } from 'react';
import { FiSave, FiCheckSquare, FiSquare, FiZap, FiCheckCircle, FiX } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import {
  loadAllChallenges,
  toggleChallengeSelection,
  updateSelectedChallenges,
} from '../../../challenges/store/challengeSlice';
import './ChallengesManager.css';

const ChallengesManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { challenges, selectedChallengeIds, loading, error } =
    useAppSelector((s) => s.challenges);

  // Локальні стани — щоб дії Save не блокували весь UI (як робив глобальний
  // `loading`) і давали користувачу зрозумілий фідбек.
  const [saving, setSaving]           = useState(false);
  const [feedback, setFeedback]       = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadAllChallenges());
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoaded && !loading && (challenges.length > 0 || error)) {
      setInitialLoaded(true);
    }
  }, [initialLoaded, loading, challenges.length, error]);

  // Автосховування toast'а
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3500);
    return () => clearTimeout(t);
  }, [feedback]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setFeedback(null);
    try {
      const res = await dispatch(updateSelectedChallenges(selectedChallengeIds));
      if (updateSelectedChallenges.fulfilled.match(res)) {
        setFeedback({ type: 'success', text: 'Зміни збережено' });
      } else {
        setFeedback({ type: 'error', text: (res.payload as string) || 'Не вдалось зберегти' });
      }
    } finally {
      setSaving(false);
    }
  };

  // Фулскрін-стан — тільки для первинного завантаження.
  if (!initialLoaded && loading) return (
    <div className="chmgr__state">
      <div className="chmgr__spinner" />
      <p>Завантаження челенджів...</p>
    </div>
  );

  if (!initialLoaded && error && challenges.length === 0) return (
    <div className="chmgr__state chmgr__state--error">
      <p>⚠️ {error}</p>
    </div>
  );

  return (
    <div className="chmgr">
      {feedback && (
        <div className={`chmgr__toast chmgr__toast--${feedback.type}`}>
          {feedback.type === 'success'
            ? <FiCheckCircle size={14} />
            : <FiX size={14} />}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="chmgr__toolbar">
        <p className="chmgr__hint">
          Обрано: <strong>{selectedChallengeIds.length}</strong> з {challenges.length}
        </p>
        <button
          className="adm-btn adm-btn--purple chmgr__save"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? <span className="chmgr__spinner chmgr__spinner--sm" /> : <FiSave size={13} />}
          {saving ? 'Збереження...' : 'Зберегти вибір'}
        </button>
      </div>

      <div className="chmgr__grid">
        {challenges.map((ch) => {
          const selected = selectedChallengeIds.includes(ch.challengeId);
          return (
            <div
              key={ch.challengeId}
              className={`chmgr__card ${selected ? 'chmgr__card--selected' : ''}`}
              onClick={() => dispatch(toggleChallengeSelection(ch.challengeId))}
            >
              <div className="chmgr__card-check">
                {selected
                  ? <FiCheckSquare size={18} className="chmgr__check-icon--on" />
                  : <FiSquare size={18} className="chmgr__check-icon--off" />
                }
              </div>

              <div className="chmgr__card-icon">
                <FiZap size={18} />
              </div>

              <div className="chmgr__card-body">
                <h3 className="chmgr__card-title">{ch.title}</h3>
                {ch.description && (
                  <p className="chmgr__card-desc">{ch.description}</p>
                )}
              </div>

              <div className="chmgr__card-footer">
                <span className="adm-badge adm-badge--purple">
                  +{ch.reward} балів
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesManager;