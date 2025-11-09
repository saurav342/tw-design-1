const express = require('express');
const { uploadPitchDeck, uploadMiddleware } = require('../controllers/uploadController');

const router = express.Router();

router.post('/pitch-deck', uploadMiddleware, uploadPitchDeck);

module.exports = router;

