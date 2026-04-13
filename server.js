const app = require('./src/app');
const dotenv = require('dotenv');
const db = require('./src/config/database')
dotenv.config();

const PORT = process.env.PORT || 3000;
db.getConnection()
    .then(connection => {
        console.log('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        console.error(' Database connection failed:', err.message);
    });
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.DB_HOST}`);
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api/docs`);
});
