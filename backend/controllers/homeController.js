const db = require('../db');

// untuk home bagian mentor sigma
exports.mentor = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, username, email, foto, tentang FROM users WHERE role = 'mentor'"
    );
    res.json(results);
  } catch (err) {
    console.error("gagal mengambil data mentor:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// sama tapi kelas
exports.kelas = async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT id, judul, image FROM kelas"
    );
    res.json(results);
  } catch (err) {
    console.error("Gagal mengambil data kelas:", err.message);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};