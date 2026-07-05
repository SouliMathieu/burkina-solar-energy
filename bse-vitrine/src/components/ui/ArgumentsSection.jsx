import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaIndustry, FaLeaf } from 'react-icons/fa';

const arguments_data = [
  {
    icon: FaHome,
    title: 'Solutions Résidentielles',
    description: "Équipez votre domicile en énergie solaire. Panneaux, batteries et onduleurs adaptés à votre consommation pour une autonomie totale.",
    color: 'bg-primary',
  },
  {
    icon: FaIndustry,
    title: 'Solutions Industrielles',
    description: "Des installations solaires de grande capacité pour les entreprises, usines et institutions. Réduisez vos coûts énergétiques durablement.",
    color: 'bg-dark',
  },
  {
    icon: FaLeaf,
    title: 'Énergie Propre & Durable',
    description: "Contribuez à la protection de l'environnement. L'énergie solaire est renouvelable, propre et disponible toute l'année au Burkina Faso.",
    color: 'bg-secondary',
  },
];

const ArgumentsSection = () => {
  return (
    <section className="py-16 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="text-center mb-12">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Pourquoi le solaire ?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-dark mt-2">
            Une énergie pour chaque besoin
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {arguments_data.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ArgumentsSection;