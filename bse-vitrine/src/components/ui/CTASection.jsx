import React from 'react';
import { FaWhatsapp, FaPhone } from 'react-icons/fa';

const CTASection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Pret a passer au solaire ?
        </h2>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Contactez BSE aujourd hui et beneficiez d une estimation gratuite pour votre projet.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/22667448282"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            <FaWhatsapp className="text-secondary text-xl" />
            Commander via WhatsApp
          </a>
          <a
            href="tel:+22667448282"
            className="flex items-center gap-2 bg-white/20 text-white border border-white/40 px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
          >
            <FaPhone />
            +226 67 44 82 82
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;