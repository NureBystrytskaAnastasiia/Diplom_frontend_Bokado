import React from 'react';
import { FiInfo, FiHeart, FiCalendar, FiClock } from 'react-icons/fi';
import type { UserProfile, UserDetailInfo } from '../types/user';

interface Props {
  profile: UserProfile;
  detailedInfo: UserDetailInfo | null;
}

const AboutCard: React.FC<Props> = ({ profile, detailedInfo }) => {
  const interests = detailedInfo?.userInterests ?? profile.userInterests ?? [];
  const age = (() => {
    if (!profile.birthDate) return null;
    const bd = new Date(profile.birthDate);
    const now = new Date();
    let years = now.getFullYear() - bd.getFullYear();
    const m = now.getMonth() - bd.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < bd.getDate())) years--;
    return years > 0 && years < 130 ? years : null;
  })();

  return (
    <div className="about">
      {/* Bio */}
      <section className="about__section">
        <h3 className="about__title">
          <FiInfo size={14} /> Про себе
        </h3>
        {profile.bio ? (
          <p className="about__bio">{profile.bio}</p>
        ) : (
          <p className="about__placeholder">Користувач ще не додав опис</p>
        )}
      </section>

      {/* Personal */}
      <section className="about__section">
        <h3 className="about__title">
          <FiCalendar size={14} /> Особисте
        </h3>
        <dl className="about__list">
          {profile.birthDate && (
            <div className="about__row">
              <dt>Дата народження</dt>
              <dd>
                {new Date(profile.birthDate).toLocaleDateString('uk-UA', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
                {age !== null && <span className="about__age"> · {age} років</span>}
              </dd>
            </div>
          )}
          <div className="about__row">
            <dt>Останній вхід</dt>
            <dd>
              <FiClock size={11} /> {new Date(profile.lastActive).toLocaleString('uk-UA')}
            </dd>
          </div>
        </dl>
      </section>

      {/* Interests */}
      <section className="about__section">
        <h3 className="about__title">
          <FiHeart size={14} /> Інтереси
        </h3>
        {interests.length > 0 ? (
          <div className="about__chips">
            {interests.map(i => (
              <span key={i.interestId} className="about__chip">{i.name}</span>
            ))}
          </div>
        ) : (
          <p className="about__placeholder">Немає доданих інтересів</p>
        )}
      </section>
    </div>
  );
};

export default AboutCard;