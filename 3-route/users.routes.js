const express = require('express');
const usersController = require('../2-controlelr/users.controller');
const { authenticate, requireRole } = require('../4-middleware/middleware');

const router = express.Router();

router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser);

router.get('/', authenticate, requireRole('admin'), usersController.listUsers);
router.get('/:id', authenticate, usersController.getUser);
router.patch('/:id', authenticate, usersController.updateUser);
router.delete('/:id', authenticate, requireRole('admin'), usersController.deleteUser);

module.exports = router;
