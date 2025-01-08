const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Ruta para recibir webhooks de pagos de Kommo
router.post('/payment', webhookController.handlePaymentWebhook);

// Ruta para verificar el estado de un webhook
router.get('/status/:leadId', webhookController.getWebhookStatus);

module.exports = router; 
