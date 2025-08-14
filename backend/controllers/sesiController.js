const { log } = require('console');
const db = require('../db');
const path = require('path');

// get by id kelas
exports.getSesiByKelas = async (req, res) => {
  const { id_kelas } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT id, judul_sesi FROM sesi WHERE id_kelas = ?',
      [id_kelas]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error ambil sesi:', error);
    res.status(500).json({ message: 'Gagal mengambil sesi' });
  }
};

//tambah
exports.tambahSesi = async (req, res) => {
  const { id } = req.params; 
  let parsed;

  try {
    parsed = JSON.parse(req.body.data);
  } catch (err) {
    return res.status(400).json({ message: "Format data JSON salah" });
  }

  const videos = [];
  for (let i = 0; i < parsed.length; i++) {
    const fieldName = `sesi_video_${i}`;
    if (req.files[fieldName] && req.files[fieldName][0]) {
      videos[i] = req.files[fieldName][0];
    } else {
      videos[i] = null;
    }
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    for (let i = 0; i < parsed.length; i++) {
      const sesi = parsed[i];
      const { judul_sesi, topik, tugas, quiz } = sesi;
      const video = videos[i]?.filename || null;

      const [sesiResult] = await conn.query(
        `INSERT INTO sesi (id_kelas, judul_sesi, topik, video) VALUES (?, ?, ?, ?)`,
        [id, judul_sesi, topik, video]
      );
      const id_sesi = sesiResult.insertId;

      if (Array.isArray(tugas) && tugas.length > 0 && tugas[0]?.soal_tugas) {
        await conn.query(
          `INSERT INTO tugas (id_sesi, soal_tugas) VALUES (?, ?)`,
          [id_sesi, tugas[0].soal_tugas]
        );
      }

      if (Array.isArray(quiz) && quiz.length > 0 && quiz[0]?.soal && Array.isArray(quiz[0]?.jawaban)) {
        const soal = quiz[0].soal;
        const jawabanList = quiz[0].jawaban;

        const [soalResult] = await conn.query(
          `INSERT INTO soal (soal) VALUES (?)`,
          [soal]
        );
        const id_soal = soalResult.insertId;

        await conn.query(`INSERT INTO quiz (id_sesi, id_soal) VALUES (?, ?)`, [
          id_sesi,
          id_soal,
        ]);

        for (const jawaban of jawabanList) {
          await conn.query(
            `INSERT INTO jawaban (jawaban, id_soal, benar) VALUES (?, ?, ?)`,
            [jawaban.teks, id_soal, jawaban.benar ? 1 : 0]
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({ message: "Semua sesi berhasil ditambahkan" });
  } catch (err) {
    await conn.rollback();
    console.error("Gagal insert sesi:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    conn.release();
  }
};

// get by id
exports.getSesiById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [sesi] = await db.query("SELECT * FROM sesi WHERE id = ?", [id]);
    if (sesi.length === 0) {
      return res.status(404).json({ message: 'Sesi tidak ditemukan' });
    }

    const [quiz] = await db.query(
      "SELECT * FROM quiz JOIN soal ON quiz.id_soal = soal.id WHERE id_sesi = ?",
      [sesi[0].id]
    );

    let jawaban = [];
    if (quiz.length > 0) {
      [jawaban] = await db.query("SELECT * FROM jawaban WHERE id_soal = ?", [quiz[0].id_soal]);
    }

    const [tugas] = await db.query("SELECT * FROM tugas WHERE id_sesi = ?", [sesi[0].id]);
    const videoUrl = sesi[0].video ? `/uploads/${sesi[0].video}` : null;

    res.json({
      ...sesi[0],
      videoUrl,
      tugas: tugas[0] || null,
      quiz: quiz.length > 0
        ? {
            ...quiz[0],
            jawaban: jawaban
          }
        : null,
    });
  } catch (error) {
    console.error("❌ Error getSesiById:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

// update
exports.updateSesi = async (req, res) => {
  const { id } = req.params;
  let { judul_sesi, topik, tugas, quiz } = req.body;

  try {
    if (typeof tugas === "string") tugas = JSON.parse(tugas);
    if (typeof quiz === "string") quiz = JSON.parse(quiz);

    const [rows] = await db.query(`SELECT video FROM sesi WHERE id = ?`, [id]);
    const sesiLama = rows[0];
    const videoLama = sesiLama?.video;
    const video = req.file?.filename || videoLama;

    await db.query(`UPDATE sesi SET judul_sesi = ?, topik = ?, video = ? WHERE id = ?`,
      [judul_sesi, topik, video, id]
    );

    await db.query(`DELETE FROM tugas WHERE id_sesi = ?`, [id]);
    if (tugas?.soal_tugas) {
      await db.query(
        `INSERT INTO tugas (id_sesi, soal_tugas) VALUES (?, ?)`,
        [id, tugas.soal_tugas]
      );
    }

    const [oldQuiz] = await db.query(`SELECT id_soal FROM quiz WHERE id_sesi = ?`, [id]);
    const idSoalList = oldQuiz.map((q) => q.id_soal);

    for (const id_soal of idSoalList) {
      await db.query(`DELETE FROM jawaban WHERE id_soal = ?`, [id_soal]);
    }
    await db.query(`DELETE FROM quiz WHERE id_sesi = ?`, [id]);
    for (const id_soal of idSoalList) {
      await db.query(`DELETE FROM soal WHERE id = ?`, [id_soal]);
    }

    if (quiz?.soal && Array.isArray(quiz.jawaban)) {
      const [result] = await db.query(
        `INSERT INTO soal (soal) VALUES (?)`,
        [quiz.soal]
      );
      const id_soal = result.insertId;

      await db.query(
        `INSERT INTO quiz (id_sesi, id_soal) VALUES (?, ?)`,
        [id, id_soal]
      );

      for (const jw of quiz.jawaban) {
        await db.query(
          `INSERT INTO jawaban (id_soal, jawaban, benar) VALUES (?, ?, ?)`,
          [id_soal, jw.jawaban, jw.benar ? 1 : 0]
        );
      }
    }

    res.status(200).json({ message: "Sesi berhasil diperbarui!" });

  } catch (error) {
    console.error("Gagal update sesi:", error);
    res.status(500).json({ message: "Gagal update sesi", error });
  }
};

// delete
exports.deleteSesi = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM sesi WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Sesi tidak ditemukan atau sudah dihapus' });
    }

    res.json({ message: 'Sesi berhasil dihapus' });
  } catch (error) {
    console.error('Error hapus sesi:', error);
    res.status(500).json({ message: 'Gagal menghapus sesi' });
  }
};