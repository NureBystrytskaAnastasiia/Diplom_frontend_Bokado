import React from 'react';
import {
  FiX, FiAlertCircle, FiInfo, FiArrowRight,
  FiMessageSquare, FiCalendar, FiUsers, FiUser, FiEdit,
  FiMic, FiImage, FiVideo, FiHeart, FiUserPlus, FiSend,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import type { Challenge } from '../types/challenge';

interface Props {
  challenge: Challenge;
  onClose: () => void;
}

// ── Підказки на основі ID челенджа (відповідає логіці beck-у ChallengeRepository.cs)
interface Hint {
  icon: React.ReactNode;
  text: string;
  link?: { to: string; label: string };
}

const HINTS: Record<number, Hint[]> = {
  1: [{
    icon: <FiMessageSquare size={14} />,
    text: 'Приєднайтесь принаймні до 3 чатів за останні 7 днів',
    link: { to: '/chat', label: 'До чатів' },
  }],
  2: [{
    icon: <FiSend size={14} />,
    text: 'Відправте 10 повідомлень за останні 7 днів',
    link: { to: '/chat', label: 'До чатів' },
  }],
  3: [{
    icon: <FiCalendar size={14} />,
    text: 'Приєднайтесь до будь-якої події за останні 7 днів',
    link: { to: '/events', label: 'До подій' },
  }],
  4: [{
    icon: <FiUserPlus size={14} />,
    text: 'Додайте 5 нових друзів за останні 7 днів',
    link: { to: '/requests', label: 'До запитів' },
  }],
  5: [{
    icon: <FiMessageSquare size={14} />,
    text: 'Напишіть повідомлення у 3 різних чатах за останні 7 днів',
    link: { to: '/chat', label: 'До чатів' },
  }],
  6: [{
    icon: <FiCalendar size={14} />,
    text: 'Створіть власну подію',
    link: { to: '/events/create', label: 'Створити подію' },
  }],
  7: [{
    icon: <FiUsers size={14} />,
    text: 'Майте щонайменше 7 друзів',
    link: { to: '/friends', label: 'До друзів' },
  }],
  8: [{
    icon: <FiMic size={14} />,
    text: 'Надішліть голосове повідомлення (.mp3) у будь-якому чаті за останні 7 днів',
    link: { to: '/chat', label: 'До чатів' },
  }],
  9: [{
    icon: <FiCalendar size={14} />,
    text: 'Відвідайте подію, яка відбулась за останні 7 днів',
    link: { to: '/events', label: 'До подій' },
  }],
  10: [
    { icon: <FiUser    size={14} />, text: 'Додайте дату народження у профіль' },
    { icon: <FiImage   size={14} />, text: 'Завантажте аватарку' },
    { icon: <FiEdit    size={14} />, text: 'Заповніть біо (about)' },
    { icon: <FiHeart   size={14} />, text: 'Додайте принаймні один інтерес',
      link: { to: '/profile', label: 'До профілю' } },
  ],
  11: [{
    icon: <FiEdit size={14} />,
    text: 'Опублікуйте свій перший пост',
    link: { to: '/profile', label: 'До профілю' },
  }],
  12: [{
    icon: <FiHeart size={14} />,
    text: 'Створіть пост, який збере 5 вподобань',
    link: { to: '/profile', label: 'До профілю' },
  }],
  13: [{
    icon: <FiUsers size={14} />,
    text: 'Приєднайтесь до будь-якої групи',
    link: { to: '/groups', label: 'До груп' },
  }],
  14: [{
    icon: <FiUsers size={14} />,
    text: 'Створіть свою групу',
    link: { to: '/groups', label: 'До груп' },
  }],
  15: [{
    icon: <FiImage size={14} />,
    text: 'Надішліть зображення (.jpg, .png, .gif) у будь-якому чаті',
    link: { to: '/chat', label: 'До чатів' },
  }],
  16: [{
    icon: <FiVideo size={14} />,
    text: 'Здійсніть відеодзвінок у чаті',
    link: { to: '/chat', label: 'До чатів' },
  }],
  17: [{
    icon: <FiUserPlus size={14} />,
    text: 'Отримайте принаймні 3 запити в друзі',
    link: { to: '/requests', label: 'До запитів' },
  }],
  18: [{
    icon: <FiUsers size={14} />,
    text: 'Майте щонайменше 10 друзів',
    link: { to: '/friends', label: 'До друзів' },
  }],
  19: [{
    icon: <FiHeart size={14} />,
    text: 'Поставте лайк на 10 постів',
    link: { to: '/dashboard', label: 'До стрічки' },
  }],
  20: [{
    icon: <FiUsers size={14} />,
    text: 'Будьте учасником щонайменше 3 груп',
    link: { to: '/groups', label: 'До груп' },
  }],
};

const FailedConditionsModal: React.FC<Props> = ({ challenge, onClose }) => {
  const navigate = useNavigate();
  const hints = HINTS[challenge.challengeId] ?? [{
    icon: <FiInfo size={14} />,
    text: 'Перевірте опис челенджу та виконайте всі умови',
  }];

  return (
    <div className="ch-modal__overlay" onClick={onClose}>
      <div className="ch-modal ch-modal--failed" onClick={(e) => e.stopPropagation()}>

        <div className="ch-modal__header ch-modal__header--failed">
          <div className="ch-modal__failed-icon">
            <FiAlertCircle size={24} />
          </div>
          <div className="ch-modal__head-titles">
            <h2 className="ch-modal__title">Умови не виконані</h2>
            <p className="ch-modal__subtitle">Ще трохи зусиль — і нагорода ваша!</p>
          </div>
          <button className="ch-modal__close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="ch-modal__section">
          <div className="ch-modal__failed-quote">
            <strong>{challenge.title}</strong>
            <p>{challenge.description}</p>
          </div>
        </div>

        <div className="ch-modal__section">
          <h3 className="ch-modal__section-title">
            <FiInfo size={14} /> Що потрібно зробити
          </h3>
          <div className="ch-modal__hints">
            {hints.map((hint, idx) => (
              <div key={idx} className="ch-modal__hint">
                <span className="ch-modal__hint-icon">{hint.icon}</span>
                <div className="ch-modal__hint-body">
                  <span className="ch-modal__hint-text">{hint.text}</span>
                  {hint.link && (
                    <button
                      className="ch-modal__hint-link"
                      onClick={() => { navigate(hint.link!.to); onClose(); }}
                    >
                      {hint.link.label} <FiArrowRight size={11} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ch-modal__footer">
          <button className="ch-modal__btn ch-modal__btn--cancel" onClick={onClose}>
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
};

export default FailedConditionsModal;
