import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { sendMessage } from '../../services/api';

const ContactForm = () => {
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', adresse: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.telephone || !form.message) {
      setError('Veuillez remplir les champs obligatoires (Nom, Telephone, Message).');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendMessage(form);
      setSuccess(true);
      setForm({ nom: '', telephone: '', email: '', adresse: '', message: '' });
    } catch (err) {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Gauche : texte */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contact</span>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mt-2 mb-4">
              Demandez votre estimation gratuite
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full mb-6" />
            <p className="text-gray-500 leading-relaxed mb-8">
              Vous avez un projet solaire ou vous souhaitez vous equiper en electronique ?
              Contactez-nous et notre equipe vous repondra rapidement avec un devis personnalise.
            </p>
            <ul className="space-y-3">
              {[
                'Reponse sous 24h',
                'Devis gratuit et sans engagement',
                'Livraison disponible a Ouagadougou',
                'Installation professionnelle sur demande',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                  <FaCheckCircle className="text-secondary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Droite : formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-neutral rounded-2xl p-8"
          >
            {success ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-secondary text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-dark mb-2">Message envoye !</h3>
                <p className="text-gray-500 text-sm mb-6">Nous vous recontacterons dans les plus brefs delais.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={form.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Telephone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={form.telephone}
                      onChange={handleChange}
                      placeholder="+226 XX XX XX XX"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={form.adresse}
                    onChange={handleChange}
                    placeholder="Votre quartier / ville"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Decrivez votre projet ou votre demande..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Envoi en cours...' : (
                    <>
                      <FaPaperPlane />
                      Envoyer ma demande
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactForm;