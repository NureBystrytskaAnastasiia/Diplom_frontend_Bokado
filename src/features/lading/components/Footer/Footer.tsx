import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiInstagram, FiTwitter } from 'react-icons/fi';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container footer__inner">
      <div className="footer__brand">
        <div className="footer__logo">B</div>
        <div>
          <h3 className="footer__name">Bokado</h3>
          <p className="footer__tagline">Знайди своїх людей</p>
        </div>
      </div>

      <nav className="footer__nav" aria-label="Footer navigation">
        <div className="footer__col">
          <h4 className="footer__col-title">Платформа</h4>
          <ul>
            <li><Link to="/about">Про нас</Link></li>
            <li><Link to="/discover">Групи</Link></li>
            <li><Link to="/events">Події</Link></li>
            <li><Link to="/premium">Premium</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Підтримка</h4>
          <ul>
            <li><a href="#">Допомога</a></li>
            <li><a href="#">Правила</a></li>
            <li><a href="#">Конфіденційність</a></li>
            <li><a href="#">Cookies</a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Контакти</h4>
          <ul className="footer__contacts">
            <li>
              <FiMail size={14} />
              <a href="mailto:hello@bokado.com">hello@bokado.com</a>
            </li>
            <li>
              <FiMapPin size={14} />
              <span>Київ, Україна</span>
            </li>
          </ul>
          <div className="footer__socials">
            <a href="#" aria-label="Instagram" className="footer__social">
              <FiInstagram size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="footer__social">
              <FiTwitter size={16} />
            </a>
          </div>
        </div>
      </nav>
    </div>

    <div className="footer__bottom">
      <div className="container footer__bottom-inner">
        <p>&copy; {new Date().getFullYear()} Bokado. Всі права захищені.</p>
        <div className="footer__bottom-links">
          <a href="#">Умови</a>
          <a href="#">Конфіденційність</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;