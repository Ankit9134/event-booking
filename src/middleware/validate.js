const Joi = require('joi');

const validateEvent = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string()
        .pattern(/^[A-Za-z0-9 ]+$/)
        .required()
        .min(3)
        .max(255)
        .messages({
            "string.pattern.base": "Title should not contain special characters"
        }),
        description: Joi.string().optional(),
        date: Joi.date().iso().greater('now').required(),
        total_capacity: Joi.number().integer().positive().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateBooking = (req, res, next) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().positive().required(),
        event_id: Joi.number().integer().positive().required(),
        number_of_tickets: Joi.number().integer().min(1).max(10).default(1)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateAttendance = (req, res, next) => {
    const schema = Joi.object({
        booking_code: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const validateUser = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(100),
        email: Joi.string().email().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = {
    validateEvent,
    validateBooking,
    validateAttendance,
    validateUser
};
