import React from 'react';
import '../styles/PremiumOffer.css';

const PremiumOffer: React.FC = () => {
  return (
    <div className="premium-container">
      <div className="premium-content">
        <section className="premium-section">
          <h2 className="premium-title">Преміум Підписка</h2>
          <p className="premium-description">
            Відкрийте для себе всі переваги преміум підписки та підніміть свій профіль на новий рівень!
          </p>

          <ul className="premium-features">
            <li>Додаткові фільтри пошуку</li>
            <li>Виділення профілю золотим кольором</li>
            <li>Стікери та кольорові ніки в чатах</li>
            <li>Пріоритет профілю в пошуку</li>
            <li>Розширена статистика активності</li>
          </ul>

          <div className="premium-price">Вартість: 100 грн</div>

          <a href="#contact" className="btn btn-primary premium-button">
            Оформити Підписку
          </a>
        </section>

        <section className="premium-section" id="advertisement">
          <h2 className="premium-title">Реклама</h2>
          <p className="premium-ad-text">
            Розміщуйте вашу рекламу на нашій платформі та отримуйте максимальне охоплення цільової аудиторії!
          </p>
          <p className="premium-ad-subtext">
            Ми пропонуємо гнучкі умови співпраці та індивідуальні пакети реклами.
          </p>
        </section>

        <section className="premium-section" id="contact">
          <h2 className="premium-title">Контакти адміністратора</h2>
          <p>Для зв'язку з адміністрацією, будь ласка, напишіть на електронну пошту:</p>
          <a href="mailto:admin@example.com" className="premium-email">
            admin@example.com
          </a>
        </section>
      </div>
    </div>
  );
};

export default PremiumOffer;
