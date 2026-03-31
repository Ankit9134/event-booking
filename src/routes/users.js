
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate } = require('../middleware/validate');
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', validateUser, userController.createUser);
// router.put('/:id', validateUserUpdate, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/bookings', userController.getUserBookings);

module.exports = router;

module.exports = router;