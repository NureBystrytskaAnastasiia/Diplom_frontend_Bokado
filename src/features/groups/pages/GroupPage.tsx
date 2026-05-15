import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUsers, FiMapPin, FiRefreshCw,
  FiVideo, FiLogIn, FiLogOut, FiTrash2, FiShield, FiUser,
} from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks/useAuth';
import {
  loadGroup,
  joinGroupById,
  leaveGroupById,
  kickMemberById,
  assignAdminById,
  closeGroupById,
  removeGroup,
  startCall,
  clearCurrentGroup,
} from '../store/groupsSlice';
import AppLayout from '../../../shared/components/AppLayout/AppLayout';
import '../styles/GroupPage.css';

const API_BASE = 'https://localhost:7192';

const roleLabel: Record<string, string> = {
  Owner: 'Власник',
  Admin: 'Адмін',
  Member: 'Учасник',
  '0': 'Учасник',
  '1': 'Адмін',
  '2': 'Власник',
};

// Бек може повертати role як число (0=Member, 1=Admin, 2=Owner) або рядок
const normalizeRole = (role: any): 'Member' | 'Admin' | 'Owner' => {
  if (role === 0 || role === 'Member') return 'Member';
  if (role === 1 || role === 'Admin')  return 'Admin';
  if (role === 2 || role === 'Owner')  return 'Owner';
  return 'Member';
};

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate    = useNavigate();
  const dispatch    = useAppDispatch();

  const { currentGroup, currentGroupLoading, actionLoading } =
    useAppSelector((s) => s.groups);
  const { user } = useAppSelector((s) => s.auth);

  const id = Number(groupId);

  useEffect(() => {
    if (id) dispatch(loadGroup(id));
    return () => { dispatch(clearCurrentGroup()); };
  }, [id, dispatch]);

  if (currentGroupLoading) {
    return (
      <AppLayout>
        <div className="group-page__loading">
          <FiRefreshCw className="group-page__spinner" /> Завантаження...
        </div>
      </AppLayout>
    );
  }

  if (!currentGroup) {
    return (
      <AppLayout>
        <div className="group-page__error">Групу не знайдено</div>
      </AppLayout>
    );
  }

  const currentUserId = user?.userId;
  const isMember  = currentGroup.members.some(m => m.userId === currentUserId);
  const isOwner   = currentGroup.creatorId === currentUserId;
  const isAdmin   = currentGroup.members.some(m => {
    const role = normalizeRole(m.role);
    return m.userId === currentUserId && (role === 'Admin' || role === 'Owner');
  });
  const isClosed  = currentGroup.status === 'Closed';
  const isFull    = currentGroup.members.length >= currentGroup.maxMembers;

  const handleJoin = async () => {
    const result = await dispatch(joinGroupById(id));
    if (joinGroupById.fulfilled.match(result)) {
      await dispatch(loadGroup(id));
      if (currentGroup?.chatId) navigate(`/chat/${currentGroup.chatId}`);
    }
  };
  const handleLeave = () => dispatch(leaveGroupById(id)).then(() => dispatch(loadGroup(id)));

  const handleKick  = (targetUserId: number) =>
    dispatch(kickMemberById({ groupId: id, targetUserId }));

  const handleAssignAdmin = (targetUserId: number) =>
    dispatch(assignAdminById({ groupId: id, targetUserId }));

  const handleClose  = () => dispatch(closeGroupById(id));

  const handleDelete = async () => {
    await dispatch(removeGroup(id));
    navigate(-1);
  };

  const handleCall = async () => {
    const result = await dispatch(startCall(id));
    if (startCall.fulfilled.match(result)) {
      window.open(result.payload, '_blank');
    }
  };

  return (
    <AppLayout>
      <div className="group-page">
        {/* Back */}
        <button className="group-page__back" onClick={() => navigate(-1)}>
          <FiArrowLeft size={15} /> Назад
        </button>

        {/* Hero */}
        <div className="group-page__hero">
          <div className="group-page__hero-top">
            <div className="group-page__icon"><FiUsers /></div>

            <div className="group-page__hero-info">
              <h1 className="group-page__name">{currentGroup.name}</h1>
              <div className="group-page__meta">
                <span className={`group-page__badge group-page__badge--${isClosed ? 'closed' : 'open'}`}>
                  {isClosed ? 'Закрита' : 'Відкрита'}
                </span>
                {currentGroup.city && (
                  <span className="group-page__meta-item">
                    <FiMapPin size={13} /> {currentGroup.city}
                  </span>
                )}
                <span className="group-page__meta-item">
                  <FiUsers size={13} />
                  {currentGroup.members.length} / {currentGroup.maxMembers} учасників
                </span>
                {currentGroup.interests.map(i => (
                  <span key={i.interestId} className="group-page__badge group-page__badge--interest">
                    {i.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {currentGroup.description && (
            <p className="group-page__desc">{currentGroup.description}</p>
          )}

          {/* Actions */}
          <div className="group-page__hero-actions">
            {/* Вступити */}
            {!isMember && !isClosed && (
              <button
                className="group-page__btn group-page__btn--primary"
                onClick={handleJoin}
                disabled={actionLoading || isFull}
              >
                <FiLogIn size={15} />
                {isFull ? 'Немає місць' : 'Вступити'}
              </button>
            )}

            {/* Вийти (не власник) */}
            {isMember && !isOwner && (
              <button
                className="group-page__btn group-page__btn--danger"
                onClick={handleLeave}
                disabled={actionLoading}
              >
                <FiLogOut size={15} /> Вийти
              </button>
            )}

            {/* Відеодзвінок (учасники) */}
            {isMember && (
              <button
                className="group-page__btn group-page__btn--ghost"
                onClick={handleCall}
                disabled={actionLoading}
              >
                <FiVideo size={15} /> Відеодзвінок
              </button>
            )}

            {/* Закрити групу (власник) */}
            {isOwner && !isClosed && (
              <button
                className="group-page__btn group-page__btn--warning"
                onClick={handleClose}
                disabled={actionLoading}
              >
                Закрити групу
              </button>
            )}

            {/* Видалити (власник) */}
            {isOwner && (
              <button
                className="group-page__btn group-page__btn--danger"
                onClick={handleDelete}
                disabled={actionLoading}
              >
                <FiTrash2 size={15} /> Видалити групу
              </button>
            )}
          </div>
        </div>

        {/* Members */}
        <section>
          <div className="group-page__section-title">
            <FiUsers size={17} />
            Учасники
            <span className="group-page__count">{currentGroup.members.length}</span>
          </div>

          <div className="group-page__members">
            {currentGroup.members.map((member) => {
              const role          = normalizeRole(member.role);
              const isCurrentUser = member.userId === currentUserId;
              const canManage     = isAdmin && role === 'Member' && !isCurrentUser;

              return (
                <div key={member.userId} className="group-page__member">
                  {member.avatarUrl ? (
                    <img
                      src={`${API_BASE}${member.avatarUrl}`}
                      alt={member.username}
                      className="group-page__member-avatar"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="group-page__member-fallback"><FiUser /></div>
                  )}

                  <div className="group-page__member-info">
                    <div className="group-page__member-name">{member.username}</div>
                    <div className={`group-page__member-role group-page__member-role--${role.toLowerCase()}`}>
                      {roleLabel[role]}
                    </div>
                  </div>

                  {canManage && (
                    <div className="group-page__member-actions">
                      <button
                        className="group-page__member-btn group-page__member-btn--admin"
                        onClick={() => handleAssignAdmin(member.userId)}
                        title="Призначити адміном"
                      >
                        <FiShield size={13} />
                      </button>
                      <button
                        className="group-page__member-btn group-page__member-btn--kick"
                        onClick={() => handleKick(member.userId)}
                        title="Виключити"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default GroupPage;