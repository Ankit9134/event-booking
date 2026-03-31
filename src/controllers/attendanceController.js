const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res, next) => {
    try {
        const eventId = req.params.id;
        const { booking_code } = req.body;
        if (!booking_code) {
            return res.status(400).json({ error: 'Booking code is required' });
        }
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        const booking = await Booking.findByBookingCode(booking_code);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.event_id !== parseInt(eventId)) {
            return res.status(400).json({ 
                error: 'This booking code is not for the specified event' 
            });
        }
        const existingAttendance = await Attendance.findExistingAttendance(booking.id);
        if (existingAttendance && existingAttendance.status === 'checked_in') {
            return res.status(400).json({ 
                error: 'Attendance already marked for this booking' 
            });
        }
        await Attendance.create({
            booking_id: booking.id,
            user_id: booking.user_id,
            event_id: booking.event_id,
            status: 'checked_in'
        });
        const totalTickets = await Attendance.getTotalTicketsByUser(booking.user_id, eventId);
    
        res.json({
            success: true,
            message: 'Attendance marked successfully',
            data: {
                booking_code: booking.booking_code,
                user_name: booking.name,
                user_email: booking.email,
                event_title: booking.title,
                event_id: parseInt(eventId),
                number_of_tickets: booking.number_of_tickets,
                total_tickets_booked_by_user: totalTickets,
                entry_time: new Date()
            }
        });

    } catch (error) {
        next(error);
    }
};