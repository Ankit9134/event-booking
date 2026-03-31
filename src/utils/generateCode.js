const { v4: uuidv4 } = require('uuid');

const generateBookingCode = () => {
    const uuid = uuidv4();
    const bookingCode = 'BK-' + uuid.substring(0, 8).toUpperCase();
    return bookingCode;
};

module.exports = { generateBookingCode };