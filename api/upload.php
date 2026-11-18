<?php
require __DIR__ . '/config.php';

// ===== VALIDASI REQUEST =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_err('Method tidak didukung', 405);

$type = $_POST['type'] ?? 'profil';
$userId = $_POST['user_id'] ?? '';

if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
    json_err('Tidak ada file yang diterima');
}
$file = $_FILES['foto'];

if ($file['size'] > 8 * 1024 * 1024) json_err('Ukuran gambar maksimal 8MB');

// ===== VALIDASI FILE =====
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);
if (!isset($allowed[$mime])) json_err('File harus berupa gambar (JPEG/PNG/WEBP)');

// ===== SIMPAN FOTO PROFIL =====
if ($type === 'profil') {
    if (!$userId) json_err('user_id wajib diisi untuk upload foto profil');
    // foto profil disimpan di folder uploads/profil (satu web untuk admin & anggota)
    $dir = __DIR__ . '/../uploads/profil';
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    // hapus foto lama
    foreach (glob($dir . '/' . preg_replace('/[^a-zA-Z0-9_-]/', '', $userId) . '.*') as $old) {
        @unlink($old);
    }

    $safeId = preg_replace('/[^a-zA-Z0-9_-]/', '', $userId);
    $filename = $safeId . '.' . $allowed[$mime];
    $dest = $dir . '/' . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        json_err('Gagal menyimpan file ke server', 500);
    }

    $relPath = 'uploads/profil/' . $filename . '?v=' . time();

    $stmt = $pdo->prepare('UPDATE users SET foto = :foto WHERE id = :id');
    $stmt->execute([':foto' => $relPath, ':id' => $userId]);

    json_ok(['path' => $relPath]);
}

json_err('type tidak dikenali');
