const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadTugas");
const {uploadTugas, getTugasUser, cekTugasUser, editTugasUser, hapusFileTugasUser, hapusTugasUserSemua, getNilaiByUserAndKelas} = require("../controllers/tugasController");

router.post("/tugas", upload.array("pengumpulan", 200), uploadTugas);
router.get("/tugas/:id_user", getTugasUser);
router.get("/tugas/cek/:id_user/:id_sesi", cekTugasUser);
router.put("/tugas/edit", upload.fields([{ name: "pengumpulan", maxCount: 200 }]), editTugasUser);
router.delete("/tugas/hapus-semua", hapusTugasUserSemua)
router.delete("/tugas/hapus-file", hapusFileTugasUser);
router.get('/nilai/kursus/:id_user/:id_kelas', getNilaiByUserAndKelas);

module.exports = router;
