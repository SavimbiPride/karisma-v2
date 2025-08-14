const express = require('express');
const router = express.Router();
const {mentor, kelas} = require('../controllers/homeController');

router.get('/mentor', mentor);
router.get('/kelas', kelas);

module.exports = router;
