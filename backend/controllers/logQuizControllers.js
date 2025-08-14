const db = require('../db');

// save save, kalau gak di save nanti nangis ulang lagi dari cj di lempar ama polisi korup
exports.saveLogQuiz = async (req, res) => {
  const { id_user, id_jawaban, benar, salah } = req.body;

  if (!id_jawaban) {
    return res.status(400).json({ message: 'id_jawaban tidak boleh kosong' });
  }

  try {
    await db.query(
      "INSERT INTO log_quiz (id_user, id_jawaban, benar, salah) VALUES (?, ?, ?, ?)",
      [id_user, id_jawaban, benar, salah]
    );

    res.json({ message: 'Berhasil simpan log quiz' });
  } catch (err) {
    console.error("Error saveLogQuiz:", err);
    res.status(500).json({ message: 'Gagal simpan log quiz' });
  }
};

// get log
exports.getLogQuizByUserAndKelas = async (req, res) => {
  const { id_user, id_kelas } = req.params;

  try {
    const [result] = await db.query(`
      SELECT lq.id_jawaban, lq.benar
      FROM log_quiz lq
      JOIN jawaban j ON lq.id_jawaban = j.id
      JOIN soal s ON j.id_soal = s.id
      JOIN quiz q ON s.id = q.id_soal
      JOIN sesi ss ON q.id_sesi = ss.id
      WHERE lq.id_user = ? AND ss.id_kelas = ?
      LIMIT 1
    `, [id_user, id_kelas]);

    if (result.length === 0) {
      return res.json(null);
    }

    res.json(result[0]);
  } catch (err) {
    console.error('Gagal getLogQuizByUserAndKelas:', err);
    res.status(500).json({ message: 'Gagal ambil data quiz user' });
  }
};

// button coba lagi
exports.deleteLogQuiz = async (req, res) => {
  const { id_user, id_kelas } = req.params;

  try {
    const [sesiRows] = await db.query(`SELECT id FROM sesi WHERE id_kelas = ?`, [id_kelas]);
    const sesiIds = sesiRows.map(s => s.id);
    
    if (sesiIds.length === 0) return res.status(404).json({ message: "Tidak ada sesi" });

    const [soalRows] = await db.query(`SELECT id FROM soal WHERE id IN (SELECT id_soal FROM quiz WHERE id_sesi IN (?))`, [sesiIds]);
    const soalIds = soalRows.map(s => s.id);

    const [jawabanRows] = await db.query(`SELECT id FROM jawaban WHERE id_soal IN (?)`, [soalIds]);
    const jawabanIds = jawabanRows.map(j => j.id);

    if (jawabanIds.length > 0) {
      await db.query(`DELETE FROM log_quiz WHERE id_user = ? AND id_jawaban IN (?)`, [id_user, jawabanIds]);
    }

    res.json({ message: "Log quiz berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteLogQuiz:", err);
    res.status(500).json({ message: "Gagal menghapus log quiz" });
  }
};


