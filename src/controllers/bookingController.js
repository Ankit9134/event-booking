const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.createBooking = async (req, res, next) => {
    const connection = await require('../config/database').getConnection();
    try {
        await connection.beginTransaction();
        
        const { user_id, event_id, number_of_tickets = 1 } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const event = await Event.findById(event_id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        if (event.remaining_tickets < number_of_tickets) {
            return res.status(400).json({ error: 'Not enough tickets available' });
        }
        const updated = await Event.updateRemainingTickets(event_id, number_of_tickets);
        if (!updated) {
            return res.status(400).json({ error: 'Failed to book tickets' });
        }
        const booking = await Booking.create(user_id, event_id, number_of_tickets);
        
        await connection.commit();
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: {
                booking_code: booking.bookingCode,
                user_id: booking.userId,
                event_id: booking.eventId,
                number_of_tickets: booking.numberOfTickets,
                event_title: event.title,
                event_date: event.date
            }
        });
    } catch (error) {
        await connection.rollback();
        next(error);
    } finally {
        connection.release();
    }
};
