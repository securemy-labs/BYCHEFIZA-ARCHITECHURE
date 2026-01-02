const logger = require('../utils/logger');

// Mock user database
const users = [
  { id: '1', username: 'admin', email: 'admin@bychefiza.com', role: 'admin' },
  { id: '2', username: 'user1', email: 'user1@example.com', role: 'customer' }
];

class UserController {
  async getAllUsers(req, res) {
    try {
      res.json({
        success: true,
        users
      });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch users' });
    }
  }

  async getUserById(req, res) {
    try {
      const user = users.find(u => u.id === req.params.id);
      if (!user) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
      res.json({ success: true, user });
    } catch (error) {
      logger.error('Get user error:', error);
      res.status(500).json({ error: true, message: 'Failed to fetch user' });
    }
  }

  async createUser(req, res) {
    try {
      const newUser = {
        id: String(users.length + 1),
        ...req.body
      };
      users.push(newUser);
      res.status(201).json({ success: true, user: newUser });
    } catch (error) {
      logger.error('Create user error:', error);
      res.status(500).json({ error: true, message: 'Failed to create user' });
    }
  }

  async updateUser(req, res) {
    try {
      const index = users.findIndex(u => u.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
      users[index] = { ...users[index], ...req.body };
      res.json({ success: true, user: users[index] });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({ error: true, message: 'Failed to update user' });
    }
  }

  async deleteUser(req, res) {
    try {
      const index = users.findIndex(u => u.id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ error: true, message: 'User not found' });
      }
      users.splice(index, 1);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({ error: true, message: 'Failed to delete user' });
    }
  }
}

module.exports = new UserController();
