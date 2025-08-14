const db = require("../db");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

// get list
exports.getListMentor = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT id, username, email, alamat, tentang, domisili, tanggal_lahir, foto FROM users WHERE role = 'mentor' ORDER BY id ASC"
    );
    res.json(result);
  } catch (err) {
    console.error("Gagal ambil list mentor:", err);
    res.status(500).json({ message: "Gagal mengambil data mentor" });
  }
};

// get by id
exports.getMentorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query(
      "SELECT id, username, email, alamat, domisili, tanggal_lahir, foto FROM users WHERE id = ? AND role = 'mentor'",
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Mentor tidak ditemukan" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error("Gagal ambil mentor by ID:", err);
    res.status(500).json({ message: "Gagal mengambil data mentor" });
  }
};

// tambah
exports.tambahMentor = async (req, res) => {
  const { username, email, password, domisili, tanggal_lahir, alamat } =
    req.body;
  const foto = req.file ? req.file.filename : "default-avatar.png";

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  try {
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email sudah digunakan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (username, email, password, alamat, domisili, tanggal_lahir, foto, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'mentor')`,
      [username, email, hashedPassword, alamat, domisili, tanggal_lahir, foto]
    );

    res.status(201).json({ message: "Mentor berhasil ditambahkan." });
  } catch (err) {
    console.error("Gagal tambah mentor:", err);
    res.status(500).json({ message: "Gagal menambahkan mentor" });
  }
};

// update
exports.updateMentor = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    tentang,
    alamat,
    domisili,
    tanggal_lahir,
    password,
  } = req.body;
  const fotoBaru = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = "mentor"',
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Mentor tidak ditemukan" });
    }

    const mentorLama = result[0];

    let hashedPassword = null;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const fields = [
      "username = ?",
      "email = ?",
      "tentang = ?",
      "alamat = ?",
      "domisili = ?",
      "tanggal_lahir = ?",
    ];
    const params = [username, email, tentang, alamat, domisili, tanggal_lahir];

    if (hashedPassword) {
      fields.push("password = ?");
      params.push(hashedPassword);
    }

    if (fotoBaru) {
      fields.push("foto = ?");
      params.push(fotoBaru);
    }

    params.push(id);

    const query = `UPDATE users SET ${fields.join(
      ", "
    )} WHERE id = ? AND role = 'mentor'`;
    await db.query(query, params);

    if ( fotoBaru && mentorLama.foto && mentorLama.foto !== "default-avatar.png") {
      const pathFotoLama = path.join(__dirname, "..", "uploads", mentorLama.foto);
      if (fs.existsSync(pathFotoLama)) {
        fs.unlinkSync(pathFotoLama);
      }
    }

    res.json({ message: "Mentor berhasil diperbarui",
      foto: fotoBaru || mentorLama.foto,
    });
  } catch (err) {
    console.error("Gagal update mentor:", err);
    res.status(500).json({ message: "Gagal mengupdate mentor" });
  }
};

// hapus
exports.deleteMentor = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'SELECT foto FROM users WHERE id = ? AND role = "mentor"',
      [id]
    );
    if (result.length === 0) {
      return res.status(404).json({ message: "Mentor tidak ditemukan" });
    }

    const foto = result[0].foto;

    if (foto && foto !== "default-avatar.png") {
      const pathFoto = path.join(__dirname, "..", "uploads", foto);
      if (fs.existsSync(pathFoto)) {
        fs.unlinkSync(pathFoto);
      }
    }

    await db.query('DELETE FROM users WHERE id = ? AND role = "mentor"', [id]);

    res.json({ message: "Mentor berhasil dihapus" });
  } catch (err) {
    console.error("Gagal hapus mentor:", err);
    res.status(500).json({ message: "Gagal menghapus mentor" });
  }
};

// get kelas by id_mentor
exports.getKelasByMentor = async (req, res) => {
  const { nama_mentor } = req.params;

  try {
    const [results] = await db.execute(
      `SELECT 
       k.id,
       k.judul AS nama_kelas,
       k.image
      FROM kelas k
      JOIN users u ON k.id_users = u.id
      WHERE u.username = ? AND u.role = 'mentor'`,
      [nama_mentor]
    );

    res.json({ kelas: results });
  } catch (err) {
    console.error("Gagal mengambil data kelas:", err);
    res.status(500).json({ message: "Gagal mengambil data kelas" });
  }
};

// get tugas by id sesi
exports.getTugasBySesi = async (req, res) => {
  const { id_kelas } = req.params;
  try {
    const [results] = await db.execute(
      `
        SELECT id, judul_sesi, topik 
        FROM sesi 
        WHERE id_kelas = ?
      `,
      [id_kelas]
    );

    res.json({ sesi: results });
  } catch (err) {
    console.error("Gagal mengambil data sesi:", err);
    res.status(500).json({ message: "Gagal mengambil data sesi" });
  }
};

// get user by sesi
exports.getUsersBySesi = async (req, res) => {
  const { sesiId } = req.params;

  try {
    const [users] = await db.execute(
      `
        SELECT DISTINCT u.id, u.username
        FROM tugas_user tu
        JOIN users u ON tu.id_user = u.id
        WHERE tu.id_sesi = ?
        `,
      [sesiId]
    );

    res.json(users);
  } catch (error) {
    console.error("Gagal mengambil user by sesi:", error);
    res.status(500).json({ message: "Gagal mengambil user untuk sesi ini" });
  }
};

// detail tugas
exports.getTugasUserDetail = async (req, res) => {
  const { id_sesi, id_user } = req.params;

  try {
    const [rows] = await db.query(
      `
        SELECT 
          t.soal_tugas, 
          tu.pengumpulan,
          tu.nilai,
          tu.komentar_mentor
        FROM tugas_user tu
        JOIN tugas t ON t.id_sesi = tu.id_sesi
        WHERE tu.id_sesi = ? AND tu.id_user = ?
      `,
      [id_sesi, id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan, mergh" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Gagal ambil data tugas user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// review dan nilai
exports.simpanReview = async (req, res) => {
  const { id_sesi, id_user, nilai, komentar } = req.body;

  if (!id_sesi || !id_user) {
    return res.status(400).json({ message: "ID sesi dan user wajib diisi" });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM tugas_user WHERE id_sesi = ? AND id_user = ?",
      [id_sesi, id_user]
    );

    if (existing.length === 0) {
      return res
        .status(404)
        .json({ message: "Data tugas user tidak ditemukan" });
    }

    await db.query(
      "UPDATE tugas_user SET nilai = ?, komentar_mentor = ? WHERE id_sesi = ? AND id_user = ?",
      [nilai, komentar, id_sesi, id_user]
    );

    res.json({ message: "Review berhasil disimpan" });
  } catch (error) {
    console.error("Gagal menyimpan review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get 
exports.getReview = async (req, res) => {
  const { id_sesi, id_user } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT nilai, komentar_mentor FROM tugas_user WHERE id_sesi = ? AND id_user = ?",
      [id_sesi, id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Data review tidak ditemukan" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Gagal mengambil review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get nilai by id
exports.getNilaiByUserAndSesi = async (req, res) => {
  const { id_user, id_sesi } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT nilai FROM tugas_user WHERE id_user = ? AND id_sesi = ?",
      [id_user, id_sesi]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Nilai tidak ditemukan" });
    }

    res.json({ nilai: rows[0].nilai });
  } catch (err) {
    console.error("Gagal mengambil data nilai:", err);
    res.status(500).json({ message: "Gagal mengambil data nilai" });
  }
};

// progress
exports.getProgressUser = async (req, res) => {
  const { id_user, id_kelas } = req.params;

  try {
    const [result] = await db.query(
      `
      SELECT 
        (
          SELECT COUNT(*) 
          FROM tugas_user tu
          JOIN sesi s ON tu.id_sesi = s.id
          WHERE tu.id_user = ? AND s.id_kelas = ? AND tu.nilai >= 70
        ) AS sesi_selesai,
        (
          SELECT COUNT(*) 
          FROM sesi 
          WHERE id_kelas = ?
        ) AS total_sesi
    `,
      [id_user, id_kelas, id_kelas]
    );

    const { sesi_selesai, total_sesi } = result[0];
    const progress =
      total_sesi > 0 ? Math.round((sesi_selesai / total_sesi) * 100) : 0;

    res.json({ progress });
  } catch (err) {
    console.error("error ambil progress:", err.message);
    res.status(500).json({ message: "Gagal ambil progress" });
  }
};