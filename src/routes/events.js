const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { validateEvent, validateAttendance } = require('../middleware/validate');
const attendanceController = require('../controllers/attendanceController');
router.get('/', eventController.getAllEvents);
router.post('/', validateEvent, eventController.createEvent);
router.post('/:id/attendance', validateAttendance, attendanceController.markAttendance);
module.exports = router;