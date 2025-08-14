const express = require('express');
const router = express.Router();
const {saveLogQuiz, getLogQuizByUserAndKelas, deleteLogQuiz} = require('../controllers/logQuizControllers');
const verifyToken = require('../middleware/verifyToken');

router.post('/log_quiz', saveLogQuiz);
router.get('/log_quiz/:id_user/:id_kelas', getLogQuizByUserAndKelas)
router.delete('/log_quiz/:id_user/:id_kelas', verifyToken, deleteLogQuiz);

module.exports = router;
