import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSun } from 'react-icons/fa';

const navLinks = [
  { label: 'Accueil',     path: '/' },
  { label: 'Nos Produits', path: '/produits' },
  { label: 'Références',  path: '/references' },
  { label: 'À propos',    path: '/a-propos' },
  { label: 'Contact',     path: '/contact' },
];

const Navbar = () => {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ferme le menu mobile au changement de page
  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center group-hover:bg-dark transition-colors">
              <FaSun className="text-white text-lg" />
            </div>
            <div className="leading-tight">
              <span className="block font-bold text-dark text-sm tracking-wide">BURKINA</span>
              <span className="block font-bold text-primary text-sm tracking-wide">SOLAR ENERGY</span>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${location.pathname === link.path
                    ? 'bg-primary text-white'
                    : 'text-text hover:text-primary hover:bg-primary/10'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA desktop */}
          <a href="https://wa.me/22667448282" target="_blank" rel="noreferrer"
             className="hidden md:flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            Commander
          </a>

          {/* Burger mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-dark hover:bg-neutral transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>

        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium my-1 transition-colors
                ${location.pathname === link.path
                  ? 'bg-primary text-white'
                  : 'text-text hover:bg-neutral'
                }`}
            >
              {link.label}
            </Link>
          ))}
          <a href="https://wa.me/22667448282" target="_blank" rel="noreferrer"
             className="block mt-2 bg-secondary text-white px-4 py-3 rounded-lg text-sm font-medium text-center hover:bg-green-700 transition-colors">
            Commander via WhatsApp
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;