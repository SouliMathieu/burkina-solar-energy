require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { testConnection } = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middlewares globaux ───────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://burkina-solar-energy.netlify.app',
    'https://bse-admin.netlify.app',
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Fichiers statiques ────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/auth',         require('./src/routes/auth'));
app.use('/api/categories',   require('./src/routes/categories'));
app.use('/api/products',     require('./src/routes/products'));
app.use('/api/projects',     require('./src/routes/projects'));
app.use('/api/site-content', require('./src/routes/siteContent'));
app.use('/api/messages',     require('./src/routes/messages'));

// ─── Route de santé ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'BSE API opérationnelle',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Démarrage ────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log('Serveur BSE démarré sur http://localhost:' + PORT);
  await testConnection();
});

module.exports = app;
