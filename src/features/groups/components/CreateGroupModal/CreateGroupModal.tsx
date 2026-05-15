import React, { useState, useEffect } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../../../../shared/hooks/useAuth';
import { createNewGroup, clearError } from '../../store/groupsSlice';
import { fetchAvailableInterests } from '../../../profile/store/interestsSlice';
import './CreateGroupModal.css';

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess?: (groupId: number) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onSuccess }) => {
  const dispatch = useAppDispatch();
  const { actionLoading, error } = useAppSelector((s) => s.groups);
  const { availableInterests } = useAppSelector((s) => s.interests);

  const [name, setName]               = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity]               = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (availableInterests.length === 0) dispatch(fetchAvailableInterests());
    return () => { dispatch(clearError()); };
  }, [dispatch, availableInterests.length]);

  const toggleInterest = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !city.trim()) return;

    const result = await dispatch(createNewGroup({
      name: name.trim(),
      description: description.trim() || undefined,
      city: city.trim(),
      interestIds: selectedIds,
    }));

    if (createNewGroup.fulfilled.match(result)) {
      onSuccess?.(result.payload.groupId);
      onClose();
    }
  };

  // Закрити по Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="create-group-modal__overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="create-group-modal">
        {/* Header */}
        <div className="create-group-modal__header">
          <h2 className="create-group-modal__title">Нова група</h2>
          <button className="create-group-modal__close" onClick={onClose} aria-label="Закрити">
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="create-group-modal__form">
          <div className="create-group-modal__field">
            <label className="create-group-modal__label">Назва групи *</label>
            <input
              className="create-group-modal__input"
              placeholder="Наприклад: Любителі хайкінгу"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="create-group-modal__field">
            <label className="create-group-modal__label">Місто *</label>
            <input
              className="create-group-modal__input"
              placeholder="Харків"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="create-group-modal__field">
            <label className="create-group-modal__label">Опис</label>
            <textarea
              className="create-group-modal__textarea"
              placeholder="Розкажи про що ця група..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {availableInterests.length > 0 && (
            <div className="create-group-modal__field">
              <label className="create-group-modal__label">Інтереси</label>
              <div className="create-group-modal__interests">
                {availableInterests.map((interest) => (
                  <button
                    key={interest.interestId}
                    type="button"
                    className={`create-group-modal__interest-btn ${
                      selectedIds.includes(interest.interestId)
                        ? 'create-group-modal__interest-btn--selected'
                        : ''
                    }`}
                    onClick={() => toggleInterest(interest.interestId)}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="create-group-modal__error">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="create-group-modal__footer">
          <button
            className="create-group-modal__btn create-group-modal__btn--cancel"
            onClick={onClose}
            disabled={actionLoading}
          >
            Скасувати
          </button>
          <button
            className="create-group-modal__btn create-group-modal__btn--submit"
            onClick={handleSubmit}
            disabled={actionLoading || !name.trim() || !city.trim()}
          >
            <FiPlus size={16} />
            {actionLoading ? 'Створення...' : 'Створити'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;