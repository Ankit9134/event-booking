// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Log the configuration to debug (remove after fixing)
console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    // Don't log password in production!
});

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'event_booking',
    port: process.env.DB_PORT || 3306,  // Default MySQL port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error(' Database connection failed:', err.message);
        console.error('Please check:');
        console.error('1. MySQL service is running');
        console.error('2. Database credentials are correct');
        console.error('3. Database exists');
    });

module.exports = pool;