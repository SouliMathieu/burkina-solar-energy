import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, FolderOpen, X, Save, Image, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../config/api';

const API_BASE = 'http://localhost:5000';

const ProjectModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (editData) {
      reset({
        titre:       editData.titre,
        description: editData.description,
        date:        editData.date ? editData.date.split('T')[0] : '',
        visible:     editData.visible,
      });
      setPreview(editData.image ? API_BASE + editData.image : null);
    } else {
      reset({ titre: '', description: '', date: '', visible: true });
      setPreview(null);
    }
    if (fileRef.current) fileRef.current.value = '';
  }, [editData, reset, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('titre',       data.titre);
      formData.append('description', data.description || '');
      formData.append('date',        data.date || '');
      formData.append('visible',     data.visible ? 1 : 0);
      if (fileRef.current && fileRef.current.files[0]) {
        formData.append('image', fileRef.current.files[0]);
      }

      if (editData) {
        await api.put('/projects/' + editData.id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Projet modifié avec succès');
      } else {
        await api.post('/projects', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Projet créé avec succès');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-dark">
            {editData ? 'Modifier le projet' : 'Nouveau projet'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du projet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Installation solaire 5KW — Ouaga 2000"
              className={"w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 " +
                (errors.titre ? 'border-red-400' : 'border-gray-300')}
              {...register('titre', { required: 'Le titre est obligatoire' })}
            />
            {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Décrivez le projet réalisé..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              {...register('description')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de réalisation
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              {...register('date')}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="visible"
              className="w-4 h-4 accent-primary"
              {...register('visible')}
              defaultChecked
            />
            <label htmlFor="visible" className="text-sm font-medium text-gray-700">
              Projet visible sur le site
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo du projet
            </label>
            {preview && (
              <div className="mb-2 w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-primary transition-colors">
              <Image size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {preview ? "Changer la photo" : 'Choisir une photo'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : <Save size={16} />}
              {editData ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Projects = () => {
  const [projects,  setProjects]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData,  setEditData]  = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleEdit   = (proj) => { setEditData(proj); setModalOpen(true); };
  const handleAdd    = ()     => { setEditData(null);  setModalOpen(true); };

  const handleDelete = async (proj) => {
    if (!window.confirm('Supprimer le projet "' + proj.titre + '" ?')) return;
    try {
      await api.delete('/projects/' + proj.id);
      toast.success('Projet supprimé');
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleVisible = async (proj) => {
    try {
      const formData = new FormData();
      formData.append('visible', proj.visible ? 0 : 1);
      await api.put('/projects/' + proj.id, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(proj.visible ? 'Projet masqué' : 'Projet visible');
      fetchProjects();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Projets réalisés</h1>
          <p className="text-gray-500 text-sm mt-1">{projects.length} projet(s) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Nouveau projet
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <FolderOpen size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun projet pour l'instant</p>
          <button onClick={handleAdd} className="mt-4 text-primary text-sm font-medium hover:underline">
            Ajouter le premier projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="h-44 bg-light flex items-center justify-center overflow-hidden relative">
                {proj.image ? (
                  <img
                    src={API_BASE + proj.image}
                    alt={proj.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <FolderOpen size={40} className="text-gray-300" />
                )}
                <div className={"absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium " +
                  (proj.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                  {proj.visible ? 'Visible' : 'Masqué'}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-dark text-sm leading-tight mb-1">{proj.titre}</h3>
                <p className="text-xs text-gray-400 mb-3">{formatDate(proj.date)}</p>
                {proj.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{proj.description}</p>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleToggleVisible(proj)}
                    className={"p-1.5 rounded-lg transition " +
                      (proj.visible
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200')}
                  >
                    {proj.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => handleEdit(proj)}
                    className="p-1.5 text-dark hover:bg-primary/10 hover:text-primary rounded-lg transition"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(proj)}
                    className="p-1.5 text-dark hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchProjects}
        editData={editData}
      />
    </div>
  );
};

export default Projects;