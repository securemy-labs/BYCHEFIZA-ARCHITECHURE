const Product = require('../models/Product');
const logger = require('../utils/logger');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;
      
      const query = { isActive: true };
      
      if (category) query.category = category;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }
      if (search) {
        query.$text = { $search: search };
      }

      const products = await Product.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const count = await Product.countDocuments(query);

      res.json({
        success: true,
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      });
    } catch (error) {
      logger.error('Get products error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to fetch products'
      });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      
      if (!product) {
        return res.status(404).json({
          error: true,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        product
      });
    } catch (error) {
      logger.error('Get product error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to fetch product'
      });
    }
  }

  async createProduct(req, res) {
    try {
      const product = new Product(req.body);
      await product.save();

      logger.info(`Product created: ${product.name}`);

      res.status(201).json({
        success: true,
        product
      });
    } catch (error) {
      logger.error('Create product error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to create product'
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({
          error: true,
          message: 'Product not found'
        });
      }

      logger.info(`Product updated: ${product._id}`);

      res.json({
        success: true,
        product
      });
    } catch (error) {
      logger.error('Update product error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to update product'
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          error: true,
          message: 'Product not found'
        });
      }

      logger.info(`Product deleted: ${product._id}`);

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      logger.error('Delete product error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to delete product'
      });
    }
  }
}

module.exports = new ProductController();
