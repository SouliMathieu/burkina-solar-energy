import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaWhatsapp, FaSun } from 'react-icons/fa';
import useSiteContent from '../../hooks/useSiteContent';

const Footer = () => {
  const { content } = useSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Colonne 1 : Logo + description */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <FaSun className="text-white text-lg" />
              </div>
              <div className="leading-tight">
                <span className="block font-bold text-white text-sm">BURKINA</span>
                <span className="block font-bold text-primary text-sm">SOLAR ENERGY</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {content.slogan}
            </p>
            <div className="flex items-center gap-3">
              <a href={content.social_facebook || '#'} target="_blank" rel="noreferrer" aria-label="Facebook BSE"
                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaFacebookF className="text-xs" />
              </a>
              <a href={content.social_instagram || '#'} target="_blank" rel="noreferrer" aria-label="Instagram BSE"
                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                <FaInstagram className="text-xs" />
              </a>
              <a href={"https://wa.me/" + (content.social_whatsapp || '22667448282')} target="_blank" rel="noreferrer" aria-label="WhatsApp BSE"
                 className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors">
                <FaWhatsapp className="text-xs" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              {[
                { label: 'Accueil',      path: '/' },
                { label: 'Nos Produits', path: '/produits' },
                { label: 'Références',   path: '/references' },
                { label: 'À propos',     path: '/a-propos' },
                { label: 'Contact',      path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path}
                        className="text-gray-400 text-sm hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Produits */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Nos Produits</h3>
            <ul className="space-y-2">
              {['Panneaux solaires', 'Onduleurs', 'Batteries', 'Accessoires solaires', 'Téléphones', 'Tablettes'].map((item) => (
                <li key={item}>
                  <Link to="/produits"
                        className="text-gray-400 text-sm hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">{content.contact_adresse}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-primary flex-shrink-0" />
                <a href={"tel:" + content.contact_telephone}
                   className="text-gray-400 text-sm hover:text-primary transition-colors">
                  {content.contact_telephone}
                </a>
              </li>
              {content.contact_telephone_2 && (
                <li className="flex items-center gap-3">
                  <FaPhone className="text-primary flex-shrink-0" />
                  <a href={"tel:" + content.contact_telephone_2}
                     className="text-gray-400 text-sm hover:text-primary transition-colors">
                    {content.contact_telephone_2}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <a href={"mailto:" + content.contact_email}
                   className="text-gray-400 text-sm hover:text-primary transition-colors">
                  {content.contact_email}
                </a>
              </li>
              {content.contact_email_2 && (
                <li className="flex items-center gap-3">
                  <FaEnvelope className="text-primary flex-shrink-0" />
                  <a href={"mailto:" + content.contact_email_2}
                     className="text-gray-400 text-sm hover:text-primary transition-colors">
                    {content.contact_email_2}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-3">
                <FaWhatsapp className="text-secondary flex-shrink-0" />
                <a href={"https://wa.me/" + (content.whatsapp_number || '22667448282')}
                   target="_blank" rel="noreferrer"
                   className="text-gray-400 text-sm hover:text-secondary transition-colors">
                  Commander via WhatsApp
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-gray-500 text-xs">
            © {year} Burkina Solar Energy. Tous droits réservés.
          </p>
          <p className="text-gray-500 text-xs">
            Fait avec ☀️ à Ouagadougou
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;