import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiGrid, FiPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import {
  loadRecommendations,
  joinGroupById,
  leaveGroupById,
} from '../../../groups/store/groupsSlice';
import GroupCard from '../../../groups/components/GroupCard/GroupCard';
import './GroupsTab.css';

interface GroupsTabProps {
  onCreateGroup: () => void;
}

const GroupsTab: React.FC<GroupsTabProps> = ({ onCreateGroup }) => {
  const dispatch    = useAppDispatch();
  const navigate    = useNavigate();
  const { recommendations, recommendationsLoading, actionLoading } =
    useAppSelector((s) => s.groups);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(loadRecommendations());
  }, [dispatch]);

  const handleJoin = async (groupId: number) => {
    const result = await dispatch(joinGroupById(groupId));
    if (joinGroupById.fulfilled.match(result)) {
      const group = recommendations.find(g => g.groupId === groupId);
      if (group?.chatId) {
        navigate(`/chat/${group.chatId}`);
      } else {
        navigate('/chats');
      }
    }
  };

  const handleLeave = (groupId: number) => {
    dispatch(leaveGroupById(groupId));
  };

  const handleRefresh = () => dispatch(loadRecommendations());

  return (
    <div className="groups-tab">
      <div className="groups-tab__toolbar">
        <button className="groups-tab__btn groups-tab__btn--ghost" onClick={handleRefresh} disabled={recommendationsLoading}>
          <FiRefreshCw size={15} className={recommendationsLoading ? 'groups-tab__spin' : ''} />
          Знайти ще
        </button>
        <button className="groups-tab__btn groups-tab__btn--primary" onClick={onCreateGroup}>
          <FiPlus size={15} />
          Створити групу
        </button>
      </div>

      {recommendationsLoading && (
        <div className="groups-tab__loading">
          <FiRefreshCw className="groups-tab__spin" size={16} /> Завантаження...
        </div>
      )}

      {!recommendationsLoading && recommendations.length === 0 && (
        <div className="groups-tab__empty">
          <FiGrid className="groups-tab__empty-icon" />
          <span>Не знайдено груп за твоїми інтересами</span>
          <p>Заповни інтереси в профілі або створи свою групу</p>
        </div>
      )}

      {!recommendationsLoading && recommendations.length > 0 && (
        <div className="groups-tab__list">
          {recommendations.map((group) => (
            <GroupCard
              key={group.groupId}
              group={group}
              currentUserId={user?.userId}
              onJoin={handleJoin}
              onLeave={handleLeave}
              isLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsTab;