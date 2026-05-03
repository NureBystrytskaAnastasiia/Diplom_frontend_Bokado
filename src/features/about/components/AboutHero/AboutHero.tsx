import React from 'react';
import { motion } from 'framer-motion';
import './AboutHero.css';

const AboutHero: React.FC = () => (
  <section className="about-hero">
    <div className="about-hero__orb about-hero__orb--1" aria-hidden="true" />
    <div className="about-hero__orb about-hero__orb--2" aria-hidden="true" />

    <div className="container about-hero__inner">
      <motion.span
        className="section-label"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        Про Bokado
      </motion.span>

      <motion.h1
        className="about-hero__title"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        Ми будуємо місце,<br />
        де <em>люди знаходять</em><br />
        одне одного
      </motion.h1>

      <motion.p
        className="about-hero__sub"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.8 }}
      >
        Українська платформа для справжнього спілкування —<br />
        через інтереси, події та спільні виклики.
      </motion.p>
    </div>

    <div className="about-hero__wave" aria-hidden="true">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F7F4FD" />
      </svg>
    </div>
  </section>
);

export default AboutHero;
