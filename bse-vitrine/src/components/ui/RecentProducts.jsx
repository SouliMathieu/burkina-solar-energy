import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaTag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';

const RecentProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 6 })
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const whatsappMessage = (name, price) =>
    encodeURIComponent("Bonjour BSE, je suis intéressé(e) par : " + name + " (" + price + " FCFA). Pouvez-vous me donner plus d'informations ?");

  const formatPrice = (price) =>
    new Intl.NumberFormat('fr-FR').format(price);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Catalogue</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mt-2">
              Produits récemment ajoutés
            </h2>
            <div className="w-16 h-1 bg-primary mt-4 rounded-full" />
          </div>
          <Link to="/produits" className="text-primary font-medium hover:underline text-sm self-start md:self-auto">
            Voir tous les produits →
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="h-48 bg-neutral overflow-hidden">
                  {product.image ? (
                    <img
                      src={'http://localhost:5000' + product.image}
                      alt={product.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaTag className="text-4xl text-gray-300" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-dark text-base mb-1 line-clamp-1">
                    {product.nom}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-primary font-bold text-lg whitespace-nowrap">
                      {formatPrice(product.prix)} FCFA
                    </span>
                    <a
                      href={'https://wa.me/22667448282?text=' + whatsappMessage(product.nom, formatPrice(product.prix))}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      <FaWhatsapp />
                      Commander
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FaTag className="text-5xl mx-auto mb-4" />
            <p>Aucun produit disponible pour le moment.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default RecentProducts;