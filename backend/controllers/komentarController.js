const db = require('../db');

// get by id kelas
exports.getKomentarByKelas = async (req, res) => {
  const { id_kelas } = req.params;

  try {
    const query = `
      SELECT k.id, k.isi, k.dibuat, u.username, u.foto
      FROM komentar k
      JOIN users u ON k.id_user = u.id
      WHERE k.id_kelas = ?
      ORDER BY k.id DESC
    `;
    const [rows] = await db.query(query, [id_kelas]);
    res.json({ rows });
  } catch (error) {
    console.error("Gagal mengambil komentar:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// tambah
exports.postKomentar = async (req, res) => {
  const { id_kelas, isi } = req.body;
  const userId = req.user?.id;

  if (!id_kelas || !isi || !userId) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
  
    const insertQuery = `
      INSERT INTO komentar (id_kelas, id_user, isi)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(insertQuery, [id_kelas, userId, isi]);
    const komentarId = result.insertId;

   
    const fetchQuery = `
      SELECT k.id, k.id_kelas, k.isi, k.dibuat, u.username, u.foto
      FROM komentar k
      JOIN users u ON k.id_user = u.id
      WHERE k.id = ?
    `;
    const [fetchResult] = await db.query(fetchQuery, [komentarId]);

    
    res.status(201).json(fetchResult[0]);

  } catch (error) {
   
    console.error('Gagal menambahkan komentar:', error);
    res.status(500).json({ message: 'Gagal menambahkan komentar' });
  }
};

// edit
exports.updateKomentar = async (req, res) => {
  const { id } = req.params;
  const { isi } = req.body;
  const userId = req.user?.id;

  if (!isi || !userId) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const updateQuery = `
    UPDATE komentar SET isi = ? WHERE id = ? AND id_user = ?
  `;

  try {
    const [result] = await db.query(updateQuery, [isi, id, userId]);
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Kamu tidak diizinkan mengedit komentar ini' });
    }
    res.json({ message: 'Komentar diperbarui' });
  } catch (err) {
    console.error('Gagal update komentar:', err);
    res.status(500).json({ message: 'Gagal update komentar' });
  }
};

// delete
exports.deleteKomentar = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const deleteQuery = `
    DELETE FROM komentar WHERE id = ? AND id_user = ?
  `;

  try {
    const [result] = await db.query(deleteQuery, [id, userId]);
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Kamu tidak diizinkan menghapus komentar ini' });
    }
    res.json({ message: 'Komentar dihapus' });
  } catch (err) {
    console.error('Gagal hapus komentar:', err);
    res.status(500).json({ message: 'Gagal hapus komentar' });
  }
};

// delete oleh atmin
exports.deleteKomentarAdmin = async (req, res) => {
  const { id } = req.params;

  const deleteQuery = `DELETE FROM komentar WHERE id = ?`;

  try {
    const [result] = await db.query(deleteQuery, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Komentar tidak ditemukan' });
    }
    res.json({ message: 'Komentar berhasil dihapus oleh admin' });
  } catch (err) {
    console.error('Gagal hapus komentar oleh admin:', err);
    res.status(500).json({ message: 'Gagal menghapus komentar' });
  }
};