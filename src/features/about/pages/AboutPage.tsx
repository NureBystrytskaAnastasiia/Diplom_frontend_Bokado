import React from 'react';
import AboutHero from '../components/AboutHero/AboutHero';
import Mission   from '../components/Mission/Mission';
import Values    from '../components/Values/Values';
import CtaBanner from '../components/CtaBanner/CtaBanner';
import Footer    from '../../lading/components/Footer/Footer';
import '../styles/AboutPage.css';

const AboutPage: React.FC = () => (
  <main className="about-page">
    <AboutHero />
    <Mission />
    <Values />
    <CtaBanner />
    <Footer />
  </main>
);

export default AboutPage;
