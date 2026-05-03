import React from 'react';
import { motion } from 'framer-motion';
import { VALUES } from '../../constants/aboutData';
import {
  staggerContainer,
  staggerItem,
  useScrollAnimation,
} from '../../../lading/hooks/useScrollAnimation';
import './Values.css';

const Values: React.FC = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section className="values section">
      <div className="container">

        <motion.div
          className="values__head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.span className="section-label" variants={staggerItem}>
            Наші цінності
          </motion.span>
          <motion.h2 className="section-title" variants={staggerItem}>
            Що нами рухає
          </motion.h2>
          <motion.p className="section-subtitle values__subtitle" variants={staggerItem}>
            Шість принципів, на яких побудовано кожне рішення в Bokado.
          </motion.p>
        </motion.div>

        <motion.div
          className="values__grid"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              className="values__card"
              variants={staggerItem}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              <div
                className="values__icon"
                style={{ background: v.bg, color: v.color }}
              >
                <v.icon size={22} />
              </div>
              <h3 className="values__card-title">{v.title}</h3>
              <p className="values__card-desc">{v.description}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Values;
