const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middlewares/auth');
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject } = require('../controllers/projectsController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'proj-' + unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/',     getAllProjects);
router.get('/:id',  getProjectById);
router.post('/',      auth, upload.single('image'), createProject);
router.put('/:id',    auth, upload.single('image'), updateProject);
router.delete('/:id', auth, deleteProject);

module.exports = router;