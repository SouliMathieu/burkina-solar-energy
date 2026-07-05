import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaTools, FaStar, FaHeadset, FaUsers, FaSolarPanel, FaCalendarAlt } from 'react-icons/fa';
import useSiteContent from '../../hooks/useSiteContent';

const reasons = [
  {
    icon: FaShieldAlt,
    title: 'Produits garantis',
    description: "Tous nos équipements sont certifiés et bénéficient d'une garantie constructeur.",
  },
  {
    icon: FaTools,
    title: 'Installation professionnelle',
    description: "Notre équipe qualifiée assure une installation rapide et dans les règles de l'art.",
  },
  {
    icon: FaStar,
    title: 'Meilleurs prix',
    description: "Des tarifs compétitifs en FCFA, sans compromis sur la qualité des équipements.",
  },
  {
    icon: FaHeadset,
    title: 'Support après-vente',
    description: "Nous restons disponibles après chaque vente pour vous accompagner.",
  },
];

const useCounter = (target, duration, active) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
};

const CounterItem = ({ icon: Icon, value, suffix, label, active }) => {
  const count = useCounter(parseInt(value) || 0, 2000, active);
  return (
    <div className="text-center">
      <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Icon className="text-primary text-2xl" />
      </div>
      <div className="text-4xl font-bold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-gray-300 text-sm">{label}</div>
    </div>
  );
};

const WhyBSE = () => {
  const { content } = useSiteContent();
  const [countersActive, setCountersActive] = useState(false);
  const countersRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersActive(true); },
      { threshold: 0.3 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => observer.disconnect();
  }, []);

  const counters = [
    { icon: FaUsers,       value: content.compteur_clients,    suffix: '+',   label: 'Clients satisfaits' },
    { icon: FaSolarPanel,  value: content.compteur_projets,    suffix: '+',   label: 'Projets réalisés'   },
    { icon: FaCalendarAlt, value: content.compteur_experience, suffix: ' ans', label: 'Expérience'         },
    { icon: FaStar,        value: '98',                        suffix: '%',   label: 'Taux de satisfaction' },
  ];

  return (
    <>
      {/* Section Pourquoi BSE */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre engagement</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mt-2">Pourquoi choisir BSE ?</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors">
                    <Icon className="text-primary text-xl group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Section Compteurs */}
      <section ref={countersRef} className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {counters.map((item, index) => (
              <CounterItem key={index} {...item} active={countersActive} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyBSE;