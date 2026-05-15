import React, { useEffect } from 'react';
import { FiSave, FiCheckSquare, FiSquare, FiZap } from 'react-icons/fi';
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

  useEffect(() => {
    dispatch(loadAllChallenges());
  }, [dispatch]);

  const handleSave = () => dispatch(updateSelectedChallenges(selectedChallengeIds));

  if (loading) return (
    <div className="chmgr__state">
      <div className="chmgr__spinner" />
      <p>Завантаження челенджів...</p>
    </div>
  );

  if (error) return (
    <div className="chmgr__state chmgr__state--error">
      <p>⚠️ {error}</p>
    </div>
  );

  return (
    <div className="chmgr">
      <div className="chmgr__toolbar">
        <p className="chmgr__hint">
          Обрано: <strong>{selectedChallengeIds.length}</strong> з {challenges.length}
        </p>
        <button className="adm-btn adm-btn--purple chmgr__save" onClick={handleSave}>
          <FiSave size={13} /> Зберегти вибір
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
                {ch.isActive && (
                  <span className="adm-badge adm-badge--green">Активний</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesManager;
