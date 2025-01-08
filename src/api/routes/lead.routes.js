const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

// Ruta para crear un lead
router.post('/create', leadController.createLead);

module.exports = router;