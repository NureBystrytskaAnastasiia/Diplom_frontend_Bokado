import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { Step } from '../../constants/landingData';
import './HowItWorks.css';

interface HowItWorksProps { steps: Step[] }

const HowItWorks: React.FC<HowItWorksProps> = ({ steps }) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section className="how section">
      {/* Акцентна смуга зверху */}
      <div className="how__accent" aria-hidden="true" />

      <div className="container">
        <motion.div
          className="how__head"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={staggerItem}>Як це працює</motion.span>
          <motion.h2 className="section-title" variants={staggerItem}>
            Три кроки до<br />нових знайомств
          </motion.h2>
        </motion.div>

        <div className="how__steps">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="how__step"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="how__step-num" aria-hidden="true">{step.number}</div>
              <div className="how__step-body">
                <div className="how__step-icon">
                  <step.icon size={20} />
                </div>
                <h3 className="how__step-title">{step.title}</h3>
                <p className="how__step-desc">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="how__connector" aria-hidden="true" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
