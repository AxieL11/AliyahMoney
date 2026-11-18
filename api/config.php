<?php

// ===== KONFIGURASI DATABASE =====
$DB_HOST = 'localhost';              // hosting: sqlXXX.infinityfree.com
$DB_NAME = 'aliyahs_money';           // hosting: if0_XXXXXXXX_aliyahs_money
$DB_USER = 'root';                   // hosting: if0_XXXXXXXX
$DB_PASS = '';                       // isi password database kamu

error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('Asia/Jakarta');

// ===== ADMIN TETAP (HANYA 1) =====
// Admin selalu Aliyah. Tersimpan di database, jadi sama di semua perangkat
// dan tidak perlu daftar ulang. Ganti kata sandi lewat menu Pengaturan di web Admin.
const ADMIN_USERNAME = 'aliyah2345';
const ADMIN_NAMA     = 'aliyah';
const ADMIN_ID       = 'sefzfzq';
// SHA-256 dari kata sandi awal: Aliyah@2026
const ADMIN_DEFAULT_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';

// ===== SESSION & HEADER =====
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Credentials: true');

// ===== KONEKSI DATABASE =====
try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Koneksi database gagal. Pastikan XAMPP (Apache+MySQL) jalan dan database "aliyahs_money" sudah di-import. Detail: ' . $e->getMessage()]);
    exit;
}

// ===== HELPER =====
// body JSON
function input_json() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// respon sukses
function json_ok($data = []) {
    echo json_encode(array_merge(['ok' => true], $data));
    exit;
}

// respon error
function json_err($msg, $code = 400) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg]);
    exit;
}

// id acak
function gen_id($prefix = '') {
    return $prefix . bin2hex(random_bytes(8));
}

// mode web: 'admin' (web Admin) atau 'user' (web User)
function app_mode($body = []) {
    $m = $_GET['mode'] ?? ($body['mode'] ?? 'user');
    return $m === 'admin' ? 'admin' : 'user';
}

// pastikan selalu ada tepat 1 admin
function ensure_admin($pdo) {
    $admins = $pdo->query(
        "SELECT id FROM users WHERE role='admin' ORDER BY (username = '" . ADMIN_USERNAME . "') DESC, created_at ASC, id ASC"
    )->fetchAll(PDO::FETCH_COLUMN);

    if (count($admins) > 1) {
        $keep = $admins[0];
        $pdo->prepare("UPDATE users SET role='user' WHERE role='admin' AND id <> ?")->execute([$keep]);
        return;
    }
    if (count($admins) === 1) return;

    // belum ada admin: promosikan akun 'aliyah' kalau sudah ada, kalau tidak buat baru
    $st = $pdo->prepare('SELECT id FROM users WHERE username = ?');
    $st->execute([ADMIN_USERNAME]);
    $id = $st->fetchColumn();
    if ($id) {
        $pdo->prepare("UPDATE users SET role='admin' WHERE id = ?")->execute([$id]);
    } else {
        $pdo->prepare("INSERT INTO users (id, nama, username, password, role) VALUES (?, ?, ?, ?, 'admin')")
            ->execute([ADMIN_ID, ADMIN_NAMA, ADMIN_USERNAME, ADMIN_DEFAULT_HASH]);
    }
}

// nomor anggota berikutnya yang belum terpakai (AG-0001, AG-0002, ...)
function next_anggota_no($pdo) {
    $n = (int)$pdo->query('SELECT COUNT(*) FROM anggota')->fetchColumn() + 1;
    $cek = $pdo->prepare('SELECT 1 FROM anggota WHERE no = ?');
    while (true) {
        $no = 'AG-' . str_pad((string)$n, 4, '0', STR_PAD_LEFT);
        $cek->execute([$no]);
        if (!$cek->fetchColumn()) return $no;
        $n++;
    }
}
