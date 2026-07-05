const { pool } = require('../config/db');

// ─── GET /api/products ────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const { category_id, search, visible } = req.query;
    let query = `
      SELECT p.*, c.nom as category_nom, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (category_id) {
      query += ' AND p.category_id = ?';
      params.push(category_id);
    }
    if (search) {
      query += ' AND (p.nom LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (visible !== undefined) {
      query += ' AND p.visible = ?';
      params.push(visible);
    } else {
      // Par défaut, le site vitrine ne voit que les produits visibles
      if (!req.user) query += ' AND p.visible = 1';
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, c.nom as category_nom
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/products ───────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { nom, description, prix, category_id, visible } = req.body;

    if (!nom || !prix || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Nom, prix et catégorie sont obligatoires'
      });
    }

    // Vérifie que la catégorie existe
    const [cat] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
    if (cat.length === 0) {
      return res.status(400).json({ success: false, message: 'Catégorie introuvable' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO products (nom, description, prix, image, category_id, visible) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, description || null, prix, image, category_id, visible !== undefined ? visible : 1]
    );

    const [newProduct] = await pool.query(
      `SELECT p.*, c.nom as category_nom FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [result.insertId]
    );
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }

    const p = existing[0];
    const { nom, description, prix, category_id, visible } = req.body;

    const updatedNom         = nom         || p.nom;
    const updatedDescription = description !== undefined ? description : p.description;
    const updatedPrix        = prix        || p.prix;
    const updatedCategoryId  = category_id || p.category_id;
    const updatedVisible     = visible     !== undefined ? visible : p.visible;
    const updatedImage       = req.file ? `/uploads/${req.file.filename}` : p.image;

    await pool.query(
      'UPDATE products SET nom=?, description=?, prix=?, image=?, category_id=?, visible=? WHERE id=?',
      [updatedNom, updatedDescription, updatedPrix, updatedImage, updatedCategoryId, updatedVisible, req.params.id]
    );

    const [updated] = await pool.query(
      `SELECT p.*, c.nom as category_nom FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Produit introuvable' });
    }
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};