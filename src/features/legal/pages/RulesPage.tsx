import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { staggerContainer, staggerItem, fadeUp } from '../../lading/hooks/useScrollAnimation';
import '../styles/RulesPage.css';

const RULES = [
  {
    number: '01',
    title: 'Справжність',
    items: [
      'Один акаунт на одну людину — дублікати видаляються.',
      'Фото профілю має відображати реальну зовнішність власника.',
      'Заборонено видавати себе за іншу людину або бренд.',
    ],
  },
  {
    number: '02',
    title: 'Повага та безпека',
    items: [
      'Harassment, булінг та цькування — підстава для миттєвого бану.',
      'Забороняється надсилати небажаний контент сексуального характеру.',
      'Погрози, заклики до насильства та дискримінаційні висловлювання заборонені.',
      'Повідомляй про порушників через кнопку "Поскаржитись" — ми розглядаємо кожну скаргу.',
    ],
  },
  {
    number: '03',
    title: 'Контент',
    items: [
      'Публікації мають відповідати темі групи або особистому профілю.',
      'Спам, масові розсилки та реклама без дозволу адміністрації заборонені.',
      'Заборонено публікувати контент, що порушує авторські права.',
      'Не розповсюджуй особисті дані інших людей без їхньої згоди.',
    ],
  },
  {
    number: '04',
    title: 'Групи та події',
    items: [
      'Власник групи несе відповідальність за контент всередині неї.',
      'Назва та опис групи мають відповідати реальному змісту спільноти.',
      'Організатор події зобов\'язаний надавати достовірну інформацію.',
      'Групи з неактивним власником понад 6 місяців можуть бути передані адміністрації.',
    ],
  },
  {
    number: '05',
    title: 'Наслідки порушень',
    items: [
      'Попередження — для незначних або перших порушень.',
      'Тимчасове обмеження функцій — для повторних порушень.',
      'Постійний бан — для серйозних або систематичних порушень.',
      'Адміністрація залишає за собою право видаляти будь-який контент без попередження.',
    ],
  },
];

const RulesPage: React.FC = () => (
  <main className="rules-page">
    {/* Hero */}
    <section className="rules-hero">
      <div className="rules-hero__orb rules-hero__orb--1" aria-hidden="true" />
      <div className="rules-hero__orb rules-hero__orb--2" aria-hidden="true" />

      <div className="container rules-hero__inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Link to="/" className="rules-back">
            <FiArrowLeft size={16} />
            На головну
          </Link>
        </motion.div>

        <motion.span
          className="section-label rules-label"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Юридична інформація
        </motion.span>

        <motion.h1
          className="rules-hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Правила спільноти
        </motion.h1>

        <motion.p
          className="rules-hero__sub"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          Базові принципи, які роблять Bokado безпечним і комфортним місцем для всіх.
        </motion.p>

        <motion.p
          className="rules-hero__date"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Остання редакція: {new Date().toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.p>
      </div>

      <div className="rules-hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7F4FD" />
        </svg>
      </div>
    </section>

    {/* Вступ */}
    <section className="rules-intro section">
      <div className="container rules-intro__inner">
        <motion.p
          className="rules-intro__text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Bokado — це простір для справжнього спілкування. Щоб він залишався таким для кожного,
          ми встановили кілька базових правил. Реєструючись на платформі, ти погоджуєшся їх дотримуватись.
        </motion.p>
      </div>
    </section>

    {/* Правила */}
    <section className="rules-content section">
      <div className="container">
        <motion.div
          className="rules-list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
        >
          {RULES.map((rule) => (
            <motion.div key={rule.number} className="rules-card" variants={staggerItem}>
              <div className="rules-card__num" aria-hidden="true">{rule.number}</div>
              <div className="rules-card__body">
                <h2 className="rules-card__title">{rule.title}</h2>
                <ul className="rules-card__list">
                  {rule.items.map((item, i) => (
                    <li key={i} className="rules-card__item">
                      <span className="rules-card__dot" aria-hidden="true" />
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
          className="rules-contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="rules-contact__title">Знайшов(ла) порушення?</h2>
          <p className="rules-contact__text">
            Використовуй кнопку "Поскаржитись" в додатку або напиши нам напряму:{' '}
            <a href="mailto:hello@bokado.com" className="rules-link">
              hello@bokado.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default RulesPage;