const express = require('express');
const router = express.Router();
const {tandaiSesiSelesai} = require('../controllers/sesiUserController');

router.post('/selesai', tandaiSesiSelesai);

module.exports = router;
