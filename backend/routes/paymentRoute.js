const express = require('express');
const router = express.Router();
const {createTransaction, notifcationHandler, cekStatusPembelian, getKelasSaya} = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

router.post('/payment/create', verifyToken, createTransaction);
router.post('/payment/notif', notifcationHandler);
router.get('/payment/cek-status/:id_kelas', verifyToken, cekStatusPembelian);
router.get('/payment/kelas-saya', verifyToken, getKelasSaya);

module.exports = router;