const express = require('express');
const router = express.Router();
const { uploadKelasFields } = require('../middleware/upload');
const {tambahKelas, getListKelas, getKelasById, getEditKelas, updateKelas, deleteKelas,} = require('../controllers/kelasController');

router.get('/list-kelas', getListKelas);
router.post('/kelas', uploadKelasFields(), tambahKelas);
router.get('/kelas/:id', getKelasById);
router.get('/edit-kelas/:id', getEditKelas);
router.put('/kelas/:id', uploadKelasFields(), updateKelas);
router.delete('/kelas/:id', deleteKelas);

module.exports = router;