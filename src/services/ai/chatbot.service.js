 // src/services/ai/chatbot.service.js
const { Configuration, OpenAIApi } = require('openai');
const config = require('../../config/ai.config');

class ChatbotService {
    constructor() {
        this.configuration = new Configuration({
            apiKey: config.OPENAI_API_KEY,
        });
        this.openai = new OpenAIApi(this.configuration);
        this.context = this.loadInitialContext();
    }

    loadInitialContext() {
        return [
            {
                role: "system",
                content: "Eres un asistente especializado en atención al cliente para una empresa de gestión de pagos. Tu objetivo es ayudar con consultas sobre estados de pago, comprobantes y procesos de acreditación."
            }
        ];
    }

    async processMessage(message, userId) {
        try {
            const conversation = [...this.context, {
                role: "user",
                content: message
            }];

            const response = await this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: conversation,
                temperature: 0.7,
                max_tokens: 150
            });

            return {
                text: response.data.choices[0].message.content,
                userId,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Error processing message:', error);
            throw new Error('Failed to process message');
        }
    }

    async handleFAQ(question) {
        const faqs = {
            "estado_pago": "Para verificar el estado de tu pago, necesito el número de referencia.",
            "tiempo_acreditacion": "Los pagos generalmente se acreditan en un plazo de 24-48 horas hábiles.",
            "comprobante": "Puedes subir tu comprobante de pago directamente desde la plataforma en la sección 'Pagos'."
        };

        return faqs[question] || await this.processMessage(question);
    }
}

module.exports = ChatbotService;
