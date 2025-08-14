const db = require('../db');

// sesi selesai
exports.tandaiSesiSelesai = async (req, res) => {
  const { id_user, id_sesi, id_kelas } = req.body;

  if (!id_user || !id_sesi || !id_kelas) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    const [existing] = await db.query(
      'SELECT * FROM sesi_user WHERE id_user = ? AND id_sesi = ?',
      [id_user, id_sesi]
    );

    if (existing.length === 0) {
      await db.query(
        'INSERT INTO sesi_user (id_user, id_kelas, id_sesi, selesai) VALUES (?, ?, ?, true)',
        [id_user, id_kelas, id_sesi]
      );
    } else {
      await db.query(
        'UPDATE sesi_user SET selesai = true WHERE id_user = ? AND id_sesi = ?',
        [id_user, id_sesi]
      );
    }

    res.json({ message: 'Sesi ditandai selesai' });
  } catch (err) {
    console.error('gagal tandai sesi:', err.message);
    res.status(500).json({ message: 'Gagal tandai sesi selesai' });
  }
};
