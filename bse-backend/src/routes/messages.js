const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createMessage, getAllMessages, markAsRead, deleteMessage } = require('../controllers/messagesController');

router.post('/',           createMessage);           // public — formulaire contact
router.get('/',            auth, getAllMessages);     // admin seulement
router.put('/:id/lu',      auth, markAsRead);        // admin seulement
router.delete('/:id',      auth, deleteMessage);     // admin seulement

module.exports = router;