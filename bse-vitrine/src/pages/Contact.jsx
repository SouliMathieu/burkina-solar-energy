import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaPaperPlane, FaCheckCircle, FaClock } from 'react-icons/fa';
import { sendMessage } from '../services/api';
import useSiteContent from '../hooks/useSiteContent';
import SEO from '../components/layout/SEO';

const Contact = () => {
  const { content } = useSiteContent();
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
      setError("Veuillez remplir les champs obligatoires (Nom, Téléphone, Message).");
      return;
    }
    setLoading(true);
    setError('');
    try {
      await sendMessage(form);
      setSuccess(true);
      setForm({ nom: '', telephone: '', email: '', adresse: '', message: '' });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral">
      <SEO
        title="Contact"
        description="Contactez Burkina Solar Energy à Ouagadougou par téléphone, WhatsApp ou via notre formulaire en ligne pour un devis gratuit."
      />

      {/* Hero */}
      <div className="bg-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contactez-nous</h1>
            <p className="text-gray-300 text-lg max-w-xl">
              Une question, un projet ou besoin d'un devis ? Notre équipe vous répond rapidement.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne coordonnées */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-dark text-lg mb-6">Nos coordonnées</h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark text-sm">Adresse</p>
                    <p className="text-gray-500 text-sm">{content.contact_adresse}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark text-sm">Téléphone</p>
                    <a href={"tel:" + content.contact_telephone}
                       className="text-gray-500 text-sm hover:text-primary transition-colors block">
                      {content.contact_telephone}
                    </a>
                    {content.contact_telephone_2 && (
                      <a href={"tel:" + content.contact_telephone_2}
                         className="text-gray-500 text-sm hover:text-primary transition-colors block mt-1">
                        {content.contact_telephone_2}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark text-sm">Email</p>
                    <a href={"mailto:" + content.contact_email}
                       className="text-gray-500 text-sm hover:text-primary transition-colors block">
                      {content.contact_email}
                    </a>
                    {content.contact_email_2 && (
                      <a href={"mailto:" + content.contact_email_2}
                         className="text-gray-500 text-sm hover:text-primary transition-colors block mt-1">
                        {content.contact_email_2}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaClock className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-dark text-sm">Horaires</p>
                    <p className="text-gray-500 text-sm">{content.contact_horaires}</p>
                  </div>
                </div>
              </div>

              <a
                href={"https://wa.me/" + (content.whatsapp_number || '22667448282')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-secondary text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6 w-full"
              >
                <FaWhatsapp className="text-xl" />
                Contacter sur WhatsApp
              </a>
            </div>

            {/* Carte Maps dynamique */}
            {content.maps_lien && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-56">
                <iframe
                  title="Localisation BSE Ouagadougou"
                  src={content.maps_lien}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>

          {/* Colonne formulaire */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-bold text-dark text-xl mb-2">Envoyez-nous un message</h3>
              <p className="text-gray-500 text-sm mb-6">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>

              {success ? (
                <div className="text-center py-12">
                  <FaCheckCircle className="text-secondary text-6xl mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-dark mb-2">Message envoyé avec succès !</h3>
                  <p className="text-gray-500 text-sm mb-6">Notre équipe vous recontactera très bientôt.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
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
                        type="text" name="nom" value={form.nom} onChange={handleChange}
                        placeholder="Votre nom"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-neutral text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                        placeholder="+226 XX XX XX XX"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-neutral text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Email</label>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="votre@email.com"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-neutral text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-1">Adresse</label>
                      <input
                        type="text" name="adresse" value={form.adresse} onChange={handleChange}
                        placeholder="Votre quartier / ville"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-neutral text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message" value={form.message} onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre projet, votre besoin ou votre question..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-neutral text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Envoi en cours...' : (
                      <>
                        <FaPaperPlane />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default Contact;