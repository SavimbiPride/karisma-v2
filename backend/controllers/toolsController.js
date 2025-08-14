const db = require("../db");
const path = require("path");
const { createTool, getAllTools } = require('../models/toolsmodel');

// get list
exports.getTools = async (req, res) => {
  try {
    const tools = await getAllTools();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data tools' });
  }
};

// get by id
exports.getToolById = async (req, res) => {
  const { id } = req.params;
  try {
    const [tool] = await db.query("SELECT * FROM tools WHERE id = ?", [id]);
    if (tool.length === 0) return res.status(404).json({ message: "Tool tidak ditemukan" });
    res.json(tool[0]);
  } catch (error) {
    console.error("Gagal ambil detail tools:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  
// tambah
exports.createTool = async (req, res) => {
  try {
    const { judul, deskripsi } = req.body;
    const image = req.file?.filename;

    if (!judul || !image || !deskripsi) {
      return res.status(400).json({ message: 'Nama, gambar, dan deskripsi wajib diisi.' });
    }

    const toolId = await createTool({ judul, image, deskripsi });
    res.status(201).json({ id: toolId, judul, image, deskripsi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menambahkan tools' });
  }
};

// update
exports.updateTool = async (req, res) => {
  const { id } = req.params;
  const { judul, deskripsi } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const [tool] = await db.query("SELECT * FROM tools WHERE id = ?", [id]);
    if (tool.length === 0) {
      return res.status(404).json({ message: "Tool tidak ditemukan" });
    }

    const newImage = image || tool[0].image;

    await db.query(
      "UPDATE tools SET judul = ?, image = ?, deskripsi = ? WHERE id = ?",
      [judul, newImage, deskripsi, id]
    );

    res.json({ message: "Tool berhasil diperbarui" });
  } catch (error) {
    console.error("Gagal update tools:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// delete
exports.deleteTool = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM tools WHERE id = ?", [id]);
    res.json({ message: "Tool berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus tools:", error);
    res.status(500).json({ message: "Server error" });
  }
};
