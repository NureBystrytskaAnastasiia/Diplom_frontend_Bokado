import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAuth';
import { loadAllChallenges, toggleChallengeSelection, updateSelectedChallenges } from '../../store/slices/challengeSlice';
import '../../styles/Admin.css';

const AdminChallengesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { challenges, selectedChallengeIds, loading, error } = useAppSelector(state => state.challenges);

  useEffect(() => {
    dispatch(loadAllChallenges());
  }, [dispatch]);

  const handleCheckboxChange = (challengeId: number) => {
    dispatch(toggleChallengeSelection(challengeId));
  };

  const handleSave = () => {
    dispatch(updateSelectedChallenges(selectedChallengeIds));
  };

  return (
    <div className="challenges-management">
      <div className="section-header">
        <h2>Управління челенджами</h2>
        <button className="btn-save" onClick={handleSave}>
          Обрати челенджі
        </button>
      </div>
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="challenges-grid">
        {challenges.map(challenge => (
          <div 
            key={challenge.challengeId} 
            className={`challenge-card ${selectedChallengeIds.includes(challenge.challengeId) ? 'selected' : ''}`}
          >
            <label className="challenge-selector">
              <input
                type="checkbox"
                checked={selectedChallengeIds.includes(challenge.challengeId)}
                onChange={() => handleCheckboxChange(challenge.challengeId)}
              />
              <span className="checkmark"></span>
            </label>
            
            <div className="challenge-content">
              <h3>{challenge.title}</h3>
              <div className="challenge-meta">
                <span className="reward-badge">{challenge.reward} бали</span>
                {challenge.isActive && <span className="active-badge">Активний</span>}
              </div>
              <p className="challenge-description">
                {challenge.description || 'No description available'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminChallengesPage;