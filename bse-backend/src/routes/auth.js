const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middlewares/auth');
const { login, getMe, updateProfile, changePassword } = require('../controllers/authController');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' }
});

router.post('/login',            loginLimiter, login);
router.get('/me',                auth, getMe);
router.put('/update-profile',    auth, updateProfile);
router.put('/change-password',   auth, changePassword);

module.exports = router;