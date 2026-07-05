const { pool } = require('../config/db');

// ─── GET /api/projects ────────────────────────────────────────
const getAllProjects = async (req, res) => {
  try {
    let query = 'SELECT * FROM projects';
    if (!req.user) query += ' WHERE visible = 1';
    query += ' ORDER BY date DESC, created_at DESC';
    const [rows] = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/projects/:id ────────────────────────────────────
const getProjectById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet introuvable' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/projects ───────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const { titre, description, date, visible } = req.body;
    if (!titre) {
      return res.status(400).json({ success: false, message: 'Le titre est obligatoire' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await pool.query(
      'INSERT INTO projects (titre, description, image, date, visible) VALUES (?, ?, ?, ?, ?)',
      [titre, description || null, image, date || null, visible !== undefined ? visible : 1]
    );
    const [newProject] = await pool.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, data: newProject[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/projects/:id ────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet introuvable' });
    }
    const p = existing[0];
    const { titre, description, date, visible } = req.body;

    const updatedTitre       = titre       || p.titre;
    const updatedDescription = description !== undefined ? description : p.description;
    const updatedDate        = date        !== undefined ? date : p.date;
    const updatedVisible     = visible     !== undefined ? visible : p.visible;
    const updatedImage       = req.file ? `/uploads/${req.file.filename}` : p.image;

    await pool.query(
      'UPDATE projects SET titre=?, description=?, image=?, date=?, visible=? WHERE id=?',
      [updatedTitre, updatedDescription, updatedImage, updatedDate, updatedVisible, req.params.id]
    );
    const [updated] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, data: updated[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/projects/:id ─────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Projet introuvable' });
    }
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Projet supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };