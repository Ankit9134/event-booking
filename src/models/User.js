
const db = require('../config/database');

class User {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM users');
    return rows;
  }
  
  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
  
  static async create(userData) {
    const { name, email } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return result.insertId;
  }
}

module.exports = User;
