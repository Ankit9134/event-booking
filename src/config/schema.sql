CREATE DATABASE IF NOT EXISTS test;
       USE test;
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )

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
    