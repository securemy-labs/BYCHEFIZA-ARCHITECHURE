const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { validateRequest } = require('../middleware/validator');

const router = express.Router();

// Register endpoint
router.post('/register',
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
