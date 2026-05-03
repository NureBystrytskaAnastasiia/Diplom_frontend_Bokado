import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiHeart, FiAward, FiShield, FiStar, FiMail, FiMapPin, FiPhone, FiCheck, FiZap, FiTarget } from 'react-icons/fi';
import '../styles/LandingPage.css';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      y: 30, 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };

  const features = [
    {
      icon: FiUsers,
      title: "Спільнота",
      description: "Тисячі українців, які шукають нових друзів та спілкування",
      color: "var(--accent-teal)"
    },
    {
      icon: FiHeart,
      title: "Спільні інтереси",
      description: "Знаходь людей зі схожими захопленнями та хобі",
      color: "var(--accent-pink)"
    },
    {
      icon: FiAward,
      title: "Гейміфікація",
      description: "Челенджі, бейджі та рівні для більш цікавого спілкування",
      color: "var(--accent-teal)"
    },
    {
      icon: FiShield,
      title: "Безпека",
      description: "Сувора модерація та перевірка профілів для вашого комфорту",
      color: "var(--accent-pink)"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Створи профіль",
      description: "Розкажи про себе, свої інтереси та цілі",
      icon: FiTarget
    },
    {
      number: 2,
      title: "Знаходь людей",
      description: "Використовуй фільтри або свайп систему для пошуку",
      icon: FiUsers
    },
    {
      number: 3,
      title: "Спілкуйся",
      description: "Знайомся, обговорюй події та приймай виклики разом",
      icon: FiZap
    }
  ];

  const testimonials = [
    {
      text: "Завдяки Bokado я знайшла справжніх друзів у новому місті. Тепер у нас ціла компанія!",
      author: "Анна, 24",
      rating: 5
    },
    {
      text: "Як інтроверту мені важко знайомитись, але тут все зручно та без напруження.",
      author: "Олексій, 19",
      rating: 5
    },
    {
      text: "Платформа допомогла мені знайти людей з такими ж хобі. Тепер ми регулярно зустрічаємось!",
      author: "Марія, 27",
      rating: 5
    }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section" 
        style={{ backgroundImage: 'url(https://img.goodfon.ru/wallpaper/big/a/a4/svoboda-lyudi-pryzhok-bereg.webp)' }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="hero-overlay">
          <motion.div 
            className="hero-content"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              Знайди своїх людей з Bokado
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              Перша українська платформа для пошуку друзів за інтересами
            </motion.p>
            <motion.div 
              className="hero-buttons"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <motion.button 
                className="btn btn-primary"
                onClick={() => navigate('/register')}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 40px rgba(0, 0, 0, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Почати зараз <FiArrowRight />
              </motion.button>
              <motion.button 
                className="btn btn-outline"
                onClick={() => navigate('/login')}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 15px 40px rgba(255, 255, 255, 0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Вже маю акаунт
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        <motion.div 
          className="scroll-indicator"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          <div className="chevron"></div>
          <div className="chevron"></div>
          <div className="chevron"></div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title" 
            variants={itemVariants}
            whileInView={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Чому обирають Bokado?
          </motion.h2>
          <motion.div className="features-grid" variants={containerVariants}>
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card" 
                variants={itemVariants}
                whileHover={{ 
                  y: -20,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
                whileInView={{
                  opacity: [0, 1],
                  y: [50, 0],
                  transition: { delay: index * 0.1, duration: 0.6 }
                }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="feature-icon"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.2,
                    transition: { duration: 0.6 }
                  }}
                >
                  <feature.icon />
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="how-it-works"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInVariants}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Як це працює?
          </motion.h2>
          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                className="step"
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
              >
                <motion.div 
                  className="step-number"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 360,
                    transition: { duration: 0.5 }
                  }}
                >
                  {step.number}
                </motion.div>
                <motion.div 
                  className="step-content"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="testimonials"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title" 
            variants={itemVariants}
          >
            Що кажуть наші користувачі
          </motion.h2>
          <motion.div className="testimonials-grid" variants={containerVariants}>
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card" 
                variants={itemVariants}
                whileHover={{ 
                  y: -15,
                  rotateX: 5,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                whileInView={{
                  opacity: [0, 1],
                  y: [30, 0],
                  transition: { delay: index * 0.15, duration: 0.6 }
                }}
                viewport={{ once: true }}
              >
                <div className="testimonial-content">
                  <p>"{testimonial.text}"</p>
                </div>
                <div className="testimonial-author">
                  <motion.div 
                    className="author-avatar"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.3 }
                    }}
                  ></motion.div>
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <div className="author-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: { delay: i * 0.1, duration: 0.3 }
                          }}
                          viewport={{ once: true }}
                        >
                          <FiStar />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Additional Features Section */}
      <motion.section 
        className="features-section"
        style={{ background: 'var(--secondary-dark)' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        <div className="section-container">
          <motion.h2 
            className="section-title" 
            variants={itemVariants}
          >
            Ще більше можливостей
          </motion.h2>
          <motion.div className="features-grid" variants={containerVariants}>
            <motion.div className="feature-card" variants={itemVariants}>
              <motion.div 
                className="feature-icon"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <FiZap />
              </motion.div>
              <h3>Швидкі знайомства</h3>
              <p>Миттєвий пошук та зв'язок з людьми поруч</p>
            </motion.div>
            <motion.div className="feature-card" variants={itemVariants}>
              <motion.div 
                className="feature-icon"
                whileHover={{ scale: 1.2, rotate: -15 }}
              >
                <FiTarget />
              </motion.div>
              <h3>Точний відбір</h3>
              <p>Розумні алгоритми для найкращих збігів</p>
            </motion.div>
            <motion.div className="feature-card" variants={itemVariants}>
              <motion.div 
                className="feature-icon"
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <FiCheck />
              </motion.div>
              <h3>Перевірені профілі</h3>
              <p>Тільки справжні люди з підтвердженими акаунтами</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.8, ease: "easeOut" }
        }}
        viewport={{ once: true }}
      >
        <div className="section-container">
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Готовий знайти нових друзів?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            Приєднуйся до Bokado вже сьогодні - це безкоштовно!
          </motion.p>
          <motion.button 
            className="btn btn-primary"
            onClick={() => navigate('/register')}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Зареєструватись
          </motion.button>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="footer-container">
          <motion.div 
            className="footer-logo"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Bokado</h3>
            <p>Знайди своїх людей</p>
          </motion.div>
          <motion.div 
            className="footer-links"
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="footer-column">
              <h4>Навігація</h4>
              <ul>
                <li><a href="#">Головна</a></li>
                <li><a href="#">Про нас</a></li>
                <li><a href="#">Контакти</a></li>
                <li><a href="#">Блог</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Правова інформація</h4>
              <ul>
                <li><a href="#">Умови використання</a></li>
                <li><a href="#">Політика конфіденційності</a></li>
                <li><a href="#">Cookies</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Контакти</h4>
              <ul className="contact-list">
                <li><FiMail /> hello@bokado.com</li>
                <li><FiMapPin /> Київ, Україна</li>
                <li><FiPhone /> +380 12 345 6789</li>
              </ul>
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="footer-bottom"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p>&copy; {new Date().getFullYear()} Bokado. Всі права захищені.</p>
        </motion.div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;