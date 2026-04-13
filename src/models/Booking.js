const db = require('../config/database');
const { generateBookingCode } = require('../utils/generateCode');  
class Booking {
    static async create(userId, eventId, numberOfTickets = 1) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            
            const bookingCode = generateBookingCode();  
            
            const [result] = await connection.execute(
                'INSERT INTO bookings (user_id, event_id, booking_code, number_of_tickets) VALUES (?, ?, ?, ?)',
                [userId, eventId, bookingCode, numberOfTickets]
            );
            
            await connection.commit();
            
            return {
                id: result.insertId,
                bookingCode,
                userId,
                eventId,
                numberOfTickets
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async findByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT b.*, e.title, e.date, e.description 
             FROM bookings b 
             JOIN events e ON b.event_id = e.id 
             WHERE b.user_id = ? 
             ORDER BY b.booking_date DESC`,
            [userId]
        );
        return rows;
    }

    static async findByBookingCode(bookingCode) {
        const [rows] = await db.execute(
            `SELECT b.*, e.title, e.date, e.description, u.name, u.email 
             FROM bookings b 
             JOIN events e ON b.event_id = e.id 
             JOIN users u ON b.user_id = u.id 
             WHERE b.booking_code = ?`,
            [bookingCode]
        );
        return rows[0];
    }
}

module.exports = Booking;
