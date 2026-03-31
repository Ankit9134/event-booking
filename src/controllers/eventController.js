const Event = require('../models/Event');
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.findAllUpcoming();
        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        next(error);
    }
};

exports.createEvent = async (req, res, next) => {
    try {
        const { title, description, date, total_capacity } = req.body;
        
        const eventId = await Event.create({
            title,
            description,
            date,
            total_capacity
        });
        
        const event = await Event.findById(eventId);
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        next(error);
    }
};
