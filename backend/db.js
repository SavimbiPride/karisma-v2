const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'norio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Koneksi ke database gagal:', err);
  } else {
    console.log('Terhubung ke database MySQL');
    connection.release(); 
  }
});

const db = pool.promise();
module.exports = db;

// untuk admin login
const plainPassword = '532008';
const email = 'ravlor@email.com';

bcrypt.hash(plainPassword, 10, async (err, hash) => {
  if (err) throw err;

  try {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, email]
    );
    console.log('Password berhasil di-hash dan diupdate!');
  } catch (error) {
    console.error('Gagal update password:', error);
  }
});
