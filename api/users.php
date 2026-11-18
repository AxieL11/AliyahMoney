<?php
require __DIR__ . '/config.php';
ensure_admin($pdo);

$method = $_SERVER['REQUEST_METHOD'];

// kolom yang boleh dikirim ke browser (TANPA hash kata sandi)
const USER_PUBLIC_COLS = 'id, nama, username, foto, role, id_anggota';

// ===== GET: DAFTAR AKUN =====
if ($method === 'GET') {
    $action = $_GET['action'] ?? 'list';
    if ($action === 'list') {
        $mode = app_mode();
        // web User tidak pernah menerima data akun admin
        $where = $mode === 'user' ? "WHERE role <> 'admin'" : '';
        $rows = $pdo->query('SELECT ' . USER_PUBLIC_COLS . " FROM users $where ORDER BY created_at ASC")->fetchAll();
        foreach ($rows as &$r) { $r['foto'] = $r['foto'] ? str_replace('../aliyahs-money-user/', '', $r['foto']) : null; }
        json_ok(['data' => $rows]);
    }
    json_err('Aksi tidak dikenali');
}

if ($method !== 'POST') json_err('Method tidak didukung', 405);

$body   = input_json();
$action = $body['action'] ?? '';
$mode   = app_mode($body);

function find_user($pdo, $id) {
    $st = $pdo->prepare('SELECT * FROM users WHERE id = ?');
    $st->execute([$id]);
    return $st->fetch() ?: null;
}
function public_user($u) {
    return [
        'id' => $u['id'], 'nama' => $u['nama'], 'username' => $u['username'],
        'foto' => $u['foto'] ? str_replace('../aliyahs-money-user/', '', $u['foto']) : null, 'role' => $u['role'], 'id_anggota' => $u['id_anggota'] ?: null,
    ];
}
// akun pelaku harus cocok dengan web yang dipakai (admin <-> web Admin, user <-> web User)
function actor_or_fail($pdo, $body, $mode) {
    $u = find_user($pdo, $body['actor'] ?? '');
    if (!$u) json_err('Akun tidak ditemukan', 404);
    if (($mode === 'admin') !== ($u['role'] === 'admin')) json_err('Akun ini tidak bisa dipakai di web ini', 403);
    return $u;
}

// ===== LOGIN =====
if ($action === 'login') {
    $username = strtolower(trim($body['username'] ?? ''));
    $hash     = (string)($body['hash'] ?? '');
    $st = $pdo->prepare('SELECT * FROM users WHERE username = ?');
    $st->execute([$username]);
    $u = $st->fetch();
    if (!$u) {
        json_err('Akun tidak ditemukan. Silakan daftar terlebih dahulu.', 404);
    }
    if (!hash_equals((string)$u['password'], $hash)) json_err('Kata sandi salah.', 401);
    json_ok(['user' => public_user($u)]);
}

// ===== DAFTAR (WEB USER) — otomatis jadi anggota =====
if ($action === 'register') {
    if ($mode !== 'user') json_err('Pendaftaran hanya lewat web User', 403);
    $nama     = trim($body['nama'] ?? '');
    $username = strtolower(trim($body['username'] ?? ''));
    $hash     = (string)($body['hash'] ?? '');
    $alamat   = trim($body['alamat'] ?? '');
    $no_hp    = trim($body['no_hp'] ?? '');
    if ($nama === '' || $username === '' || $hash === '') json_err('Nama, username, dan kata sandi wajib diisi.');
    if (!preg_match('/^\S{3,40}$/', $username)) json_err('Username 3–40 karakter tanpa spasi.');

    $cek = $pdo->prepare('SELECT 1 FROM users WHERE username = ?');
    $cek->execute([$username]);
    if ($cek->fetchColumn()) json_err('Username ini sudah terdaftar. Silakan masuk.');

    $pdo->beginTransaction();
    try {
        $idAnggota = gen_id();
        $pdo->prepare(
            'INSERT INTO anggota (id,no,nama,alamat,no_hp,tanggal_gabung) VALUES (?,?,?,?,?,?)'
        )->execute([$idAnggota, next_anggota_no($pdo), $nama, $alamat, $no_hp, date('Y-m-d')]);

        $idUser = gen_id();
        // peran SELALU 'user' dari pendaftaran — admin hanya 1 dan tidak bisa dibuat di sini
        $pdo->prepare(
            "INSERT INTO users (id,nama,username,password,role,id_anggota) VALUES (?,?,?,?, 'user', ?)"
        )->execute([$idUser, $nama, $username, $hash, $idAnggota]);
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        json_err('Gagal mendaftar: ' . $e->getMessage(), 500);
    }
    json_ok(['id' => $idUser, 'id_anggota' => $idAnggota]);
}

// ===== ADMIN: JADIKAN AKUN SEBAGAI ANGGOTA (OTOMATIS) =====
if ($action === 'adopt') {
    actor_or_fail($pdo, $body, 'admin');
    if ($mode !== 'admin') json_err('Hanya admin', 403);
    $ids = $body['user_ids'] ?? [];
    if (!is_array($ids)) json_err('Format data tidak valid');

    $pending = $pdo->query(
        "SELECT u.* FROM users u LEFT JOIN anggota a ON a.id = u.id_anggota
         WHERE u.role = 'user' AND a.id IS NULL ORDER BY u.created_at ASC"
    )->fetchAll();
    $dibuat = 0;
    $pdo->beginTransaction();
    try {
        foreach ($pending as $u) {
            if (!($body['all'] ?? false) && !in_array($u['id'], $ids, true)) continue;
            $idAnggota = gen_id();
            $pdo->prepare(
                'INSERT INTO anggota (id,no,nama,alamat,no_hp,tanggal_gabung) VALUES (?,?,?,?,?,?)'
            )->execute([$idAnggota, next_anggota_no($pdo), $u['nama'], '', '', date('Y-m-d')]);
            $pdo->prepare('UPDATE users SET id_anggota = ? WHERE id = ?')->execute([$idAnggota, $u['id']]);
            $dibuat++;
        }
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        json_err('Gagal menambahkan anggota: ' . $e->getMessage(), 500);
    }
    json_ok(['dibuat' => $dibuat]);
}

// ===== UBAH PROFIL SENDIRI (nama, username, foto, kata sandi) =====
if ($action === 'update_self') {
    $u = actor_or_fail($pdo, $body, $mode);
    $set = []; $val = [];
    if (array_key_exists('nama', $body)) {
        $n = trim((string)$body['nama']);
        if ($n === '') json_err('Nama tidak boleh kosong');
        $set[] = 'nama = ?'; $val[] = $n;
    }
    if (array_key_exists('username', $body)) {
        $un = strtolower(trim((string)$body['username']));
        if ($un === '') json_err('Username tidak boleh kosong');
        $cek = $pdo->prepare('SELECT 1 FROM users WHERE username = ? AND id <> ?');
        $cek->execute([$un, $u['id']]);
        if ($cek->fetchColumn()) json_err('Username ini sudah dipakai akun lain');
        $set[] = 'username = ?'; $val[] = $un;
    }
    if (array_key_exists('foto', $body) && $body['foto'] === null) {
        $set[] = 'foto = NULL';
    }
    if (!empty($body['hash'])) {
        $set[] = 'password = ?'; $val[] = (string)$body['hash'];
    }
    if ($set) {
        $val[] = $u['id'];
        $pdo->prepare('UPDATE users SET ' . implode(', ', $set) . ' WHERE id = ?')->execute($val);
    }
    json_ok();
}

// ===== HAPUS AKUN SENDIRI =====
if ($action === 'delete_self') {
    $u = actor_or_fail($pdo, $body, $mode);
    if ($u['role'] === 'admin') json_err('Akun admin tidak dapat dihapus.', 403);
    if (!hash_equals((string)$u['password'], (string)($body['hash'] ?? ''))) json_err('Kata sandi salah.', 401);
    $pdo->prepare('DELETE FROM users WHERE id = ?')->execute([$u['id']]);
    json_ok();
}

json_err('Aksi tidak dikenali');
