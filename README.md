# Aliyah's Money — Sistem Pinjaman & Pembayaran Koperasi

Aplikasi web untuk mengelola **pinjaman, cicilan, dan pembayaran anggota koperasi** dalam satu
dashboard. Dibuat dengan PHP + MySQL (tanpa framework) dan antarmuka responsif yang bisa dipakai
dari laptop maupun HP.

**Demo online:** https://aliyahmoney.kesug.com/
**Login admin bawaan:** `aliyah2345` / `123456` _(ganti lewat menu Pengaturan setelah login)_

---

## Fitur

| Modul | Keterangan |
|---|---|
| Dashboard | Ringkasan anggota, pinjaman aktif, total pembayaran, grafik tren |
| Data Anggota | CRUD anggota: nomor, nama, alamat, no. HP, tanggal gabung, metode pembayaran, nomor rekening, foto QRIS |
| Pinjaman | Pengajuan pinjaman, tenor, bunga, total pinjaman, status (pengajuan / disetujui / lunas / ditolak) |
| Pembayaran | Pencatatan cicilan ke-berapa, jumlah bayar, sisa pinjaman, denda, unggah bukti transfer |
| Riwayat Cicilan | Riwayat pembayaran per pinjaman |
| Laporan | Rekap pinjaman & pembayaran |
| Pengaturan | Nama koperasi, notifikasi, hari jatuh tempo, denda (aktif/persen), bunga, mode gelap, bahasa, ukuran teks, lama grafik |
| Login | Admin + anggota, password disimpan sebagai hash **SHA-256** |

---

## Teknologi

- **PHP 8.2+** (diuji di PHP 8.2 lokal dan PHP 8.4 di hosting)
- **MySQL / MariaDB** — PDO, prepared statement
- **HTML + CSS + JavaScript vanilla** (tanpa framework, tanpa build step)
- API internal berbentuk JSON (`api/*.php`)

---

## Struktur Proyek

```
.
├── index.php                  # seluruh antarmuka (landing, login, dashboard, modul)
├── api/
│   ├── config.php             # konfigurasi database + konstanta admin
│   ├── state.php              # ambil & simpan seluruh state aplikasi
│   ├── users.php              # login, daftar, ubah password/profil
│   └── upload.php             # unggah foto (profil, QRIS, bukti pembayaran)
├── css/style.css
├── js/script.js
├── img/banner-koperasi.webp
├── uploads/
│   ├── profil/                # foto profil
│   ├── qris/                  # foto QRIS
│   └── bukti/                 # bukti pembayaran
└── database/
    ├── database.sql           # dump lengkap (dengan CREATE DATABASE) — untuk lokal
    └── database_hosting.sql   # tanpa CREATE DATABASE — untuk hosting seperti InfinityFree
```

---

## Struktur Database

Database: `aliyahs_money` (5 tabel, InnoDB, utf8mb4)

| Tabel | Primary Key | Relasi |
|---|---|---|
| `users` | `id` (varchar 40), `username` UNIQUE | `id_anggota` → `anggota.id` |
| `anggota` | `id` (varchar 40) | — |
| `pinjaman` | `id` (varchar 40) | `id_anggota` → `anggota.id` (ON DELETE CASCADE) |
| `pembayaran` | `id` (varchar 40) | `id_pinjaman` → `pinjaman.id` (ON DELETE CASCADE) |
| `prefs` | `id` (int, selalu 1) | tabel pengaturan satu baris |

- `users.password` menyimpan **SHA-256** dari kata sandi.
- `anggota.foto_qris` dan `pembayaran.bukti_foto` bertipe `LONGTEXT` (menyimpan path/nama file unggahan).

---

## Cara Menjalankan (Lokal — XAMPP)

1. Salin folder proyek ke `C:\xampp\htdocs\aliyahs-money`.
2. Jalankan **Apache** dan **MySQL** dari XAMPP Control Panel.
3. Buka `http://localhost/phpmyadmin` → tab **Import** → pilih `database/database.sql` → **Go**.
4. Sesuaikan `api/config.php` bila perlu (bawaan: host `localhost`, user `root`, tanpa password).
5. Buka `http://localhost/aliyahs-money/` → login `aliyah2345` / `123456`.

## Cara Menjalankan (Hosting — InfinityFree)

1. Buat database di vPanel → **MySQL Databases** (catat host `sqlXXX.infinityfree.com`, nama DB, dan user).
2. Upload seluruh isi proyek ke folder domain (`<subdomain>/htdocs/`) lewat **File Manager** atau FTP
   (`ftpupload.net`, user `if0_XXXXXXXX`).
3. Di **phpMyAdmin**, pilih database kamu (jangan di halaman server) → tab **Import** →
   `database/database_hosting.sql`. File ini sengaja tanpa `CREATE DATABASE` karena hosting gratis
   tidak mengizinkan pembuatan database (error `#1044`).
4. Isi blok database di `api/config.php`:

```php
$DB_HOST = 'sqlXXX.infinityfree.com';
$DB_NAME = 'if0_XXXXXXXX_aliyahs_money';
$DB_USER = 'if0_XXXXXXXX';
$DB_PASS = 'password_database_kamu';
```

5. Buka domainnya → login.

> **Keamanan:** `api/config.php` di repo ini memakai nilai contoh. Jangan pernah commit password
> database asli atau kredensial hosting ke repository publik.

---

## Catatan Teknis

- **Autentikasi** memakai `$_SESSION` untuk identitas login; role (`admin` / `user`) dicek di server
  pada `api/users.php` dan `api/state.php`.
- **Antrian mode admin/user** di frontend hanya untuk tampilan; keputusan izin tetap di sisi server.
- **Backup data**: menu *Cadangkan Data* mengunduh seluruh data sebagai berkas JSON.
- Aplikasi tidak butuh `composer`, `npm`, atau proses build apa pun — cukup PHP dan MySQL.

---

## Lisensi

Proyek tugas akademik. Bebas dipakai untuk pembelajaran.
