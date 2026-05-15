import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiMapPin, FiArrowRight, FiLogIn, FiLogOut } from 'react-icons/fi';
import type { GetGroupDto } from '../../types/group';
import './GroupCard.css';

interface GroupCardProps {
  group: GetGroupDto;
  currentUserId?: number;
  onJoin?: (groupId: number) => void;
  onLeave?: (groupId: number) => void;
  isLoading?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({
  group,
  currentUserId,
  onJoin,
  onLeave,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  const memberCount  = group.members.length;
  const isFull       = memberCount >= group.maxMembers;
  const isMember     = currentUserId
    ? group.members.some(m => m.userId === currentUserId)
    : false;
  const isOwner      = currentUserId === group.creatorId;
  const isClosed     = group.status === 'Closed' || (group.status as any) === 1;
  const fillPercent  = Math.min((memberCount / group.maxMembers) * 100, 100);
  const firstInterest = group.interests[0]?.name;

  return (
    <div className="group-card">
      {/* Header */}
      <div className="group-card__header">
        <div className="group-card__icon">
          <FiUsers />
        </div>

        <div className="group-card__title-wrap">
          <div className="group-card__name">{group.name}</div>
          <div className="group-card__meta">
            {group.city && (
              <span className="group-card__city">
                <FiMapPin size={11} style={{ marginRight: 2 }} />
                {group.city}
              </span>
            )}
            {firstInterest && (
              <span className="group-card__interest">{firstInterest}</span>
            )}
          </div>
        </div>

        <span className={`group-card__status group-card__status--${isClosed ? 'closed' : 'open'}`}>
          {isClosed ? 'Закрита' : 'Відкрита'}
        </span>
      </div>

      {/* Description */}
      {group.description && (
        <p className="group-card__desc">{group.description}</p>
      )}

      {/* Footer */}
      <div className="group-card__footer">
        <div className="group-card__info">
          {/* Members count + progress */}
          <div className="group-card__stat">
            <FiUsers size={13} />
            <span>{memberCount} / {group.maxMembers}</span>
          </div>
          <div>
            <div className="group-card__progress">
              <div
                className={`group-card__progress-fill ${isFull ? 'group-card__progress-fill--full' : ''}`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="group-card__actions">
          <button
            className="group-card__btn group-card__btn--ghost"
            onClick={() => navigate(`/groups/${group.groupId}`)}
          >
            <FiArrowRight size={14} />
            Детальніше
          </button>

          {!isMember && !isClosed && (
            <button
              className="group-card__btn group-card__btn--primary"
              onClick={() => onJoin?.(group.groupId)}
              disabled={isLoading || isFull}
              title={isFull ? 'Немає місць' : 'Вступити'}
            >
              <FiLogIn size={14} />
              {isFull ? 'Немає місць' : 'Вступити'}
            </button>
          )}

          {isMember && !isOwner && (
            <button
              className="group-card__btn group-card__btn--danger"
              onClick={() => onLeave?.(group.groupId)}
              disabled={isLoading}
            >
              <FiLogOut size={14} />
              Вийти
            </button>
          )}

          {isOwner && (
            <button
              className="group-card__btn group-card__btn--ghost"
              onClick={() => navigate(`/groups/${group.groupId}`)}
              disabled
            >
              Моя група
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;