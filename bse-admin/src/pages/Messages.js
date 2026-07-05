import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, Eye, EyeOff, Phone, Mail, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../config/api';

// ─── Modal détail message ─────────────────────────────────────
const MessageModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-dark">Détail du message</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Expéditeur */}
          <div className="bg-light rounded-xl p-4 space-y-2">
            <p className="font-semibold text-dark text-base">{message.nom}</p>
            {message.telephone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={14} className="text-primary" />
                {message.telephone}
              </div>
            )}
            {message.email && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={14} className="text-primary" />
                {message.email}
              </div>
            )}
            {message.adresse && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={14} className="text-primary" />
                {message.adresse}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock size={12} />
              {new Date(message.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Message :</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </div>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="w-full bg-dark hover:bg-dark/90 text-white py-2.5 rounded-lg text-sm font-medium transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page Messages ────────────────────────────────────────────
const Messages = () => {
  const [messages, setMessages]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [filterLu, setFilterLu]     = useState('tous');

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleView = async (msg) => {
    setSelected(msg);
    if (!msg.lu) {
      try {
        await api.put(`/messages/${msg.id}/lu`);
        fetchMessages();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async (msg) => {
    if (!window.confirm(`Supprimer le message de "${msg.nom}" ?`)) return;
    try {
      await api.delete(`/messages/${msg.id}`);
      toast.success('Message supprimé');
      fetchMessages();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleLu = async (msg) => {
    try {
      if (!msg.lu) {
        await api.put(`/messages/${msg.id}/lu`);
      } else {
        // Remettre en non-lu via l'API directement
        await api.put(`/messages/${msg.id}/lu`, { lu: 0 });
      }
      fetchMessages();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const filtered = messages.filter(m => {
    if (filterLu === 'lus')    return m.lu === 1;
    if (filterLu === 'nonlus') return m.lu === 0;
    return true;
  });

  const unreadCount = messages.filter(m => !m.lu).length;

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length} message(s) —
            <span className={`ml-1 font-medium ${unreadCount > 0 ? 'text-red-500' : 'text-green-600'}`}>
              {unreadCount > 0 ? `${unreadCount} non lu(s)` : 'tous lus ✓'}
            </span>
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex gap-2">
        {[
          { key: 'tous',    label: 'Tous',       count: messages.length },
          { key: 'nonlus',  label: 'Non lus',    count: messages.filter(m => !m.lu).length },
          { key: 'lus',     label: 'Lus',        count: messages.filter(m => m.lu).length  },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilterLu(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
              filterLu === key
                ? 'bg-dark text-white'
                : 'bg-light text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              filterLu === key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <MessageSquare size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun message</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filtered.map(msg => (
              <div
                key={msg.id}
                className={`flex items-center gap-4 px-4 py-4 hover:bg-light/50 transition-colors ${
                  !msg.lu ? 'bg-primary/5' : ''
                }`}
              >
                {/* Indicateur non lu */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  !msg.lu ? 'bg-primary' : 'bg-transparent'
                }`} />

                {/* Avatar */}
                <div className="w-10 h-10 bg-dark/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-dark font-semibold text-sm">
                    {msg.nom.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleView(msg)}>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!msg.lu ? 'font-semibold text-dark' : 'font-medium text-gray-700'}`}>
                      {msg.nom}
                    </p>
                    {!msg.lu && (
                      <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">Nouveau</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {msg.telephone && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone size={10} /> {msg.telephone}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {formatDate(msg.created_at)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleView(msg)}
                    className="p-1.5 text-dark hover:bg-primary/10 hover:text-primary rounded-lg transition"
                    title="Voir le message"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => handleToggleLu(msg)}
                    className={`p-1.5 rounded-lg transition ${
                      msg.lu
                        ? 'text-gray-400 hover:bg-gray-100'
                        : 'text-primary hover:bg-primary/10'
                    }`}
                    title={msg.lu ? 'Marquer non lu' : 'Marquer lu'}
                  >
                    {msg.lu ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button
                    onClick={() => handleDelete(msg)}
                    className="p-1.5 text-dark hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal détail */}
      <MessageModal message={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Messages;