require('dotenv').config(); // Cargar variables de entorno desde .env

const config = {
    baseUrl: 'https://webtindercuentas.kommo.com/api/v4', // Usa tu subdominio aquí
    apiKey: process.env.KOMMO_API_KEY, // Token de larga duración
    accountId: process.env.KOMMO_ACCOUNT_ID // ID de la cuenta
};

module.exports = config;