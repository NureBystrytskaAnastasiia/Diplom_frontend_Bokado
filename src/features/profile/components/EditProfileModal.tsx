import React, { useRef, useState } from 'react';
import {
  FiX, FiUser, FiCalendar, FiMapPin, FiLock, FiEdit3,
  FiHeart, FiCamera, FiCheck, FiSave,
} from 'react-icons/fi';
import type { Interest, UserProfile } from '../types/user';

interface Props {
  profile: UserProfile;
  availableInterests: Interest[];
  initialInterests: string[]; // імена обраних інтересів
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: {
    username: string;
    birthDate: string;
    bio: string;
    status: string;
    city: string;
    password: string;
    avatarFile: File | null;
    avatarUrl: string | null;
    interests: string[];
  }) => void;
}

const EditProfileModal: React.FC<Props> = ({
  profile, availableInterests, initialInterests, isLoading, onClose, onSubmit,
}) => {
  // ── Базові поля
  const [username, setUsername]   = useState(profile.username);
  const [birthDate, setBirthDate] = useState(profile.birthDate?.split('T')[0] ?? '');
  const [bio, setBio]             = useState(profile.bio ?? '');
  const [status, setStatus]       = useState(profile.status ?? '');
  const [city, setCity]           = useState(profile.city ?? '');
  const [password, setPassword]   = useState('');

  // ── Аватарка
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatarUrl
      ? (profile.avatarUrl.startsWith('http') ? profile.avatarUrl : `https://localhost:7192${profile.avatarUrl}`)
      : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Інтереси
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialInterests);
  const [interestQuery, setInterestQuery] = useState('');

  const [localError, setLocalError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setLocalError('Дозволені формати: JPG, PNG, GIF, WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError('Максимальний розмір — 5 МБ');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setLocalError(null);
  };

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  // Групування інтересів за категорією
  const grouped = availableInterests.reduce((acc, i) => {
    const cat = i.category || 'Інше';
    (acc[cat] ||= []).push(i);
    return acc;
  }, {} as Record<string, Interest[]>);

  const filterChip = (i: Interest) =>
    !interestQuery || i.name.toLowerCase().includes(interestQuery.toLowerCase());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setLocalError('Ім\'я користувача обов\'язкове');
      return;
    }
    if (username.length < 3 || username.length > 20) {
      setLocalError('Ім\'я має бути від 3 до 20 символів');
      return;
    }
    if (password && password.length < 6) {
      setLocalError('Пароль має бути від 6 символів');
      return;
    }
    setLocalError(null);

    onSubmit({
      username: username.trim(),
      birthDate,
      bio,
      status,
      city,
      password,
      avatarFile,
      avatarUrl: avatarFile ? null : profile.avatarUrl,
      interests: selectedInterests,
    });
  };

  return (
    <div className="pe-modal__overlay" onClick={onClose}>
      <div className="pe-modal" onClick={(e) => e.stopPropagation()}>

        <header className="pe-modal__header">
          <h2 className="pe-modal__title">Редагування профілю</h2>
          <button className="pe-modal__close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </header>

        <form className="pe-form" onSubmit={handleSubmit}>

          {localError && <div className="pe-form__error">{localError}</div>}

          {/* Avatar */}
          <div className="pe-avatar-block">
            <div className="pe-avatar-preview">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" />
              ) : (
                <div className="pe-avatar-preview__fallback">
                  {username.charAt(0).toUpperCase() || '?'}
                </div>
              )}
              <button
                type="button"
                className="pe-avatar-change"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiCamera size={14} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileSelect}
              />
            </div>
            <div className="pe-avatar-info">
              <strong>Аватар</strong>
              <span>JPG, PNG, GIF або WEBP до 5 МБ</span>
            </div>
          </div>

          {/* Username + city */}
          <div className="pe-form__row">
            <div className="pe-field">
              <label><FiUser size={13} /> Ім'я користувача</label>
              <input
                className="pe-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                required
              />
            </div>
            <div className="pe-field">
              <label><FiMapPin size={13} /> Місто</label>
              <input
                className="pe-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Не вказано"
              />
            </div>
          </div>

          {/* Birthday + password */}
          <div className="pe-form__row">
            <div className="pe-field">
              <label><FiCalendar size={13} /> Дата народження</label>
              <input
                type="date"
                className="pe-input"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="pe-field">
              <label><FiLock size={13} /> Новий пароль</label>
              <input
                type="password"
                className="pe-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Залиште порожнім, якщо не змінюєте"
              />
            </div>
          </div>

          {/* Status */}
          <div className="pe-field">
            <label><FiEdit3 size={13} /> Статус</label>
            <input
              className="pe-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="Коротка фраза про себе"
              maxLength={100}
            />
            <span className="pe-hint">{status.length} / 100</span>
          </div>

          {/* Bio */}
          <div className="pe-field">
            <label><FiEdit3 size={13} /> Біо</label>
            <textarea
              className="pe-input pe-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Розкажіть про себе детальніше..."
              rows={4}
              maxLength={500}
            />
            <span className="pe-hint">{bio.length} / 500</span>
          </div>

          {/* Interests */}
          <div className="pe-field">
            <label><FiHeart size={13} /> Інтереси ({selectedInterests.length})</label>
            <input
              className="pe-input"
              value={interestQuery}
              onChange={(e) => setInterestQuery(e.target.value)}
              placeholder="Пошук інтересів..."
            />

            <div className="pe-interests">
              {Object.entries(grouped).map(([cat, items]) => {
                const visible = items.filter(filterChip);
                if (visible.length === 0) return null;
                return (
                  <div key={cat} className="pe-interests__group">
                    <span className="pe-interests__group-title">{cat}</span>
                    <div className="pe-interests__chips">
                      {visible.map(i => {
                        const active = selectedInterests.includes(i.name);
                        return (
                          <button
                            key={i.interestId}
                            type="button"
                            className={`pe-chip ${active ? 'pe-chip--active' : ''}`}
                            onClick={() => toggleInterest(i.name)}
                          >
                            {active && <FiCheck size={11} />}
                            {i.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {Object.keys(grouped).length === 0 && (
                <div className="pe-interests__empty">Інтереси завантажуються...</div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pe-form__actions">
            <button type="button" className="pe-btn pe-btn--cancel" onClick={onClose}>
              Скасувати
            </button>
            <button type="submit" className="pe-btn pe-btn--save" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="pe-spinner" />
                  Збереження...
                </>
              ) : (
                <>
                  <FiSave size={14} /> Зберегти зміни
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;