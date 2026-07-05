import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaImage, FaWhatsapp } from 'react-icons/fa';
import { getProjects } from '../services/api';
import SEO from '../components/layout/SEO';

const References = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getProjects()
      .then((res) => setProjects(res.data.data || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen bg-neutral">
      <SEO
      title="Nos Références"
      description="Découvrez les projets solaires réalisés par Burkina Solar Energy à Ouagadougou et partout au Burkina Faso."
    />
      {/* Hero */}
      <div className="bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Nos References</h1>
          <p className="text-gray-300">Projets realises par Burkina Solar Energy a Ouagadougou et partout au Burkina</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        )}

        {/* Grille projets */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
                onClick={() => setSelected(project)}
              >
                <div className="h-52 bg-neutral overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={'http://localhost:5000' + project.image}
                      alt={project.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-5xl text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-colors flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity text-sm bg-primary px-4 py-2 rounded-lg">
                      Voir le detail
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-dark text-base mb-2 line-clamp-2">{project.titre}</h3>
                  {project.date && (
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                      <FaCalendarAlt className="text-primary" />
                      {formatDate(project.date)}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Aucun projet */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <FaImage className="text-6xl mx-auto mb-4" />
            <p className="text-lg font-medium">Aucun projet disponible pour le moment.</p>
          </div>
        )}

        {/* CTA bas de page */}
        {!loading && projects.length > 0 && (
          <div className="mt-16 bg-dark rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Vous avez un projet solaire ?</h2>
            <p className="text-gray-300 mb-6 text-sm">Contactez-nous pour un devis gratuit et une installation professionnelle.</p>
            <a
              href="https://wa.me/22667448282"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <FaWhatsapp className="text-xl" />
              Discuter de mon projet
            </a>
          </div>
        )}

      </div>

      {/* Modal detail projet */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.image && (
              <div className="h-64 overflow-hidden rounded-t-2xl">
                <img
                  src={'http://localhost:5000' + selected.image}
                  alt={selected.titre}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-dark mb-2">{selected.titre}</h2>
              {selected.date && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                  <FaCalendarAlt className="text-primary" />
                  {formatDate(selected.date)}
                </div>
              )}
              <p className="text-gray-600 leading-relaxed mb-6">{selected.description}</p>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/22667448282"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-secondary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  <FaWhatsapp />
                  Projet similaire
                </a>
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-neutral transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default References;