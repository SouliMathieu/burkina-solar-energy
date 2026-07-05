import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layout
import Navbar        from './components/layout/Navbar';
import Footer        from './components/layout/Footer';
import TopBar        from './components/layout/TopBar';
import WhatsAppButton from './components/layout/WhatsAppButton';

// Wrapper d'animation
import PageWrapper from './components/layout/PageWrapper';

// Pages
import Home       from './pages/Home';
import Products   from './pages/Products';
import References from './pages/References';
import About       from './pages/About';
import Contact     from './pages/Contact';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/produits"   element={<PageWrapper><Products /></PageWrapper>} />
        <Route path="/references" element={<PageWrapper><References /></PageWrapper>} />
        <Route path="/a-propos"   element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/contact"    element={<PageWrapper><Contact /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-poppins">
        <TopBar />
        <Navbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;