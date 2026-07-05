const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriesController');

// ─── Config Multer (upload images) ───────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cat-' + unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images JPG, PNG et WebP sont acceptées'));
    }
  },
});

// ─── Routes publiques ─────────────────────────────────────────
router.get('/',    getAllCategories);
router.get('/:id', getCategoryById);

// ─── Routes protégées (admin) ─────────────────────────────────
router.post('/',    auth, upload.single('image'), createCategory);
router.put('/:id',  auth, upload.single('image'), updateCategory);
router.delete('/:id', auth, deleteCategory);

module.exports = router;