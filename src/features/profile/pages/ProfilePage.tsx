// src/features/profile/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiUser, FiAlertCircle, FiMessageCircle } from 'react-icons/fi';

import { useAppSelector, useAppDispatch } from '../../../shared/hooks/useAuth';
import { updateProfile, fetchUserProfile, fetchDetailedUserInfo } from '../store/userSlice';
import { fetchAvailableInterests } from '../store/interestsSlice';
import { loadMyFriends } from '../../friends/store/friendsSlice';
import type { UpdateProfileRequest } from '../types/user';

import AppLayout       from '../../../shared/components/AppLayout/AppLayout';
import ProfileHeader   from '../components/ProfileHeader';
import AboutCard       from '../components/AboutCard';
import EditProfileModal from '../components/EditProfileModal';
import PostsSection    from '../../posts/components/PostsSection'; // ← NEW

import '../styles/ProfilePages.css';
import '../../posts/styles/Posts.css'; // ← NEW

type Tab = 'posts' | 'about';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useAppDispatch();

  const { user: currentUser } = useAppSelector(s => s.auth);
  const { profile, detailedInfo, isLoading, error } = useAppSelector(s => s.user);
  const { availableInterests } = useAppSelector(s => s.interests);
  const { myFriends }          = useAppSelector(s => s.friends);

  const [tab, setTab]         = useState<Tab>('posts');
  const [editOpen, setEditOpen] = useState(false);
  const [localErr, setLocalErr] = useState<string | null>(null);

  const userIdNum = userId ? parseInt(userId) : 0;
  const isOwn     = currentUser?.userId === userIdNum;

  useEffect(() => {
    if (!userIdNum || isNaN(userIdNum)) return;

    dispatch(fetchAvailableInterests());
    dispatch(fetchUserProfile(userIdNum));

    if (isOwn || currentUser?.isAdmin) {
      dispatch(fetchDetailedUserInfo(userIdNum));
    }
    if (isOwn) {
      dispatch(loadMyFriends());
    }
  }, [userIdNum, dispatch, isOwn, currentUser?.isAdmin]);

  const handleSubmitEdit = async (data: {
    username: string;
    birthDate: string;
    bio: string;
    status: string;
    city: string;
    password: string;
    avatarFile: File | null;
    avatarUrl: string | null;
    interests: string[];
  }) => {
    if (!profile) return;
    setLocalErr(null);

    const updateData: UpdateProfileRequest = {
      username:  data.username,
      birthDate: new Date(data.birthDate).toISOString(),
      bio:       data.bio       || undefined,
      status:    data.status    || undefined,
      city:      data.city      || undefined,
      password:  data.password  || undefined,
      userIcon:  data.avatarFile || undefined,
      avatarUrl: data.avatarUrl || null,
      userInterests: data.interests.length > 0 ? data.interests : undefined,
    };

    const res = await dispatch(updateProfile({ userId: userIdNum, data: updateData }));

    if (updateProfile.fulfilled.match(res)) {
      setEditOpen(false);
      dispatch(fetchDetailedUserInfo(userIdNum));
    } else {
      setLocalErr((res.payload as string) || 'Не вдалось оновити профіль');
    }
  };

  // ── Loading ──
  if (isLoading && !profile) {
    return (
      <AppLayout>
        <div className="prof-loading">
          <div className="prof-spinner" />
          Завантаження профілю...
        </div>
      </AppLayout>
    );
  }

  // ── Error ──
  if (error || !profile) {
    return (
      <AppLayout>
        <div className="prof-error">
          <FiAlertCircle size={32} />
          <p>{error || 'Профіль не знайдено'}</p>
        </div>
      </AppLayout>
    );
  }

  const friendCount = isOwn
    ? myFriends.length
    : (detailedInfo?.friends?.length ?? 0);

  const friendsList = isOwn
    ? myFriends
    : (detailedInfo?.friends ?? []);

  return (
    <AppLayout>
      <div className="prof">

        {/* Toast */}
        {localErr && (
          <div className="prof-toast prof-toast--error">
            <FiAlertCircle size={14} />
            {localErr}
            <button onClick={() => setLocalErr(null)}>×</button>
          </div>
        )}

        {/* Шапка профілю */}
        <ProfileHeader
          profile={profile}
          detailedInfo={isOwn ? detailedInfo : null}
          friendCount={friendCount}
          friends={friendsList}
          isOwn={isOwn}
          onEditClick={() => setEditOpen(true)}
        />

        {/* Вкладки */}
        <nav className="prof-tabs">
          <button
            className={`prof-tab${tab === 'posts' ? ' prof-tab--active' : ''}`}
            onClick={() => setTab('posts')}
          >
            <FiMessageCircle size={14} />
            Публікації
          </button>

          <button
            className={`prof-tab${tab === 'about' ? ' prof-tab--active' : ''}`}
            onClick={() => setTab('about')}
          >
            <FiUser size={14} />
            Про користувача
          </button>
        </nav>

        {/* Контент вкладок */}
        <section className="prof-content">
          {tab === 'posts' && (
            <PostsSection
              profileUserId={userIdNum}
              isOwn={isOwn}
            />
          )}

          {tab === 'about' && (
            <AboutCard
              profile={profile}
              detailedInfo={isOwn ? detailedInfo : null}
            />
          )}
        </section>

      </div>

      {/* Модалка редагування */}
      {editOpen && (
        <EditProfileModal
          profile={profile}
          availableInterests={availableInterests}
          initialInterests={detailedInfo?.userInterests?.map(i => i.name) ?? []}
          isLoading={isLoading}
          onClose={() => setEditOpen(false)}
          onSubmit={handleSubmitEdit}
        />
      )}
    </AppLayout>
  );
};

export default ProfilePage;