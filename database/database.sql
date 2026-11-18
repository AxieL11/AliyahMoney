-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 12, 2026 at 03:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aliyahs_money`
--

CREATE DATABASE `aliyahs_money`;
use aliyahs_money;

-- --------------------------------------------------------

--
-- Table structure for table `anggota`
--

CREATE TABLE `anggota` (
  `id` varchar(40) NOT NULL,
  `no` varchar(30) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `no_hp` varchar(30) DEFAULT NULL,
  `tanggal_gabung` date DEFAULT NULL,
  `metode_pembayaran` varchar(20) DEFAULT NULL,
  `no_rekening` varchar(150) DEFAULT NULL,
  `foto_qris` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` varchar(40) NOT NULL,
  `no` varchar(30) NOT NULL,
  `id_pinjaman` varchar(40) NOT NULL,
  `cicilan_ke` int(11) NOT NULL DEFAULT 1,
  `jumlah_bayar` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tanggal_bayar` date DEFAULT NULL,
  `sisa_pinjaman` decimal(15,2) NOT NULL DEFAULT 0.00,
  `denda` decimal(15,2) NOT NULL DEFAULT 0.00,
  `bukti_foto` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pinjaman`
--

CREATE TABLE `pinjaman` (
  `id` varchar(40) NOT NULL,
  `no` varchar(30) NOT NULL,
  `id_anggota` varchar(40) NOT NULL,
  `tanggal_pinjaman` date DEFAULT NULL,
  `jumlah_pinjaman` decimal(15,2) NOT NULL DEFAULT 0.00,
  `tenor` int(11) NOT NULL DEFAULT 0,
  `bunga` decimal(6,2) NOT NULL DEFAULT 0.00,
  `total_pinjaman` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(20) NOT NULL DEFAULT 'pengajuan',
  `alasan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prefs`
--

CREATE TABLE `prefs` (
  `id` int(11) NOT NULL DEFAULT 1,
  `notifAngsuran` tinyint(1) NOT NULL DEFAULT 1,
  `notifTransaksi` tinyint(1) NOT NULL DEFAULT 1,
  `notifJatuhTempo` tinyint(1) NOT NULL DEFAULT 1,
  `hariJatuhTempo` int(11) NOT NULL DEFAULT 3,
  `namaKoperasi` varchar(150) NOT NULL DEFAULT 'Aliyah''s Money',
  `dendaAktif` tinyint(1) NOT NULL DEFAULT 1,
  `dendaPersen` decimal(5,2) NOT NULL DEFAULT 0.50,
  `bungaPersen` decimal(5,2) NOT NULL DEFAULT 5.00,
  `darkMode` tinyint(1) NOT NULL DEFAULT 0,
  `bahasa` varchar(5) NOT NULL DEFAULT 'id',
  `ukuranTeks` varchar(10) NOT NULL DEFAULT 'sedang',
  `chartHari` int(11) NOT NULL DEFAULT 7,
  `qrisAdminFoto` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prefs`
--

INSERT INTO `prefs` (`id`, `notifAngsuran`, `notifTransaksi`, `notifJatuhTempo`, `hariJatuhTempo`, `namaKoperasi`, `dendaAktif`, `dendaPersen`, `bungaPersen`, `darkMode`, `bahasa`, `ukuranTeks`, `chartHari`, `qrisAdminFoto`) VALUES
(1, 1, 1, 1, 3, 'Aliyah\'s Money', 1, 0.50, 5.00, 0, 'id', 'sedang', 7, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(40) NOT NULL,
  `nama` varchar(150) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'user',
  `id_anggota` varchar(40) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `username`, `password`, `foto`, `role`, `id_anggota`, `created_at`) VALUES
('sefzfzq', 'aliyah', 'aliyah2345', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', NULL, 'admin', NULL, '2026-09-22 12:56:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pembayaran_pinjaman` (`id_pinjaman`);

--
-- Indexes for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_pinjaman_anggota` (`id_anggota`);

--
-- Indexes for table `prefs`
--
ALTER TABLE `prefs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `fk_pembayaran_pinjaman` FOREIGN KEY (`id_pinjaman`) REFERENCES `pinjaman` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pinjaman`
--
ALTER TABLE `pinjaman`
  ADD CONSTRAINT `fk_pinjaman_anggota` FOREIGN KEY (`id_anggota`) REFERENCES `anggota` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
