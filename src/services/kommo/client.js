const axios = require('axios');
const config = require('../../config/kommo.config');

class KommoClient {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: config.baseUrl,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async createCustomField(entityType, fieldData) {
        try {
            console.log('Creando campo personalizado...');
            console.log('Cuerpo de la solicitud:', fieldData);
    
            // Asegúrate de que el cuerpo de la solicitud esté correctamente formateado
            const requestBody = {
                name: fieldData.name,
                type: fieldData.type,
                code: fieldData.code || null, // Opcional: código del campo
                sort: fieldData.sort || 999, // Opcional: define el orden del campo
                is_api_only: fieldData.is_api_only || false, // Opcional: define si el campo es solo para API
                enums: fieldData.enums || null // Opcional: para campos de tipo "select"
            };
    
            // La URL debe incluir el entity_type (leads, contacts, companies)
            const response = await this.axiosInstance.post(`/${entityType}/custom_fields`, [requestBody]);
            console.log('Campo personalizado creado correctamente:', response.data);
            return response.data._embedded.custom_fields[0]; // Devuelve el campo creado
        } catch (error) {
            console.error('Error creando campo personalizado:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                validationErrors: error.response?.data['validation-errors']
            });
    
            // Mostrar los errores de validación en detalle
            if (error.response?.data['validation-errors']) {
                error.response.data['validation-errors'].forEach((validationError, index) => {
                    console.error(`Error de validación ${index + 1}:`, validationError.errors);
                });
            }
    
            throw error;
        }
    }

    // Obtener la lista de pipelines y statuses
    async getPipelines() {
        try {
            console.log('Obteniendo pipelines...');
            const response = await this.axiosInstance.get('/leads/pipelines');
            console.log('Pipelines obtenidos:', response.data._embedded.pipelines);
            return response.data._embedded.pipelines;
        } catch (error) {
            console.error('Error obteniendo pipelines:', error.response?.data || error.message);
            throw error;
        }
    }

    // Obtener la lista de usuarios
    async getUsers() {
        try {
            console.log('Obteniendo usuarios...');
            const response = await this.axiosInstance.get('/users');
            console.log('Usuarios obtenidos:', response.data._embedded.users);
            return response.data._embedded.users;
        } catch (error) {
            console.error('Error obteniendo usuarios:', error.response?.data || error.message);
            throw error;
        }
    }

    async getCustomFields() {
        try {
            console.log('Obteniendo campos personalizados...');
            const response = await this.axiosInstance.get('/leads/custom_fields');
            console.log('Campos personalizados obtenidos:', response.data._embedded.custom_fields);
            return response.data._embedded.custom_fields;
        } catch (error) {
            console.error('Error obteniendo campos personalizados:', error.response?.data || error.message);
            throw error;
        }
    }    

    // Crear un lead
    async createLead(leadData) {
        try {
            console.log('Creando lead...');
            console.log('Cuerpo de la solicitud:', leadData);
            const response = await this.axiosInstance.post('/leads', leadData);
            console.log('Lead creado correctamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creando lead:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                validationErrors: error.response?.data['validation-errors'] // Log de errores de validación
            });
            throw error;
        }
    }

    async updateLead(leadId, leadData) {
        try {
            console.log('Actualizando lead...');
            console.log('Cuerpo de la solicitud:', [leadData]);
    
            // Asegúrate de que el cuerpo de la solicitud sea un arreglo de objetos
            const response = await this.axiosInstance.patch('/leads', [leadData]);
            console.log('Lead actualizado correctamente:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error actualizando lead:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers,
                validationErrors: error.response?.data['validation-errors']
            });
    
            // Mostrar los errores de validación en detalle
            if (error.response?.data['validation-errors']) {
                error.response.data['validation-errors'].forEach((validationError, index) => {
                    console.error(`Error de validación ${index + 1}:`, validationError.errors);
                });
            }
    
            throw error;
        }
    }
}

module.exports = new KommoClient();