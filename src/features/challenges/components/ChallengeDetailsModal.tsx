import React from 'react';
import {
  FiX, FiTarget, FiAward, FiStar, FiCheckCircle, FiClock, FiUsers,
} from 'react-icons/fi';
import type { Challenge } from '../types/challenge';

interface Props {
  challenge: Challenge;
  busy: boolean;
  onComplete: () => void;
  onClose: () => void;
}

const ChallengeDetailsModal: React.FC<Props> = ({ challenge, busy, onComplete, onClose }) => {
  const rate = challenge.completionRate ?? 0;

  return (
    <div className="ch-modal__overlay" onClick={onClose}>
      <div className="ch-modal" onClick={(e) => e.stopPropagation()}>

        <div className="ch-modal__header">
          <div className="ch-modal__head-titles">
            {challenge.isCompleted && (
              <span className="ch__badge ch__badge--done">
                <FiAward size={10} /> Виконано
              </span>
            )}
            <h2 className="ch-modal__title">{challenge.title}</h2>
          </div>
          <button className="ch-modal__close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="ch-modal__hero">
          <div className={`ch-modal__hero-icon ${challenge.isCompleted ? 'ch-modal__hero-icon--done' : ''}`}>
            {challenge.isCompleted ? <FiAward size={28} /> : <FiTarget size={28} />}
          </div>
          <div className="ch-modal__reward-big">
            <FiStar size={16} />
            <span>+{challenge.reward}</span>
            <small>балів</small>
          </div>
        </div>

        <div className="ch-modal__section">
          <h3 className="ch-modal__section-title">Опис завдання</h3>
          <p className="ch-modal__desc">{challenge.description}</p>
        </div>

        {(rate > 0 || challenge.completedAt) && (
          <div className="ch-modal__section">
            <h3 className="ch-modal__section-title">Статистика</h3>
            <div className="ch-modal__stats">
              {rate > 0 && (
                <div className="ch-modal__stat">
                  <div className="ch-modal__stat-head">
                    <FiUsers size={13} />
                    <span>Виконали користувачі</span>
                  </div>
                  <div className="ch-modal__stat-bar">
                    <div className="ch-modal__stat-bar-fill" style={{ width: `${Math.min(rate, 100)}%` }} />
                  </div>
                  <span className="ch-modal__stat-val">{rate}%</span>
                </div>
              )}
              {challenge.completedAt && (
                <div className="ch-modal__stat-info">
                  <FiCheckCircle size={13} />
                  <span>
                    Виконано {new Date(challenge.completedAt).toLocaleDateString('uk-UA', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="ch-modal__footer">
          {!challenge.isCompleted ? (
            <>
              <button className="ch-modal__btn ch-modal__btn--cancel" onClick={onClose}>
                Закрити
              </button>
              <button
                className="ch-modal__btn ch-modal__btn--complete"
                onClick={onComplete}
                disabled={busy}
              >
                {busy ? (
                  <>
                    <span className="ch__btn-spinner" />
                    Перевірка...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={14} /> Завершити
                  </>
                )}
              </button>
            </>
          ) : (
            <button className="ch-modal__btn ch-modal__btn--cancel" onClick={onClose}>
              <FiClock size={14} /> Закрити
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailsModal;
