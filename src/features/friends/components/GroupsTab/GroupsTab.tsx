import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiGrid, FiPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import {
  loadRecommendations,
  loadGroups,
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
  const { recommendations, groups, recommendationsLoading, actionLoading } =
    useAppSelector((s) => s.groups);
  const { user } = useAppSelector((s) => s.auth);

  // Мої групи — де я учасник або власник
  const myGroups = groups.filter(g =>
    g.members.some(m => m.userId === user?.userId)
  );

  // Рекомендації — групи де мене немає
  const displayGroups = recommendations.length > 0
    ? recommendations
    : groups.filter(g =>
        g.status === 'Open' &&
        !g.members.some(m => m.userId === user?.userId)
      );

  useEffect(() => {
    dispatch(loadRecommendations()).then((result) => {
      // Якщо рекомендації порожні — завантажуємо всі групи як fallback
      if (loadRecommendations.fulfilled.match(result) && result.payload.length === 0) {
        dispatch(loadGroups());
      }
    });
  }, [dispatch]);

  const handleJoin = async (groupId: number) => {
    const result = await dispatch(joinGroupById(groupId));
    if (joinGroupById.fulfilled.match(result)) {
      const group = displayGroups.find(g => g.groupId === groupId);
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

  const handleRefresh = () => {
    dispatch(loadRecommendations()).then((result) => {
      if (loadRecommendations.fulfilled.match(result) && result.payload.length === 0) {
        dispatch(loadGroups());
      }
    });
  };

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

      {/* Мої групи */}
      {!recommendationsLoading && myGroups.length > 0 && (
        <div className="groups-tab__section">
          <div className="groups-tab__section-title">Мої групи</div>
          <div className="groups-tab__list">
            {myGroups.map((group) => (
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
        </div>
      )}

      {/* Рекомендації / всі групи */}
      {!recommendationsLoading && (
        <div className="groups-tab__section">
          {displayGroups.length > 0 && (
            <>
              <div className="groups-tab__section-title">
                {recommendations.length > 0 ? 'Рекомендовані' : 'Всі групи'}
              </div>
              <div className="groups-tab__list">
                {displayGroups.map((group) => (
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
            </>
          )}

          {displayGroups.length === 0 && myGroups.length === 0 && (
            <div className="groups-tab__empty">
              <FiGrid className="groups-tab__empty-icon" />
              <span>Груп поки немає</span>
              <p>Створи першу групу!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupsTab;