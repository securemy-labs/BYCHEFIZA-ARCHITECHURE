const logger = require('../utils/logger');

const payments = [];

class PaymentController {
  async processPayment(req, res) {
    try {
      const { orderId, amount, method } = req.body;
      
      const payment = {
        id: String(payments.length + 1),
        orderId,
        amount,
        method,
        status: 'completed',
        transactionId: `txn_${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      
      payments.push(payment);
      logger.info(`Payment processed: ${payment.id}`);
      
      res.status(201).json({ success: true, payment });
    } catch (error) {
      logger.error('Process payment error:', error);
      res.status(500).json({ error: true, message: 'Payment processing failed' });
    }
  }

  async getPaymentStatus(req, res) {
    try {
      const payment = payments.find(p => p.id === req.params.id);
      if (!payment) {
        return res.status(404).json({ error: true, message: 'Payment not found' });
      }
      res.json({ success: true, payment });
    } catch (error) {
      logger.error('Get payment error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch payment' });
    }
  }

  async refundPayment(req, res) {
    try {
      const { paymentId } = req.body;
      const index = payments.findIndex(p => p.id === paymentId);
      
      if (index === -1) {
        return res.status(404).json({ error: true, message: 'Payment not found' });
      }
      
      payments[index].status = 'refunded';
      payments[index].refundedAt = new Date().toISOString();
      
      logger.info(`Payment refunded: ${paymentId}`);
      res.json({ success: true, payment: payments[index] });
    } catch (error) {
      logger.error('Refund payment error:', error);
      res.status(500).json({ error: true, message: 'Refund failed' });
    }
  }
}

module.exports = new PaymentController();
