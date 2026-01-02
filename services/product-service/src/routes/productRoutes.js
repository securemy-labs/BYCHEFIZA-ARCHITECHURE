const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

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
