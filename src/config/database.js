
const mysql = require('mysql2/promise');
require('dotenv').config();
const fs=require('fs')
console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});
console.log(process.env.CA);
const db = mysql.createPool({
    host: process.env.DB_HOST ,
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME ,
    port: process.env.DB_PORT || 3306,  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    ssl:{
    ca: fs.readFileSync('./certs/isrgrootx.pem')
    }
});


module.exports = db;
