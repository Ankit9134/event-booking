const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
};

const DB_NAME = process.env.DB_NAME || 'event_booking_db';

async function initDatabase() {
    let connection;
    
    try {
        console.log('🔧 Starting database initialization...');
        
        // Connect to MySQL server without database
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Connected to MySQL server');
        
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        console.log(`Database '${DB_NAME}' created or already exists`);
        
        // Use the database
        await connection.execute(`USE \`${DB_NAME}\``);
        
        // Create tables
        console.log(' Creating tables...');
        
        // Users table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created');
        
        // Events table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                date DATETIME NOT NULL,
                total_capacity INT NOT NULL CHECK (total_capacity > 0),
                remaining_tickets INT NOT NULL CHECK (remaining_tickets >= 0),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_date (date),
                INDEX idx_remaining_tickets (remaining_tickets)
            )
        `);
        console.log(' Events table created');
        
        // Bookings table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                booking_code VARCHAR(50) NOT NULL UNIQUE,
                number_of_tickets INT NOT NULL DEFAULT 1 CHECK (number_of_tickets > 0),
                booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_event_id (event_id),
                INDEX idx_booking_code (booking_code)
            )
        `);
        console.log('Bookings table created');
        
        // Event Attendance table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS event_attendance (
                id INT AUTO_INCREMENT PRIMARY KEY,
                booking_id INT NOT NULL,
                user_id INT NOT NULL,
                event_id INT NOT NULL,
                entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('pending', 'checked_in') DEFAULT 'pending',
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
                INDEX idx_booking_id (booking_id),
                INDEX idx_event_id (event_id)
            )
        `);
        console.log(' Event attendance table created');
        
        // Insert sample data
        console.log(' Inserting sample data...');
        
        // Check if users exist
        const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
        if (userCount[0].count === 0) {
            await connection.execute(`
                INSERT INTO users (name, email) VALUES 
                ('Ankit', 'ankit@example.com'),
                ('Aman', 'aman@example.com')
            `);
            console.log('Sample users inserted');
        }
        
        // Check if events exist
        const [eventCount] = await connection.execute('SELECT COUNT(*) as count FROM events');
        if (eventCount[0].count === 0) {
            await connection.execute(`
                INSERT INTO events (title, description, date, total_capacity, remaining_tickets) VALUES 
                ('Tech Conference 2024', 'Annual technology conference with industry leaders', '2024-12-15 10:00:00', 100, 100),
                ('Music Festival', 'Live music performances by top artists', '2024-12-20 18:00:00', 500, 500),
                ('Business Summit', 'Networking and business growth seminar', '2024-12-25 09:00:00', 200, 200)
            `);
            console.log('Sample events inserted');
        }
        
        console.log('\n Database initialization completed successfully!');
        console.log('\n Tables created:');
        const [tables] = await connection.execute('SHOW TABLES');
        tables.forEach(table => {
            const tableName = Object.values(table)[0];
            console.log(`   - ${tableName}`);
        });
        
    } catch (error) {
        console.error(' Error initializing database:', error.message);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log(' Database connection closed');
        }
    }
}

// Run initialization
initDatabase().catch(console.error);