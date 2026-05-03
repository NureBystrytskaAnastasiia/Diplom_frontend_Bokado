import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, useScrollAnimation } from '../../hooks/useScrollAnimation';
import type { Feature } from '../../constants/landingData';
import './FeaturesSection.css';

interface FeaturesSectionProps {
  label: string;
  title: string;
  subtitle?: string;
  features: Feature[];
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  label, title, subtitle, features,
}) => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section className="features section">
      <div className="container">
        <motion.div
          className="features__head"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={staggerItem}>{label}</motion.span>
          <motion.h2 className="section-title" variants={staggerItem}>{title}</motion.h2>
          {subtitle && (
            <motion.p className="section-subtitle features__subtitle" variants={staggerItem}>
              {subtitle}
            </motion.p>
          )}
        </motion.div>

        <motion.div
          className="features__grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="features__card"
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              <div
                className="features__icon"
                style={{ background: f.color + '18', color: f.color }}
              >
                <f.icon size={22} />
              </div>
              <h3 className="features__card-title">{f.title}</h3>
              <p className="features__card-desc">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
