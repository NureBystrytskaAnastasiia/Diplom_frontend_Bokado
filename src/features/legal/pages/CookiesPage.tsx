import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { fadeUp, staggerContainer, staggerItem } from '../../lading/hooks/useScrollAnimation';
import '../styles/CookiesPage.css';

const SECTIONS = [
  {
    title: 'Що таке cookies?',
    text: 'Cookies — це невеликі текстові файли, які зберігаються у вашому браузері під час відвідування сайту. Вони допомагають сайту запам\'ятати ваші налаштування та підтримувати сесію авторизації.',
  },
  {
    title: 'Які cookies ми використовуємо?',
    text: 'Bokado використовує виключно технічні (необхідні) cookies для роботи авторизації. Без них неможливо підтримувати вашу сесію та захищати акаунт. Ми не використовуємо маркетингові або аналітичні cookies.',
  },
  {
    title: 'Чи передаємо ми дані третім особам?',
    text: 'Ні. Дані з cookies не передаються рекламним мережам, аналітичним сервісам або будь-яким третім особам. Ваші дані залишаються тільки між вами і Bokado.',
  },
  {
    title: 'Як керувати cookies?',
    text: 'Ви можете видалити або заблокувати cookies через налаштування браузера. Зверніть увагу: блокування технічних cookies може призвести до неможливості входу в акаунт.',
  },
  {
    title: 'Зміни в політиці',
    text: 'Ми можемо час від часу оновлювати цю сторінку. Актуальна версія завжди доступна за цим посиланням. Рекомендуємо переглядати її періодично.',
  },
];

const CookiesPage: React.FC = () => (
  <main className="cookies-page">
    {/* Hero */}
    <section className="cookies-hero">
      <div className="cookies-hero__orb cookies-hero__orb--1" aria-hidden="true" />
      <div className="cookies-hero__orb cookies-hero__orb--2" aria-hidden="true" />

      <div className="container cookies-hero__inner">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <Link to="/" className="cookies-back">
            <FiArrowLeft size={16} />
            На головну
          </Link>
        </motion.div>

        <motion.span
          className="section-label cookies-label"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Юридична інформація
        </motion.span>

        <motion.h1
          className="cookies-hero__title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          Політика cookies
        </motion.h1>

        <motion.p
          className="cookies-hero__sub"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
        >
          Остання редакція: {new Date().toLocaleDateString('uk-UA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.p>
      </div>

      <div className="cookies-hero__wave" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7F4FD" />
        </svg>
      </div>
    </section>

    {/* Контент */}
    <section className="cookies-content section">
      <div className="container cookies-content__inner">
        <motion.div
          className="cookies-sections"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {SECTIONS.map((s, i) => (
            <motion.div key={i} className="cookies-section" variants={staggerItem}>
              <h2 className="cookies-section__title">{s.title}</h2>
              <p className="cookies-section__text">{s.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Контакт */}
        <motion.div
          className="cookies-contact"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <h2 className="cookies-section__title">Є питання?</h2>
          <p className="cookies-section__text">
            Якщо у вас є запитання щодо нашої політики cookies — напишіть нам:{' '}
            <a href="mailto:hello@bokado.com" className="cookies-link">
              hello@bokado.com
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default CookiesPage;