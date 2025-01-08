const kommoClient = require('../../services/kommo/client');

class PaymentController {
    async processPayment(req, res) {
        try {
            const { leadId, amount, paymentMethod } = req.body;

            // Validar el comprobante de pago
            if (!leadId || !amount || !paymentMethod) {
                throw new Error('Faltan campos obligatorios en el comprobante de pago');
            }

            // Obtener la lista de campos personalizados
            const customFields = await kommoClient.getCustomFields();

            // Buscar los campos personalizados necesarios
            const amountField = customFields.find(f => f.name === 'Monto');
            const paymentMethodField = customFields.find(f => f.name === 'Método de Pago');

            if (!amountField || !paymentMethodField) {
                throw new Error('No se encontraron los campos personalizados necesarios');
            }

            // Crear el cuerpo de la solicitud para actualizar el lead
            const leadData = [
                {
                    id: leadId,
                    custom_fields_values: [
                        {
                            field_id: amountField.id, // Usa el field_id del campo "Monto"
                            values: [{ value: amount }]
                        },
                        {
                            field_id: paymentMethodField.id, // Usa el field_id del campo "Método de Pago"
                            values: [{ value: paymentMethod }]
                        }
                    ]
                }
            ];

            // Log del cuerpo de la solicitud
            console.log('Cuerpo de la solicitud:', leadData);

            // Enviar la solicitud para actualizar el lead
            const response = await kommoClient.updateLead(leadId, leadData);

            // Registrar la transacción (simulación)
            const transaction = {
                leadId,
                amount,
                paymentMethod,
                paymentDate: new Date().toISOString()
            };
            console.log('Transacción registrada:', transaction);

            res.status(200).json({
                message: 'Pago procesado correctamente',
                transaction
            });
        } catch (error) {
            console.error('Error procesando el pago:', error.message);
            res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    }
}

module.exports = new PaymentController();