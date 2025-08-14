const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadsingle');
const {getSummary, tambahAdmin, getListAdmin, getAdminById, editAdmin, deleteAdmin,}= require('../controllers/adminController');

router.get('/summary', getSummary);
// router.post('/admin', upload.single('foto'), tambahAdmin);
router.get('/list-admin', getListAdmin);
router.get('/admin/:id', getAdminById);
router.put('/admin/:id', upload.single('foto'), editAdmin);
router.delete('/admin/:id', deleteAdmin);

module.exports = router;
 