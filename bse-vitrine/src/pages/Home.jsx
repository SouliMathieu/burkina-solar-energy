import React from 'react';
import HeroSlider from '../components/ui/HeroSlider';
import ArgumentsSection from '../components/ui/ArgumentsSection';
import RecentProducts from '../components/ui/RecentProducts';
import WhyBSE from '../components/ui/WhyBSE';
import ContactForm from '../components/ui/ContactForm';
import CTASection from '../components/ui/CTASection';
import SEO from '../components/layout/SEO';
const Home = () => {
  return (
    <div>
      <SEO
      title="Accueil"
      description="Burkina Solar Energy (BSE) à Ouagadougou — panneaux solaires, onduleurs, batteries et électronique grand public. Estimation gratuite, commande via WhatsApp."
    />
      <HeroSlider />
      <ArgumentsSection />
      <RecentProducts />
      <WhyBSE />
      <ContactForm />
      <CTASection />
    </div>
  );
};

export default Home;