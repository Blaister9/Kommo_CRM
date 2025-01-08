const kommoClient = require('../../services/kommo/client');

class LeadController {
    async createLead(req, res) {
        try {
            console.log('Iniciando creación de lead...');

            // Obtener la lista de pipelines y statuses
            console.log('Obteniendo pipelines y statuses...');
            const pipelines = await kommoClient.getPipelines();
            const pipeline = pipelines.find(p => p.is_main); // Selecciona la pipeline principal
            if (!pipeline) {
                throw new Error('No se encontró una pipeline principal');
            }

            const status = pipeline._embedded.statuses.find(s => s.is_editable); // Selecciona un status editable
            if (!status) {
                throw new Error('No se encontró un status editable en la pipeline');
            }

            // Obtener la lista de usuarios
            console.log('Obteniendo usuarios...');
            const users = await kommoClient.getUsers();
            const responsibleUser = users[0]; // Selecciona el primer usuario

            // Obtener la lista de campos personalizados
            console.log('Obteniendo campos personalizados...');
            const customFields = await kommoClient.getCustomFields();

            // Verificar si los campos personalizados existen, si no, crearlos
            let amountField = customFields.find(f => f.name === 'Monto');
            let paymentMethodField = customFields.find(f => f.name === 'Método de Pago');

            if (!amountField) {
                console.log('Creando campo personalizado "Monto"...');
                amountField = await kommoClient.createCustomField('leads', {
                    name: 'Monto',
                    type: 'numeric' // Usar 'numeric' para campos numéricos
                });
            }

            if (!paymentMethodField) {
                console.log('Creando campo personalizado "Método de Pago"...');
                paymentMethodField = await kommoClient.createCustomField('leads', {
                    name: 'Método de Pago',
                    type: 'text' // Usar 'text' para campos de texto
                });
            }

            // Crear el lead con los IDs obtenidos
            const leadData = {
                name: req.body.name,
                status_id: status.id, // Usa el status_id obtenido
                pipeline_id: pipeline.id, // Usa el pipeline_id obtenido
                responsible_user_id: responsibleUser.id, // Usa el responsible_user_id obtenido
                custom_fields_values: [
                    {
                        field_id: amountField.id, // Usa el field_id del campo "Monto"
                        values: [{ value: 0 }] // Valor inicial
                    },
                    {
                        field_id: paymentMethodField.id, // Usa el field_id del campo "Método de Pago"
                        values: [{ value: 'Sin método' }] // Valor inicial
                    }
                ]
            };

            // Log del cuerpo de la solicitud
            console.log('Cuerpo de la solicitud:', [leadData]);

            // Enviar la solicitud como un arreglo de objetos
            const response = await kommoClient.createLead([leadData]);

            res.status(200).json({
                message: 'Lead creado correctamente',
                leadId: response._embedded.leads[0].id
            });
        } catch (error) {
            console.error('Error en el controlador al crear lead:', error.response?.data || error.message);
            res.status(500).json({
                error: 'Error interno del servidor',
                details: error.message
            });
        }
    }
}

module.exports = new LeadController();