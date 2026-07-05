import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaBullseye, FaHandshake, FaLeaf, FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import SEO from '../components/layout/SEO';
const values = [
  {
    icon: FaHandshake,
    title: 'Confiance',
    description: "Nous construisons des relations durables avec nos clients basées sur la transparence et le respect.",
  },
  {
    icon: FaLeaf,
    title: 'Durabilité',
    description: "Nous promouvons les énergies renouvelables pour un avenir plus propre au Burkina Faso.",
  },
  {
    icon: FaBullseye,
    title: 'Excellence',
    description: "Nous sélectionnons uniquement des équipements de qualité supérieure pour garantir votre satisfaction.",
  },
  {
    icon: FaSun,
    title: 'Innovation',
    description: "Nous suivons les dernières avancées technologiques pour vous proposer les meilleures solutions.",
  },
];

const team = [
  { name: 'Prosper', role: 'Directeur Général', initial: 'P' },
  { name: 'Équipe Technique', role: 'Installation & Maintenance', initial: 'É' },
  { name: 'Service Commercial', role: 'Vente & Conseil', initial: 'S' },
];

const About = () => {
  return (
    <div className="min-h-screen">
       <SEO
      title="À propos"
      description="Burkina Solar Energy : notre histoire, notre mission et nos valeurs au service de l'énergie solaire à Ouagadougou."
    />
      {/* Hero */}
      <div className="bg-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">À propos de BSE</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Burkina Solar Energy est votre partenaire de confiance pour l'énergie solaire
              et l'électronique à Ouagadougou depuis plus de 10 ans.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Histoire */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre histoire</span>
              <h2 className="text-3xl font-bold text-dark mt-2 mb-6">
                Une entreprise née de la passion pour l'énergie propre
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Burkina Solar Energy a été fondée à Ouagadougou avec une vision claire :
                  rendre l'énergie solaire accessible à tous les Burkinabè, particuliers comme entreprises.
                </p>
                <p>
                  Face aux défis énergétiques du Burkina Faso, notamment les coupures fréquentes
                  et le coût élevé de l'électricité, BSE s'est positionné comme la solution locale
                  de référence pour les installations solaires de qualité.
                </p>
                <p>
                  Aujourd'hui, avec plus de 500 clients satisfaits et 300 projets réalisés,
                  BSE continue de grandir et d'innover pour mieux servir sa clientèle.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: '500+', label: 'Clients satisfaits', color: 'bg-primary' },
                { value: '300+', label: 'Projets réalisés', color: 'bg-secondary' },
                { value: '10+', label: "Années d'expérience", color: 'bg-dark' },
                { value: '98%', label: 'Taux de satisfaction', color: 'bg-primary' },
              ].map((stat, i) => (
                <div key={i} className={'rounded-2xl p-6 text-white text-center ' + stat.color}>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm opacity-80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre mission</span>
          <h2 className="text-3xl font-bold text-dark mt-2 mb-4">Ce qui nous anime chaque jour</h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Rendre l'énergie solaire accessible, abordable et fiable pour tous les Burkinabè.
            Proposer des équipements électroniques de qualité à des prix compétitifs en FCFA.
            Accompagner nos clients de l'achat jusqu'à l'installation et au service après-vente.
          </p>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Nos valeurs</span>
            <h2 className="text-3xl font-bold text-dark mt-2">Ce en quoi nous croyons</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-neutral rounded-2xl p-6 text-center group hover:bg-primary transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Icon className="text-primary group-hover:text-white text-xl transition-colors" />
                  </div>
                  <h3 className="font-bold text-dark group-hover:text-white mb-2 transition-colors">{item.title}</h3>
                  <p className="text-gray-500 group-hover:text-white/80 text-sm leading-relaxed transition-colors">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Équipe */}
      <section className="py-16 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Notre équipe</span>
            <h2 className="text-3xl font-bold text-dark mt-2">Les personnes derrière BSE</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">{member.initial}</span>
                </div>
                <h3 className="font-bold text-dark mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA contact */}
      <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Prenez contact avec nous</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="text-primary" />
                  <span>+226 67 44 82 82</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="text-primary" />
                  <span>contact@burkina-solar.com</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/22667448282"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                <FaWhatsapp className="text-xl" />
                Nous contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;