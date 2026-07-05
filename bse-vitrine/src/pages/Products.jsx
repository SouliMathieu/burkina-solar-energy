import SEO from '../components/layout/SEO';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaTag, FaSearch, FaTh, FaList } from 'react-icons/fa';
import { getProducts, getCategories } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category_id = selectedCategory;
    if (search) params.search = search;
    getProducts(params)
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, search]);

  const formatPrice = (price) => new Intl.NumberFormat('fr-FR').format(price);

  const whatsappMessage = (name, price) =>
    encodeURIComponent('Bonjour BSE, je suis interesse par : ' + name + ' (' + price + ' FCFA). Pouvez-vous me donner plus informations ?');

  return (
    <div className="min-h-screen bg-neutral">
        <SEO
      title="Nos Produits"
      description="Découvrez le catalogue BSE : panneaux solaires, onduleurs, batteries, téléphones et tablettes aux meilleurs prix en FCFA à Ouagadougou."
    />
      <div className="bg-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Nos Produits</h1>
          <p className="text-gray-300">Equipements solaires et electronique grand public</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-dark mb-4">Categories</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={'px-5 py-2 rounded-full text-sm font-medium transition-colors ' +
                  (selectedCategory === null
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-primary/10 border border-gray-200')}
              >
                Tous les produits
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={'px-5 py-2 rounded-full text-sm font-medium transition-colors ' +
                    (selectedCategory === cat.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-600 hover:bg-primary/10 border border-gray-200')}
                >
                  {cat.nom}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3">
            <button
              onClick={() => setView('grid')}
              className={'p-2 rounded-lg transition-colors ' + (view === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary')}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setView('list')}
              className={'p-2 rounded-lg transition-colors ' + (view === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-primary')}
            >
              <FaList />
            </button>
          </div>
        </div>

        {!loading && (
          <p className="text-gray-500 text-sm mb-6">
            {products.length} produit{products.length !== 1 ? 's' : ''} trouve{products.length !== 1 ? 's' : ''}
          </p>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && products.length > 0 && view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="h-44 bg-neutral overflow-hidden">
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
                <div className="p-4">
                  {product.category_nom && (
                    <span className="text-xs text-secondary font-medium bg-secondary/10 px-2 py-0.5 rounded-full">
                      {product.category_nom}
                    </span>
                  )}
                  <h3 className="font-semibold text-dark text-sm mt-2 mb-1 line-clamp-2">
                    {product.nom}
                  </h3>
                  <p className="text-gray-400 text-xs mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary font-bold">{formatPrice(product.prix)} FCFA</span>
                    <a
                      href={'https://wa.me/22667448282?text=' + whatsappMessage(product.nom, formatPrice(product.prix))}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 bg-secondary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
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

        {!loading && products.length > 0 && view === 'list' && (
          <div className="space-y-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex gap-4 p-4"
              >
                <div className="w-24 h-24 bg-neutral rounded-xl overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img
                      src={'http://localhost:5000' + product.image}
                      alt={product.nom}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaTag className="text-2xl text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  {product.category_nom && (
                    <span className="text-xs text-secondary font-medium">{product.category_nom}</span>
                  )}
                  <h3 className="font-semibold text-dark mb-1">{product.nom}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                </div>
                <div className="flex flex-col items-end justify-between flex-shrink-0">
                  <span className="text-primary font-bold">{formatPrice(product.prix)} FCFA</span>
                  <a
                    href={'https://wa.me/22667448282?text=' + whatsappMessage(product.nom, formatPrice(product.prix))}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    <FaWhatsapp />
                    Commander
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <FaTag className="text-6xl mx-auto mb-4" />
            <p className="text-lg font-medium">Aucun produit trouve</p>
            <p className="text-sm mt-2">Essayez une autre categorie ou un autre terme de recherche.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Products;