 // src/api/controllers/webhook.controller.js
const KommoService = require('../../services/kommo/client');
const ExcelService = require('../../services/excel/excel.service');
const { validatePayment } = require('../../utils/validation');

class WebhookController {
    constructor() {
        this.kommoService = new KommoService();
        this.excelService = new ExcelService();
    }

    async handlePaymentWebhook(req, res) {
        try {
            const paymentData = req.body;
            
            // Validar el comprobante de pago
            const isValid = await validatePayment(paymentData);
            if (!isValid) {
                return res.status(400).json({ error: 'Comprobante de pago inválido' });
            }

            // Actualizar CRM
            await this.kommoService.updatePaymentStatus(paymentData);

            // Actualizar Excel
            await this.excelService.updateTransaction(paymentData);

            res.status(200).json({ message: 'Pago procesado correctamente' });
        } catch (error) {
            console.error('Error processing payment webhook:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}

module.exports = new WebhookController();
