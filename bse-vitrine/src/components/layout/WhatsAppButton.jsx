import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phone = '22667448282';
  const message = "Bonjour BSE, je souhaite avoir des informations sur vos produits.";
  const url = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2">

      {showTooltip && (
        <div className="hidden sm:block bg-white text-sm px-4 py-3 rounded-xl shadow-lg max-w-xs text-center border border-gray-100">
          <p className="font-medium">Besoin d'aide ?</p>
          <p className="text-gray-500 text-xs mt-1">Contactez-nous sur WhatsApp</p>
        </div>
      )}

      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-11 h-11 sm:w-14 sm:h-14 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 active:scale-95 hover:scale-110 transition-all duration-300"
        aria-label="Contacter via WhatsApp"
      >
        <FaWhatsapp className="text-white text-lg sm:text-2xl" />
      </a>

    </div>
  );
};

export default WhatsAppButton;