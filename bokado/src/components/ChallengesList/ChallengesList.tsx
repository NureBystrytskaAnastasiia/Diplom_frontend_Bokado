import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { fetchChallenges, completeChallenge, clearError } from '../../store/slices/usechallengesSlice';
import '../../styles/Challenges.css';

const ChallengesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const { challenges, loading, error } = useAppSelector((state) => state.userChallenges);
  const [completingChallenges, setCompletingChallenges] = useState<Set<number>>(new Set());
  const [customError, setCustomError] = useState<string | null>(null);


  useEffect(() => {
    if (token) {
      dispatch(fetchChallenges(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCompleteChallenge = async (challengeId: number) => {
  if (!token || completingChallenges.has(challengeId)) return;

  setCompletingChallenges(prev => new Set(prev).add(challengeId));
  setCustomError(null);

  try {
    await dispatch(completeChallenge({ challengeId, token })).unwrap();
    dispatch(fetchChallenges(token));
  } catch (err: any) {
    console.error('Не вдалося завершити завдання:', err);

    const message = err?.toString() || '';

    if (message.includes('умови') || message.includes('conditions') || message.includes('400')) {
      setCustomError('Ви не виконали всі умови для проходження челенджу.');
    } else {
      setCustomError('Сталася помилка при завершенні завдання.');
    }
  } finally {
    setCompletingChallenges(prev => {
      const newSet = new Set(prev);
      newSet.delete(challengeId);
      return newSet;
    });
  }
};



  if (loading) return <div className="challenges-message">Завантаження челенджів...</div>;
  if (error) return <div className="challenges-error">Помилка: {error}</div>;
  if (challenges.length === 0) return <div className="challenges-message">Немає доступних завдань</div>;

  return (
    <div className="challenges-page">
      <h2 className="challenges-title">Доступні челенджі</h2>
      {customError && <div className="challenges-error">{customError}</div>}
      <div className="challenges-grid">
        {challenges.map((challenge) => {
          const isCompleting = completingChallenges.has(challenge.challengeId);
          
          return (
            <div 
              key={challenge.challengeId}
              className={`challenge-card ${challenge.isCompleted ? 'completed' : ''}`}
            >
              <h3>{challenge.title}</h3>
              <p>{challenge.description}</p>
              <p><strong>Нагорода:</strong> {challenge.reward} балів</p>
              
              {challenge.isCompleted ? (
                <div className="challenge-status">
                  <span>✓ Завершено</span>
                  {challenge.completedAt && (
                    <small>
                      {new Date(challenge.completedAt).toLocaleDateString('uk-UA')}
                    </small>
                  )}
                </div>
              ) : (
                <button
                  className={`btn btn-success ${isCompleting ? 'loading' : ''}`}
                  onClick={() => handleCompleteChallenge(challenge.challengeId)}
                  disabled={isCompleting}
                >
                  {isCompleting ? 'Перевірка...' : 'Завершити завдання'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChallengesList;