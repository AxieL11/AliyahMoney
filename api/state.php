<?php
require __DIR__ . '/config.php';

// ===== DAFTAR KOLOM =====
const ANGGOTA_COLS   = ['id','no','nama','alamat','no_hp','tanggal_gabung','metode_pembayaran','no_rekening','nama_bank','foto_qris'];
const PINJAMAN_COLS  = ['id','no','id_anggota','tanggal_pinjaman','jumlah_pinjaman','tenor','bunga','total_pinjaman','status','alasan'];
const PEMBAYARAN_COLS = ['id','no','id_pinjaman','cicilan_ke','jumlah_bayar','tanggal_bayar','sisa_pinjaman','denda','bukti_foto','metode_pembayaran','nama_bank','no_rekening'];

// ===== MIGRASI KOLOM ALASAN =====
if (!$pdo->query("SHOW COLUMNS FROM pinjaman LIKE 'alasan'")->fetch()) {
    $pdo->exec('ALTER TABLE pinjaman ADD COLUMN alasan TEXT NULL AFTER status');
}

// ===== MIGRASI KOLOM NAMA_BANK (otomatis, sekali saja) =====
if (!$pdo->query("SHOW COLUMNS FROM anggota LIKE 'nama_bank'")->fetch()) {
    $pdo->exec('ALTER TABLE anggota ADD COLUMN nama_bank VARCHAR(60) NULL AFTER no_rekening');
}

// ===== MIGRASI METODE PEMBAYARAN DI TABEL PEMBAYARAN (otomatis, sekali saja) =====
if (!$pdo->query("SHOW COLUMNS FROM pembayaran LIKE 'metode_pembayaran'")->fetch()) {
    $pdo->exec('ALTER TABLE pembayaran ADD COLUMN metode_pembayaran VARCHAR(20) NULL AFTER bukti_foto');
    $pdo->exec('ALTER TABLE pembayaran ADD COLUMN nama_bank VARCHAR(60) NULL AFTER metode_pembayaran');
    $pdo->exec('ALTER TABLE pembayaran ADD COLUMN no_rekening VARCHAR(60) NULL AFTER nama_bank');
}

// ===== BACA DATA =====
function load_anggota($pdo) {
    return $pdo->query('SELECT ' . implode(',', ANGGOTA_COLS) . ' FROM anggota ORDER BY created_at ASC')->fetchAll();
}
function load_pinjaman($pdo) {
    $rows = $pdo->query('SELECT ' . implode(',', PINJAMAN_COLS) . ' FROM pinjaman ORDER BY created_at ASC')->fetchAll();
    foreach ($rows as &$r) {
        $r['jumlah_pinjaman'] = (float)$r['jumlah_pinjaman'];
        $r['tenor']           = (int)$r['tenor'];
        $r['bunga']           = (float)$r['bunga'];
        $r['total_pinjaman']  = (float)$r['total_pinjaman'];
    }
    return $rows;
}
function load_pembayaran($pdo) {
    $rows = $pdo->query('SELECT ' . implode(',', PEMBAYARAN_COLS) . ' FROM pembayaran ORDER BY created_at ASC')->fetchAll();
    foreach ($rows as &$r) {
        $r['cicilan_ke']    = (int)$r['cicilan_ke'];
        $r['jumlah_bayar']  = (float)$r['jumlah_bayar'];
        $r['sisa_pinjaman'] = (float)$r['sisa_pinjaman'];
        $r['denda']         = (float)$r['denda'];
    }
    return $rows;
}
function load_prefs($pdo) {
    $row = $pdo->query('SELECT * FROM prefs WHERE id=1')->fetch();
    if (!$row) return null;
    unset($row['id']);
    foreach (['notifAngsuran','notifTransaksi','notifJatuhTempo','dendaAktif','darkMode'] as $b) {
        $row[$b] = (bool)$row[$b];
    }
    $row['hariJatuhTempo'] = (int)$row['hariJatuhTempo'];
    $row['dendaPersen']    = (float)$row['dendaPersen'];
    $row['bungaPersen']    = (float)$row['bungaPersen'];
    if (isset($row['chartHari'])) $row['chartHari'] = (int)$row['chartHari'];
    return $row;
}

// ===== GET: LOAD DATA =====
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'load';
    if ($action === 'load') {
        json_ok(['data' => [
            'anggota'    => load_anggota($pdo),
            'pinjaman'   => load_pinjaman($pdo),
            'pembayaran' => load_pembayaran($pdo),
            'prefs'      => load_prefs($pdo),
        ]]);
    }
    json_err('Aksi tidak dikenali');
}

// ===== POST: SIMPAN DATA =====
if ($method === 'POST') {
    $body = input_json();
    $mode = app_mode($body);
    $action = $body['action'] ?? 'save';
    $key = $body['key'] ?? '';
    $data = $body['data'] ?? null;

    if ($action !== 'save') json_err('Aksi tidak dikenali');

    // -- prefs
    if ($key === 'prefs') {
        if (!is_array($data)) json_err('Format prefs tidak valid');
        // pengaturan inti hanya bisa diubah dari web Admin
        if ($mode !== 'admin') {
            $cur = $pdo->query('SELECT namaKoperasi, dendaPersen, bungaPersen, qrisAdminFoto FROM prefs WHERE id=1')->fetch();
            if ($cur) {
                $data['namaKoperasi']  = $cur['namaKoperasi'];
                $data['dendaPersen']   = $cur['dendaPersen'];
                $data['bungaPersen']   = $cur['bungaPersen'];
                $data['qrisAdminFoto'] = $cur['qrisAdminFoto'];
            }
        }
        $stmt = $pdo->prepare(
            'UPDATE prefs SET notifAngsuran=:notifAngsuran, notifTransaksi=:notifTransaksi,
             notifJatuhTempo=:notifJatuhTempo, hariJatuhTempo=:hariJatuhTempo, namaKoperasi=:namaKoperasi,
             dendaAktif=:dendaAktif, dendaPersen=:dendaPersen, bungaPersen=:bungaPersen, darkMode=:darkMode,
             ukuranTeks=:ukuranTeks, chartHari=:chartHari, qrisAdminFoto=:qrisAdminFoto
             WHERE id=1'
        );
        $stmt->execute([
            ':notifAngsuran'   => !empty($data['notifAngsuran']) ? 1 : 0,
            ':notifTransaksi'  => !empty($data['notifTransaksi']) ? 1 : 0,
            ':notifJatuhTempo' => !empty($data['notifJatuhTempo']) ? 1 : 0,
            ':hariJatuhTempo'  => (int)($data['hariJatuhTempo'] ?? 3),
            ':namaKoperasi'    => $data['namaKoperasi'] ?? "Aliyah's Money",
            ':dendaAktif'      => !empty($data['dendaAktif']) ? 1 : 0,
            ':dendaPersen'     => (float)($data['dendaPersen'] ?? 0.5),
            ':bungaPersen'     => (float)($data['bungaPersen'] ?? 5),
            ':darkMode'        => !empty($data['darkMode']) ? 1 : 0,
            ':ukuranTeks'      => $data['ukuranTeks'] ?? 'sedang',
            ':chartHari'       => (int)($data['chartHari'] ?? 7),
            ':qrisAdminFoto'   => $data['qrisAdminFoto'] ?? null,
        ]);
        json_ok();
    }

    if (!is_array($data)) json_err('Format data tidak valid');

    // anggota, pinjaman, pembayaran
    $pdo->beginTransaction();
    try {
        if ($key === 'anggota') {
            // -- anggota
            $ids = array_values(array_filter(array_map(fn($r) => $r['id'] ?? null, $data)));
            if (count($ids)) {
                $ph = implode(',', array_fill(0, count($ids), '?'));
                $pdo->prepare("DELETE FROM anggota WHERE id NOT IN ($ph) AND created_at < (NOW() - INTERVAL 8 SECOND)")->execute($ids);
            } else {
                $pdo->exec('DELETE FROM anggota WHERE created_at < (NOW() - INTERVAL 8 SECOND)');
            }
            $stmt = $pdo->prepare(
                'INSERT INTO anggota (id,no,nama,alamat,no_hp,tanggal_gabung,metode_pembayaran,no_rekening,nama_bank,foto_qris)
                 VALUES (:id,:no,:nama,:alamat,:no_hp,:tanggal_gabung,:metode_pembayaran,:no_rekening,:nama_bank,:foto_qris)
                 ON DUPLICATE KEY UPDATE no=VALUES(no), nama=VALUES(nama), alamat=VALUES(alamat),
                    no_hp=VALUES(no_hp), tanggal_gabung=VALUES(tanggal_gabung),
                    metode_pembayaran=VALUES(metode_pembayaran), no_rekening=VALUES(no_rekening), nama_bank=VALUES(nama_bank),
                    foto_qris=VALUES(foto_qris)'
            );
            foreach ($data as $r) {
                if (empty($r['id'])) continue;
                $stmt->execute([
                    ':id' => $r['id'], ':no' => $r['no'] ?? '', ':nama' => $r['nama'] ?? '',
                    ':alamat' => $r['alamat'] ?? '', ':no_hp' => $r['no_hp'] ?? '',
                    ':tanggal_gabung' => $r['tanggal_gabung'] ?? null,
                    ':metode_pembayaran' => $r['metode_pembayaran'] ?? null,
                    ':no_rekening' => $r['no_rekening'] ?? '',
                    ':nama_bank' => $r['nama_bank'] ?? null,
                    ':foto_qris' => $r['foto_qris'] ?? null,
                ]);
            }
            // akun yang anggotanya terhapus otomatis dilepas tautannya
            $pdo->exec('UPDATE users SET id_anggota = NULL WHERE id_anggota IS NOT NULL AND id_anggota NOT IN (SELECT id FROM anggota)');
        } elseif ($key === 'pinjaman') {
            // -- pinjaman
            $ids = array_values(array_filter(array_map(fn($r) => $r['id'] ?? null, $data)));
            if (count($ids)) {
                $ph = implode(',', array_fill(0, count($ids), '?'));
                $pdo->prepare("DELETE FROM pinjaman WHERE id NOT IN ($ph) AND created_at < (NOW() - INTERVAL 8 SECOND)")->execute($ids);
            } else {
                $pdo->exec('DELETE FROM pinjaman WHERE created_at < (NOW() - INTERVAL 8 SECOND)');
            }
            $stmt = $pdo->prepare(
                'INSERT INTO pinjaman (id,no,id_anggota,tanggal_pinjaman,jumlah_pinjaman,tenor,bunga,total_pinjaman,status,alasan)
                 VALUES (:id,:no,:id_anggota,:tanggal_pinjaman,:jumlah_pinjaman,:tenor,:bunga,:total_pinjaman,:status,:alasan)
                 ON DUPLICATE KEY UPDATE no=VALUES(no), id_anggota=VALUES(id_anggota),
                    tanggal_pinjaman=VALUES(tanggal_pinjaman), jumlah_pinjaman=VALUES(jumlah_pinjaman),
                    tenor=VALUES(tenor), bunga=VALUES(bunga), total_pinjaman=VALUES(total_pinjaman),
                    status=VALUES(status), alasan=VALUES(alasan)'
            );
            foreach ($data as $r) {
                if (empty($r['id']) || empty($r['id_anggota'])) continue;
                $stmt->execute([
                    ':id' => $r['id'], ':no' => $r['no'] ?? '', ':id_anggota' => $r['id_anggota'],
                    ':tanggal_pinjaman' => $r['tanggal_pinjaman'] ?? null,
                    ':jumlah_pinjaman' => $r['jumlah_pinjaman'] ?? 0, ':tenor' => $r['tenor'] ?? 0,
                    ':bunga' => $r['bunga'] ?? 0, ':total_pinjaman' => $r['total_pinjaman'] ?? 0,
                    ':status' => $r['status'] ?? 'pengajuan',
                    ':alasan' => $r['alasan'] ?? null,
                ]);
            }
        } elseif ($key === 'pembayaran') {
            // -- pembayaran
            $ids = array_values(array_filter(array_map(fn($r) => $r['id'] ?? null, $data)));
            if (count($ids)) {
                $ph = implode(',', array_fill(0, count($ids), '?'));
                $pdo->prepare("DELETE FROM pembayaran WHERE id NOT IN ($ph) AND created_at < (NOW() - INTERVAL 8 SECOND)")->execute($ids);
            } else {
                $pdo->exec('DELETE FROM pembayaran WHERE created_at < (NOW() - INTERVAL 8 SECOND)');
            }
            $stmt = $pdo->prepare(
                'INSERT INTO pembayaran (id,no,id_pinjaman,cicilan_ke,jumlah_bayar,tanggal_bayar,sisa_pinjaman,denda,bukti_foto,metode_pembayaran,nama_bank,no_rekening)
                 VALUES (:id,:no,:id_pinjaman,:cicilan_ke,:jumlah_bayar,:tanggal_bayar,:sisa_pinjaman,:denda,:bukti_foto,:metode_pembayaran,:nama_bank,:no_rekening)
                 ON DUPLICATE KEY UPDATE no=VALUES(no), id_pinjaman=VALUES(id_pinjaman),
                    cicilan_ke=VALUES(cicilan_ke), jumlah_bayar=VALUES(jumlah_bayar),
                    tanggal_bayar=VALUES(tanggal_bayar), sisa_pinjaman=VALUES(sisa_pinjaman),
                    denda=VALUES(denda), bukti_foto=VALUES(bukti_foto),
                    metode_pembayaran=VALUES(metode_pembayaran), nama_bank=VALUES(nama_bank), no_rekening=VALUES(no_rekening)'
            );
            foreach ($data as $r) {
                if (empty($r['id']) || empty($r['id_pinjaman'])) continue;
                $stmt->execute([
                    ':id' => $r['id'], ':no' => $r['no'] ?? '', ':id_pinjaman' => $r['id_pinjaman'],
                    ':cicilan_ke' => $r['cicilan_ke'] ?? 1, ':jumlah_bayar' => $r['jumlah_bayar'] ?? 0,
                    ':tanggal_bayar' => $r['tanggal_bayar'] ?? null, ':sisa_pinjaman' => $r['sisa_pinjaman'] ?? 0,
                    ':denda' => $r['denda'] ?? 0, ':bukti_foto' => $r['bukti_foto'] ?? null,
                    ':metode_pembayaran' => $r['metode_pembayaran'] ?? null, ':nama_bank' => $r['nama_bank'] ?? null, ':no_rekening' => $r['no_rekening'] ?? null,
                ]);
            }
        } else {
            $pdo->rollBack();
            json_err('key tidak dikenali: ' . $key);
        }
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        json_err('Gagal menyimpan ' . $key . ': ' . $e->getMessage(), 500);
    }
    json_ok();
}

json_err('Method tidak didukung', 405);
