const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Ruta para procesar pagos
router.post('/process', paymentController.processPayment);

module.exports = router;