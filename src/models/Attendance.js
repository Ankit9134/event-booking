const database = require('../config/database');

class Attendance {
    static async findExistingAttendance(bookingId) {
        const connection = await database.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM event_attendance WHERE booking_id = ?',
                [bookingId]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }
    static async create(attendanceData) {
        const connection = await database.getConnection();
        try {
            const { booking_id, user_id, event_id, status } = attendanceData;
            const [result] = await connection.execute(
                'INSERT INTO event_attendance (booking_id, user_id, event_id, status) VALUES (?, ?, ?, ?)',
                [booking_id, user_id, event_id, status]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }
    static async getTotalTicketsByUser(userId, eventId) {
        const connection = await database.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT SUM(number_of_tickets) as total_tickets FROM bookings WHERE user_id = ? AND event_id = ?',
                [userId, eventId]
            );
            return rows[0].total_tickets || 0;
        } finally {
            connection.release();
        }
    }
}

module.exports = Attendance;