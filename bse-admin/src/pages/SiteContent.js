import { useState, useEffect, useRef } from 'react';
import { Save, FileText, Phone, MapPin, Users, Share2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

const API_BASE = 'http://localhost:5000';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b bg-light">
      <Icon size={18} className="text-primary" />
      <h2 className="font-semibold text-dark">{title}</h2>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const Field = ({ label, value, onChange, type = 'text', rows, placeholder, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
    {type === 'textarea' ? (
      <textarea
        rows={rows || 3}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    )}
  </div>
);

// Composant upload image pour chaque slide
const SlideImageUpload = ({ slideIndex, currentImage, onUploaded }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage ? API_BASE + currentImage : null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/site-content/upload-hero-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onUploaded(res.data.data.path);
      toast.success('Image du slide ' + slideIndex + ' mise à jour');
    } catch (error) {
      toast.error('Erreur lors du téléversement');
      setPreview(currentImage ? API_BASE + currentImage : null);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploaded('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Image du slide (optionnelle)
      </label>
      {preview ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-2">
          <img src={preview} alt="slide" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <p className="text-xs text-gray-400 mb-2">Aucune image — fond coloré par défaut</p>
      )}
      <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-2.5 hover:border-primary transition-colors">
        {uploading ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <Upload size={16} className="text-gray-400" />
        )}
        <span className="text-sm text-gray-500">
          {uploading ? 'Téléversement...' : preview ? "Changer l'image" : 'Choisir une image'}
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileRef}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
};

const SiteContent = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/site-content')
      .then(res => setContent(res.data.data))
      .catch(() => toast.error('Erreur lors du chargement des contenus'))
      .finally(() => setLoading(false));
  }, []);

  const update = (key, value) => {
    setContent(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/site-content/bulk', content);
      toast.success('Contenus sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Contenus du site</h1>
          <p className="text-gray-500 text-sm mt-1">Modifiez les informations affichées sur le site vitrine</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70 transition"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : <Save size={16} />}
          Sauvegarder
        </button>
      </div>

      {/* Hero Slider */}
      <Section title="Hero Slider — 5 slides" icon={FileText}>
        <p className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
          Modifiez les textes et images de chaque slide. Si aucune image n'est choisie, un fond coloré s'affichera.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Slide {i}</p>
              <Field
                label="Titre"
                value={content['hero_titre_' + i]}
                onChange={v => update('hero_titre_' + i, v)}
                placeholder="Titre du slide"
              />
              <Field
                label="Sous-titre"
                value={content['hero_sous_titre_' + i]}
                onChange={v => update('hero_sous_titre_' + i, v)}
                type="textarea"
                rows={2}
                placeholder="Description courte"
              />
              <SlideImageUpload
                slideIndex={i}
                currentImage={content['hero_image_' + i]}
                onUploaded={path => update('hero_image_' + i, path)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Réseaux sociaux */}
      <Section title="Réseaux sociaux" icon={Share2}>
        <p className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
          Collez ici les liens complets de vos pages. Laisser vide si vous n'avez pas encore de page.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Lien Facebook"
            value={content['social_facebook']}
            onChange={v => update('social_facebook', v)}
            placeholder="https://facebook.com/burkina-solar-energy"
          />
          <Field
            label="Lien Instagram"
            value={content['social_instagram']}
            onChange={v => update('social_instagram', v)}
            placeholder="https://instagram.com/burkina-solar-energy"
          />
          <Field
            label="Numéro WhatsApp (sans le +)"
            value={content['whatsapp_number']}
            onChange={v => update('whatsapp_number', v)}
            placeholder="22667448282"
            hint="Format international sans + ni espaces"
          />
        </div>
      </Section>

      {/* Contact */}
      <Section title="Informations de contact" icon={Phone}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Téléphone principal"
            value={content['contact_telephone']}
            onChange={v => update('contact_telephone', v)}
            placeholder="+226 67 44 82 82"
          />
          <Field
            label="Téléphone secondaire (optionnel)"
            value={content['contact_telephone_2']}
            onChange={v => update('contact_telephone_2', v)}
            placeholder="+226 XX XX XX XX"
            hint="Laisser vide si vous n'en avez pas"
          />
          <Field
            label="Email principal"
            value={content['contact_email']}
            onChange={v => update('contact_email', v)}
            type="email"
            placeholder="contact@burkina-solar.com"
          />
          <Field
            label="Email secondaire (optionnel)"
            value={content['contact_email_2']}
            onChange={v => update('contact_email_2', v)}
            type="email"
            placeholder="info@burkina-solar.com"
            hint="Laisser vide si vous n'en avez pas"
          />
          <Field
            label="Adresse"
            value={content['contact_adresse']}
            onChange={v => update('contact_adresse', v)}
            placeholder="Ouagadougou, Burkina Faso — Secteur 15"
          />
          <Field
            label="Horaires d'ouverture"
            value={content['contact_horaires']}
            onChange={v => update('contact_horaires', v)}
            placeholder="Lun - Sam : 8h00 - 18h00"
          />
        </div>
      </Section>

      {/* Google Maps */}
      <Section title="Localisation Google Maps" icon={MapPin}>
        <p className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
          Comment faire : 1) Allez sur Google Maps → 2) Trouvez votre entreprise → 3) Cliquez "Partager" → 4) "Intégrer une carte" → 5) Copiez uniquement la valeur de src="..." et collez-la ici.
        </p>
        <Field
          label="Lien d'intégration Google Maps"
          value={content['maps_lien']}
          onChange={v => update('maps_lien', v)}
          placeholder="https://www.google.com/maps/embed?pb=..."
          hint="La carte apparaîtra automatiquement sur la page Contact"
        />
        {content['maps_lien'] && (
          <div className="mt-2 rounded-xl overflow-hidden h-48 border border-gray-200">
            <iframe
              title="Aperçu carte"
              src={content['maps_lien']}
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        )}
      </Section>

      {/* À propos */}
      <Section title="Section À propos" icon={FileText}>
        <Field
          label="Slogan BSE"
          value={content['slogan']}
          onChange={v => update('slogan', v)}
          placeholder="L'énergie du soleil, la force du Burkina"
        />
        <Field
          label="Titre À propos"
          value={content['about_titre']}
          onChange={v => update('about_titre', v)}
          placeholder="Qui sommes-nous ?"
        />
        <Field
          label="Texte À propos"
          value={content['about_texte']}
          onChange={v => update('about_texte', v)}
          type="textarea"
          rows={4}
          placeholder="Description de l'entreprise..."
        />
      </Section>

      {/* Compteurs */}
      <Section title="Compteurs animés" icon={Users}>
        <p className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg">
          Ces chiffres s'affichent avec une animation sur la page d'accueil. Entrez uniquement des chiffres.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field
            label="Clients satisfaits"
            value={content['compteur_clients']}
            onChange={v => update('compteur_clients', v)}
            type="number"
            placeholder="500"
          />
          <Field
            label="Projets réalisés"
            value={content['compteur_projets']}
            onChange={v => update('compteur_projets', v)}
            type="number"
            placeholder="300"
          />
          <Field
            label="Années d'expérience"
            value={content['compteur_experience']}
            onChange={v => update('compteur_experience', v)}
            type="number"
            placeholder="10"
          />
        </div>
      </Section>

      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-70 transition shadow-lg"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : <Save size={16} />}
          Sauvegarder tous les contenus
        </button>
      </div>

    </div>
  );
};

export default SiteContent;