const User = require('../models/User');
const Booking = require('../models/Booking');

exports.getAllUsers = async (req, res, next) => {
    try {
        // Change from findAll() to findAll() - this is correct for Sequelize
        // But make sure your model is properly initialized
        const users = await User.findAll();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        // Change from findById() to findByPk() for Sequelize
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        
        // Change from User.create() to User.create() - this is correct for Sequelize
        const user = await User.create({ name, email });
        
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await user.update(req.body);
        
        res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Email already in use by another user' });
        }
        next(error);
    }
};


exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await user.destroy();
        
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
exports.getUserBookings = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const bookings = await Booking.findByUserId(userId);
        
        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
};