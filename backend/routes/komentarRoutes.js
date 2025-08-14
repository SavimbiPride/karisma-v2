const express = require('express');
const router = express.Router();
const { getKomentarByKelas, postKomentar, updateKomentar, deleteKomentar, deleteKomentarAdmin} = require('../controllers/komentarController');
const verifyToken = require('../middleware/verifyToken');

router.get('/komentar/:id_kelas', getKomentarByKelas);
router.post('/komentar', verifyToken, postKomentar);
router.put('/komentar/:id', verifyToken, updateKomentar);
router.delete('/komentar/:id', verifyToken, deleteKomentar);
router.delete('/admin/komentar/:id', verifyToken, deleteKomentarAdmin);

module.exports = router;
