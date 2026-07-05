const { pool } = require('../config/db');

// ─── GET /api/site-content ────────────────────────────────────
const getAllContent = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM site_content ORDER BY cle ASC');
    // Transforme en objet clé/valeur pour faciliter l'usage côté frontend
    const content = {};
    rows.forEach(row => { content[row.cle] = row.valeur; });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/site-content/:cle ───────────────────────────────
const updateContent = async (req, res) => {
  try {
    const { cle } = req.params;
    const { valeur } = req.body;
    if (valeur === undefined) {
      return res.status(400).json({ success: false, message: 'La valeur est obligatoire' });
    }
    // INSERT ou UPDATE si la clé existe déjà
    await pool.query(
      'INSERT INTO site_content (cle, valeur) VALUES (?, ?) ON DUPLICATE KEY UPDATE valeur = ?',
      [cle, valeur, valeur]
    );
    res.json({ success: true, message: 'Contenu mis à jour', data: { cle, valeur } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/site-content (mise à jour en masse) ─────────────
const updateMultipleContent = async (req, res) => {
  try {
    const updates = req.body; // { cle1: valeur1, cle2: valeur2, ... }
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, message: 'Format invalide' });
    }
    const entries = Object.entries(updates);
    for (const [cle, valeur] of entries) {
      await pool.query(
        'INSERT INTO site_content (cle, valeur) VALUES (?, ?) ON DUPLICATE KEY UPDATE valeur = ?',
        [cle, valeur, valeur]
      );
    }
    res.json({ success: true, message: `${entries.length} contenu(s) mis à jour` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllContent, updateContent, updateMultipleContent };