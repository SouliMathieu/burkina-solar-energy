import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useSiteContent from '../../hooks/useSiteContent';

const defaultSlides = [
  { ctaLink: '/produits',   bg: 'from-dark to-blue-900'   },
  { ctaLink: null,          bg: 'from-green-900 to-dark'  },
  { ctaLink: '/produits',   bg: 'from-blue-900 to-dark'   },
  { ctaLink: '/references', bg: 'from-dark to-green-900'  },
  { ctaLink: '/contact',    bg: 'from-yellow-900 to-dark' },
];

const HeroSlider = () => {
  const { content } = useSiteContent();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides = defaultSlides.map((s, i) => ({
    id: i + 1,
    title:    content[`hero_titre_${i + 1}`]      || '',
    subtitle: content[`hero_sous_titre_${i + 1}`] || '',
    image:    content[`hero_image_${i + 1}`]      || '',
    ctaLink:  s.ctaLink,
    bg:       s.bg,
  }));

  const whatsapp = content.whatsapp_number || '22667448282';

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const variants = {
    enter:  (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  const slide = slides[current];

  return (
    <div className="relative h-[92vh] sm:h-[85vh] min-h-[560px] sm:min-h-[500px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className={`absolute inset-0 flex items-center ${slide.image ? '' : `bg-gradient-to-br ${slide.bg}`}`}
          style={slide.image ? {
            backgroundImage: `url(http://localhost:5000${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        >
          {/* Overlay sombre si image */}
          {slide.image && (
            <div className="absolute inset-0 bg-dark/60" />
          )}

          {/* Overlay pattern si pas d'image */}
          {!slide.image && (
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          )}

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full relative z-10">
            <div className="max-w-2xl pr-0 sm:pr-12">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-6"
              >
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Burkina Solar Energy — Ouagadougou
              </motion.div>

              {/* Titre */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6"
              >
                {slide.title}
              </motion.h1>

              {/* Sous-titre */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              {/* Boutons CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              >
                {slide.ctaLink ? (
                  <Link to={slide.ctaLink}
                        className="bg-primary text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center text-sm sm:text-base">
                    Découvrir
                  </Link>
                ) : (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
                     className="bg-primary text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors text-center text-sm sm:text-base">
                    Commander
                  </a>
                )}

                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer"
                   className="flex items-center justify-center gap-2 bg-secondary text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base">
                  <FaWhatsapp className="text-lg" />
                  WhatsApp
                </a>
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Flèches navigation — masquées sur mobile */}
      <button onClick={prev} aria-label="Slide précédent"
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-colors">
        <FaChevronLeft />
      </button>
      <button onClick={next} aria-label="Slide suivant"
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full items-center justify-center text-white transition-colors">
        <FaChevronRight />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
                  aria-label={`Aller au slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    i === current ? 'w-8 h-3 bg-primary' : 'w-3 h-3 bg-white/50 hover:bg-white'
                  }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;