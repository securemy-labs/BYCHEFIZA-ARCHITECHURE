const express = require('express');
require('dotenv').config();
const logger = require('./utils/logger');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'payment-service',
    version: '1.0.0'
  });
});

app.use('/', paymentRoutes);

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({ error: true, message: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info(`Payment Service running on port ${PORT}`);
});

module.exports = app;
