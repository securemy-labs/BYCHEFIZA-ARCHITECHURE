const express = require('express');
const axios = require('axios');

const router = express.Router();

// Service URLs from environment
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3003';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005';

// API Gateway info
router.get('/', (req, res) => {
  res.json({
    name: 'BYCHEFIZA API Gateway',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments'
    }
  });
});

// Authentication routes
router.use('/auth', async (req, res, next) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${AUTH_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

// User routes
router.use('/users', async (req, res, next) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${USER_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Product routes
router.use('/products', async (req, res, next) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${PRODUCT_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Order routes
router.use('/orders', async (req, res, next) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${ORDER_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

// Payment routes
router.use('/payments', async (req, res, next) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${PAYMENT_SERVICE_URL}${req.path}`,
      data: req.body,
      headers: req.headers
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
