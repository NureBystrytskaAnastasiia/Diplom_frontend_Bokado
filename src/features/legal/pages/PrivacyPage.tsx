import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { staggerContainer, staggerItem, fadeUp } from '../../lading/hooks/useScrollAnimation';
import '../styles/PrivacyPage.css';

const SECTIONS = [
  {
    number: '01',
    title: 'Які дані ми збираємо?',
    items: [
      'Реєстраційні дані: email, нікнейм, пароль (у зашифрованому вигляді).',
      'Дані профілю: фото, місто, дата народження, розділ "Про себе", інтереси.',
      'Активність на платформі: участь у групах, подіях, виконані челенджі.',
      'Повідомлення в особистих та групових чатах.',
      'Технічні дані: час входу, тип пристрою (для безпеки акаунту).',
    ],
  },
  {
    number: '02',
    title: 'Навіщо нам ці дані?',
    items: [
      'Для роботи авторизації та захисту твого акаунту.',
      'Для персоналізованих рекомендацій груп та людей за інтересами.',
      'Для відображення профілю іншим користувачам платформи.',
      'Для надсилання важливих сповіщень щодо акаунту (не реклами).',
    ],
  },
  {
    number: '03',
    title: 'Хто має доступ до даних?',
    items: [
      'Твої публічні дані (нікнейм, фото, місто, інтереси) бачать інші авторизовані користувачі.',
      'Повідомлення в особистому чаті бачать тільки два учасники переписки.',
      'Повідомлення в груповому чаті бачать всі учасники групи.',
      'Адміністратори платформи мають доступ до даних виключно для модерації.',
      'Третім особам, рекламним мережам та аналітичним сервісам дані не передаються.',
    ],
  },
  {
    number: '04',
    title: 'Скільки зберігаються дані?',
    items: [
      'Дані акаунту зберігаються поки акаунт активний.',
      'Після видалення акаунту дані видаляються протягом 30 днів.',
      'Повідомлення в чаті підтримки з адміністратором зберігаються 30 днів.',
      'Технічні логи для безпеки зберігаються не більше 90 днів.',
    ],
  },
  {
    number: '05',
    title: 'Твої права',
    items: [
      'Право на доступ — ти можеш запросити копію своїх даних.',
      'Право на виправлення — ти можеш редагувати дані в налаштуваннях профілю.',
      'Право на видалення — ти можеш видалити акаунт і всі пов\'язані дані.',
      'Право на заперечення — ти можеш звернутись до нас з питаннями щодо обробки даних.',
    ],
  },
  {
    number: '06',
    title: 'Безпека даних',
    items: [
      'Паролі зберігаються у зашифрованому вигляді — ми не знаємо твій пароль.',
      'Авторизація захищена JWT токенами з терміном дії 7 днів.',
      'З\'єднання між додатком і сервером зашифроване (HTTPS).',
      'У разі підозрілої активності акаунт може бути тимчасово заблокований для перевірки.',
    ],
  },
];

const PrivacyPage: React.FC = () => (
  <main className="privacy-page">
    {/* Hero */}
    <section className="privacy-hero">
      <div className="privacy-hero__orb privacy-hero__orb--1" aria-hidden="true" />
      <div className="privacy-hero__orb privacy-hero__orb--2" aria-hidden="true" />

      <div className="container privacy-hero__inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Link to="/" className="privacy-back">
            <FiArrowLeft size={16} />
            На головну
          </Link>
        </motion.div>

        <motion.span
          className="section-label privacy-label"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Юридична інформація
        </motion.span>

        <motion.h1
          className="privacy-hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Політика<br />конфіденційності
        </motion.h1>

        <motion.p
          className="privacy-hero__sub"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          Ми дбаємо про твої дані. Тут чесно і зрозуміло — що збираємо,
          навіщо і як захищаємо.
        </motion.p>

        <motion.p
          className="privacy-hero__date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Остання редакція: {new Date().toLocaleDateString('uk-UA', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </motion.p>
      </div>

      <div className="privacy-hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7F4FD" />
        </svg>
      </div>
    </section>

    {/* Вступ */}
    <section className="privacy-intro section">
      <div className="container privacy-intro__inner">
        <motion.p
          className="privacy-intro__text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Реєструючись на Bokado, ти довіряєш нам певні персональні дані.
          Ми ставимося до цього відповідально — не продаємо дані, не показуємо рекламу
          і не передаємо інформацію третім особам.
        </motion.p>
      </div>
    </section>

    {/* Секції */}
    <section className="privacy-content section">
      <div className="container">
        <motion.div
          className="privacy-list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
        >
          {SECTIONS.map((s) => (
            <motion.div key={s.number} className="privacy-card" variants={staggerItem}>
              <div className="privacy-card__num" aria-hidden="true">{s.number}</div>
              <div className="privacy-card__body">
                <h2 className="privacy-card__title">{s.title}</h2>
                <ul className="privacy-card__list">
                  {s.items.map((item, i) => (
                    <li key={i} className="privacy-card__item">
                      <span className="privacy-card__dot" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Контакт */}
        <motion.div
          className="privacy-contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="privacy-contact__title">Питання щодо даних?</h2>
          <p className="privacy-contact__text">
            Якщо ти хочеш отримати копію своїх даних, видалити акаунт або маєш
            інші питання щодо конфіденційності — напиши нам:{' '}
            <a href="mailto:hello@bokado.com" className="privacy-link">
              hello@bokado.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default PrivacyPage;