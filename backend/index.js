const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const kelasRoutes = require('./routes/kelasRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const komentarRoutes = require('./routes/komentarRoutes');
const paymentRoutes = require('./routes/paymentRoute');
const tugasRoutes = require('./routes/tugasRoutes');
const sesiUserRoutes = require('./routes/sesiUserRoutes');
const logQuizRoutes = require('./routes/logQuizRoutes');
const toolsRoutes = require('./routes/toolsRoutes');
const sesiRoutes = require('./routes/sesiRoutes');
const homeRoutes = require('./routes/homeRoutes');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/tugas', express.static(path.join(__dirname, 'uploads/tugas')));
app.get('/', (req, res) => {
  res.send('battle control online');
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', adminRoutes);
app.use('/api', kelasRoutes);
app.use('/api', mentorRoutes);
app.use('/api', komentarRoutes);
app.use('/api', paymentRoutes);
app.use('/api', tugasRoutes);
app.use('/api', sesiUserRoutes);
app.use('/api', logQuizRoutes);
app.use('/api', toolsRoutes);
app.use('/api', sesiRoutes);
app.use('/api', homeRoutes);

app.listen(PORT, () => {
  console.log(`battle control online at http://localhost:${PORT}`);
});
