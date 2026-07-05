import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Package, X, Image, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '../config/api';

const API_BASE = 'http://localhost:5000';

const formatPrice = (price) =>
  new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';

// ─── Modal Formulaire ─────────────────────────────────────────
const ProductModal = ({ isOpen, onClose, onSuccess, editData, categories }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (editData) {
      reset({
        nom:         editData.nom,
        description: editData.description,
        prix:        editData.prix,
        category_id: editData.category_id,
        visible:     editData.visible,
      });
      setPreview(editData.image ? API_BASE + editData.image : null);
    } else {
      reset({ nom: '', description: '', prix: '', category_id: '', visible: 1 });
      setPreview(null);
    }
    // Réinitialiser le fichier sélectionné
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
      formData.append('nom',         data.nom);
      formData.append('description', data.description || '');
      formData.append('prix',        data.prix);
      formData.append('category_id', data.category_id);
      formData.append('visible',     data.visible ? 1 : 0);

      // Utilise le ref pour récupérer le fichier
      if (fileRef.current && fileRef.current.files[0]) {
        formData.append('image', fileRef.current.files[0]);
      }

      if (editData) {
        await api.put('/products/' + editData.id, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Produit modifié avec succès');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Produit créé avec succès');
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

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-dark">
            {editData ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Panneau Solaire 200W"
              className={"w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 " +
                (errors.nom ? 'border-red-400' : 'border-gray-300')}
              {...register('nom', { required: 'Le nom est obligatoire' })}
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Description du produit..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              {...register('description')}
            />
          </div>

          {/* Prix + Catégorie */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (FCFA) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 45000"
                className={"w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 " +
                  (errors.prix ? 'border-red-400' : 'border-gray-300')}
                {...register('prix', { required: 'Le prix est obligatoire' })}
              />
              {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                className={"w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 " +
                  (errors.category_id ? 'border-red-400' : 'border-gray-300')}
                {...register('category_id', { required: 'La catégorie est obligatoire' })}
              >
                <option value="">Choisir...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
            </div>
          </div>

          {/* Visibilité */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="visible"
              className="w-4 h-4 accent-primary"
              {...register('visible')}
              defaultChecked
            />
            <label htmlFor="visible" className="text-sm font-medium text-gray-700">
              Produit visible sur le site
            </label>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image du produit
            </label>
            {preview && (
              <div className="mb-2 w-full h-40 rounded-lg overflow-hidden bg-gray-100">
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

          {/* Boutons */}
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
              ) : editData ? 'Modifier' : 'Créer'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// ─── Page principale ──────────────────────────────────────────
const Products = () => {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editData,   setEditData]   = useState(null);
  const [filterCat,  setFilterCat]  = useState('');
  const [search,     setSearch]     = useState('');

  const fetchData = async () => {
    try {
      const [prods, cats] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(prods.data.data);
      setCategories(cats.data.data);
    } catch (error) {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (prod) => { setEditData(prod); setModalOpen(true); };
  const handleAdd  = ()     => { setEditData(null); setModalOpen(true); };

  const handleDelete = async (prod) => {
    if (!window.confirm('Supprimer le produit "' + prod.nom + '" ?')) return;
    try {
      await api.delete('/products/' + prod.id);
      toast.success('Produit supprimé');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleToggleVisible = async (prod) => {
    try {
      const formData = new FormData();
      formData.append('visible', prod.visible ? 0 : 1);
      await api.put('/products/' + prod.id, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(prod.visible ? 'Produit masqué' : 'Produit visible');
      fetchData();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const filtered = products.filter(p => {
    const matchCat    = filterCat ? p.category_id === parseInt(filterCat) : true;
    const matchSearch = search ? p.nom.toLowerCase().includes(search.toLowerCase()) : true;
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">Produits</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} produit(s) au total</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Nouveau produit
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Toutes les catégories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
      </div>

      {/* Liste */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Package size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-dark">Produit</th>
                <th className="text-left px-4 py-3 font-semibold text-dark hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 font-semibold text-dark">Prix</th>
                <th className="text-center px-4 py-3 font-semibold text-dark">Visible</th>
                <th className="text-right px-4 py-3 font-semibold text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(prod => (
                <tr key={prod.id} className="hover:bg-light/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-light flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {prod.image ? (
                          <img src={API_BASE + prod.image} alt={prod.nom} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={18} className="text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-dark">{prod.nom}</p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">{prod.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="bg-dark/10 text-dark px-2 py-1 rounded-full text-xs font-medium">
                      {prod.category_nom}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-primary">{formatPrice(prod.prix)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleVisible(prod)}
                      className={"p-1.5 rounded-lg transition " +
                        (prod.visible
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200')}
                    >
                      {prod.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="p-1.5 text-dark hover:bg-primary/10 hover:text-primary rounded-lg transition"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(prod)}
                        className="p-1.5 text-dark hover:bg-red-50 hover:text-red-500 rounded-lg transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        editData={editData}
        categories={categories}
      />
    </div>
  );
};

export default Products;