const { pool } = require('../config/db');

// ─── POST /api/messages ───────────────────────────────────────
const createMessage = async (req, res) => {
  try {
    const { nom, telephone, email, adresse, message } = req.body;
    if (!nom || !message) {
      return res.status(400).json({ success: false, message: 'Nom et message sont obligatoires' });
    }
    const [result] = await pool.query(
      'INSERT INTO messages (nom, telephone, email, adresse, message) VALUES (?, ?, ?, ?, ?)',
      [nom, telephone || null, email || null, adresse || null, message]
    );
    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: { id: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/messages ────────────────────────────────────────
const getAllMessages = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── PUT /api/messages/:id/lu ─────────────────────────────────
const markAsRead = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Message introuvable' });
    }
    await pool.query('UPDATE messages SET lu = 1 WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Message marqué comme lu' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── DELETE /api/messages/:id ─────────────────────────────────
const deleteMessage = async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Message introuvable' });
    }
    await pool.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Message supprimé' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createMessage, getAllMessages, markAsRead, deleteMessage };