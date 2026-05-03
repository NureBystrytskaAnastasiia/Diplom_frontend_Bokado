import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { staggerContainer, staggerItem, useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { Testimonial } from '../../constants/landingData';
import './Testimonials.css';

interface TestimonialsProps { testimonials: Testimonial[] }

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section className="testimonials section">
      <div className="container">
        <motion.div
          className="testimonials__head"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={staggerItem}>Відгуки</motion.span>
          <motion.h2 className="section-title" variants={staggerItem}>
            Вони вже знайшли<br />своїх людей
          </motion.h2>
        </motion.div>

        <motion.div
          className="testimonials__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonials__card"
              variants={staggerItem}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div className="testimonials__stars" aria-label={`Рейтинг ${t.rating} з 5`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FiStar key={j} size={14} />
                ))}
              </div>
              <p className="testimonials__text">"{t.text}"</p>
              <div className="testimonials__author">
                <div
                  className="testimonials__avatar"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="testimonials__name">{t.author}</div>
                  <div className="testimonials__role">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
