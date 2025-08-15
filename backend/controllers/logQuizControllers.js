const db = require('../db');

// save save, kalau gak di save nanti nangis ulang lagi dari cj di lempar ama polisi korup
exports.saveLogQuiz = async (req, res) => {
  const { id_user, id_jawaban, benar, salah } = req.body;
  if (!id_user || !id_jawaban) {
    return res.status(400).json({ message: "id_user & id_jawaban wajib" });
  }

  try {
    const [[row]] = await db.query(
      "SELECT id_soal FROM jawaban WHERE id = ?",
      [id_jawaban]
    );
    if (!row) return res.status(400).json({ message: "Jawaban tidak valid" });
    const id_soal = row.id_soal;

    await db.query(`
      DELETE lq FROM log_quiz lq
      JOIN jawaban j2 ON lq.id_jawaban = j2.id
      WHERE lq.id_user = ? AND j2.id_soal = ?
    `, [id_user, id_soal]);

    await db.query(
      "INSERT INTO log_quiz (id_user, id_jawaban, benar, salah) VALUES (?, ?, ?, ?)",
      [id_user, id_jawaban, benar, salah]
    );

    res.json({ message: "Berhasil simpan log quiz" });
  } catch (err) {
    console.error("Error saveLogQuiz:", err);
    res.status(500).json({ message: "Gagal simpan log quiz" });
  }
};

// get log
exports.getLogQuizByUserAndKelas = async (req, res) => {
  const { id_user, id_kelas } = req.params;

  try {
    const [rows] = await db.query(`
      SELECT 
        ss.id     AS id_sesi,
        s.id      AS id_soal,
        lq.id_jawaban,
        lq.benar
      FROM log_quiz lq
      JOIN jawaban j ON lq.id_jawaban = j.id
      JOIN soal s    ON j.id_soal = s.id
      JOIN quiz q    ON s.id = q.id_soal
      JOIN sesi ss   ON q.id_sesi = ss.id
      WHERE lq.id_user = ? AND ss.id_kelas = ?
    `, [id_user, id_kelas]);

    res.json(rows); 
  } catch (err) {
    console.error("Gagal getLogQuizByUserAndKelas:", err);
    res.status(500).json({ message: "Gagal ambil data quiz user" });
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


