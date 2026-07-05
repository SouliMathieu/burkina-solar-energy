import { useState, useEffect } from 'react';
import { Package, Tag, FolderOpen, MessageSquare, TrendingUp, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4">
    <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon size={26} className={color} />
    </div>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-3xl font-bold text-dark">{value}</p>
    </div>
  </div>
);

const quickLinks = [
  { label: 'Ajouter un produit',  href: '/products',     color: 'bg-primary/10 text-primary'    },
  { label: 'Ajouter un projet',   href: '/projects',     color: 'bg-secondary/10 text-secondary' },
  { label: 'Voir les messages',   href: '/messages',     color: 'bg-purple-100 text-purple-600'  },
  { label: 'Modifier contenus',   href: '/site-content', color: 'bg-dark/10 text-dark'           },
];

const Dashboard = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cats, prods, projs, msgs] = await Promise.all([
          api.get('/categories'),
          api.get('/products'),
          api.get('/projects'),
          api.get('/messages'),
        ]);
        setStats({
          categories: cats.data.data.length,
          products:   prods.data.data.length,
          projects:   projs.data.data.length,
          messages:   msgs.data.data.length,
          unread:     msgs.data.data.filter(m => !m.lu).length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-dark rounded-xl p-6 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-white/60 text-sm mt-1">Vue d'ensemble de votre site BSE</p>
        </div>
        <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center">
          <Sun size={28} className="text-primary" />
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Tag}           label="Catégories"      value={stats.categories} color="text-dark"        bg="bg-dark/10"       />
        <StatCard icon={Package}       label="Produits"         value={stats.products}   color="text-primary"    bg="bg-primary/10"    />
        <StatCard icon={FolderOpen}    label="Projets réalisés" value={stats.projects}   color="text-secondary"  bg="bg-secondary/10"  />
        <StatCard icon={MessageSquare} label="Messages reçus"   value={stats.messages}   color="text-purple-600" bg="bg-purple-100"    />
      </div>

      {/* Infos supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Messages non lus */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark">Messages non lus</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              stats.unread > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {stats.unread > 0 ? `${stats.unread} non lu(s)` : 'Tout lu ✓'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: stats.messages > 0
                  ? `${((stats.messages - stats.unread) / stats.messages) * 100}%`
                  : '100%'
                }}
              />
            </div>
            <span className="text-sm text-gray-500">
              {stats.messages - stats.unread}/{stats.messages} lus
            </span>
          </div>
        </div>

        {/* Accès rapide */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-dark mb-4">Accès rapide</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(({ label, href, color }) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className={`${color} rounded-lg px-3 py-2 text-xs font-medium text-center hover:opacity-80 transition-opacity`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info version */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
        <TrendingUp size={20} className="text-secondary" />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-dark">BSE Admin v1.0</span> — Backend connecté sur{' '}
          <span className="font-mono text-primary">localhost:5000</span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;