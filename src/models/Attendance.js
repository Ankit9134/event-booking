const db = require('../config/database'); 

class Attendance {
    static async findExistingAttendance(bookingId) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM event_attendance WHERE booking_id = ?',
                [bookingId]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("Error in findExistingAttendance:", error.message);
            throw error; 
        }
    }
    static async create(attendanceData) {
        try {
            const { booking_id, user_id, event_id, status } = attendanceData;
            const [result] = await db.execute(
                'INSERT INTO event_attendance (booking_id, user_id, event_id, status) VALUES (?, ?, ?, ?)',
                [booking_id, user_id, event_id, status]
            );
            return result.insertId;
        } catch (error) {
            console.error("Error in createAttendance:", error.message);
            throw error;
        }
    }
    static async getTotalTicketsByUser(userId, eventId) {
        try {
            const [rows] = await db.execute(
                'SELECT SUM(number_of_tickets) as total_tickets FROM bookings WHERE user_id = ? AND event_id = ?',
                [userId, eventId]
            );
            return rows[0].total_tickets || 0;
        } catch (error) {
            console.error("Error in getTotalTicketsByUser:", error.message);
            throw error;
        }
    }
}

module.exports = Attendance;
