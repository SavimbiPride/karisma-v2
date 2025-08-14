const db = require("../db");
const fs = require("fs");
const path = require("path");

// upload
exports.uploadTugas = async (req, res) => {
  try {
    const { id_user, id_sesi } = req.body;
    const files = req.files.map((f) => f.filename);
    const pengumpulanJSON = JSON.stringify(files);

    await db.query(
      "INSERT INTO tugas_user (id_user, id_sesi, pengumpulan) VALUES (?, ?, ?)",
      [id_user, id_sesi, pengumpulanJSON]
    );

    res.json({ message: "Tugas berhasil diupload!" });
  } catch (err) {
    console.error("Gagal upload tugas:", err);
    res.status(500).json({ message: "Gagal upload tugas." });
  }
};

// get 
exports.getTugasUser = async (req, res) => {
  try {
    const { id_user } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM tugas_user WHERE id_user = ?",
      [id_user]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Gagal ambil tugas user" });
  }
};

// cek
exports.cekTugasUser = async (req, res) => {
  try {
    const { id_user, id_sesi } = req.params;

    const [tugasRows] = await db.query(
      "SELECT * FROM tugas WHERE id_sesi = ? LIMIT 1",
      [id_sesi]
    );

    const [submitRows] = await db.query(
      "SELECT * FROM tugas_user WHERE id_user = ? AND id_sesi = ?",
      [id_user, id_sesi]
    );

    const sudahKumpul = submitRows.length > 0;
    const pengumpulan = sudahKumpul
    ? JSON.parse(submitRows[0].pengumpulan || "[]")
    : [];


    res.json({
      tugas: {
        ...tugasRows[0],
        pengumpulan,
      },
      sudahKumpul,
    });
  } catch (err) {
    console.error("Gagal cek status tugas:", err);
    res.status(500).json({ message: "Gagal cek status tugas" });
  }
};

// update
exports.editTugasUser = async (req, res) => {
  const { id_user, id_sesi } = req.body;
  const files = req.files?.pengumpulan || [];

  try {
    const pengumpulanBaru = files.map((f) => f.filename);
    const fileTugasList = JSON.parse(req.body.fileTugasList || "[]");
    const semuaFiles = [...fileTugasList, ...pengumpulanBaru];

    await db.query("UPDATE tugas_user SET pengumpulan = ? WHERE id_user = ? AND id_sesi = ?",
      [JSON.stringify(semuaFiles), id_user, id_sesi]
    );

    return res.status(200).json({ message: "Tugas berhasil diperbarui." });
  } catch (err) {
    console.error("Error update tugas:", err);
    return res.status(500).json({ message: "Gagal update tugas." });
  }
};

// delete satu file
exports.hapusFileTugasUser = async (req, res) => {
  try {
    const { id_user, id_sesi, filename } = req.query;

    if (!id_user || !id_sesi || !filename) {
      return res.status(400).json({ message: "Parameter tidak lengkap" });
    }

    const [rows] = await db.query(
      "SELECT * FROM tugas_user WHERE id_user = ? AND id_sesi = ?",
      [id_user, id_sesi]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tugas tidak ditemukan" });
    }

    const pengumpulan = JSON.parse(rows[0].pengumpulan || "[]");

    const updatedPengumpulan = pengumpulan.filter((f) => f !== filename);

    const filePath = path.join(__dirname, "../uploads/tugas", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    } else {
      return res.status(404).json({ message: "File tidak ditemukan di server" });
    }

    await db.query(
      "UPDATE tugas_user SET pengumpulan = ? WHERE id_user = ? AND id_sesi = ?",
      [JSON.stringify(updatedPengumpulan), id_user, id_sesi]
    );

    return res.json({ message: "File berhasil dihapus" });
  } catch (err) {
    console.error("Gagal hapus file tugas:", err);
    return res.status(500).json({ message: "Gagal hapus file", error: err.message });
  }
};

// delete semua file
exports.hapusTugasUserSemua = async (req, res) => {
  try {
    const { id_user, id_sesi, filename } = req.query;

    if (!id_user || !id_sesi) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    const [rows] = await db.query(
      "SELECT * FROM tugas_user WHERE id_user = ? AND id_sesi = ?",
      [id_user, id_sesi]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tugas tidak ditemukan" });
    }

    let pengumpulan = JSON.parse(rows[0].pengumpulan || "[]");

    if (filename) {
      if (!pengumpulan.includes(filename)) {
        return res.status(404).json({ message: "File tidak ditemukan dalam database" });
      }

      const filePath = path.join(__dirname, "../uploads/tugas", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      pengumpulan = pengumpulan.filter((f) => f !== filename);
      await db.query(
        "UPDATE tugas_user SET pengumpulan = ? WHERE id_user = ? AND id_sesi = ?",
        [JSON.stringify(pengumpulan), id_user, id_sesi]
      );

      return res.json({ message: "File berhasil dihapus" });
    }

    for (const file of pengumpulan) {
      const filePath = path.join(__dirname, "../uploads/tugas", file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await db.query("DELETE FROM tugas_user WHERE id_user = ? AND id_sesi = ?", [
      id_user, id_sesi,
    ]);

    return res.json({ message: "Semua file dan data tugas berhasil dihapus" });
  } catch (err) {
    console.error("Gagal menghapus file tugas:", err);
    return res.status(500).json({ message: "Gagal menghapus tugas", error: err.message });
  }
};

// get nilai untuk ke user
exports.getNilaiByUserAndKelas = async (req, res) => {
  const { id_user, id_kelas } = req.params;

  try {
    const [sesiRows] = await db.query(
      `SELECT id FROM sesi WHERE id_kelas = ?`,
      [id_kelas]
    );
    const sesiIds = sesiRows.map((row) => row.id);

    if (sesiIds.length === 0) {
      return res.json([]);
    }

    const [nilaiRows] = await db.query(
      `SELECT id_sesi, nilai FROM tugas_user 
       WHERE id_user = ? AND id_sesi IN (?)`,
      [id_user, sesiIds]
    );

    res.json(nilaiRows);
  } catch (err) {
    console.error("Gagal mengambil nilai user:", err);
    res.status(500).json({ message: "Gagal mengambil nilai user" });
  }
};