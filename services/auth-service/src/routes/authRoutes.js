const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs for auth
  message: 'Too many authentication attempts, please try again later.'
});

// Register endpoint
router.post('/register',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('username').isLength({ min: 3 }),
    validateRequest
  ],
  authController.register
);

// Login endpoint
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validateRequest
  ],
  authController.login
);

// Refresh token endpoint
router.post('/refresh',
  authController.refreshToken
);

// Logout endpoint
router.post('/logout',
  authController.logout
);

// Verify token endpoint
router.post('/verify',
  authController.verifyToken
);

module.exports = router;
