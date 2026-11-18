<?php // Aliyah's Money — satu web untuk Admin & Anggota (tampilan mengikuti peran akun) ?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aliyah's Money</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&family=Playwrite+ID+Cursive:wght@400;500;600&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
</head>
<body data-mode="user">

<!-- ===== INTRO ALA NETFLIX ===== -->
<div class="intro" id="introSplash" aria-hidden="true">
  <div class="intro-core">
    <div class="intro-mark">Am</div>
    <div class="intro-name">Aliyah’s Money</div>
    <div class="intro-line"></div>
  </div>
  <div class="intro-hint">Ketuk dimanapun untuk melewati</div>
</div>

<!-- ===== HALAMAN LOGIN ===== -->
<div class="auth-screen" id="authScreen">
 <div class="auth-stack">
  <div class="auth-wrap">
    <div class="auth-side">
      <div>
        <div class="side-top">
          <div class="mark">Am</div>
        </div>
        <div style="font-size:11.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--green-soft);margin-bottom:10px;position:relative;">Aliyah's Money — Sistem Pinjaman dan Pembayaran</div>
        <h2>Kelola pinjaman &amp; pembayaran anggota <em>tanpa ribet</em>, hanya <em>dalam satu</em> dashboard.</h2>
        <p>Data anggota, pinjaman, pembayaran dan cicilan tercatat rapi dan mudah dipantau dimanapun dan kapanpun saat butuh.</p>
        <div class="auth-feat">
          <div class="row" style="--i:0"><span class="ico"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Pantau pinjaman &amp; pembayaran secara real-time</div>
          <div class="row" style="--i:1"><span class="ico"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Data anggota tersimpan otomatis dan efisien</div>
          <div class="row" style="--i:2"><span class="ico"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>Akses aman dengan akun pribadi tanpa takut bocor</div>
        </div>
      </div>

      <div style="font-size:11.5px;color:#9C8F78;position:relative;">© 2026 Aliyah's Money — Sistem Pinjaman dan Pembayaran</div>
    </div>

    <div class="auth-form-col">
      <!-- ===== PANEL LOGIN ===== -->
      <div class="auth-panel active" id="panelLogin">
        <div class="login-id-row">
          <div class="login-av" id="loginAv"></div>
          <div>
            <h1 style="margin-bottom:2px;">Selamat datang kembali 👋</h1>
            <div class="sub" id="loginSub" style="margin-bottom:0;">Masuk dengan akun Anda (admin atau anggota).</div>
          </div>
        </div>
        <div class="auth-err" id="loginErr"></div>
        <div class="auth-fields">
          <div style="--fi:0"><label>Username</label><div class="field-ico-wrap"><svg class="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" stroke-linecap="round"/></svg><input class="field" id="liUsername" type="text" placeholder="username anda" autocomplete="off"></div></div>
          <div style="--fi:1"><label>Kata Sandi</label><div class="field-ico-wrap"><svg class="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="9.5" rx="2.3"/><path d="M8 10.5V7.8a4 4 0 018 0v2.7" stroke-linecap="round"/></svg><div class="pass-wrap"><input class="field" id="liPass" type="password" placeholder="Masukkan kata sandi"><button type="button" class="pass-toggle" data-toggle-pass="liPass" aria-label="Tampilkan kata sandi"></button></div></div></div>
          <label class="auth-remember" style="--fi:2"><input type="checkbox" id="liRemember">Ingatkan di perangkat ini</label>
        </div>
        <button class="btn primary auth-submit" id="btnLogin">Masuk</button>
        <div class="auth-switch">Belum punya akun? <button type="button" id="toRegister">Daftar di sini</button></div>
      </div>

      <!-- ===== PANEL DAFTAR ===== -->
      <div class="auth-panel" id="panelRegister">
        <div class="eyebrow">Daftar</div>
        <h1>Buat akun baru</h1>
        <div class="sub">Datamu otomatis tercatat sebagai anggota dan langsung muncul di daftar Anggota admin.</div>
        <div class="auth-err" id="regErr"></div>
        <div class="auth-fields">
          <div style="--fi:0"><label>Nama Lengkap</label><div class="field-ico-wrap"><svg class="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c1.2-4 4.2-6 7.5-6s6.3 2 7.5 6" stroke-linecap="round"/></svg><input class="field" id="reNama" placeholder="cth. Siti Rahma"></div></div>
          <div style="--fi:1"><label>Username</label><div class="field-ico-wrap"><svg class="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3z" stroke-linejoin="round"/></svg><input class="field" id="reUsername" type="text" placeholder="cth. siti_rahma"></div></div>
          <div style="--fi:2"><label>Kata Sandi</label><div class="field-ico-wrap"><svg class="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="9.5" rx="2.3"/><path d="M8 10.5V7.8a4 4 0 018 0v2.7" stroke-linecap="round"/></svg><div class="pass-wrap"><input class="field" id="rePass" type="password" placeholder="Minimal 6 karakter"><button type="button" class="pass-toggle" data-toggle-pass="rePass" aria-label="Tampilkan kata sandi"></button></div></div></div>
          <div style="--fi:3"><label>Ulangi Kata Sandi</label><div class="field-ico-wrap"><svg class="field-ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4.5" y="10.5" width="15" height="9.5" rx="2.3"/><path d="M8 10.5V7.8a4 4 0 018 0v2.7" stroke-linecap="round"/></svg><div class="pass-wrap"><input class="field" id="rePass2" type="password" placeholder="Ulangi kata sandi"><button type="button" class="pass-toggle" data-toggle-pass="rePass2" aria-label="Tampilkan kata sandi"></button></div></div></div>
          <div style="--fi:4"><label>Alamat <span style="font-weight:600;opacity:.65;"></span></label><input class="field" id="reAlamat" placeholder="cth. Jl. Merdeka No. 12, Muara Enim"></div>
          <div style="--fi:5"><label>No. HP <span style="font-weight:600;opacity:.65;"></span></label><input class="field" id="reHp" inputmode="tel" placeholder="cth. 0812xxxxxxx"></div>
        </div>
        <button class="btn primary auth-submit" id="btnRegister">Daftar</button>
        <div class="auth-switch">Sudah punya akun? <button type="button" id="toLogin">Masuk di sini</button></div>
      </div>
    </div>
  </div>
 </div>
</div>

<div class="app" id="appRoot">
  <!-- ===== SIDEBAR ===== -->
  <aside class="sidebar" id="sidebar">
    <div class="logo">
      <div class="mark">Am</div>
      <span>Aliyah's Money</span>
      <button type="button" class="sidebar-close" id="sidebarClose" title="Tutup menu" aria-label="Tutup menu">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18" stroke-linecap="round"/></svg>
      </button>
    </div>
    <div class="navlabel">Menu</div>
    <nav class="navlist" id="navTabs">
      <button data-view="dashboard" class="active">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="16" width="7" height="5" rx="2"/></svg>
        Dashboard
      </button>
      <button data-view="anggota">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c1-3.5 3.6-5.5 5.5-5.5s4.5 2 5.5 5.5" stroke-linecap="round"/><path d="M16 4.5c1.6.4 2.8 1.9 2.8 3.6 0 1.7-1.2 3.2-2.8 3.6M18.5 14.8c1.8.6 3 2.3 3.5 4.7" stroke-linecap="round"/></svg>
        Anggota
      <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="subnav" data-subnav="anggota"><button type="button" class="subnav-btn" data-go="anggota" data-sub="data">Data Anggota</button><button type="button" class="subnav-btn only-admin" data-go="anggota" data-sub="tambah">Tambah Anggota <span class="badge-mini" id="pendingAkunBadge2" style="display:none;">0</span></button><button type="button" class="subnav-btn" data-go="anggota" data-sub="detail">Detail Anggota</button></div>
      <button data-view="pinjaman">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 6h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Pinjaman
        <span class="badge-mini" id="loanBadge" style="display:none;">0</span>
      <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="subnav" data-subnav="pinjaman"><button type="button" class="subnav-btn" data-go="pinjaman" data-sub="pengajuan">Pengajuan Pinjaman</button><button type="button" class="subnav-btn" data-go="pinjaman" data-sub="data">Data Pinjaman</button><button type="button" class="subnav-btn" data-go="pinjaman" data-sub="aktif">Pinjaman Aktif</button><button type="button" class="subnav-btn" data-go="pinjaman" data-sub="selesai">Pinjaman Selesai</button></div>
      <button data-view="pembayaran">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18" stroke-linecap="round"/><path d="M7 15h4" stroke-linecap="round"/></svg>
        Pembayaran
      <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="subnav" data-subnav="pembayaran"><button type="button" class="subnav-btn" data-go="pembayaran" data-sub="riwayat">Riwayat Pembayaran</button><span class="subnav-label">Metode Pembayaran</span><button type="button" class="subnav-btn" data-go="pembayaran" data-sub="rekening" style="padding-left:20px;">Transfer Rekening</button><button type="button" class="subnav-btn" data-go="pembayaran" data-sub="va" style="padding-left:20px;">Virtual Account</button><button type="button" class="subnav-btn" data-go="pembayaran" data-sub="qris" style="padding-left:20px;">QRIS</button></div>
      <button data-view="cicilan">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h13l-3-3M20 17H7l3 3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Riwayat Cicilan
      <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="subnav" data-subnav="cicilan"><button type="button" class="subnav-btn" data-go="cicilan" data-sub="semua">Semua Riwayat Cicilan</button><button type="button" class="subnav-btn" data-go="cicilan" data-sub="dibayar">Cicilan Sudah Dibayar</button><button type="button" class="subnav-btn" data-go="cicilan" data-sub="belum">Cicilan Belum Dibayar</button></div>
      <button data-view="laporan">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Laporan
      <svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      <div class="subnav" data-subnav="laporan"><button type="button" class="subnav-btn" data-go="laporan" data-sub="anggota">Laporan Anggota</button><button type="button" class="subnav-btn" data-go="laporan" data-sub="pinjaman">Laporan Pinjaman</button><button type="button" class="subnav-btn" data-go="laporan" data-sub="pembayaran">Laporan Pembayaran</button><button type="button" class="subnav-btn" data-go="laporan" data-sub="cicilan">Laporan Cicilan</button></div>
    </nav>
    <div class="navlabel">Umum</div>
    <nav class="navlist" id="navSecondary">
      <button type="button" data-view="pengaturan"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.5 1h.1a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>Pengaturan</button>
      <button type="button" data-view="privasi"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3z" stroke-linejoin="round"/></svg>Kebijakan Privasi</button>
      <button type="button" data-view="bantuan"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.8-2.3 2-2.3 3.6" stroke-linecap="round"/><circle cx="12" cy="16.5" r=".6" fill="currentColor"/></svg>Bantuan</button>
      <button type="button" id="btnLogout"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4H8a2 2 0 00-2 2v12a2 2 0 002 2h7" stroke-linecap="round"/><path d="M18 15l3-3-3-3M21 12h-11" stroke-linecap="round" stroke-linejoin="round"/></svg>Keluar</button>
    </nav>

    <div class="promo-card tilt">
      <h4>Cadangkan Data Anda Di sini!</h4>
      <p></p>
      <button type="button" id="promoBackup">Buka Pengaturan</button>
    </div>
  </aside>

  <!-- ===== KONTEN UTAMA ===== -->
  <div class="main" id="mainContent">
    <div class="topbar">
      <button class="menu-btn" id="menuBtn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18" stroke-linecap="round"/></svg>
      </button>
      <div class="search" id="searchWrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
        <input id="globalSearch" placeholder="Cari anggota atau pinjaman...">
        <span class="kbd">⌘F</span>
        <div class="search-results" id="searchResults"></div>
      </div>
      <div class="top-right">
        <button class="icon-btn" id="refreshBtn" title="Muat ulang data" aria-label="Muat ulang data">
          <svg class="ri-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-3-6.7" stroke-linecap="round"/><path d="M21 4v5h-5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg class="ri-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="icon-btn" id="themeToggleBtn" title="Ganti tampilan gelap/terang">
          <svg id="themeIconSun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" stroke-linecap="round"/></svg>
          <svg id="themeIconMoon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><path d="M20.5 14.5A8.5 8.5 0 1110 3.2a7 7 0 0010.5 11.3z" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <div class="scope-wrap" id="adminScopeWrap" style="display:none;">
          <select class="field scope-select" id="adminScopeSelect" title="Cakupan data yang ditampilkan">
            <option value="semua">Pantau Semua Akun</option>
          </select>
        </div>
        <div class="notif-wrap" id="notifWrap">
          <button class="icon-btn" id="notifBtn" title="Notifikasi"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 18a2.5 2.5 0 005 0" stroke-linecap="round"/></svg><span class="dot" id="notifDot" style="display:none;"></span></button>
          <div class="notif-panel" id="notifPanel">
            <div class="notif-head">Notifikasi</div>
            <div class="notif-list" id="notifList"></div>
          </div>
        </div>
        <div class="user">
          <div class="av" id="adminAv">AK</div>
          <div>
            <div class="name">Admin</div>
            <div class="mail">admin</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== DASHBOARD ===== -->
    <section class="view active" data-view="dashboard">
      <div class="page-head">
        <div>
          <h1 id="pgTitleDashboard">Dashboard</h1>
          <p id="pgSubDashboard">Ringkasan data anggota, pinjaman, dan pembayaran.</p>
        </div>
      </div>

      <!-- ===== BANNER KOPERASI ===== -->
      <div class="hero-banner" id="heroBanner">
        <img src="img/banner-koperasi.webp?v=4" alt="Aliyah's Money — Koperasi Simpan Pinjam &amp; Sejahtera" draggable="false">
        <span class="hb-shine"></span>
      </div>

      <div class="stat-row">
        <div class="stat-card tilt">
          <div class="stat-top"><span>Total Anggota</span><div class="arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
          <div class="stat-val" id="stAnggota">0</div>
          <div class="stat-foot up"><span class="chip">Aktif</span> seluruh anggota terdaftar</div>
        </div>
        <div class="stat-card tilt">
          <div class="stat-top"><span>Pinjaman Berjalan</span><div class="arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
          <div class="stat-val mono" id="stPinjaman">Rp 0</div>
          <div class="stat-foot" id="stPinjamanCount">0 pinjaman berjalan</div>
        </div>
        <div class="stat-card tilt">
          <div class="stat-top"><span>Total Pembayaran</span><div class="arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
          <div class="stat-val mono" id="stPembayaran">Rp 0</div>
          <div class="stat-foot up"><span class="chip">↑</span> akumulasi seluruh jumlah_bayar</div>
        </div>
        <div class="stat-card tilt">
          <div class="stat-top"><span>Pinjaman Lunas</span><div class="arrow"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 17L17 7M7 7h10v10" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div>
          <div class="stat-val" id="stLunas">0</div>
          <div class="stat-foot">pinjaman berstatus lunas</div>
        </div>
      </div>

      <div class="grid3">
        <!-- grafik -->
        <div class="card tilt">
          <div class="card-head"><h3>Aktivitas Pembayaran</h3>
            <select class="field pillbtn-select" id="chartPeriodSelect" title="Rentang aktivitas pembayaran">
              <option value="7">7 hari terakhir</option>
              <option value="10">10 hari terakhir</option>
              <option value="14">14 hari terakhir</option>
              <option value="30">30 hari terakhir</option>
            </select>
          </div>
          <div class="chart" id="chartBars"></div>
        </div>
        <!-- pengingat -->
        <div class="card tilt due-card" id="reminderCard">
          <div class="card-head"><h3>Pengingat Pinjaman</h3></div>
          <span class="reminder-tag" id="reminderTag">Perlu Perhatian</span>
          <p class="reminder-title" id="reminderTitle">Belum ada pinjaman berjalan</p>
          <div class="reminder-time" id="reminderTime"></div>
          <button class="btn primary" id="btnReminder" style="width:100%;justify-content:center;">Lihat Pinjaman</button>
        </div>
        <!-- aktivitas terbaru & kas -->
        <div class="col-right">
          <div class="card tilt">
            <div class="card-head"><h3 id="cardTitleAktivitas">Aktivitas Terbaru</h3><button class="btn small outline" id="viewAllTx">Lihat semua</button></div>
            <div id="dashTxList"></div>
          </div>
          <div class="kas-card tilt">
            <div class="lbl">Pembayaran Diterima Hari Ini</div>
            <div class="val mono" id="kasHariIni">Rp 0</div>
            <div class="kas-actions">
              <button class="primary" title="Catat pembayaran" id="kasAdd"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg></button>
              <button title="Lihat pembayaran" id="kasView"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="2.5"/></svg></button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid3">
        <!-- daftar anggota -->
        <div class="card tilt">
          <div class="card-head"><h3>Anggota Terbaru</h3></div>
          <div id="memberList"></div>
        </div>
        <!-- donut progres -->
        <div class="card tilt">
          <div class="card-head"><h3>Progres Pelunasan</h3></div>
          <div class="donut-wrap">
            <div class="donut" id="donut"><div class="hole"><b id="donutPct">0%</b><span>Terbayar</span></div></div>
            <div class="legend">
              <div class="row"><span class="dotc" style="background:var(--dark)"></span>Terbayar<b id="legDone">Rp 0</b></div>
              <div class="row"><span class="dotc" style="background:var(--green-soft)"></span>Total Pinjaman<b id="legTarget">Rp 0</b></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== ANGGOTA ===== -->
    <section class="view" data-view="anggota">
      <div class="page-head">
        <div><div class="crumb" id="crumbAnggota"></div><h1 id="pgTitleAnggota">Anggota</h1></div>
        <div class="head-actions only-admin"><button class="btn primary" id="btnAddAnggota2">+ Tambah Anggota <span class="badge-mini" id="pendingAkunBadge" style="display:none;margin-left:6px;">0</span></button></div>
      </div>
      <div class="card tilt" data-subpanel="data">
        <table>
          <thead><tr><th>id_anggota</th><th>nama</th><th>alamat</th><th>no_hp</th><th>tanggal_gabung</th><th></th></tr></thead>
          <tbody id="anggotaBody"></tbody>
        </table>
      </div>
      <div class="card tilt" data-subpanel="detail" id="anggotaDetailCard" style="display:none;">
        <div class="card-head"><h3>Detail Anggota</h3></div>
        <select class="field" id="detailAnggotaSelect" style="max-width:340px;margin-bottom:14px;"></select>
        <div id="detailAnggotaBody"></div>
      </div>
    </section>

    <!-- ===== PINJAMAN ===== -->
    <section class="view" data-view="pinjaman">
      <div class="page-head">
        <div><div class="crumb" id="crumbPinjaman"></div><h1 id="pgTitlePinjaman">Pinjaman</h1></div>
        <div class="head-actions"><button class="btn primary" id="btnAddPinjaman2">+ Pinjaman</button></div>
      </div>
      <div class="card tilt">
        <table>
          <thead><tr><th>id_pinjaman</th><th>id_anggota</th><th>tanggal_pinjaman</th><th style="text-align:right">jumlah_pinjaman</th><th>tenor</th><th>bunga</th><th style="text-align:right">total_pinjaman</th><th>status</th><th></th></tr></thead>
          <tbody id="pinjamanBody"></tbody>
        </table>
      </div>
    </section>

    <!-- ===== PEMBAYARAN ===== -->
    <section class="view" data-view="pembayaran">
      <div class="page-head">
        <div><div class="crumb" id="crumbPembayaran"></div><h1 id="pgTitlePembayaran">Pembayaran</h1></div>
        <div class="head-actions"><button class="btn primary" id="btnAddPembayaran">+ Catat Pembayaran</button></div>
      </div>
      <div class="card tilt" data-subpanel="riwayat">
        <table>
          <thead><tr><th>id_pembayaran</th><th>tanggal_bayar</th><th>id_pinjaman</th><th>anggota</th><th>cicilan_ke</th><th>metode</th><th style="text-align:right">jumlah_bayar</th><th style="text-align:right">denda</th><th style="text-align:right">sisa_pinjaman</th><th>bukti</th></tr></thead>
          <tbody id="pembayaranBody"></tbody>
        </table>
      </div>

      <div class="card tilt" style="margin-top:16px;" data-subpanel="rekening va qris" id="metodeCard">
        <div class="card-head"><h3 id="cardTitleMetode">Metode Pembayaran</h3></div>
        <div id="metodeNote" class="reminder-time" style="margin:-6px 0 12px;"></div>
        <div id="qrisAdminWrap" style="display:none;margin-bottom:14px;padding:12px;border:1px dashed var(--line);border-radius:12px;">
          <label style="display:block;margin-bottom:8px;font-weight:800;font-size:12.5px;">Foto QRIS Resmi (dikelola Admin — berlaku untuk seluruh anggota yang memilih QRIS)</label>
          <label class="bukti-upload" for="qrisAdminInput" id="qrisAdminUploadWrap" style="max-width:160px;">
            <img id="qrisAdminPreview" style="display:none;">
            <span id="qrisAdminPlaceholder">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="10.5" r="1.6"/><path d="M21 16l-5.2-5.2a2 2 0 00-2.8 0L6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span>Ketuk untuk unggah QRIS</span>
            </span>
          </label>
          <input type="file" id="qrisAdminInput" accept="image/*" style="display:none;">
          <button type="button" class="link-btn danger" id="qrisAdminHapus" style="display:none;margin-top:6px;">Hapus foto QRIS</button>
        </div>
        <table>
          <thead id="metodeHead"></thead>
          <tbody id="metodeBody"></tbody>
        </table>
      </div>
    </section>

    <!-- ===== CICILAN ANGGOTA ===== -->
    <section class="view" data-view="cicilan">
      <div class="page-head">
        <div><div class="crumb" id="crumbCicilan"></div><h1 id="pgTitleCicilan">Riwayat Cicilan Anggota</h1></div>
      </div>
      <div class="card tilt">
        <table>
          <thead id="cicilanHead"></thead>
          <tbody id="cicilanBody"></tbody>
        </table>
      </div>
    </section>

    <!-- ===== LAPORAN ===== -->
    <section class="view" data-view="laporan">
      <div class="page-head">
        <div><div class="crumb" id="crumbLaporan"></div><h1 id="pgTitleLaporan">Laporan</h1></div>
        <div class="head-actions"><button class="btn primary" id="btnCetakLaporan">🖨️ Cetak / Unduh PDF</button></div>
      </div>

      <div class="card tilt" style="margin-bottom:16px;">
        <div class="card-head"><h3>Filter Periode</h3></div>
        <div class="field-row" style="align-items:flex-end;">
          <div><label>Jenis Laporan</label>
            <select class="field" id="lapJenis">
              <option value="harian">Harian</option>
              <option value="bulanan" selected>Bulanan</option>
              <option value="tahunan">Tahunan</option>
            </select>
          </div>
          <div><label id="lapNilaiLabel">Bulan</label><input class="field" id="lapNilai" type="month"></div>
        </div>
      </div>

      <div class="stat-row">
        <div class="stat-card tilt">
          <div class="stat-top"><span>Pinjaman Dicairkan</span></div>
          <div class="stat-val mono" id="lapCair">Rp 0</div>
          <div class="stat-foot" id="lapCairCount">0 pinjaman</div>
        </div>
        <div class="stat-card tilt">
          <div class="stat-top"><span>Pembayaran Diterima</span></div>
          <div class="stat-val mono" id="lapMasuk">Rp 0</div>
          <div class="stat-foot" id="lapMasukCount">0 transaksi</div>
        </div>
        <div class="stat-card tilt">
          <div class="stat-top"><span>Total Transaksi</span></div>
          <div class="stat-val" id="lapTransaksi">0</div>
          <div class="stat-foot">pencairan + pembayaran</div>
        </div>
        <div class="stat-card tilt">
          <div class="stat-top"><span>Pinjaman Lunas</span></div>
          <div class="stat-val" id="lapLunas">0</div>
          <div class="stat-foot">lunas pada periode ini</div>
        </div>
      </div>

      <div class="card tilt">
        <div class="card-head"><h3><span id="lapJudul">Detail</span> — <span id="lapPeriodeLabel"></span></h3></div>
        <table>
          <thead id="lapHead"></thead>
          <tbody id="lapBody"></tbody>
        </table>
      </div>

      <div class="card tilt" style="margin-top:16px;" id="lapBuktiCard">
        <div class="card-head"><h3>Bukti Pembayaran (Foto)</h3></div>
        <p class="sub" style="margin:-4px 0 12px;font-size:12px;">Foto/tangkapan layar bukti transfer yang diunggah pada periode ini. Cetakan PDF laporan bisa diunduh Admin lewat tombol di atas dan berlaku untuk seluruh anggota.</p>
        <div id="lapBukti" style="display:flex;flex-wrap:wrap;gap:10px;"></div>
      </div>
    </section>
    <section class="view" data-view="pengaturan">
      <div class="page-head">
        <div><h1 id="pgTitlePengaturan">Pengaturan</h1><p id="pgSubPengaturan">Kelola profil, preferensi, dan keamanan akun.</p></div>
      </div>
      <div class="settings-grid">
        <div>
          <div class="card tilt">
            <div class="card-head"><h3>Profil Akun</h3></div>
            <div class="settings-avrow">
              <label class="avbig-wrap" for="setFotoInput" title="Ubah foto profil">
                <div class="avbig" id="setAv">AK</div>
                <span class="avbig-edit"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M12 20h9" stroke-linecap="round"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
              </label>
              <input type="file" id="setFotoInput" accept="image/*" style="display:none;">
              <div>
                <div class="name" id="setDisplayName">Admin</div>
                <div class="avbig-actions">
                  <button type="button" class="link-btn" id="btnUbahFoto">Ubah foto</button>
                  <button type="button" class="link-btn danger" id="btnHapusFoto" style="display:none;">Hapus foto</button>
                </div>
              </div>
            </div>
            <div class="field-row">
              <div><label>Username</label><input class="field" id="setUsername" placeholder="Username"></div>
            </div>
            <div style="margin-top:10px;display:flex;justify-content:flex-end;">
              <button class="btn outline" id="btnGantiUsername">Simpan Username</button>
            </div>
          </div>

          <div class="card tilt" id="memberInfoCard" style="margin-top:16px;display:none;">
            <div class="card-head"><h3>Informasi Keanggotaan</h3></div>
            <div class="kv-grid">
              <div class="kv"><label>No. Anggota</label><div id="miNoAnggota">—</div></div>
              <div class="kv"><label>Bergabung</label><div id="miBergabung">—</div></div>
              <div class="kv"><label>Status</label><div id="miStatus">—</div></div>
              <div class="kv"><label>Total Pinjaman</label><div id="miTotalPinjaman">Rp 0</div></div>
            </div>
          </div>

          <div class="card tilt" style="margin-top:16px;">
            <div class="card-head"><h3>Keamanan</h3></div>
            <div class="field-row">
              <div><label>Kata Sandi Baru</label><div class="pass-wrap"><input class="field" id="setPassBaru" type="password" placeholder="Minimal 6 karakter"><button type="button" class="pass-toggle" data-toggle-pass="setPassBaru" aria-label="Tampilkan kata sandi"></button></div></div>
              <div><label>Konfirmasi Kata Sandi</label><div class="pass-wrap"><input class="field" id="setPassKonfirmasi" type="password" placeholder="Ulangi kata sandi"><button type="button" class="pass-toggle" data-toggle-pass="setPassKonfirmasi" aria-label="Tampilkan kata sandi"></button></div></div>
            </div>
            <div style="margin-top:16px;display:flex;justify-content:flex-end;">
              <button class="btn outline" id="btnGantiPassword">Ganti Kata Sandi</button>
            </div>
            <div class="settings-sub">Perangkat yang Sedang Login</div>
            <div id="loginHistoryList"></div>
          </div>

          <div class="card tilt" style="margin-top:16px;">
            <div class="card-head"><h3>Cadangkan &amp; Pulihkan Data</h3></div>
            <div class="toggle-row">
              <div class="info"><div class="t">Unduh Cadangan</div><div class="s">Simpan salinan seluruh tabel Aliyah's Money (.json) ke perangkat Anda</div></div>
              <button class="btn outline" id="btnExportData">Unduh</button>
            </div>
            <div class="toggle-row">
              <div class="info"><div class="t">Pulihkan dari File</div><div class="s">Impor data dari file cadangan sebelumnya</div></div>
              <label class="btn outline" for="importFile" style="cursor:pointer;">Pilih File</label>
              <input type="file" id="importFile" accept="application/json" style="display:none;">
            </div>
          </div>

        </div>

        <div>
          <div class="card tilt">
            <div class="card-head"><h3>Preferensi</h3></div>
            <div class="toggle-row">
              <div><label style="display:block;margin-bottom:6px;">Ukuran Teks</label>
                <select class="field" id="setUkuranTeks" style="max-width:140px;">
                  <option value="kecil">Kecil</option>
                  <option value="sedang" selected>Sedang</option>
                  <option value="besar">Besar</option>
                </select>
              </div>
            </div>
            <div class="toggle-row">
              <div class="info"><div class="t">Pengingat Pinjaman</div><div class="s">Notifikasi pinjaman yang perlu perhatian</div></div>
              <div class="switch on" data-toggle="notifAngsuran"></div>
            </div>
            <div class="toggle-row">
              <div class="info"><div class="t">Pengingat Jatuh Tempo</div><div class="s">Beri tahu cicilan yang mendekati/lewat jatuh tempo</div></div>
              <div class="switch on" data-toggle="notifJatuhTempo"></div>
            </div>
            <div class="toggle-row">
              <div><label style="display:block;margin-bottom:6px;">Ingatkan berapa hari sebelum jatuh tempo (maks. 3 hari, cth. H-1)</label>
                <input class="field" id="setHariJatuhTempo" type="number" min="0" max="3" style="max-width:100px;" placeholder="cth. 1"></div>
            </div>
            <div class="toggle-row">
              <div class="info"><div class="t">Notifikasi Pembayaran</div><div class="s">Beri tahu setiap ada pembayaran baru</div></div>
              <div class="switch on" data-toggle="notifTransaksi"></div>
            </div>
            <div class="toggle-row">
              <div class="info"><div class="t">Denda Keterlambatan</div><div class="s">Kenakan denda otomatis untuk cicilan yang lewat jatuh tempo</div></div>
              <div class="switch on" data-toggle="dendaAktif"></div>
            </div>
            <div class="toggle-row" id="dendaPersenRow">
              <div><label style="display:block;margin-bottom:6px;">Denda per hari keterlambatan (%)</label>
                <input class="field" id="setDendaPersen" type="number" min="0" max="100" step="0.1" style="max-width:100px;" placeholder="cth. 0.5" disabled>
                <div class="reminder-time" id="dendaPersenNote" style="margin-top:4px;">Nilai ini hanya bisa dilihat — hanya Admin yang dapat mengubah persentase denda, sudah ditetapkan di sistem.</div>
              </div>
            </div>
            <div class="toggle-row" id="bungaPersenRow">
              <div><label style="display:block;margin-bottom:6px;">Suku Bunga Pinjaman (%)</label>
                <input class="field" id="setBungaPersen" type="number" min="0" max="100" step="0.1" style="max-width:100px;" placeholder="cth. 5" disabled>
                <div class="reminder-time" id="bungaPersenNote" style="margin-top:4px;">Nilai ini hanya bisa dilihat — hanya Admin yang dapat mengubah suku bunga, sudah ditetapkan di sistem.</div>
              </div>
            </div>
          </div>

          <div class="card tilt only-user" style="margin-top:16px;">
            <div class="card-head"><h3>Zona Berbahaya</h3></div>
            <div class="danger-row">
              <div>
                <div class="t">Hapus Semua Data Saya</div>
                <div class="s">Hanya menghapus data anggota, pinjaman &amp; pembayaran milik akun Anda sendiri — akun/anggota lain tidak terpengaruh. Tindakan ini tidak dapat dibatalkan.</div>
              </div>
              <button class="btn danger" id="btnResetData">Hapus</button>
            </div>
            <div class="danger-row" style="margin-top:10px;">
              <div>
                <div class="t">Hapus Akun</div>
                <div class="s">Akun Anda dihapus permanen dan Anda akan keluar. Data anggota &amp; pinjaman tidak ikut terhapus.</div>
              </div>
              <button class="btn danger" id="btnHapusAkun">Hapus Akun</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== KEBIJAKAN PRIVASI ===== -->
    <section class="view" data-view="privasi">
      <div class="page-head">
        <div><h1 id="pgTitlePrivasi">Kebijakan Privasi</h1><p id="pgSubPrivasi">Bagaimana Aliyah's Money mengumpulkan, menggunakan, dan melindungi data Anda.</p></div>
      </div>
      <div class="privacy-intro card tilt">
        <div class="privacy-intro-ico">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3.5v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9v-5L12 3z" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div>
          <div class="t">Data Anda, aman &amp; terkendali</div>
          <div class="s">Kami hanya menyimpan apa yang benar-benar diperlukan untuk mengelola pinjaman dan pembayaran koperasi — tidak lebih.</div>
        </div>
      </div>
      <div class="privacy-list">
        <div class="privacy-item card tilt">
          <div class="privacy-num">1</div>
          <div class="privacy-body">
            <div class="privacy-title">Data yang Kami Kumpulkan</div>
            <p>Kami mengumpulkan data yang Anda masukkan sendiri: nama, alamat, nomor HP, tanggal bergabung, data pinjaman, riwayat pembayaran, metode pembayaran, foto profil, dan foto bukti transfer/QRIS yang diunggah.</p>
          </div>
        </div>
        <div class="privacy-item card tilt">
          <div class="privacy-num">2</div>
          <div class="privacy-body">
            <div class="privacy-title">Penggunaan Data</div>
            <p>Data digunakan semata-mata untuk mengelola pencatatan pinjaman dan pembayaran anggota, menghitung denda/bunga, menampilkan riwayat cicilan, serta menyusun laporan periode. Kami tidak menjual atau membagikan data Anda ke pihak ketiga untuk kepentingan iklan.</p>
          </div>
        </div>
        <div class="privacy-item card tilt">
          <div class="privacy-num">3</div>
          <div class="privacy-body">
            <div class="privacy-title">Penyimpanan &amp; Keamanan</div>
            <p>Data disimpan di server/database aplikasi ini dan dilindungi dengan kata sandi terenkripsi (hash). Foto bukti pembayaran dan QRIS hanya dapat dilihat oleh Admin dan anggota pemilik data tersebut.</p>
          </div>
        </div>
        <div class="privacy-item card tilt">
          <div class="privacy-num">4</div>
          <div class="privacy-body">
            <div class="privacy-title">Hak Pengguna</div>
            <p>Anda berhak melihat, memperbarui, mengunduh cadangan, atau menghapus data anggota, pinjaman, dan pembayaran milik akun Anda sendiri melalui menu Pengaturan. Penghapusan akun tidak otomatis menghapus data tersebut, demi keperluan pembukuan.</p>
          </div>
        </div>
        <div class="privacy-item card tilt">
          <div class="privacy-num">5</div>
          <div class="privacy-body">
            <div class="privacy-title">Kontak</div>
            <p>Pertanyaan seputar privasi dapat disampaikan melalui menu Bantuan.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== BANTUAN ===== -->
    <section class="view" data-view="bantuan">
      <div class="page-head">
        <div><h1 id="pgTitleBantuan">Butuh Bantuan?</h1><p id="pgSubBantuan">Cari jawaban atau hubungi tim dukungan kami.</p></div>
      </div>

      <div class="help-hero">
        <h2>Ada yang bisa kami bantu?</h2>
        <p>Cari topik seputar anggota, pinjaman, pembayaran, atau cicilan di bawah ini.</p>
        <div class="help-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
          <input id="faqSearch" placeholder="Ketik pertanyaan Anda...">
        </div>
      </div>

      <div class="help-grid">
        <div class="card tilt">
          <div class="card-head"><h3>Pertanyaan Umum</h3></div>
          <div id="faqList">
            <details class="faq" open>
              <summary>Bagaimana cara menambahkan anggota baru?</summary>
              <p>Buka menu Anggota, lalu klik "+ Tambah Anggota". Isi nama, alamat, nomor HP, dan tanggal bergabung, lalu simpan.</p>
            </details>
            <details class="faq">
              <summary>Bagaimana alur pinjaman sampai pembayaran?</summary>
              <p>Ajukan pinjaman di menu Pinjaman dengan mengisi jumlah pinjaman, tenor, dan bunga. Total pinjaman dihitung otomatis. Setiap kali anggota membayar, catat di menu Pembayaran (tabel PEMBAYARAN) — sisa pinjaman akan berkurang otomatis hingga lunas.</p>
            </details>
            <details class="faq">
              <summary>Apa itu Riwayat Cicilan Anggota?</summary>
              <p>Ini adalah relasi turunan / view opsional (cicilan_anggota) yang menggabungkan data ANGGOTA, PINJAMAN, dan PEMBAYARAN, sehingga riwayat cicilan per anggota mudah dilihat dalam satu tabel.</p>
            </details>
            <details class="faq">
              <summary>Bagaimana total_pinjaman dan sisa_pinjaman dihitung?</summary>
              <p>total_pinjaman = jumlah_pinjaman ditambah bunga flat sesuai persentase yang diisi saat pengajuan. sisa_pinjaman berkurang setiap kali jumlah_bayar dicatat pada menu Pembayaran, hingga mencapai nol dan status pinjaman menjadi "lunas".</p>
            </details>
            <details class="faq">
              <summary>Apakah data tersimpan otomatis?</summary>
              <p>Ya. Setiap perubahan pada anggota, pinjaman, dan pembayaran otomatis tersimpan secara real-time.</p>
            </details>
          </div>
        </div>

        <div class="card tilt">
          <div class="card-head"><h3>Hubungi Kami</h3></div>
          <a class="contact-item" href="https://wa.me/6281253113500" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;">
            <div class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5.5a2 2 0 012-2h2.2a1 1 0 011 .8l.8 3.5a1 1 0 01-.5 1.1l-1.6.9a13 13 0 006.3 6.3l.9-1.6a1 1 0 011.1-.5l3.5.8a1 1 0 01.8 1V19a2 2 0 01-2 2h-1C9.4 21 3 14.6 3 6.5v-1z"/></svg></div>
            <div><div class="t">WhatsApp Support</div><div class="s">0812-5311-3500</div></div>
            <div class="go">›</div>
          </a>
          <a class="contact-item" href="mailto:bantuan@aliyahsmoney.id" style="text-decoration:none;color:inherit;">
            <div class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div><div class="t">Email Dukungan</div><div class="s">bantuan@aliyahsmoney.id</div></div>
            <div class="go">›</div>
          </a>
          <div class="contact-item">
            <div class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div><div class="t">Jam Operasional</div><div class="s">Senin–Jumat, 08.00–17.00</div></div>
            <div class="go">›</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>

<!-- ===== MODAL ===== -->
<div class="overlay" id="ovAnggota"><div class="modal">
  <div class="modal-head"><h3 id="anggotaModalTitle">Tambah Anggota</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="tab-switch only-admin" id="anggotaTabs">
    <button type="button" class="active" data-tab="otomatis">Otomatis dari akun <span class="badge-mini" id="tabOtoCount" style="display:none;">0</span></button>
    <button type="button" data-tab="manual">Manual</button>
  </div>
  <div class="modal-body only-admin" id="paneOtomatis">
    <p class="sub" style="margin:0;font-size:12.5px;">Akun yang mendaftar lewat web User otomatis masuk ke daftar Anggota. Pilih di sini bila ada akun yang belum tercatat sebagai anggota.</p>
    <div id="pendingAkunList" class="pending-list"></div>
  </div>
  <div class="modal-body" id="paneManual">
    <div><label>Nama Lengkap (nama)</label><input class="field" id="fNama" placeholder="cth. Siti Rahma"></div>
    <div><label>Alamat (alamat)</label><input class="field" id="fAlamat" placeholder="cth. Jl. Merdeka No. 12, Muara Enim"></div>
    <div class="field-row">
      <div><label>No. HP (no_hp)</label><input class="field" id="fHp" placeholder="cth. 0812xxxxxxx"></div>
      <div><label>Tanggal Gabung (tanggal_gabung)</label><input class="field" id="fTanggalGabung" type="date"></div>
    </div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Batal</button>
    <button class="btn primary only-admin" id="adoptAnggota">Tambahkan yang dipilih</button>
    <button class="btn primary" id="saveAnggota">Simpan</button></div>
</div></div>

<div class="overlay" id="ovHapusAkun"><div class="modal">
  <div class="modal-head"><h3>Hapus Akun</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="modal-body">
    <p class="sub" style="margin:0;font-size:13px;">Akun Anda akan dihapus permanen dan tidak bisa dipulihkan. Masukkan kata sandi untuk melanjutkan.</p>
    <div><label>Kata Sandi</label><div class="pass-wrap"><input class="field" id="hapusAkunPass" type="password" placeholder="Kata sandi akun Anda"><button type="button" class="pass-toggle" data-toggle-pass="hapusAkunPass" aria-label="Tampilkan kata sandi"></button></div></div>
    <div class="reminder-time" id="hapusAkunErr" style="margin:0;color:#FCA5A5;display:none;"></div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Batal</button><button class="btn danger" id="konfirmHapusAkun">Hapus Akun</button></div>
</div></div>

<div class="overlay" id="ovMetode"><div class="modal">
  <div class="modal-head"><h3>Atur Metode Pembayaran</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="modal-body">
    <div><label>Anggota</label><div class="field" id="fMetodeAnggota" style="display:flex;align-items:center;opacity:.9;"></div></div>
    <div>
      <label>Metode Pembayaran (metode_pembayaran)</label>
      <select class="field" id="fMetode" style="display:none;" tabindex="-1" aria-hidden="true">
        <option value="rekening">Transfer Rekening Bank</option>
        <option value="va">Virtual Account</option>
        <option value="qris">QRIS</option>
      </select>
      <div class="metode-cards" id="metodeCards" role="radiogroup" aria-label="Metode pembayaran">
        <span class="metode-slider"></span>
        <button type="button" class="metode-card" data-metode="rekening" role="radio"><span class="mc-ico">🏦</span><b>Transfer</b><small>Rekening Bank</small></button>
        <button type="button" class="metode-card" data-metode="va" role="radio"><span class="mc-ico">💳</span><b>Virtual Account</b><small>VA</small></button>
        <button type="button" class="metode-card" data-metode="qris" role="radio"><span class="mc-ico">📱</span><b>QRIS</b><small>Scan kode</small></button>
      </div>
    </div>
    <div id="fNoRekeningWrap"><label id="fNoRekeningLabel">No. Rekening (no_rekening)</label><input class="field" id="fNoRekening" placeholder="cth. BCA 1234567890 a.n. Siti Rahma"></div>
    <div id="fQrisWrap" style="display:none;margin-top:10px;">
      <div class="reminder-time" style="margin:0;">Gambar QRIS ditetapkan oleh Admin dan berlaku untuk seluruh anggota yang memilih metode ini — Anda tidak perlu mengunggah foto QRIS sendiri.</div>
      <div id="fQrisAdminPreviewWrap" style="margin-top:8px;"><img id="fQrisAdminPreview" style="display:none;width:88px;height:88px;object-fit:cover;border-radius:8px;border:1px solid var(--line);"></div>
    </div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Batal</button><button class="btn primary" id="saveMetode">Simpan</button></div>
</div></div>

<div class="overlay" id="ovPinjaman"><div class="modal">
  <div class="modal-head"><h3>Ajukan Pinjaman</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="modal-body">
    <div><label>Anggota (id_anggota)</label><select class="field" id="pAnggota"></select></div>
    <div class="field-row">
      <div><label>Jumlah Pinjaman / Rp (jumlah_pinjaman)</label><input class="field" id="pJumlah" type="number" placeholder="cth. 2000000"></div>
      <div><label>Tenor (bulan)</label><input class="field" id="pTenor" type="number" placeholder="cth. 10"></div>
    </div>
    <div class="field-row">
      <div><label>Bunga / % (bunga)</label><input class="field" id="pBunga" type="number" step="0.1" placeholder="cth. 5">
        <div class="reminder-time" id="pBungaNote" style="margin-top:4px;display:none;">Suku bunga sudah ditetapkan Admin dan tidak bisa diubah di sini.</div></div>
      <div><label>Tanggal Pinjaman (tanggal_pinjaman)</label><input class="field" id="pTanggal" type="date">
        <div class="reminder-time" style="margin-top:4px;">Pilih manual — tidak otomatis mengikuti tanggal hari ini.</div></div>
    </div>
    <div><label>Alasan Peminjaman (alasan)</label><textarea class="field" id="pAlasan" rows="3" maxlength="255" style="resize:vertical;font-family:inherit;" placeholder="cth. Modal usaha, biaya sekolah, kebutuhan mendesak"></textarea>
      <div class="reminder-time" style="margin-top:4px;">Wajib diisi. Alasan ini akan dibaca Admin sebelum memberi persetujuan.</div></div>
    <div class="kv-grid" style="grid-template-columns:1fr;">
      <div class="kv"><label>total_pinjaman (dihitung otomatis)</label><div id="pTotalPreview">Rp 0</div></div>
    </div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Batal</button><button class="btn primary" id="savePinjaman">Simpan</button></div>
</div></div>

<div class="overlay" id="ovPinjamanDetail"><div class="modal" style="max-width:460px;">
  <div class="modal-head"><h3 id="pdTitle">Detail Pinjaman</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="modal-body">
    <div class="kv-grid" id="pdInfo"></div>
    <div class="step-track" id="pdSteps"></div>
    <div class="step-labels"><span>Diajukan</span><span>Berjalan</span><span>Lunas</span></div>
    <div id="pdActions" style="display:flex;gap:10px;"></div>
    <div class="settings-sub" style="margin:6px 0 0;">Riwayat Pembayaran (PEMBAYARAN)</div>
    <div id="pdSchedule"></div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Tutup</button></div>
</div></div>

<div class="overlay" id="ovPembayaran"><div class="modal">
  <div class="modal-head"><h3>Catat Pembayaran</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="modal-body">
    <div id="bPinjamanSelectWrap" style="display:none;">
      <label>Pilih Pinjaman (id_pinjaman)</label>
      <select class="field" id="bPinjamanSelect"></select>
    </div>
    <div id="pembayaranInfo" style="font-size:13px;color:var(--text-soft);"></div>
    <div><label>Cicilan Ke- (cicilan_ke)</label><input class="field" id="bKe" type="number" disabled></div>
    <div><label>Jumlah Bayar / Rp (jumlah_bayar)</label><input class="field" id="bNominal" type="number" placeholder="cth. 200000"></div>
    <div><label>Tanggal Bayar (tanggal_bayar)</label><input class="field" id="bTanggal" type="date"></div>
    <div id="bDendaRow"><label>Denda Keterlambatan / Rp (denda)</label><input class="field" id="bDenda" type="number" min="0" placeholder="0">
      <div class="reminder-time" id="bDendaNote" style="margin-top:4px;"></div>
      <button type="button" class="link-btn" id="bDendaReset" style="display:none;margin-top:4px;">Kembalikan ke denda otomatis</button>
    </div>
    <div class="kv-grid" style="grid-template-columns:1fr;">
      <div class="kv"><label>sisa_pinjaman setelah dibayar</label><div id="bSisaPreview">Rp 0</div></div>
    </div>
    <div id="bMetodeWrap" style="margin-top:4px;">
      <label>Metode Pembayaran <span style="color:var(--red);">* Wajib dipilih</span></label>
      <div class="metode-opts" id="bMetodeOpts">
        <button type="button" class="metode-opt" data-bmetode="rekening"><b>Transfer Rekening</b><small>Transfer bank</small></button>
        <button type="button" class="metode-opt" data-bmetode="va"><b>Virtual Account</b><small>Dana, GoPay, dll</small></button>
        <button type="button" class="metode-opt" data-bmetode="qris"><b>QRIS</b><small>Scan kode</small></button>
      </div>
      <div class="metode-step" id="bMetodeDetail" style="display:none;">
        <label id="bPilihLabel">Pilih Bank</label>
        <div class="bank-grid" id="bPilihGrid"></div>
        <div id="bNomorWrap" style="margin-top:10px;display:none;">
          <label id="bNomorLabel">Nomor Rekening</label>
          <input class="field" id="bNomor" inputmode="numeric" placeholder="Masukkan nomor">
        </div>
      </div>
      <div class="metode-step" id="bQrisWrap" style="display:none;">
        <label>Scan QRIS berikut</label>
        <img id="bQrisImg" alt="QRIS" style="display:none;width:100%;max-width:220px;border-radius:12px;border:1px solid var(--line);cursor:zoom-in;">
        <div class="reminder-time" id="bQrisNote" style="margin-top:6px;"></div>
      </div>
    </div>
    <div style="margin-top:4px;">
      <label>Bukti Pembayaran (foto/screenshot) <span style="color:var(--red);">* Wajib diisi</span></label>
      <label class="bukti-upload" for="bBuktiInput" id="bBuktiUploadWrap">
        <img id="bBuktiPreview" style="display:none;">
        <span id="bBuktiPlaceholder">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8.5" cy="10.5" r="1.6"/><path d="M21 16l-5.2-5.2a2 2 0 00-2.8 0L6 18" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Ketuk untuk unggah foto bukti transfer (wajib)</span>
        </span>
      </label>
      <input type="file" id="bBuktiInput" accept="image/*" style="display:none;">
      <button type="button" class="link-btn danger" id="bBuktiHapus" style="display:none;margin-top:6px;">Hapus foto</button>
      <div class="reminder-time" style="margin-top:4px;">Wajib unggah foto/tangkapan layar bukti transfer sebelum menyimpan pembayaran — bukan cetakan sistem.</div>
    </div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Batal</button><button class="btn primary" id="savePembayaran">Simpan</button></div>
</div></div>

<div class="overlay" id="ovCropFoto"><div class="modal" style="max-width:380px;">
  <div class="modal-head"><h3>Sesuaikan Foto Profil</h3><button class="modal-close" data-close>&times;</button></div>
  <div class="modal-body">
    <div class="crop-stage" id="cropStage">
      <img id="cropImg" alt="Pratinjau foto profil" draggable="false">
      <div class="crop-ring"></div>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg>
      <input type="range" id="cropZoom" min="100" max="300" value="100" style="flex:1;">
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/></svg>
    </div>
    <div class="reminder-time" style="margin-top:2px;">Geser foto untuk memposisikan, gunakan penggeser untuk memperbesar/memperkecil. 1 akun = 1 foto profil.</div>
  </div>
  <div class="modal-foot"><button class="btn outline" data-close>Batal</button><button class="btn primary" id="cropSave">Simpan Foto</button></div>
</div></div>

<div class="overlay" id="ovLightbox"><div class="lightbox-inner">
  <button class="modal-close" data-close style="position:absolute;top:-6px;right:-6px;background:var(--dark);color:#fff;border-radius:50%;width:30px;height:30px;">&times;</button>
  <img id="lightboxImg" alt="Bukti pembayaran">
</div></div>

<div class="view-loader" id="viewLoader" aria-hidden="true"><div class="vl-box"><span class="vl-ring"></span><span class="vl-mark">Am</span></div><div class="vl-label">Memuat…</div></div>
<div class="payfx" id="payFx" role="dialog" aria-modal="true" aria-label="Bukti pembayaran"></div>
<div class="ach-stack" id="achStack" aria-live="polite"></div>
<div class="toast" id="toast"></div>
<div id="printArea" class="print-area"></div>
<script src="js/script.js" defer></script>
</body>
</html>
