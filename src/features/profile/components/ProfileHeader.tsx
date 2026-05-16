// src/features/profile/components/ProfileHeader.tsx
import React, { useState } from 'react';
import {
  FiEdit2,
  FiMapPin,
  FiCalendar,
  FiStar,
  FiAward,
  FiMail,
  FiCheckCircle,
} from 'react-icons/fi';

import type { UserProfile, UserDetailInfo } from '../types/user';
import type { FriendDto } from '../../friends/types/friends';
import FriendsModal from './FriendsModal';

interface Props {
  profile:     UserProfile;
  detailedInfo: UserDetailInfo | null;
  friendCount: number;
  friends:     FriendDto[];   // ← NEW: список друзів для модалки
  isOwn:       boolean;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<Props> = ({
  profile,
  detailedInfo,
  friendCount,
  friends,
  isOwn,
  onEditClick,
}) => {
  const [friendsOpen, setFriendsOpen] = useState(false);

  const avatarUrl = profile.avatarUrl
    ? (profile.avatarUrl.startsWith('http')
        ? profile.avatarUrl
        : `https://localhost:7192${profile.avatarUrl}`)
    : null;

  return (
    <>
      <section className="ph">
        <div className="ph__banner" />

        <div className="ph__body">

          <div className="ph__avatar-wrap">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile.username}
                className="ph__avatar"
              />
            ) : (
              <div className="ph__avatar ph__avatar--fallback">
                {profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="ph__content">

            <div className="ph__top">
              <div className="ph__names">
                <h1 className="ph__username">
                  {profile.username}

                  {profile.isPremium && (
                    <span className="ph__badge ph__badge--premium" title="Premium">
                      <FiStar size={11} />
                      Premium
                    </span>
                  )}

                  {profile.isAdmin && (
                    <span className="ph__badge ph__badge--admin" title="Administrator">
                      <FiCheckCircle size={11} />
                      Admin
                    </span>
                  )}
                </h1>

                {profile.status && (
                  <p className="ph__status">«{profile.status}»</p>
                )}
              </div>

              {isOwn && (
                <button className="ph__edit-btn" onClick={onEditClick}>
                  <FiEdit2 size={14} />
                  Редагувати
                </button>
              )}
            </div>

            <div className="ph__meta">
              {profile.city && (
                <span className="ph__meta-chip">
                  <FiMapPin size={12} />
                  {profile.city}
                </span>
              )}

              <span className="ph__meta-chip">
                <FiCalendar size={12} />
                На Bokado з {new Date(profile.createdAt).toLocaleDateString('uk-UA', {
                  month: 'long',
                  year:  'numeric',
                })}
              </span>

              {detailedInfo?.email && (
                <span className="ph__meta-chip">
                  <FiMail size={12} />
                  {detailedInfo.email}
                </span>
              )}
            </div>

            <div className="ph__stats">

              {/* Рівень */}
              <div className="ph__stat">
                <span className="ph__stat-val">{profile.level}</span>
                <span className="ph__stat-lbl">
                  <FiAward size={11} />
                  Рівень
                </span>
              </div>

              {/* Друзі — клікабельний */}
              <button
                className="ph__stat ph__stat--clickable"
                onClick={() => setFriendsOpen(true)}
                title="Переглянути список друзів"
              >
                <span className="ph__stat-val">{friendCount}</span>
                <span className="ph__stat-lbl">Друзів</span>
              </button>

              {/* Челенджі */}
              <div className="ph__stat">
                <span className="ph__stat-val">
                  {detailedInfo?.userChallenges?.filter((c: any) => c.isCompleted).length ?? 0}
                </span>
                <span className="ph__stat-lbl">Челенджів</span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Модалка друзів */}
      {friendsOpen && (
        <FriendsModal
          friends={friends}
          onClose={() => setFriendsOpen(false)}
        />
      )}
    </>
  );
};

export default ProfileHeader;