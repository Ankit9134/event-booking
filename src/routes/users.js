
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate } = require('../middleware/validate');
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateUser, userController.createUser);
router.get('/:id/bookings', userController.getUserBookings);

module.exports = router;
