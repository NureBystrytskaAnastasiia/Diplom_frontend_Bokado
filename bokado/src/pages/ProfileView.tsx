import React, { useEffect } from 'react';
import type { UserProfile } from '../types/user';
import '../styles/ProfilePages.css';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { loadMyFriends } from '../store/slices/friendsSlice';

interface ProfileViewProps {
  profile: UserProfile;
  detailedInfo?: {
    email?: string;
    userInterests?: { interestId: number; name: string }[];
    friends?: { userId: number; username: string }[];
  };
  isOwnProfile: boolean;
  onEditClick: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  detailedInfo,
  isOwnProfile,
  onEditClick,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const myFriends = useSelector((state: RootState) => state.friends.myFriends);

  useEffect(() => {
    if (isOwnProfile) {
      dispatch(loadMyFriends());
    }
  }, [dispatch, isOwnProfile]);

  const friendCount = isOwnProfile
    ? myFriends.length
    : detailedInfo?.friends?.length ?? 0;

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="avatar-container">
          {profile.avatarUrl ? (
            <div className="avatar-wrapper">
              <img
                src={
                  profile.avatarUrl.startsWith('http')
                    ? profile.avatarUrl
                    : `https://localhost:7192${profile.avatarUrl}`
                }
                alt="Avatar"
                className="profile-avatar"
              />
            </div>
          ) : (
            <div className="avatar-placeholder">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="profile-main-info">
          <h2 className="username">
            {profile.username}
            {profile.isPremium && (
              <span className="premium-badge">Premium</span>
            )}
            {profile.isAdmin && <span className="admin-badge">Admin</span>}
          </h2>
          <p className="member-since">
            Акаунт створено {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="profile-details-grid">
        <div className="detail-card">
          <h3 className="detail-title">Про себе</h3>
          {profile.bio ? (
            <p className="bio-text">{profile.bio}</p>
          ) : (
            <p className="bio-text placeholder">Немає інформації про себе</p>
          )}
        </div>

        <div className="detail-card">
          <h3 className="detail-title">Деталі</h3>
          <div className="detail-row">
            <span className="detail-label">Дата народження:</span>
            <span className="detail-value">
              {new Date(profile.birthDate).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Рівень:</span>
            <span className="detail-value level-value">{profile.level}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Статус:</span>
            <span className="detail-value">
              {profile.isPremium ? 'Premium' : 'Regular'}
            </span>
          </div>
          {profile.city && (
            <div className="detail-row">
              <span className="detail-label">Місто:</span>
              <span className="detail-value">{profile.city}</span>
            </div>
          )}
          <div className="detail-row">
            <span className="detail-label">Кількість друзів:</span>
            <span className="detail-value">{friendCount}</span>
          </div>
        </div>

        {detailedInfo?.userInterests && detailedInfo.userInterests.length > 0 && (
          <div className="detail-card interests-card">
            <h3 className="detail-title">Інтереси</h3>
            <div className="interests-display">
              {detailedInfo.userInterests.map((interest) => (
                <span key={interest.interestId} className="interest-tag">
                  {interest.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {detailedInfo && (
          <div className="detail-card">
            <h3 className="detail-title">Контактна інформація</h3>
            <div className="detail-row">
              <span className="detail-label">Пошта:</span>
              <span className="detail-value">{detailedInfo.email}</span>
            </div>
            {detailedInfo.friends && detailedInfo.friends.length > 0 && (
              <div className="detail-row">
                <span className="detail-value">
                 
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="profile-actions">
        {isOwnProfile && (
          <button onClick={onEditClick} className="edit-button">
            Редагувати профіль
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
