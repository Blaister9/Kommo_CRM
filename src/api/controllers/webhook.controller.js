const kommoClient = require('../../services/kommo/client');
const ExcelService = require('../../services/excel/excel.service');
const { validatePayment } = require('../../utils/validation');

class WebhookController {
    constructor() {
        this.excelService = new ExcelService();
    }

    async handlePaymentWebhook(req, res) {
        try {
            const paymentData = req.body;
    
            // Validar datos del pago
            const isValid = validatePayment(paymentData);
            if (!isValid) {
                return res.status(400).json({ error: 'Datos de pago inválidos' });
            }
    
            // Actualizar en Kommo
            await kommoClient.patch(`/leads/${paymentData.leadId}`, {
                status_id: paymentData.status // Actualizar el estado del lead
            });
    
            // Actualizar Excel
            await this.excelService.updateTransaction(paymentData);
    
            res.status(200).json({
                message: 'Pago procesado correctamente',
                leadId: paymentData.leadId,
                status: paymentData.status
            });
        } catch (error) {
            console.error('Error processing payment webhook:', error.response ? error.response.data : error.message);
            res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    }

    async getWebhookStatus(req, res) {
        try {
            const { leadId } = req.params;
            const leadDetails = await kommoClient.getLeadDetails(leadId);
            
            res.status(200).json({
                leadId,
                status: leadDetails.status_id,
                lastUpdated: new Date(leadDetails.updated_at * 1000)
            });
        } catch (error) {
            console.error('Error getting webhook status:', error);
            res.status(500).json({ 
                error: 'Error obteniendo estado',
                details: error.message 
            });
        }
    }
}

module.exports = new WebhookController();