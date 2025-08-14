-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2025 at 09:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `norio`
--

-- --------------------------------------------------------

--
-- Table structure for table `jawaban`
--

CREATE TABLE `jawaban` (
  `id` int(50) NOT NULL,
  `jawaban` varchar(250) NOT NULL,
  `id_soal` int(11) NOT NULL,
  `benar` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jawaban`
--

INSERT INTO `jawaban` (`id`, `jawaban`, `id_soal`, `benar`) VALUES
(493, 'ye', 126, 0),
(494, 'piuyt', 126, 0),
(495, 'yup', 126, 0),
(496, 'tentu', 126, 1),
(497, 'yu', 127, 0),
(498, 'te', 127, 1),
(499, 'q', 127, 0),
(500, 't', 127, 0),
(501, 'test', 128, 1),
(502, 'yu', 128, 0),
(503, 'ye', 128, 0),
(504, 'e', 128, 0),
(505, 'satu', 129, 0),
(506, 'dua', 129, 0),
(507, 'titiga', 129, 1),
(508, 'empat', 129, 0),
(509, '1', 130, 0),
(510, '2', 130, 1),
(511, '3', 130, 0),
(512, '4', 130, 0),
(513, '3', 131, 0),
(514, '2', 131, 0),
(515, '8', 131, 1),
(516, '6', 131, 0),
(523, 'satu', 134, 0),
(525, '2', 134, 0),
(527, '3', 134, 0),
(528, 'empelima', 134, 1),
(593, 'q ganti', 151, 1),
(594, 'w ganti', 151, 0),
(595, 'e ganti', 151, 0),
(596, 'ty ganti', 151, 0),
(621, 'ban', 158, 0),
(622, 'jawabn', 158, 0),
(623, 'jawa', 158, 0),
(624, 'jawaban', 158, 1),
(637, 'a', 162, 0),
(638, 'b', 162, 1),
(639, 'c', 162, 0),
(640, 'd', 162, 0),
(733, 'visual studio code', 186, 0),
(734, 'html', 186, 1),
(735, 'css', 186, 0),
(736, 'javascript', 186, 0),
(737, '<input (type:teks)>', 187, 0),
(738, '<input type:{text}>', 187, 0),
(739, '<input type:\"text\">', 187, 1),
(740, '<input type:text>', 187, 0),
(741, '.head{}', 188, 0),
(742, '<body>', 188, 0),
(743, '<head>', 188, 0),
(744, '.body{}', 188, 1),
(745, 'alert.log(\"yang benar\");', 189, 0),
(746, 'alert(\"woaa\")', 189, 0),
(747, 'alert(gedagedigedayo)', 189, 0),
(748, 'alert(\"woaah, what the hell\");', 189, 1),
(749, 'teng', 190, 0),
(750, 'ganteng', 190, 0),
(751, 'handsome', 190, 1),
(752, 'gan', 190, 0);

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int(50) NOT NULL,
  `id_users` int(50) NOT NULL,
  `judul` varchar(250) NOT NULL,
  `deskripsi` text NOT NULL,
  `image` varchar(250) NOT NULL,
  `harga` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `id_users`, `judul`, `deskripsi`, `image`, `harga`) VALUES
(60, 49, 'coding itu mudah banget', 'Merasa coding itu sulit? Buang jauh-jauh pikiran itu! Di kelas \"Coding Itu Mudah Banget\", kamu akan membuktikan bahwa semua orang bisa membuat website. Kami akan memandumu langkah demi langkah untuk menguasai tiga pilar utama pengembangan web: HTML, CSS, dan JavaScript. Mulai dari membangun kerangka halaman web dengan HTML, mempercantik tampilannya dengan CSS, hingga menambahkan elemen interaktif menggunakan JavaScript. Kelas ini didesain khusus untuk pemula tanpa perlu pengalaman coding sama sekali. Ayo bergabung dan buat website pertamamu', '1755137598726-159384776.jpeg', 1000000.00),
(61, 50, 'test1', 'testdeks1', '1755146725658-598278437.png', 10000.00),
(62, 51, 'test2', 'testdesk2', '1755146758179-175744363.gif', 10000.00),
(63, 52, 'test3', 'testdesk3', '1755146803344-546514659.gif', 10000.00);

-- --------------------------------------------------------

--
-- Table structure for table `kelas_tools`
--

CREATE TABLE `kelas_tools` (
  `id` int(11) NOT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `id_tools` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas_tools`
--

INSERT INTO `kelas_tools` (`id`, `id_kelas`, `id_tools`) VALUES
(51, 60, 287),
(52, 60, 288),
(53, 60, 289),
(54, 60, 290),
(55, 61, 288),
(56, 62, 289),
(57, 63, 290);

-- --------------------------------------------------------

--
-- Table structure for table `komentar`
--

CREATE TABLE `komentar` (
  `id` int(50) NOT NULL,
  `id_kelas` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `isi` varchar(250) NOT NULL,
  `dibuat` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `komentar`
--

INSERT INTO `komentar` (`id`, `id_kelas`, `id_user`, `isi`, `dibuat`) VALUES
(88, 60, 28, 'sangat di rekomendasikan, yup yup :3', '2025-08-14 12:38:59'),
(89, 60, 24, 'aku setuju dengan melodie 👍', '2025-08-14 12:40:59'),
(91, 60, 23, 'aku bingung, hiks hiks', '2025-08-14 12:43:59');

-- --------------------------------------------------------

--
-- Table structure for table `log_quiz`
--

CREATE TABLE `log_quiz` (
  `id` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `id_jawaban` int(50) NOT NULL,
  `benar` int(11) NOT NULL,
  `salah` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log_quiz`
--

INSERT INTO `log_quiz` (`id`, `id_user`, `id_jawaban`, `benar`, `salah`) VALUES
(22, 48, 638, 1, 0),
(32, 28, 744, 1, 0),
(33, 28, 734, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `id_kelas` int(50) NOT NULL,
  `kode_transaksi` varchar(50) NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `total_pembayaran` decimal(10,2) NOT NULL,
  `tanggal_diterima` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('pending','berhasil','gagal') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `id_user`, `id_kelas`, `kode_transaksi`, `total_harga`, `total_pembayaran`, `tanggal_diterima`, `status`) VALUES
(21, 28, 60, 'ORDER_1755143421819', 1000000.00, 0.00, '2025-08-14 04:00:19', 'berhasil'),
(22, 24, 60, 'ORDER_1755150005787', 1000000.00, 0.00, '2025-08-14 06:46:59', 'berhasil'),
(23, 23, 60, 'ORDER_1755150082626', 1000000.00, 0.00, '2025-08-14 06:44:30', 'berhasil');

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` int(50) NOT NULL,
  `id_sesi` int(50) NOT NULL,
  `id_soal` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`id`, `id_sesi`, `id_soal`) VALUES
(181, 174, 186),
(182, 175, 187),
(183, 176, 188),
(184, 177, 189),
(185, 178, 190);

-- --------------------------------------------------------

--
-- Table structure for table `sesi`
--

CREATE TABLE `sesi` (
  `id` int(50) NOT NULL,
  `judul_sesi` varchar(250) NOT NULL,
  `topik` varchar(250) NOT NULL,
  `video` varchar(250) NOT NULL,
  `id_kelas` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sesi`
--

INSERT INTO `sesi` (`id`, `judul_sesi`, `topik`, `video`, `id_kelas`) VALUES
(174, 'Kenalan Dulu! Apa Itu Website & Alat Perang Coder', 'Selamat datang di dunia coding! Di sesi pembuka ini, kita akan buang semua istilah yang bikin pusing. Kamu akan belajar apa itu website sebenarnya dan bagaimana tiga pahlawan super—HTML, CSS, dan JavaScript—bekerja sama untuk membuatnya', '1755140461831-213101910.mp4', 60),
(175, 'Membangun Kerangka Website dengan HTML', 'Saatnya praktik! Anggap saja kita akan membangun sebuah rumah, dan HTML adalah kerangkanya. Di sesi ini, kamu akan menulis baris kode pertamamu menggunakan HTML', '1755140461837-885490020.mp4', 60),
(176, 'Sulap Halaman Jadi Cantik dengan CSS', 'Kerangka HTML-mu sudah jadi, tapi masih terlihat polos, kan? Di sesi inilah keajaiban dimulai! Dengan CSS, kita akan menjadi desainer untuk website kita sendiri', '1755141132229-401688421.mp4', 60),
(177, 'Menghidupkan Website dengan Keajaiban JavaScript', 'Website-mu sudah punya kerangka (HTML) dan sudah cantik (CSS), sekarang saatnya membuatnya \"hidup\"! Di sesi ini kita akan kenalan dengan JavaScript, si pemberi nyawa pada website. Kamu akan belajar konsep paling dasar dari JavaScript untuk membuat el', '1755143055934-939428622.mp4', 60),
(178, 'Proyek Pertamamu! Menggabungkan Semua & Langkah Selanjutnya', 'Inilah sesi puncaknya! Kamu akan menggunakan semua yang telah dipelajari—HTML, CSS, dan JavaScript—untuk membangun sebuah proyek mini dari nol, misalnya halaman portofolio atau biodata sederhana. Sesi ini akan menguji dan memperkuat pemahamanmu', '1755143056492-212677196.mp4', 60);

-- --------------------------------------------------------

--
-- Table structure for table `soal`
--

CREATE TABLE `soal` (
  `id` int(50) NOT NULL,
  `soal` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `soal`
--

INSERT INTO `soal` (`id`, `soal`) VALUES
(126, 'aku sigma'),
(127, 'test quiz'),
(128, 'test quiz'),
(129, 'test quiz'),
(130, 'qu'),
(131, 'quyt'),
(134, 'test quiz'),
(151, 'quuuuuu ganti'),
(158, 'oiusi'),
(162, 'Apa itu mysql'),
(186, 'yang mana untuk kerangaka awal web'),
(187, 'yang mana penulisan benar untuk text'),
(188, 'untuk badan web di css yang mana'),
(189, 'contoh alert adalah'),
(190, 'saya');

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `id` int(50) NOT NULL,
  `judul` varchar(250) NOT NULL,
  `image` varchar(250) NOT NULL DEFAULT '''belum.jpeg''',
  `deskripsi` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`id`, `judul`, `image`, `deskripsi`) VALUES
(287, 'visual studio code', '1755137539462-393833396.jpeg', 'untuk teks editor'),
(288, 'javascript', '1755137557174-583003511.jpeg', 'untuk interaktif web'),
(289, 'html', '1755137571280-614066890.jpeg', 'untuk kerangka web'),
(290, 'css', '1755137585064-864045242.jpeg', 'untuk menghias web');

-- --------------------------------------------------------

--
-- Table structure for table `tugas`
--

CREATE TABLE `tugas` (
  `id` int(50) NOT NULL,
  `soal_tugas` text NOT NULL,
  `id_sesi` int(250) NOT NULL,
  `id_tugas_user` int(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tugas`
--

INSERT INTO `tugas` (`id`, `soal_tugas`, `id_sesi`, `id_tugas_user`) VALUES
(191, 'buatkan h1-h6', 174, NULL),
(192, 'buatkan macam macam jenis input field', 175, NULL),
(193, 'buatkan web (h1-h6, list dan input) menggunakan html dan css', 176, NULL),
(194, 'sambungkan file js ke file html kamu', 177, NULL),
(195, 'buatlah web kamu termasuk (h1-h6, list, button, input)', 178, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tugas_user`
--

CREATE TABLE `tugas_user` (
  `id` int(50) NOT NULL,
  `id_user` int(50) NOT NULL,
  `id_sesi` int(50) NOT NULL,
  `pengumpulan` text NOT NULL,
  `nilai` int(50) DEFAULT NULL,
  `komentar_mentor` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tugas_user`
--

INSERT INTO `tugas_user` (`id`, `id_user`, `id_sesi`, `pengumpulan`, `nilai`, `komentar_mentor`) VALUES
(61, 28, 174, '[\"1755143531213-20250806_003131.jpg\"]', 80, 'nice'),
(62, 28, 175, '[\"1755143628538-20250806_003131.jpg\"]', 100, 'YAAAy'),
(63, 28, 176, '[\"1755143700154-cs_16_condition_zero_eng.exe\"]', 90, 'YES'),
(65, 28, 178, '[\"1755143793311-react4.pdf\"]', 90, 'sangat bagus'),
(66, 28, 177, '[\"1755143867670-Inside Scout.mp4\"]', 70, 'bagus');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `username` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `tentang` varchar(1000) NOT NULL,
  `foto` varchar(250) NOT NULL DEFAULT '''default-avatar.png''',
  `tanggal_lahir` date NOT NULL,
  `alamat` varchar(250) NOT NULL,
  `domisili` varchar(250) NOT NULL,
  `role` enum('admin','user','mentor') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `tentang`, `foto`, `tanggal_lahir`, `alamat`, `domisili`, `role`) VALUES
(10, 'Ravlor2', 'ravlor2@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(11, 'Ravlor3', 'ravlor3@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(12, 'Ravlor4', 'ravlor4@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(13, 'Ravlor5', 'ravlor5@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(14, 'Ravlor6', 'ravlor6@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(15, 'Ravlor7', 'ravlor7@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(16, 'Ravlor8', 'ravlor8@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(17, 'Ravlor10', 'ravlor10@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(22, 'Ravlor11', 'ravlor11@gmail.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(23, 'pim ', 'pim@rawul.com', '$2b$10$gPVsmtp6ABcgp/hVO5h2N.Hu5RqO8T7asSRMmasCclEein1cKgtcO', '', 'profile_1751025594082.jpg', '2001-03-05', 'kota', 'kalimantan', 'user'),
(24, 'tukikmewing', 'rizzz@rawul.com', '$2b$10$rPsAbqYhgdVk0aIIL1EYXeYeHy.VfQoRkHWfEzZewL3Fr1aAxMU.i', '', 'profile_1751027194410.jpeg', '1899-11-29', 'alamat', 'jawa jawa jawa', 'user'),
(28, 'melodie', 'melodie@example.com', '$2b$10$f5oKrebXzlD85OzxnCL.Iu1L.45fBNVxhCcaOD9pqHM21qLIRInIG', '', '1755143123640-438983328.jpg', '1998-03-02', 'seoul', 'korea', 'user'),
(31, 'sigma', 'sigma@sigma.com', '12345', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(34, 'user1', 'user1@email.com', '123', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(37, 'user', 'user@gmail.com', '123', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(39, 'test', 'test@email.com', '$2b$10$bwn2CwnIPdjSyHvi6byyFOZMgp//EezTNjvVw6aBwzUREDcB.x276', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(40, 'Ravlor', 'ravlor@email.com', '$2b$10$otgzgRbc6vRSXh8Y6PM5mewLn5oNW4eGoWp5JEHA/yQbzCZynLSAu', '', '1755137628330-490752522.jpeg', '2008-02-28', 'malang', 'jawa timur', 'admin'),
(43, 'rena', 'rena@email.com', '$2b$10$oPngziHYOiK1duS.sfLJuetS7AFJIauzwqi.kVimBqt4TlLA.gfiK', '', '\'default-avatar.png\'', '1899-11-29', '', '', 'user'),
(44, 'ravlor', 'ravlor@example.com', '$2b$10$ubvZc8Ipa5aiP9jyxDrYDOZhm4FkyYaILHCT47F/AZFgHT5PsoFy6', '', '1753845434590-604769407.png', '2008-03-05', 'jalan jalan malang', 'jawa', 'user'),
(48, 'dafan', 'dafan@email.com', '$2b$10$9HLQgs62Sc2w5VvjFNMQbeZ2ICAt2elenuJGeRvD63iaAh9ZizB22', '', '\'default-avatar.png\'', '0000-00-00', '', '', 'user'),
(49, 'ravlor', 'ravlormentor@email.com', '$2b$10$aH22k3v0fPi8safcqViW9.voTSqK9NPPWMdxDasexv7HMdCw6cuv6', 'saya adalah mentor, saya bisa ngoding. gitu. yup. :3', '1755143101003-282377190.jpeg', '5220-05-03', 'malang', 'jatim', 'mentor'),
(50, 'agus', 'agus@email.com', '$2b$10$NDpDCvm/yC2CWhlKz/F/m.adT51vTBSAJWoIFmVpV5K5SCdHlhI/e', '', '1755144681828-696147727.jpeg', '0000-00-00', '', '', 'mentor'),
(51, 'hadza ', 'hadza@email.com', '$2b$10$NdPTg6rdkQEauqp4YRnYnubFTK2URdZlXP3v5nLqDegw2HmrDT/uO', '', '1755144733808-693984959.jpeg', '0000-00-00', '', '', 'mentor'),
(52, 'sigma', 'sigma@email.com', '$2b$10$jAfzqhzImdRvM36f2J18EeIgvcEQfjwDWBCGNaDAG2/tDBajF5ZZu', '', '1755145416996-809031769.jpg', '0000-00-00', '', '', 'mentor');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `jawaban`
--
ALTER TABLE `jawaban`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_soal` (`id_soal`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_users` (`id_users`);

--
-- Indexes for table `kelas_tools`
--
ALTER TABLE `kelas_tools`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kelas_id` (`id_kelas`),
  ADD KEY `tool_id` (`id_tools`);

--
-- Indexes for table `komentar`
--
ALTER TABLE `komentar`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_kelas`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `log_quiz`
--
ALTER TABLE `log_quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_jawaban` (`id_jawaban`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_sesi`),
  ADD KEY `id_soalQuiz` (`id_soal`);

--
-- Indexes for table `sesi`
--
ALTER TABLE `sesi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indexes for table `soal`
--
ALTER TABLE `soal`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tugas`
--
ALTER TABLE `tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kelas` (`id_sesi`),
  ADD KEY `id_tugas_user` (`id_tugas_user`);

--
-- Indexes for table `tugas_user`
--
ALTER TABLE `tugas_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_sesi` (`id_sesi`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `jawaban`
--
ALTER TABLE `jawaban`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=753;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT for table `kelas_tools`
--
ALTER TABLE `kelas_tools`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `komentar`
--
ALTER TABLE `komentar`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `log_quiz`
--
ALTER TABLE `log_quiz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- AUTO_INCREMENT for table `sesi`
--
ALTER TABLE `sesi`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT for table `soal`
--
ALTER TABLE `soal`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=191;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=291;

--
-- AUTO_INCREMENT for table `tugas`
--
ALTER TABLE `tugas`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- AUTO_INCREMENT for table `tugas_user`
--
ALTER TABLE `tugas_user`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `jawaban`
--
ALTER TABLE `jawaban`
  ADD CONSTRAINT `jawaban_ibfk_1` FOREIGN KEY (`id_soal`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kelas`
--
ALTER TABLE `kelas`
  ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`id_users`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `kelas_tools`
--
ALTER TABLE `kelas_tools`
  ADD CONSTRAINT `kelas_tools_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kelas_tools_ibfk_2` FOREIGN KEY (`id_tools`) REFERENCES `tools` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `komentar`
--
ALTER TABLE `komentar`
  ADD CONSTRAINT `komentar_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `komentar_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `log_quiz`
--
ALTER TABLE `log_quiz`
  ADD CONSTRAINT `log_quiz_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `log_quiz_ibfk_2` FOREIGN KEY (`id_jawaban`) REFERENCES `jawaban` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_2` FOREIGN KEY (`id_soal`) REFERENCES `soal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `quiz_ibfk_3` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sesi`
--
ALTER TABLE `sesi`
  ADD CONSTRAINT `sesi_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tugas`
--
ALTER TABLE `tugas`
  ADD CONSTRAINT `tugas_ibfk_1` FOREIGN KEY (`id_tugas_user`) REFERENCES `tugas_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tugas_ibfk_2` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tugas_user`
--
ALTER TABLE `tugas_user`
  ADD CONSTRAINT `tugas_user_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tugas_user_ibfk_2` FOREIGN KEY (`id_sesi`) REFERENCES `sesi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
