const express = require('express');
const rateLimit = require('express-rate-limit');
const productController = require('../controllers/productController');

const router = express.Router();

// Rate limiter for product endpoints
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

// Apply rate limiting to all routes
router.use(productLimiter);

// Get all products
router.get('/products', productController.getAllProducts);

// Get product by ID
router.get('/products/:id', productController.getProductById);

// Create product
router.post('/products', productController.createProduct);

// Update product
router.put('/products/:id', productController.updateProduct);

// Delete product
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
