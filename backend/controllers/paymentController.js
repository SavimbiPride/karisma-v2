const db = require('../db');
const snap = require('../midtrans/midtransClient');

// buat snap 
exports.createTransaction = async (req, res) =>{
    const {nama, email, whatsapp, id_kelas, total_harga} = req.body;
    const orderId = `ORDER_${Date.now()}`;
    const parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: total_harga,
        },
        customer_details:{
            first_name:nama, 
            email,
            phone: whatsapp,
        },
        callbacks: {
            finish: `http://localhost:5173/detail_kelas_beli/${id_kelas}`,
        },
    };

    try {
        const transaction = await snap.createTransaction(parameter);
        await db.query(`INSERT INTO payment (id_user, id_kelas, kode_transaksi, total_harga, status) VALUES (?, ?, ?, ?, ?)`,
            [req.user.id, id_kelas, orderId, total_harga, 'pending']
        );
        res.json({
            snapToken: transaction.token,
            redirect_url: transaction.redirect_url,
            order_id: orderId,
        });
    } catch (error) {
        console.error("❌ Midtrans Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'gagal membuat transaksi. hiks hiks'});
    }
};

// notif dari MIDtrans 7
exports.notifcationHandler = async (req, res) => {
    try{
        const statusResponse = await snap.transaction.notification(req.body);
        const orderId = statusResponse.order_id;
        const transactionStatus = statusResponse.transaction_status;
        const fraudStatus = statusResponse.fraud_status;

        let status = '';
        if (transactionStatus === 'capture') {
            status = fraudStatus === 'challenge' ? 'pending' : 'berhasil';
        } else if (transactionStatus === 'settlement') {
            status = 'berhasil';
        } else if (
            transactionStatus === 'cancel' ||
            transactionStatus === 'deny' ||
            transactionStatus === 'expire'
        ) {
            status = 'gagal';
        }

        // update status payment database
        await db.query(`UPDATE payment SET status = ?, tanggal_diterima = NOW() WHERE kode_transaksi = ?`, [status, orderId]); 
        console.log(`transaksi berhasil ${orderId} diupdate status: ${status}`);
    } catch (error) {
        console.error('gagal memproses notifikasi midtrans:', error.message);
        res.status(500).json({ message: 'gagal memproses notifikasi'});
    }
};

// cek enum tax
exports.cekStatusPembelian = async (req, res) => {
    const userId = req.user.id;
    const { id_kelas } = req.params;
    
    try {
        const [rows] = await db.query(
            `SELECT status  FROM payment WHERE id_user = ? AND id_kelas = ? AND status = 'berhasil' LIMIT 1`,[userId, id_kelas]
        );

        if(rows.length > 0) {
            res.json({ status: 'berhasil' });
        } else {
            res.json({ status: 'belum' });
        }
    } catch (error) {
        console.error('gagal mengecek status pembelian:', error.message);
        res.status(500).json({ message: 'gagal cek status pembelian' });
    }
};

// setelah beli
exports.getKelasSaya = async (req, res) => {
  const userId = req.user.id;

  try {
    const [kelasSaya] = await db.query(`
   SELECT 
    k.id, k.judul, k.deskripsi, k.image, 
    u.username AS nama_pengajar, u.foto AS foto_pengajar,
    (
        SELECT COUNT(*) 
        FROM tugas_user tu
        JOIN sesi s ON tu.id_sesi = s.id
        WHERE tu.id_user = ? AND s.id_kelas = k.id AND tu.nilai >= 70
    ) AS sesi_selesai,
    (
        SELECT COUNT(*) 
        FROM sesi 
        WHERE id_kelas = k.id
    ) AS total_sesi
    FROM payment p
    JOIN kelas k ON p.id_kelas = k.id
    JOIN users u ON k.id_users = u.id
    WHERE p.id_user = ? AND p.status = 'berhasil'
    `, [userId, userId]);

    const kelasDenganProgress = kelasSaya.map(k => {
      const progress = k.total_sesi > 0 ? (k.sesi_selesai / k.total_sesi) * 100 : 0;
      return { ...k, progress: Math.round(progress) };
    });

    res.json(kelasDenganProgress);
  } catch (error) {
    console.error("❌ Error getKelasSaya:", error.message);
    res.status(500).json({ message: 'Gagal mengambil data kelas yang dibeli' });
  }
};
