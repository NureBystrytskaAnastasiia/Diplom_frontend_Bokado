import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { fadeUp } from '../../hooks/useScrollAnimation';
import './CtaSection.css';

const CtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="cta section">
      <div className="cta__orb cta__orb--1" aria-hidden="true" />
      <div className="cta__orb cta__orb--2" aria-hidden="true" />

      <div className="container cta__inner">
        <motion.div
          className="cta__content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <span className="cta__eyebrow">Безкоштовно назавжди</span>

          <h2 className="cta__title">
            Готові знайти<br />нових друзів?
          </h2>

          <p className="cta__sub">
            Приєднуйся до 50 000+ українців,<br />
            які вже знайшли своїх людей на Bokado.
          </p>

          <div className="cta__actions">
            <button
              className="btn btn-white"
              onClick={() => navigate('/register')}
            >
              Зареєструватись <FiArrowRight />
            </button>
            <button
              className="btn cta__btn-outline"
              onClick={() => navigate('/login')}
            >
              Увійти
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
