const logger = require('../utils/logger');

const orders = [];

class OrderController {
  async getAllOrders(req, res) {
    try {
      res.json({ success: true, orders });
    } catch (error) {
      logger.error('Get orders error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch orders' });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = orders.find(o => o.id === req.params.id);
      if (!order) {
        return res.status(404).json({ error: true, message: 'Order not found' });
      }
      res.json({ success: true, order });
    } catch (error) {
      logger.error('Get order error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch order' });
    }
  }

  async createOrder(req, res) {
    try {
      const newOrder = {
        id: String(orders.length + 1),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      orders.push(newOrder);
      logger.info(`Order created: ${newOrder.id}`);
      res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
      logger.error('Create order error:', error);
      res.status(500).json({ error: true, message: 'Failed to create order' });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const index = orders.findIndex(o => o.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: true, message: 'Order not found' });
      }
      orders[index] = { ...orders[index], ...req.body, updatedAt: new Date().toISOString() };
      res.json({ success: true, order: orders[index] });
    } catch (error) {
      logger.error('Update order error:', error);
      res.status(500).json({ error: true, message: 'Failed to update order' });
    }
  }
}

module.exports = new OrderController();
