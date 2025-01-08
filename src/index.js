const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const leadRoutes = require('./api/routes/lead.routes');
const paymentRoutes = require('./api/routes/payment.routes');


// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/lead', leadRoutes);
app.use('/api/payment', paymentRoutes);

// Ruta de prueba
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;