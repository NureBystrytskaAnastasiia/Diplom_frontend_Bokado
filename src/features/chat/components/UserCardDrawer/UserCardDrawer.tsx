// src/features/chat/components/UserCardDrawer/UserCardDrawer.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX, FiUser, FiMapPin, FiClock, FiExternalLink,
  FiCircle,
} from 'react-icons/fi';
import axiosInstance, { BASE_URL } from '../../../../shared/api/axiosInstance';
import type { ChatUser } from '../../types/chat';
import './UserCardDrawer.css';

interface OnlineStatus {
  userId:     number;
  isOnline:   boolean;
  lastActive: string;
}

interface UserProfile {
  userId:    number;
  username:  string;
  avatarUrl: string | null;
  bio:       string | null;
  status:    string | null;
  city:      string | null;
  level:     number;
  isPremium: boolean;
}

interface Props {
  user:    ChatUser;
  onClose: () => void;
}

const resolveUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

const formatLastSeen = (iso: string): string => {
  const date = new Date(iso);
  const now  = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60)     return 'щойно';
  if (diff < 3600)   return `${Math.floor(diff / 60)} хв тому`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} год тому`;
  if (diff < 172800) return 'вчора';
  return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
};

const UserCardDrawer: React.FC<Props> = ({ user, onClose }) => {
  const navigate = useNavigate();

  const [profile,  setProfile]  = useState<UserProfile | null>(null);
  const [status,   setStatus]   = useState<OnlineStatus | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [profileRes, statusRes] = await Promise.all([
          axiosInstance.get<UserProfile>(`/api/users/${user.userId}`),
          axiosInstance.get<OnlineStatus>(`/api/users/${user.userId}/status`),
        ]);
        setProfile(profileRes.data);
        setStatus(statusRes.data);
      } catch {
        // показуємо хоча б те що є в user
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.userId]);

  // Закрити по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const avatarUrl  = resolveUrl(profile?.avatarUrl ?? user.avatarUrl);
  const name       = profile?.username ?? user.username;
  const isOnline   = status?.isOnline ?? false;

  const goToProfile = () => {
    onClose();
    navigate(`/profile/${user.userId}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="ucd-backdrop" onClick={onClose} />

      {/* Drawer */}
      <aside className="ucd-drawer">

        {/* Close */}
        <button className="ucd-close" onClick={onClose} title="Закрити">
          <FiX size={18} />
        </button>

        {loading ? (
          <div className="ucd-loading">
            <span className="ucd-spinner" />
            Завантаження...
          </div>
        ) : (
          <>
            {/* Avatar + name */}
            <div className="ucd-hero">
              <div className="ucd-avatar-wrap">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="ucd-avatar" />
                ) : (
                  <div className="ucd-avatar ucd-avatar--fallback">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Онлайн-крапка */}
                <span className={`ucd-dot${isOnline ? ' ucd-dot--online' : ''}`} />
              </div>

              <h2 className="ucd-name">
                {name}
                {profile?.isPremium && (
                  <span className="ucd-badge ucd-badge--premium">Premium</span>
                )}
              </h2>

              {profile?.status && (
                <p className="ucd-user-status">«{profile.status}»</p>
              )}
            </div>

            {/* Статус онлайн */}
            <div className="ucd-online-row">
              <FiCircle
                size={8}
                className={isOnline ? 'ucd-online-icon--on' : 'ucd-online-icon--off'}
                fill="currentColor"
              />
              <span className="ucd-online-text">
                {isOnline
                  ? 'Зараз онлайн'
                  : status
                    ? `Був(ла) ${formatLastSeen(status.lastActive)}`
                    : 'Статус невідомий'}
              </span>
            </div>

            {/* Інфо */}
            <div className="ucd-info">
              {profile?.city && (
                <div className="ucd-info-row">
                  <FiMapPin size={14} className="ucd-info-icon" />
                  <span>{profile.city}</span>
                </div>
              )}

              {status && !isOnline && (
                <div className="ucd-info-row">
                  <FiClock size={14} className="ucd-info-icon" />
                  <span>
                    Останній візит:{' '}
                    {new Date(status.lastActive).toLocaleString('uk-UA', {
                      day:    'numeric',
                      month:  'long',
                      hour:   '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              )}

              {profile?.level && (
                <div className="ucd-info-row">
                  <span className="ucd-level-icon">⭐</span>
                  <span>Рівень {profile.level}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile?.bio && (
              <div className="ucd-bio">
                <p className="ucd-bio__label">Про себе</p>
                <p className="ucd-bio__text">{profile.bio}</p>
              </div>
            )}

            {/* CTA */}
            <button className="ucd-profile-btn" onClick={goToProfile}>
              <FiUser size={15} />
              Переглянути профіль
              <FiExternalLink size={13} className="ucd-profile-btn__arrow" />
            </button>
          </>
        )}
      </aside>
    </>
  );
};

export default UserCardDrawer;