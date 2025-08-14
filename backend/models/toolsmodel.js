const db = require('../db');

// buat relasi
exports.createTool = async ({ judul, image, deskripsi }) => {
  const [result] = await db.query(
    'INSERT INTO tools (judul, image, deskripsi) VALUES (?, ?, ?)',
    [judul, image, deskripsi]
  );
  return result.insertId;
};

// relasi all
exports.getAllTools = async () => {
  const [rows] = await db.query('SELECT * FROM tools');
  return rows;
};
