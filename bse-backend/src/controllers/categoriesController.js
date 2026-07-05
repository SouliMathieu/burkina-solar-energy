const { pool } = require('../config/db');

// Utilitaire slug
const generateSlug = (text) =>
  text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ─── GET /api/categories ──────────────────────────────────────
const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories ORDER BY ordre ASC, created_at ASC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/categories/:id ──────────────────────────────────
const getCategoryById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Catégorie introuvable' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/categories ─────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { nom, ordre } = req.body;
    if (!nom) {
      return res.status(400).json({ success: false, message: 'Le nom est obligatoire' });
    }
    const slug = generateSlug(nom);
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO categories (nom, slug, image, ordre) VALUES (?, ?, ?, ?)',
      [nom, slug, image, ordre || 0]
    );
    const [newCat] = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newCat[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, message: 'Une catégorie avec ce nom existe déjà' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/categories/:id ──────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const { nom, ordre } = req.body;
    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Catégorie introuvable' });
    }

    const updatedNom   = nom   || existing[0].nom;
    const updatedOrdre = ordre !== undefined ? ordre : existing[0].ordre;
    const updatedSlug  = nom ? generateSlug(nom) : existing[0].slug;
    const updatedImage = req.file ? `/uploads/${req.file.filename}` : existing[0].image;

    await pool.query(
      'UPDATE categories SET nom = ?, slug = ?, image = ?, ordre = ? WHERE id = ?',
      [updatedNom, updatedSlug, updatedImage, updatedOrdre, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/categories/:id ───────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Catégorie introuvable' });
    }
    // Vérifie si des produits utilisent cette catégorie
    const [products] = await pool.query(
      'SELECT COUNT(*) as total FROM products WHERE category_id = ?', [req.params.id]
    );
    if (products[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer — ${products[0].total} produit(s) utilisent cette catégorie`
      });
    }
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};