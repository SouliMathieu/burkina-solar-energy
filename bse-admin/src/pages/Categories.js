import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Tag, X, Save, Image } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../config/api';

const API_BASE = 'http://localhost:5000';

const CategoryModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (editData) {
      reset({ nom: editData.nom, ordre: editData.ordre });
      setPreview(editData.image ? API_BASE + editData.image : null);
    } else {
      reset({ nom: '', ordre: 0 });
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
      formData.append('nom', data.nom);
      formData.append('ordre', data.ordre || 0);
      if (fileRef.current && fileRef.current.files[0]) {
        formData.append('image', fileRef.current.files[0]);
      }

      if (editData) {
        await api.put('/categories/' + editData.id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Catégorie modifiée avec succès');
      } else {
        await api.post('/categories', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Catégorie créée avec succès');
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-dark">
            {editData ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Panneaux Solaires"
              className={"w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 " +
                (errors.nom ? 'border-red-400' : 'border-gray-300')}
              {...register('nom', { required: 'Le nom est obligatoire' })}
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ordre d'affichage
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              {...register('ordre')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image de la catégorie
            </label>
            {preview && (
              <div className="mb-2 w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-primary transition-colors">
              <Image size={18} className="text-gray-400" />
              <span className="text-sm text-gray-500">
                {preview ? "Changer l'image" : 'Choisir une image'}
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

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [editData, setEditData]     = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleEdit   = (cat) => { setEditData(cat);  setModalOpen(true); };
  const handleAdd    = ()     => { setEditData(null); setModalOpen(true); };

  const handleDelete = async (cat) => {
    if (!window.confirm('Supprimer la catégorie "' + cat.nom + '" ?')) return;
    try {
      await api.delete('/categories/' + cat.id);
      toast.success('Catégorie supprimée');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Catégories</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} catégorie(s) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Nouvelle catégorie
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Tag size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune catégorie pour l'instant</p>
          <button onClick={handleAdd} className="mt-4 text-primary text-sm font-medium hover:underline">
            Créer la première catégorie
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="h-36 bg-light flex items-center justify-center overflow-hidden">
                {cat.image ? (
                  <img
                    src={API_BASE + cat.image}
                    alt={cat.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <Tag size={36} className="text-gray-300" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-dark text-sm">{cat.nom}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Ordre : {cat.ordre}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-1.5 text-dark hover:bg-primary/10 hover:text-primary rounded-lg transition"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-dark hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCategories}
        editData={editData}
      />
    </div>
  );
};

export default Categories;