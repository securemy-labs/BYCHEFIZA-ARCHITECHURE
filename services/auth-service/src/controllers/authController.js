const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '24h';

class AuthController {
  async register(req, res) {
    try {
      const { email, password, username } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // In a real application, save to database
      // For demo purposes, we'll just return success
      logger.info(`User registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          email,
          username
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        error: true,
        message: 'Registration failed'
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // In a real application, fetch user from database
      // For demo purposes, we'll create a mock user
      const mockUser = {
        id: '123',
        email,
        username: 'testuser',
        passwordHash: await bcrypt.hash('password123', 10)
      };

      // Verify password
      const isValid = await bcrypt.compare(password, mockUser.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({
          error: true,
          message: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      // Generate refresh token
      const refreshToken = jwt.sign(
        { userId: mockUser.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        error: true,
        message: 'Login failed'
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: true,
          message: 'Refresh token required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      // Generate new access token
      const newToken = jwt.sign(
        { userId: decoded.userId },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      res.json({
        success: true,
        token: newToken
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(401).json({
        error: true,
        message: 'Invalid refresh token'
      });
    }
  }

  async logout(req, res) {
    try {
      // In a real application, invalidate the token in Redis
      logger.info('User logged out');

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        error: true,
        message: 'Logout failed'
      });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          error: true,
          message: 'No token provided'
        });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      res.json({
        success: true,
        valid: true,
        userId: decoded.userId
      });
    } catch (error) {
      res.status(401).json({
        error: true,
        valid: false,
        message: 'Invalid token'
      });
    }
  }
}

module.exports = new AuthController();
