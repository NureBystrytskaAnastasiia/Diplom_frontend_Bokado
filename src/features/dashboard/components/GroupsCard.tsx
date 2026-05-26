import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowRight, FiMapPin, FiPlus } from 'react-icons/fi';

interface Interest { interestId: number; name: string; }
interface Member   { userId: number; }
interface Group {
  groupId: number;
  name: string;
  city?: string;
  members: Member[];
  maxMembers: number;
  interests: Interest[];
}

interface Props {
  groups: Group[];
  currentUserId?: number;
  actionLoading: boolean;
  loading: boolean;
  onJoin: (e: React.MouseEvent, groupId: number) => void;
}

const GroupsCard: React.FC<Props> = ({ groups, currentUserId, actionLoading, loading, onJoin }) => {
  const navigate = useNavigate();

  return (
    <section className="db__card db__card--groups">
      <div className="db__card-head">
        <div className="db__card-title">
          <span className="db__card-icon db__card-icon--green"><FiUsers size={16} /></span>
          Рекомендовані групи
        </div>
        <Link to="/groups" className="db__see-all">
          Всі <FiArrowRight size={13} />
        </Link>
      </div>

      <div className="db__groups-list">
        {loading
          ? [1, 2, 3].map(i => <div key={i} className="db__group-skeleton" />)
          : groups.length === 0
            ? (
              <div className="db__empty">
                <FiUsers size={28} className="db__empty-icon" />
                <span>Немає рекомендацій</span>
              </div>
            )
            : groups.map(g => {
              const isMember = g.members.some(m => m.userId === currentUserId);
              return (
                <div key={g.groupId} className="db__group" onClick={() => navigate(`/groups/${g.groupId}`)}>
                  <div className="db__group-avatar">{g.name.charAt(0).toUpperCase()}</div>
                  <div className="db__group-info">
                    <span className="db__group-name">{g.name}</span>
                    <div className="db__group-meta">
                      {g.city && <span><FiMapPin size={10} /> {g.city}</span>}
                      <span><FiUsers size={10} /> {g.members.length}/{g.maxMembers}</span>
                      {g.interests.slice(0, 2).map(i => (
                        <span key={i.interestId} className="db__group-tag">{i.name}</span>
                      ))}
                    </div>
                  </div>
                  {isMember
                    ? <span className="db__group-member">В групі</span>
                    : (
                      <button
                        className="db__group-join"
                        onClick={(e) => onJoin(e, g.groupId)}
                        disabled={actionLoading}
                      >
                        <FiPlus size={14} />
                      </button>
                    )
                  }
                </div>
              );
            })
        }
      </div>
    </section>
  );
};

export default GroupsCard;