import React from 'react';
import { Navigate } from 'react-router-dom';

import HeroSection     from '../components/HeroSection/HeroSection';
import FeaturesSection from '../components/FeaturesSection/FeaturesSection';
import HowItWorks      from '../components/HowItWorks/HowItWorks';
import Testimonials    from '../components/Testimonials/Testimonials';
import CtaSection      from '../components/CtaSection/CtaSection';
import Footer          from '../components/Footer/Footer';

import {
  FEATURES,
  EXTRA_FEATURES,
  STEPS,
  TESTIMONIALS,
} from '../constants/landingData';

import '../styles/LandingPage.css';
import { useAppSelector } from '../../../shared/hooks/useAuth';

const LandingPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="landing-page">
      <HeroSection />

      <FeaturesSection
        label="Можливості"
        title="Чому обирають Bokado?"
        subtitle="Все що потрібно для якісного спілкування — в одному місці."
        features={FEATURES}
      />

      <HowItWorks steps={STEPS} />

      <Testimonials testimonials={TESTIMONIALS} />

      <FeaturesSection
        label="Ще більше"
        title="Деталі, які важливі"
        features={EXTRA_FEATURES}
      />

      <CtaSection />

      <Footer />
    </main>
  );
};

export default LandingPage;