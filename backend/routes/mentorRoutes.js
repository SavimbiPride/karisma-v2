const express = require('express'); 
const router = express.Router();
const upload = require('../middleware/uploadsingle');
const { getProgressUser, getListMentor, getMentorById, tambahMentor, updateMentor, deleteMentor, getKelasByMentor, getTugasBySesi, getTugasUserDetail, simpanReview, getReview, getNilaiByUserAndSesi, getUsersBySesi} = require('../controllers/mentorController');

router.get('/list-mentor', getListMentor);
router.get('/mentor/:id', getMentorById);
router.post('/mentor', upload.single('foto'), tambahMentor);
router.put('/mentor/:id', upload.single('foto'), updateMentor);
router.delete('/mentor/:id', deleteMentor);
router.get('/kelas/mentor/:nama_mentor', getKelasByMentor);
router.get('/sesi/kelas/:id_kelas', getTugasBySesi);  
router.get('/userbysesi/:sesiId', getUsersBySesi);
router.get('/bySesi/:id_sesi/:id_user', getTugasUserDetail);
router.post('/review', simpanReview);
router.get('/nilai/:id_user/:id_sesi', getNilaiByUserAndSesi);
router.get('/review/:id_user/:id_sesi', getReview);
router.get('/progress/:id_user/:id_kelas', getProgressUser);

module.exports = router;
