const express = require('express');
const router = express.Router();
const { uploadSesiFields } = require('../middleware/upload');
const uploadEditSesiVideo = require('../middleware/uploadvideo');
const {tambahSesi, getSesiByKelas, deleteSesi, getSesiById, updateSesi} = require('../controllers/sesiController');

router.get('/kelas/:id_kelas/sesi', getSesiByKelas);
router.post('/tambah_sesi/:id', uploadSesiFields(), tambahSesi);
router.get('/sesi/:id', getSesiById);
router.put('/sesi/:id', uploadEditSesiVideo, updateSesi);
router.delete('/sesi/:id', deleteSesi);

module.exports = router;
