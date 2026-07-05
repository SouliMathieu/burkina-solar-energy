import { useState, useEffect } from 'react';
import { Save, User, Lock, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b bg-light">
      <Icon size={18} className="text-primary" />
      <h2 className="font-semibold text-dark">{title}</h2>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const MonCompte = () => {
  const [profile, setProfile] = useState({ nom: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setProfile({ nom: res.data.data.nom, email: res.data.data.email }))
      .catch(() => toast.error('Erreur lors du chargement du profil'))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profile.nom || !profile.email) {
      toast.error('Nom et email sont obligatoires');
      return;
    }
    setLoadingProfile(true);
    try {
      await api.put('/auth/update-profile', profile);
      // Mettre à jour les infos en localStorage
      const user = JSON.parse(localStorage.getItem('bse_user') || '{}');
      localStorage.setItem('bse_user', JSON.stringify({ ...user, nom: profile.nom, email: profile.email }));
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      toast.error('Tous les champs sont obligatoires');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Les deux nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoadingPassword(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success('Mot de passe modifié avec succès');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoadingPassword(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-bold text-dark">Mon compte</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez vos informations de connexion</p>
      </div>

      {/* Informations du profil */}
      <Section title="Informations du profil" icon={User}>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={profile.nom}
                onChange={e => setProfile({ ...profile, nom: e.target.value })}
                placeholder="Votre nom"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                placeholder="votre@email.com"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <p className="text-yellow-800 text-xs">
              Attention : si vous modifiez votre email, vous devrez utiliser le nouvel email pour vous connecter la prochaine fois.
            </p>
          </div>
          <button
            type="submit"
            disabled={loadingProfile}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-70 transition"
          >
            {loadingProfile ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Save size={16} />}
            Sauvegarder le profil
          </button>
        </form>
      </Section>

      {/* Changer le mot de passe */}
      <Section title="Changer le mot de passe" icon={Lock}>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <div className="relative">
              <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={passwords.currentPassword}
                onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                placeholder="Votre mot de passe actuel"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={passwords.newPassword}
                onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                placeholder="Minimum 6 caractères"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                placeholder="Répétez le nouveau mot de passe"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loadingPassword}
            className="flex items-center gap-2 bg-dark hover:bg-dark/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-70 transition"
          >
            {loadingPassword ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Lock size={16} />}
            Changer le mot de passe
          </button>
        </form>
      </Section>

    </div>
  );
};

export default MonCompte;