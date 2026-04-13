const db = require('../config/database');

class Event {
    static async create(eventData) {
        const { title, description, date, total_capacity } = eventData;
        
        if (!title || !date || !total_capacity) {
            throw new Error('Missing required fields: title, date, total_capacity');
        }
        
        try {
            console.log('Attempting to create event with data:', { title, description, date, total_capacity });
            
            const [result] = await db.execute(
                'INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES (?, ?, ?, ?, ?)',
                [title, description, date,total_capacity, total_capacity]
            );
            
            console.log('Event created successfully with ID:', result.insertId);
            return result.insertId;
        } catch (error) {
            console.error('Error creating event:', error);
           throw error
        }
    }

    static async findAllUpcoming() {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM events WHERE date > NOW() ORDER BY date ASC'
            );
            return rows;
        } catch (error) {
            console.error('Error finding upcoming events:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [rows] = await db.execute(
                'SELECT * FROM events WHERE id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error finding event by id:', error);
            throw error;
        }
    }

    static async updateRemainingTickets(eventId, ticketsToBook) {
        let connection;
        try {
            connection = await db.getConnection();
            await connection.beginTransaction();
            
            const [result] = await connection.execute(
                'UPDATE events SET remaining_tickets = remaining_tickets - ? WHERE id = ? AND remaining_tickets >= ?',
                [ticketsToBook, eventId, ticketsToBook]
            );
            
            if (result.affectedRows === 0) {
                await connection.rollback();
                return false;
            }
            
            await connection.commit();
            return true;
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error updating remaining tickets:', error);
            throw error;
        } finally {
            if (connection) connection.release();
        }
    }
}

module.exports = Event;
