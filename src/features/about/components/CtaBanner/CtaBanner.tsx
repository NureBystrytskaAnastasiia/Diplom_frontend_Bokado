import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { fadeUp } from '../../../lading/hooks/useScrollAnimation';
import './CtaBanner.css';

const CtaBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-banner section">
      <div className="cta-banner__orb cta-banner__orb--1" aria-hidden="true" />
      <div className="cta-banner__orb cta-banner__orb--2" aria-hidden="true" />

      <div className="container cta-banner__inner">
        <motion.div
          className="cta-banner__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <span className="cta-banner__eyebrow">Безкоштовно назавжди</span>
          <h2 className="cta-banner__title">
            Готова стати<br />частиною спільноти?
          </h2>
          <p className="cta-banner__sub">
            Приєднуйся до 50 000+ українців,<br />
            які вже знайшли своїх людей на Bokado.
          </p>
          <div className="cta-banner__actions">
            <button className="btn btn-white" onClick={() => navigate('/register')}>
              Зареєструватись <FiArrowRight />
            </button>
            <button className="btn cta-banner__ghost" onClick={() => navigate('/login')}>
              Увійти
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
