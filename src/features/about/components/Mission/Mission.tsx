import React from 'react';
import { motion } from 'framer-motion';
import { MISSION, STATS } from '../../constants/aboutData';
import {
  staggerContainer,
  staggerItem,
  slideLeft,
  useScrollAnimation,
} from '../../../lading/hooks/useScrollAnimation';
import './Mission.css';

const Mission: React.FC = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section className="mission section">
      <div className="container mission__inner">

        {/* Лівий — текст */}
        <motion.div
          className="mission__text"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={slideLeft}
        >
          <span className="section-label">{MISSION.eyebrow}</span>
          <h2 className="section-title mission__title">{MISSION.title}</h2>
          <div className="mission__paragraphs">
            {MISSION.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        {/* Правий — статистика */}
        <motion.div
          className="mission__stats"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {STATS.map((s) => (
            <motion.div key={s.label} className="mission__stat" variants={staggerItem}>
              <strong className="mission__stat-value">{s.value}</strong>
              <span className="mission__stat-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Mission;
