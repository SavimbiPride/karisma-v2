const db = require('../db');
const path = require('path');

// get semua kelas
exports.getListKelas = async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT 
        k.*,
        (
          SELECT COUNT(*) 
          FROM payment 
          WHERE id_kelas = k.id AND status = 'berhasil'
        ) AS jumlahUserMengikuti
      FROM kelas k
    `);
    res.json(results);
  } catch (err) {
    console.error('Gagal mengambil data kelas:', err);
    res.status(500).json({ message: 'Gagal mengambil data kelas' });
  }
};

// tambah
exports.tambahKelas = async (req, res) => {
  const {
    judul,
    deskripsi,
    harga,
    selectedToolIds,
    id_users 
  } = req.body;

  const gambarKelas = req.files['gambar_kelas']?.[0]?.filename;
  // const fotoPengajar = req.body.foto_pengajar;

  if (!id_users || !judul || !deskripsi || !harga || !gambarKelas) {
    return res.status(400).json({ message: 'Lengkapi semua field.' });
  }

  try {
    const [cekUser] = await db.query('SELECT id FROM users WHERE id = ? AND role = ?', [id_users, 'mentor']);
    if (cekUser.length === 0) {
      return res.status(400).json({ message: 'User tidak ditemukan atau bukan mentor.' });
    }

    const [kelasResult] = await db.query(
      `INSERT INTO kelas (id_users, judul, deskripsi, harga, image)
      VALUES (?, ?, ?, ?, ?)`,
      [id_users, judul, deskripsi, harga, gambarKelas]
    );

    const kelasId = kelasResult.insertId;

    const toolIds = JSON.parse(selectedToolIds);
    for (let toolId of toolIds) {
      await db.query(
        `INSERT INTO kelas_tools (id_kelas, id_tools) VALUES (?, ?)`,
        [kelasId, toolId]
      );
    }

    return res.status(201).json({ message: 'Kelas berhasil ditambahkan.' });
  } catch (err) {
    console.error('Error tambahKelas:', err);
    return res.status(500).json({ message: 'Gagal menambahkan kelas.' });
  }
};

// get by id
exports.getKelasById = async (req, res) => {
  const { id } = req.params;

  try {
    const [kelasRows] = await db.query(`SELECT * FROM kelas WHERE id = ?`, [id]);
    if (kelasRows.length === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    const kelas = kelasRows[0];

    const [mentorRows] = await db.query(
      `SELECT username, foto, tentang FROM users WHERE id = ? AND role = 'mentor'`,
      [kelas.id_users]
    );

    const mentor = mentorRows[0] || {};
    const foto_pengajar_url = mentor.foto
      ? `http://localhost:5000/uploads/${mentor.foto}`
      : null;

    const [tools] = await db.query(`
      SELECT t.*, CONCAT('http://localhost:5000/uploads/', t.image) AS image_url
      FROM kelas_tools kt
      JOIN tools t ON kt.id_tools = t.id
      WHERE kt.id_kelas = ?
    `, [id]);

    const [sesiRows] = await db.query(`SELECT * FROM sesi WHERE id_kelas = ?`, [id]);

    const sesi = await Promise.all(sesiRows.map(async (sesiItem) => {
      const [tugasRows] = await db.query(
        `SELECT soal_tugas FROM tugas WHERE id_sesi = ?`,
        [sesiItem.id]
      );

      const [quizSoalRows] = await db.query(`
        SELECT q.id_soal, soal.soal 
        FROM quiz q 
        JOIN soal ON q.id_soal = soal.id 
        WHERE q.id_sesi = ?
      `, [sesiItem.id]);

      const quiz = await Promise.all(quizSoalRows.map(async (q) => {
        const [jawabanRows] = await db.query(`
          SELECT id, jawaban, benar 
          FROM jawaban 
          WHERE id_soal = ?
        `, [q.id_soal]);

        return {
          soal: q.soal,
          jawaban: jawabanRows.map(j => ({
            id: j.id,
            teks: j.jawaban,
            benar: j.benar === 1
          }))
        };
      }));

      return {
        ...sesiItem,
        tugas: tugasRows.map(t => ({ soal_tugas: t.soal_tugas })),
        quiz
      };
    }));

    res.json({
      ...kelas,
      username: mentor.username || 'Tidak diketahui',
      foto_pengajar: mentor.foto || null,
      foto_pengajar_url,
      tentang_mentor: mentor.tentang || '',
      tools,
      sesi
    });

  } catch (error) {
    console.error('Gagal mengambil detail kelas:', error);
    res.status(500).json({ message: 'Gagal mengambil detail kelas' });
  }
};

// get buat update
exports.getEditKelas = async (req, res) => {
  const kelasId = req.params.id;

  try {
    const [kelasRows] = await db.query(`
      SELECT 
        k.id, k.judul, k.deskripsi, k.harga, 
        k.image,
        u.username AS nama_pengajar, u.foto AS mentor_foto, u.tentang AS mentor_tentang
      FROM kelas k
      LEFT JOIN users u ON k.id_users = u.id
      WHERE k.id = ?
    `, [kelasId]);

    if (kelasRows.length === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    const kelas = kelasRows[0];

    const [tools] = await db.query(`
      SELECT t.id, t.judul, t.deskripsi, t.image
      FROM kelas_tools kt
      JOIN tools t ON kt.id_tools = t.id
      WHERE kt.id_kelas = ?
    `, [kelasId]);

    kelas.tools = tools;
    kelas.foto_pengajar_url = kelas.mentor_foto ? `http://localhost:5000/uploads/${kelas.mentor_foto}` : null;
    kelas.tentang_pengajar = kelas.mentor_tentang || '';

    res.json(kelas);
  } catch (err) {
    console.error('Gagal mengambil data kelas:', err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data kelas' });
  }
};

// update
exports.updateKelas = async (req, res) => {
    const { id } = req.params; 
    const { judul, deskripsi, harga, id_users, selectedToolIds } = req.body; 

    let toolsToAssociate = [];
    try {
        toolsToAssociate = typeof selectedToolIds === 'string' ? JSON.parse(selectedToolIds) : (selectedToolIds || []);

        toolsToAssociate = [...new Set(toolsToAssociate.map(Number).filter(id => !isNaN(id)))];
    } catch (err) {
        console.error('Gagal parse selectedToolIds:', err);
        return res.status(400).json({ message: 'Format ID tools tidak valid' });
    }

    const imageFile = req.files?.gambar_kelas?.[0]?.filename;
    const oldImage = req.body.old_image || null;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); 

        const updateFields = [judul, deskripsi, harga];
        let sqlKelas = `UPDATE kelas SET judul = ?, deskripsi = ?, harga = ?`;

        if (id_users && id_users.trim()) {
            sqlKelas += `, id_users = ?`;
            updateFields.push(id_users);
        }

        sqlKelas += `, image = ? WHERE id = ?`;
        updateFields.push(imageFile || oldImage, id);

        const [resultKelas] = await connection.query(sqlKelas, updateFields);
        if (resultKelas.affectedRows === 0) {
            await connection.rollback(); 
            return res.status(404).json({ message: 'Kelas tidak ditemukan' });
        }

        const [existingTools] = await connection.query(
            `SELECT id_tools FROM kelas_tools WHERE id_kelas = ?`, 
            [id]
        );
        const existingToolIds = new Set(existingTools.map(row => row.id_tools));

        const toolsToAdd = toolsToAssociate.filter(toolId => !existingToolIds.has(toolId));

        const toolsToRemove = Array.from(existingToolIds).filter(toolId => !toolsToAssociate.includes(toolId));

        if (toolsToRemove.length > 0) {
            const placeholders = toolsToRemove.map(() => '?').join(',');
            await connection.query(
                `DELETE FROM kelas_tools WHERE id_kelas = ? AND id_tools IN (${placeholders})`, 
                [id, ...toolsToRemove]
            );
            console.log(`tools dihapus dari kelas ${id}:`, toolsToRemove);
        }

        if (toolsToAdd.length > 0) {
            const values = toolsToAdd.map(toolId => `(${id}, ${toolId})`).join(', ');
            await connection.query(
                `INSERT INTO kelas_tools (id_kelas, id_tools) VALUES ${values}`
            );
            console.log(`tools ditambahkan ke kelas ${id}:`, toolsToAdd);
        }

        await connection.commit();
        res.status(200).json({ message: 'Kelas berhasil diperbarui' });

    } catch (err) {
        await connection.rollback(); 
        console.error('gagal update kelas:', err);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    } finally {
        if (connection) connection.release(); 
    }
};

// delete
exports.deleteKelas = async (req, res) => {
  const { id } = req.params;

  try {
    const [sesiList] = await db.query(`SELECT id FROM sesi WHERE id_kelas = ?`, [id]);

    for (const sesi of sesiList) {
      const id_sesi = sesi.id;
      const [quizList] = await db.query(`SELECT id_soal FROM quiz WHERE id_sesi = ?`, [id_sesi]);

      for (const q of quizList) {
        await db.query(`DELETE FROM jawaban WHERE id_soal = ?`, [q.id_soal]);
        await db.query(`DELETE FROM soal WHERE id = ?`, [q.id_soal]);
      }

      await db.query(`DELETE FROM tugas_user WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM tugas WHERE id_sesi = ?`, [id_sesi]);
      await db.query(`DELETE FROM quiz WHERE id_sesi = ?`, [id_sesi]);
    }

    await db.query(`DELETE FROM komentar WHERE id_kelas = ?`, [id]);

    await db.query(`DELETE FROM kelas_tools WHERE id_kelas = ?`, [id]);
    await db.query(`DELETE FROM sesi WHERE id_kelas = ?`, [id]);

    const [result] = await db.query(`DELETE FROM kelas WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }

    res.json({ message: 'Kelas dan semua data terkait berhasil dihapus' });
  } catch (err) {
    console.error('Gagal menghapus kelas:', err);
    res.status(500).json({ message: 'Gagal menghapus kelas' });
  }
};