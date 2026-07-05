import React from 'react';
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import useSiteContent from '../../hooks/useSiteContent';

const TopBar = () => {
  const { content } = useSiteContent();

  return (
    <div className="bg-dark text-white text-sm py-2 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

        {/* Gauche : téléphone + email */}
        <div className="flex items-center gap-6">
          <a href={"tel:" + content.contact_telephone}
             className="flex items-center gap-2 hover:text-primary transition-colors">
            <FaPhone className="text-primary text-xs" />
            <span>{content.contact_telephone}</span>
          </a>
          <a href={"mailto:" + content.contact_email}
             className="flex items-center gap-2 hover:text-primary transition-colors">
            <FaEnvelope className="text-primary text-xs" />
            <span>{content.contact_email}</span>
          </a>
        </div>

        {/* Droite : réseaux sociaux */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">Suivez-nous :</span>
          <a
            href={content.social_facebook || '#'}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook BSE"
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
          >
            <FaFacebookF className="text-xs" />
          </a>
          <a
            href={content.social_instagram || '#'}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram BSE"
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
          >
            <FaInstagram className="text-xs" />
          </a>
          <a
            href={"https://wa.me/" + (content.social_whatsapp || '22667448282')}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp BSE"
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"
          >
            <FaWhatsapp className="text-xs" />
          </a>
        </div>

      </div>
    </div>
  );
};

export default TopBar;