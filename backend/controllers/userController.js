const db = require('../db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MELODIE';
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// get by id untuk user dan admin
exports.getProfile = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const [results] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    res.json(results[0]);
  } catch (err) {
    console.error('Token error:', err);
    res.status(403).json({ message: 'Token tidak valid' });
  }
};

// update
exports.updateProfile = async (req, res) => {
  const { username, email, alamat, domisili, tanggal_lahir, id, password } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  try {
    const [userData] = await db.query('SELECT foto FROM users WHERE id = ?', [id]);
    if (userData.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    const fotoLama = userData[0].foto;

    let query = `
      UPDATE users SET 
        username = ?, 
        email = ?, 
        alamat = ?, 
        domisili = ?, 
        tanggal_lahir = ?`;
    const values = [username, email, alamat, domisili, tanggal_lahir];

    if (fotoBaru) {
      query += `, foto = ?`;
      values.push(fotoBaru);
    }

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = ?`;
      values.push(hashedPassword);
    }

    query += ` WHERE id = ?`;
    values.push(id);

    await db.query(query, values);

    if (fotoBaru && fotoLama && fotoLama !== 'default-avatar.png') {
      const pathFotoLama = path.join(__dirname, '../uploads', fotoLama);
      if (fs.existsSync(pathFotoLama)) fs.unlinkSync(pathFotoLama);
    }

    res.json({ message: 'Profil berhasil diperbarui', foto: fotoBaru || fotoLama });
  } catch (err) {
    console.error('Update profil error:', err);
    res.status(500).json({ message: 'Gagal update profil' });
  }
};

// get all
exports.getAllUsers = async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT id, username, email, alamat, domisili, tanggal_lahir, foto FROM users WHERE role = "user"'
    );
    res.json(result);
  } catch (err) {
    console.error('Gagal ambil semua user:', err);
    res.status(500).json({ message: 'Gagal mengambil data user' });
  }
};

// get by id untuk admin
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      'SELECT id, username, email, foto FROM users WHERE id = ? AND role = "user"',
      [id]
    );
    if (result.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
    res.json(result[0]);
  } catch (err) {
    console.error('Gagal ambil user by ID:', err);
    res.status(500).json({ message: 'Gagal mengambil user' });
  }
};

// update oleh admin
exports.updateUserByAdmin = async (req, res) => {
  const { id, email, password } = req.body;

  try { const [cek] = await db.query('SELECT id FROM users WHERE id = ? AND role = "user"', [id]);
    if (cek.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    let hashedPassword = null;
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const updateQuery = password && password.trim() !== ''
      ? 'UPDATE users SET email = ?, password = ? WHERE id = ? AND role = "user"'
      : 'UPDATE users SET email = ? WHERE id = ? AND role = "user"';

    const values = password && password.trim() !== ''
      ? [email, hashedPassword, id]
      : [email, id];

    await db.query(updateQuery, values);

    res.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update user oleh admin:', err);
    res.status(500).json({ message: 'Gagal update user' });
  }
};

// delete
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const [userData] = await db.query('SELECT foto FROM users WHERE id = ? AND role = "user"', [userId]);
    if (userData.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });

    const foto = userData[0].foto;
    if (foto && foto !== 'default-avatar.png') {
      const pathFoto = path.join(__dirname, '../uploads', foto);
      if (fs.existsSync(pathFoto)) fs.unlinkSync(pathFoto);
    }

    await db.query('DELETE FROM users WHERE id = ? AND role = "user"', [userId]);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Gagal menghapus user:', err);
    res.status(500).json({ message: 'Gagal menghapus user' });
  }
};
