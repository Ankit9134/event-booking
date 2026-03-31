const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking, validateAttendance } = require('../middleware/validate');
router.post('/', validateBooking, bookingController.createBooking);


module.exports = router;