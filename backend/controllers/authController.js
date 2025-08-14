const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'MELODIE';
const DEFAULT_PASSWORD = 'pass54321';

// register
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field harus diisi.' });
  }

  try {
    const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Email sudah dipakai' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user']
    );

    res.status(201).json({ message: 'User berhasil didaftarkan' });
  } catch (err) {
    console.error('Error register:', err);
    res.status(500).json({ message: 'Gagal mendaftarkan user' });
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi.' });
  }

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const user = results[0];

    // ✅ Bandingkan password hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY || 'MELODIE',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login berhasil',
      token,
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      foto: user.foto || 'default-avatar.png'
    });
  } catch (err) {
    console.error('Error login:', err);
    res.status(500).json({ message: 'Gagal login' });
  }
};

// reset password mentor dan user 
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const role = req.query.role;

  if (!['user', 'mentor'].includes(role)) {
    return res.status(400).json({ message: 'Role tidak valid' });
  }

  try {
    // Hash password default
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    // Update password ke hashed default password
    const [result] = await db.query(
      `UPDATE users SET password = ? WHERE id = ? AND role = ?`,
      [hashedPassword, id, role]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User atau mentor tidak ditemukan' });
    }

    res.status(200).json({ message: `Password ${role} berhasil direset ke default` });
  } catch (error) {
    console.error('Reset password gagal:', error);
    res.status(500).json({ message: 'Gagal mereset password' });
  }
};
