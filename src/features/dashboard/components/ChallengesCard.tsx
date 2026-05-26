import React from 'react';
import { Link } from 'react-router-dom';
import { FiTarget, FiArrowRight, FiStar, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

interface Challenge {
  challengeId: number;
  title: string;
  description: string;
  reward: number;
  isCompleted: boolean;
}

interface Props {
  challenges: Challenge[];
  activeChalls: Challenge[];
  doneChalls: number;
  loading: boolean;
  onComplete: (e: React.MouseEvent, challengeId: number) => void;
}

const ChallengesCard: React.FC<Props> = ({ challenges, activeChalls, doneChalls, loading, onComplete }) => (
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

    {!loading && challenges.length > 0 && (
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
      {loading
        ? [1, 2, 3].map(i => <div key={i} className="db__chall-skeleton" />)
        : activeChalls.length === 0
          ? (
            <div className="db__empty">
              <FiTarget size={28} className="db__empty-icon" />
              <span>Немає активних челенджів</span>
              <Link to="/challenges" className="db__empty-btn">Обрати челенджі</Link>
            </div>
          )
          : activeChalls.map(ch => (
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
                  onClick={(e) => onComplete(e, ch.challengeId)}
                  title="Відмітити виконаним"
                >
                  <FiCheckCircle size={16} />
                </button>
              </div>
            </div>
          ))
      }
    </div>
  </section>
);

export default ChallengesCard;