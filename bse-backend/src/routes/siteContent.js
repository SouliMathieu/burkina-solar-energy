const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const { getAllContent, updateContent, updateMultipleContent } = require('../controllers/siteContentController');

// Config Multer pour les images du slider
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'hero-' + unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images JPG, PNG et WebP sont acceptées'));
    }
  },
});

router.get('/',         getAllContent);
router.put('/bulk',     auth, updateMultipleContent);
router.put('/:cle',     auth, updateContent);

// Route spéciale pour uploader une image de slide
router.post('/upload-hero-image', auth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Aucune image fournie' });
    }
    const imagePath = '/uploads/' + req.file.filename;
    res.json({ success: true, data: { path: imagePath } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;