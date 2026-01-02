const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const logger = require('./utils/logger');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`;

mongoose.connect(MONGO_URI).then(() => {
  logger.info('Connected to MongoDB');
}).catch(err => {
  logger.error('MongoDB connection error:', err);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'product-service',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/', productRoutes);

// Error handler
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  logger.info(`Product Service running on port ${PORT}`);
});

module.exports = app;
