const express = require('express');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/payments/process', paymentController.processPayment);
router.get('/payments/:id', paymentController.getPaymentStatus);
router.post('/payments/refund', paymentController.refundPayment);

module.exports = router;
