(function(){
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const todayISO = () => new Date().toISOString().slice(0,10);
  const diffDaysISO = (a,b) => Math.round((new Date(a+'T00:00:00Z') - new Date(b+'T00:00:00Z')) / 86400000);
  const uid = () => Math.random().toString(36).slice(2,9);
  const rupiah = n => 'Rp ' + Number(n||0).toLocaleString('id-ID');
  const fmtDate = d => d ? new Date(d).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'}) : '-';
  const initials = name => (name||'?').trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();

  // ===== RIPPLE TOMBOL =====
  document.addEventListener('pointerdown', e=>{
    const btn = e.target.closest('.btn, .icon-btn');
    if(!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'js-ripple';
    span.style.width = span.style.height = size+'px';
    span.style.left = (e.clientX - r.left - size/2)+'px';
    span.style.top = (e.clientY - r.top - size/2)+'px';
    btn.appendChild(span);
    span.addEventListener('animationend', ()=> span.remove());
    btn.classList.remove('wiggle'); void btn.offsetWidth; btn.classList.add('wiggle');
  });

  // ===== CONFETTI =====
  const CONFETTI_COLORS = ['#D9A441','#B9862A','#F0C878','#171512','#F87171','#60A5FA'];
  function confettiBurst(x, y, count){
    count = count || 26;
    for(let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'confetti-piece';
      p.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      p.style.left = x+'px'; p.style.top = y+'px';
      const angle = (Math.random()*Math.PI*2);
      const dist = 90 + Math.random()*160;
      const dx = Math.cos(angle)*dist;
      const dy = Math.sin(angle)*dist - 60;
      const rot = (Math.random()*720-360)+'deg';
      const dur = 700 + Math.random()*500;
      document.body.appendChild(p);
      const anim = p.animate([
        { transform:'translate(0,0) rotate(0deg)', opacity:1 },
        { transform:`translate(${dx}px, ${dy+220}px) rotate(${rot})`, opacity:0 }
      ], { duration: dur, easing:'cubic-bezier(.16,.84,.44,1)' });
      anim.onfinish = ()=> p.remove();
    }
  }
  function celebrateFrom(el){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    confettiBurst(r.left + r.width/2, r.top + r.height/2);
  }

  // ===== EFEK TILT 3D =====
  (function initTilt(){
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    if(reduceMotion || noHover) return;
    document.querySelectorAll('.tilt').forEach(card=>{
      let raf=null;
      card.addEventListener('mousemove', e=>{
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', (px*100)+'%');
        card.style.setProperty('--my', (py*100)+'%');
        const rotY = (px - .5) * 9;
        const rotX = (.5 - py) * 9;
        if(raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(()=>{ card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px) translateZ(2px)`; });
      });
      card.addEventListener('mouseleave', ()=>{
        if(raf) cancelAnimationFrame(raf);
        card.classList.add('tilting');
        card.style.transform = '';
        setTimeout(()=> card.classList.remove('tilting'), 450);
      });
    });
    // tombol
    document.querySelectorAll('.btn.primary, .btn.outline, .btn.danger, .icon-btn, .auth-submit').forEach(btn=>{
      btn.addEventListener('mousemove', e=>{
        const r = btn.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        btn.style.transform = `perspective(300px) rotateX(${-py*12}deg) rotateY(${px*12}deg) translateY(-1.5px)`;
      });
      btn.addEventListener('mouseleave', ()=>{ btn.style.transform=''; });
    });
  })();

  // ===== FOTO PROFIL =====
  function setAvatarVisual(el, user){
    if(!el) return;
    const foto = user && user.foto;
    if(foto){
      el.style.backgroundImage = `url("${foto}")`;
      el.textContent = '';
    } else {
      el.style.backgroundImage = 'none';
      el.textContent = initials(user ? user.nama : '?');
    }
  }
  function resizeImageFile(file, maxSize){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Gagal membaca file'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('File bukan gambar yang valid'));
        img.onload = () => {
          let { width, height } = img;
          if(width > height){ if(width > maxSize){ height = Math.round(height*maxSize/width); width = maxSize; } }
          else { if(height > maxSize){ width = Math.round(width*maxSize/height); height = maxSize; } }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // ===== TOGGLE KATA SANDI =====
  const EYE_OPEN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 4.22-5.65M9.9 4.24A9.86 9.86 0 0 1 12 4c7 0 11 8 11 8a20.4 20.4 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 1l22 22" stroke-linecap="round"/></svg>';
  $$('.pass-toggle').forEach(btn=>{
    btn.innerHTML = EYE_OPEN;
    btn.addEventListener('click', ()=>{
      const inp = document.getElementById(btn.dataset.togglePass);
      if(!inp) return;
      const hidden = inp.type === 'password';
      inp.type = hidden ? 'text' : 'password';
      btn.innerHTML = hidden ? EYE_OFF : EYE_OPEN;
      btn.setAttribute('aria-label', hidden ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
    });
  });
  const fmtNo = (prefix,n) => prefix + '-' + String(n).padStart(4,'0');
  const escHtml = t => String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  // total pinjaman
  const hitungTotalPinjaman = (jumlah,bunga) => Math.round(Number(jumlah||0) * (1 + Number(bunga||0)/100));

  let state = {
    anggota:[], pinjaman:[], pembayaran:[],
    prefs:{ notifAngsuran:true, notifTransaksi:true, notifJatuhTempo:true, hariJatuhTempo:3, namaKoperasi:"Aliyah's Money", dendaAktif:true, dendaPersen:0.5, bungaPersen:5, darkMode:false, ukuranTeks:'sedang', qrisAdminFoto:null, chartHari:7 }
  };
  const STORE_KEYS = ['anggota','pinjaman','pembayaran','prefs'];

  // ===== KONFIGURASI =====
  const ENABLE_DEMO_DATA = false;
  const API = 'api/';
  // mode web: 'admin' (web Admin) atau 'user' (web User) — diset oleh halaman
  // satu web untuk admin & anggota: mode ditentukan oleh peran akun yang masuk
  let APP_MODE = 'user';
  // tema gelap disimpan per akun di perangkat (bukan di database), jadi tidak saling terbawa
  var THEME_OWNER = '';
  function readDark(){ try{ return !!THEME_OWNER && localStorage.getItem('am_dark_'+THEME_OWNER)==='1'; }catch(e){ return false; } }
  function writeDark(v){ try{ if(THEME_OWNER) localStorage.setItem('am_dark_'+THEME_OWNER, v?'1':'0'); }catch(e){} }
  function setMode(u){
    APP_MODE = (u && u.role==='admin') ? 'admin' : 'user';
    THEME_OWNER = u ? u.id : '';
    document.body.setAttribute('data-mode', APP_MODE);
    state.prefs.darkMode = readDark();
    applyTheme(); applyTexts();
  }

  // ===== LOAD & SIMPAN DATA =====
  let _lastRenderPayload = null;
  async function loadAll(){
    let changed = true;
    try{
      const res = await fetch(API + 'state.php?action=load', {cache:'no-store'});
      const j = await res.json();
      if(j.ok){
        state.anggota = j.data.anggota || [];
        state.pinjaman = j.data.pinjaman || [];
        state.pembayaran = j.data.pembayaran || [];
        if(j.data.prefs) state.prefs = j.data.prefs;
        state.prefs.darkMode = readDark();
        const payload = JSON.stringify(j.data) + '|' + JSON.stringify(users);
        changed = payload !== _lastRenderPayload;
        _lastRenderPayload = payload;
      } else {
        toast('Gagal memuat data: ' + (j.error||''));
      }
    }catch(err){
      console.error('loadAll error', err);
    }
    if(!changed) return;
    if(ENABLE_DEMO_DATA && state.anggota.length===0 && state.pinjaman.length===0) seedDemoData();
    applyPrefs();
    renderAll();
  }

  async function persist(key){
    try{
      const res = await fetch(API + 'state.php', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({action:'save', key, data: state[key], mode: APP_MODE})
      });
      const j = await res.json();
      if(!j.ok){ toast('Gagal menyimpan ke database: ' + (j.error||'')); console.error(j); }
    }catch(err){
      console.error('persist error', err);
      toast('Tidak bisa terhubung ke server');
    }
  }

  // simpan pengaturan
  let prefsSyncing = false;
  async function persistPrefsPatch(patch){
    prefsSyncing = true;
    try{
      try{
        const res = await fetch(API + 'state.php?action=load', {cache:'no-store'});
        const j = await res.json();
        const latest = (j.ok && j.data && j.data.prefs) ? j.data.prefs : state.prefs;
        state.prefs = Object.assign({}, latest, patch);
      }catch(err){
        console.error('persistPrefsPatch load error', err);
        state.prefs = Object.assign({}, state.prefs, patch);
      }
      await persist('prefs');
    } finally {
      prefsSyncing = false;
    }
  }

  // ===== SINKRONISASI REAL-TIME =====
  let realtimeTimer = null;
  function startRealtimeSync(){
    if(realtimeTimer) return;
    realtimeTimer = setInterval(async ()=>{
      if(!currentUser) return;
      if(document.querySelector('.overlay.active')) return;
      if(prefsSyncing) return;
      await loadUsers();
      await loadAll();
    }, 4000);
  }
  function stopRealtimeSync(){
    if(realtimeTimer){ clearInterval(realtimeTimer); realtimeTimer = null; }
  }

  function applyPrefs(){
    const logoName = $('.logo span');
    if(logoName) logoName.textContent = state.prefs.namaKoperasi || "Aliyah's Money";
    applyTheme();
    applyTextSize();
    applyTexts();
  }

  // ===== UKURAN TEKS =====
  function applyTextSize(){
    const ukuran = state.prefs.ukuranTeks || 'sedang';
    const app = $('#appRoot'), auth = $('#authScreen');
    [app, auth].forEach(el=>{
      if(!el) return;
      el.classList.remove('text-kecil','text-sedang','text-besar');
      el.classList.add('text-'+ukuran);
    });
  }

  // ===== TEKS ANTARMUKA =====
  const TEXT = {
    navDashboard:'Dashboard',
    navAnggota:'Anggota',
    navPinjaman:'Pinjaman',
    navPembayaran:'Pembayaran',
    navCicilan:'Riwayat Cicilan',
    navLaporan:'Laporan',
    navPengaturan:'Pengaturan',
    navPrivasi:'Kebijakan Privasi',
    navBantuan:'Bantuan',
    navKeluar:'Keluar',
    btnSimpan:'Simpan',
    btnBatal:'Batal',
    btnTambahAnggota:'+ Tambah Anggota',
    get btnAjukanPinjaman(){ return APP_MODE==='admin' ? '+ Pinjaman' : '+ Ajukan Pinjaman'; },
    btnCatatPembayaran:'+ Catat Pembayaran',
    btnCetakLaporan:'🖨️ Cetak / Unduh PDF',
    btnKeluar:'Keluar',
    ttlDashboard:'Dashboard',
    subDashboard:'Ringkasan data anggota, pinjaman, dan pembayaran.',
    ttlAnggota:'Anggota',
    subAnggota:'Tabel ANGGOTA — data anggota peminjam.',
    ttlPinjaman:'Pinjaman',
    subPinjaman:'Tabel PINJAMAN — pengajuan sampai pelunasan pinjaman anggota.',
    ttlPembayaran:'Pembayaran',
    subPembayaran:'Tabel PEMBAYARAN — riwayat cicilan yang dibayarkan atas pinjaman, beserta metode pembayaran anggota.',
    ttlCicilan:'Riwayat Cicilan Anggota',
    subCicilan:'cicilan_anggota — relasi turunan / view opsional yang menggabungkan ANGGOTA, PINJAMAN, dan PEMBAYARAN untuk memudahkan melihat riwayat cicilan per anggota.',
    ttlLaporan:'Laporan',
    subLaporan:'Ringkasan pinjaman & pembayaran per periode — harian, bulanan, atau tahunan.',
    ttlPengaturan:'Pengaturan',
    subPengaturan:'Kelola profil, preferensi, dan keamanan akun.',
    ttlPrivasi:'Kebijakan Privasi',
    subPrivasi:'Bagaimana Aliyah\'s Money mengumpulkan, menggunakan, dan melindungi data Anda.',
    ttlBantuan:'Butuh Bantuan?',
    subBantuan:'Cari jawaban atau hubungi tim dukungan kami.',
    cardAktivitas:'Aktivitas Terbaru',
    cardMetode:'Metode Pembayaran',
    lihatSemua:'Lihat semua',
    stLunas:'Lunas',
    stDitolak:'Ditolak',
    stMenunggu:'Menunggu Persetujuan',
    stBerjalan:'Berjalan',
    stAktif:'Aktif',
    aksiTinjau:'Tinjau',
    aksiLihat:'Lihat',
    aksiKelola:'Kelola',
    aksiEdit:'Edit',
    aksiHapus:'Hapus',
    aksiAtur:'Atur',
    emptyAnggota:'Belum ada anggota.',
    emptyAnggotaSaya:'Akun Anda belum terhubung ke data anggota manapun.',
    emptyPinjaman:'Belum ada pengajuan pinjaman.',
    emptyPinjamanSaya:'Belum ada riwayat pinjaman untuk akun Anda.',
    emptyPembayaran:'Belum ada riwayat pembayaran.',
    emptyPembayaranSaya:'Belum ada riwayat pembayaran untuk akun Anda.',
    emptyCicilan:'Belum ada riwayat cicilan.',
    emptyCicilanSaya:'Belum ada riwayat cicilan untuk akun Anda.',
    belumAdaFoto:'Belum ada foto',
    lihatBuktiTt:'Lihat bukti pembayaran',
    metodeBelumDiatur:'Belum diatur',
    metodeVA:'Virtual Account',
    metodeQRIS:'QRIS',
    metodeRekening:'Transfer Rekening Bank',
    qrisBelumAdmin:'QRIS belum diunggah Admin',
    terlambatHari:'Terlambat',
    hari:'hari',
    jatuhTempoHariIni:'Jatuh tempo hari ini',
    jatuhTempoBesok:'H-1 · Jatuh tempo besok',
    jatuhTempoDalam:'Jatuh tempo',
    hariLagi:'hari lagi',
    lblTanggal:'Tanggal',
    lblJenis:'Jenis',
    lblAnggota:'Anggota',
    lblKeterangan:'Keterangan',
    lblNominal:'Nominal',
    lblDenda:'Denda',
  };
  const SUB = { anggota:'data', pinjaman:'data', pembayaran:'riwayat', cicilan:'semua', laporan:'pembayaran' };
  let _keepSub = false;
  function t(key){ const d=TEXT[key]; return d===undefined ? key : d; }
  function applyTexts(){
    const map = {
      '#navTabs button[data-view="dashboard"]':'navDashboard',
      '#navTabs button[data-view="anggota"]':'navAnggota',
      '#navTabs button[data-view="pinjaman"]':'navPinjaman',
      '#navTabs button[data-view="pembayaran"]':'navPembayaran',
      '#navTabs button[data-view="cicilan"]':'navCicilan',
      '#navTabs button[data-view="laporan"]':'navLaporan',
      '#navSecondary button[data-view="pengaturan"]':'navPengaturan',
      '#navSecondary button[data-view="privasi"]':'navPrivasi',
      '#navSecondary button[data-view="bantuan"]':'navBantuan',
      '#btnLogout':'navKeluar',
      '#btnAddAnggota2':'btnTambahAnggota',
      '#btnAddPinjaman2':'btnAjukanPinjaman',
      '#btnAddPembayaran':'btnCatatPembayaran',
      '#btnCetakLaporan':'btnCetakLaporan',
      '#pgTitleDashboard':'ttlDashboard', '#pgSubDashboard':'subDashboard',
      
      
      
      
      
      '#pgTitlePengaturan':'ttlPengaturan', '#pgSubPengaturan':'subPengaturan',
      '#pgTitlePrivasi':'ttlPrivasi', '#pgSubPrivasi':'subPrivasi',
      '#pgTitleBantuan':'ttlBantuan', '#pgSubBantuan':'subBantuan',
      '#cardTitleAktivitas':'cardAktivitas', '#cardTitleMetode':'cardMetode',
      '#viewAllTx':'lihatSemua',
      '#thLapTanggal':'lblTanggal', '#thLapJenis':'lblJenis', '#thLapAnggota':'lblAnggota',
      '#thLapKeterangan':'lblKeterangan', '#thLapNominal':'lblNominal',
    };
    // elemen teks polos
    const plainTextSel = new Set(['#pgTitleDashboard','#pgSubDashboard','#pgTitleAnggota','#pgSubAnggota',
      '#pgTitlePinjaman','#pgSubPinjaman','#pgTitlePembayaran','#pgSubPembayaran','#pgTitleCicilan','#pgSubCicilan',
      '#pgTitleLaporan','#pgSubLaporan','#pgTitlePengaturan','#pgSubPengaturan','#pgTitlePrivasi','#pgSubPrivasi',
      '#pgTitleBantuan','#pgSubBantuan','#cardTitleAktivitas','#cardTitleMetode','#viewAllTx',
      '#thLapTanggal','#thLapJenis','#thLapAnggota','#thLapKeterangan','#thLapNominal']);
    Object.keys(map).forEach(sel=>{
      if(plainTextSel.has(sel)){
        const el = $(sel); if(!el) return;
        const txt0 = TEXT[map[sel]]; if(txt0===undefined) return;
        el.textContent = txt0;
        return;
      }
      const el = $(sel); if(!el) return;
      const txt = TEXT[map[sel]]; if(txt===undefined) return;
      // tombol nav
      const svg = el.querySelector('svg');
      const badge = el.querySelector('.badge-mini');
      if(svg){
        let node = svg.nextSibling;
        while(node && node.nodeType!==3) node = node.nextSibling;
        if(node) node.textContent = ' ' + txt; else el.appendChild(document.createTextNode(' '+txt));
      } else {
        el.textContent = txt;
        if(badge) el.appendChild(badge);
      }
    });
  }
  $('#setUkuranTeks') && $('#setUkuranTeks').addEventListener('change', async ()=>{
    const val = $('#setUkuranTeks').value;
    state.prefs.ukuranTeks = val;
    applyTextSize();
    await persistPrefsPatch({ukuranTeks: val});
    toast('Ukuran teks diperbarui');
  });

  function applyTheme(){
    const dark = !!state.prefs.darkMode;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    const sun = $('#themeIconSun'), moon = $('#themeIconMoon');
    if(sun && moon){ sun.style.display = dark ? 'none' : 'block'; moon.style.display = dark ? 'block' : 'none'; }
  }
  $('#themeToggleBtn').addEventListener('click', async ()=>{
    const val = !state.prefs.darkMode;
    state.prefs.darkMode = val;
    $('#themeToggleBtn').classList.remove('flip'); void $('#themeToggleBtn').offsetWidth; $('#themeToggleBtn').classList.add('flip');
    applyTheme();
    $$('.switch[data-toggle="darkMode"]').forEach(sw=> sw.classList.toggle('on', state.prefs.darkMode));
    writeDark(val);
  });

  // ===== DATA CONTOH =====
  function seedDemoData(){
    const a1={id:uid(),no:fmtNo('AG',1),nama:'Siti Rahma',alamat:'Jl. Merdeka No. 12, Muara Enim',no_hp:'0812-3456-7890',tanggal_gabung:'2024-02-10',metode_pembayaran:'rekening',no_rekening:'1234567890 a.n. Siti Rahma'};
    const a2={id:uid(),no:fmtNo('AG',2),nama:'Budi Santoso',alamat:'Jl. Sriwijaya No. 5, Muara Enim',no_hp:'0813-2211-9987',tanggal_gabung:'2024-05-03',metode_pembayaran:'va',no_rekening:'VA 8807112233'};
    const a3={id:uid(),no:fmtNo('AG',3),nama:'Ani Wijaya',alamat:'Jl. Rambutan No. 8, Muara Enim',no_hp:'0857-6612-4432',tanggal_gabung:'2025-01-20',metode_pembayaran:'rekening',no_rekening:'5566778899 a.n. Ani Wijaya'};
    const a4={id:uid(),no:fmtNo('AG',4),nama:'Edwin Adenike',alamat:'Jl. Melati No. 2, Muara Enim',no_hp:'0821-7788-1122',tanggal_gabung:'2025-03-11',metode_pembayaran:'qris',no_rekening:'',foto_qris:null};
    state.anggota=[a1,a2,a3,a4];

    function buatPinjaman(no,anggota,jumlah,tenor,bunga,tglPinjaman,status){
      const total = hitungTotalPinjaman(jumlah,bunga);
      return {id:uid(),no:fmtNo('PJ',no),id_anggota:anggota.id,tanggal_pinjaman:tglPinjaman,
        jumlah_pinjaman:jumlah,tenor,bunga,total_pinjaman:total,status};
    }
    const p1 = buatPinjaman(1,a2,2000000,10,5,'2025-03-01','berjalan');
    const p2 = buatPinjaman(2,a3,1000000,5,4,'2025-01-15','lunas');
    const p3 = buatPinjaman(3,a4,1500000,6,5,'2025-08-20','pengajuan');
    state.pinjaman=[p1,p2,p3];

    state.pembayaran=[];
    function addMonths(iso,n){ const d=new Date(iso); d.setMonth(d.getMonth()+n); return d.toISOString().slice(0,10); }
    // p1
    (function(){
      const cicilan = Math.round(p1.total_pinjaman / p1.tenor);
      state.pembayaran.push({id:uid(),no:fmtNo('BY',1),id_pinjaman:p1.id,cicilan_ke:1,jumlah_bayar:cicilan,
        tanggal_bayar:addMonths(p1.tanggal_pinjaman,1),sisa_pinjaman:p1.total_pinjaman-cicilan});
    })();
    // p2
    (function(){
      const cicilan = Math.round(p2.total_pinjaman / p2.tenor);
      let sisa = p2.total_pinjaman;
      for(let i=1;i<=p2.tenor;i++){
        sisa = Math.max(0, sisa - cicilan);
        state.pembayaran.push({id:uid(),no:fmtNo('BY',i+1),id_pinjaman:p2.id,cicilan_ke:i,jumlah_bayar:cicilan,
          tanggal_bayar:addMonths(p2.tanggal_pinjaman,i),sisa_pinjaman:sisa});
      }
    })();

    STORE_KEYS.filter(k=>k!=='prefs').forEach(persist);
  }

  function anggotaName(id){ const m=state.anggota.find(x=>x.id===id); return m?m.nama:'—'; }
  function anggotaNo(id){ const m=state.anggota.find(x=>x.id===id); return m?m.no:'—'; }
  function pinjamanTotalBayar(pid){ return state.pembayaran.filter(b=>b.id_pinjaman===pid).reduce((s,b)=>s+Math.max(0,b.jumlah_bayar-(b.denda||0)),0); }
  function pinjamanSisa(p){ return Math.max(0, p.total_pinjaman - pinjamanTotalBayar(p.id)); }

  // ===== DATA PER AKUN =====
  function myAnggotaId(){
    if(isAdmin()) return adminViewScope==='fokus' ? adminFocusAnggotaId : null;
    const id = currentUser ? currentUser.id_anggota : null;
    return id && state.anggota.some(a=>a.id===id) ? id : null;
  }
  function scopedAnggota(){
    if(isAdmin() && adminViewScope==='semua') return state.anggota;
    const id = myAnggotaId();
    return id ? state.anggota.filter(a=>a.id===id) : [];
  }
  function scopedPinjaman(){
    if(isAdmin() && adminViewScope==='semua') return state.pinjaman;
    const id = myAnggotaId();
    return id ? state.pinjaman.filter(p=>p.id_anggota===id) : [];
  }
  function scopedPembayaran(){
    if(isAdmin() && adminViewScope==='semua') return state.pembayaran;
    const idSet = new Set(scopedPinjaman().map(p=>p.id));
    return state.pembayaran.filter(b=>idSet.has(b.id_pinjaman));
  }
  function canSeePinjaman(p){ return !!p && (isAdmin() || p.id_anggota===myAnggotaId()); }

  // ===== JATUH TEMPO =====
  function addMonths(iso,n){ const d=new Date(iso); d.setMonth(d.getMonth()+n); return d.toISOString().slice(0,10); }
  function cicilanKeBerikutnyaOf(p){ return state.pembayaran.filter(b=>b.id_pinjaman===p.id).length + 1; }
  function jatuhTempoBerikutnya(p){
    if(p.status!=='berjalan' || pinjamanSisa(p)<=0) return null;
    const ke = cicilanKeBerikutnyaOf(p);
    if(ke > p.tenor) return null;
    return { ke, tanggal: addMonths(p.tanggal_pinjaman, ke) };
  }
  function sisaHari(iso){
    const d = new Date(iso+'T00:00:00'), now = new Date(todayISO()+'T00:00:00');
    return Math.round((d-now)/86400000);
  }
  function dueTagHtml(p){
    const jt = jatuhTempoBerikutnya(p); if(!jt) return '';
    const sisa = sisaHari(jt.tanggal);
    if(sisa<0){
      const d = hitungDenda(p);
      return `<span class="due-tag late">${t('terlambatHari')} ${Math.abs(sisa)} ${t('hari')}${d && d.nominal>0 ? ' · '+t('lblDenda')+' '+rupiah(d.nominal) : ''}</span>`;
    }
    if(sisa<=(state.prefs.hariJatuhTempo??3)) return `<span class="due-tag soon">${sisa===0?t('jatuhTempoHariIni'):sisa===1?t('jatuhTempoBesok'):t('jatuhTempoDalam')+' '+sisa+' '+t('hariLagi')}</span>`;
    return '';
  }

  // ===== DENDA KETERLAMBATAN =====
  function cicilanNominal(p){ return Math.round(p.total_pinjaman / p.tenor); }
  function hitungDenda(p){
    if(!state.prefs.dendaAktif) return null;
    const jt = jatuhTempoBerikutnya(p); if(!jt) return null;
    const sisa = sisaHari(jt.tanggal);
    if(sisa>=0) return null;
    let baseDate = jt.tanggal;
    if(p.denda_settled_ke===jt.ke && p.denda_settled_tanggal && p.denda_settled_tanggal>baseDate){
      baseDate = p.denda_settled_tanggal;
    }
    const hari = diffDaysISO(todayISO(), baseDate);
    if(hari<=0) return null;
    const persen = Number(state.prefs.dendaPersen)||0;
    const nominal = Math.round(cicilanNominal(p) * (persen/100) * hari);
    return { hari, nominal, ke: jt.ke };
  }

  // ===== SIDEBAR =====
  function isMobileWidth(){ return window.innerWidth <= 880; }
  function setSidebar(open){
    $('#sidebar').classList.toggle('hidden', !open);
    $('#mainContent').classList.toggle('full', !open || isMobileWidth());
  }
  $('#menuBtn').addEventListener('click', ()=>{
    $('#menuBtn').classList.toggle('spin');
    setSidebar($('#sidebar').classList.contains('hidden'));
  });
  $('#sidebarClose').addEventListener('click', ()=> setSidebar(false));
  setSidebar(!isMobileWidth());


  // ===== SUBMENU =====
  const SUB_TITLES = {
    anggota:{data:'Data Anggota', detail:'Detail Anggota'},
    pinjaman:{pengajuan:'Pengajuan Pinjaman', data:'Data Pinjaman', aktif:'Pinjaman Aktif', selesai:'Pinjaman Selesai'},
    pembayaran:{riwayat:'Riwayat Pembayaran', rekening:'Transfer Rekening', va:'Virtual Account', qris:'QRIS'},
    cicilan:{semua:'Semua Riwayat Cicilan', dibayar:'Cicilan Sudah Dibayar', belum:'Cicilan Belum Dibayar'},
    laporan:{anggota:'Laporan Anggota', pinjaman:'Laporan Pinjaman', pembayaran:'Laporan Pembayaran', cicilan:'Laporan Cicilan'}
  };
  const SUB_PARENT = {anggota:'Anggota', pinjaman:'Pinjaman', pembayaran:'Pembayaran', cicilan:'Riwayat Cicilan', laporan:'Laporan'};
  const SUB_DEFAULT = {anggota:'data', pinjaman:'data', pembayaran:'riwayat', cicilan:'semua', laporan:'pembayaran'};
  function syncSubUI(v){
    $$('.subnav').forEach(n=> n.classList.toggle('open', n.dataset.subnav===v));
    $$('#navTabs button[data-view]').forEach(b=> b.classList.toggle('has-open', b.dataset.view===v && !!SUB[v]));
    Object.keys(SUB).forEach(view=>{
      const key = SUB[view];
      $$('.subnav-btn[data-go="'+view+'"]').forEach(b=> b.classList.toggle('on', key===b.dataset.sub));
      $$('.view[data-view="'+view+'"] [data-subpanel]').forEach(p=>{
        p.style.display = p.dataset.subpanel.split(' ').includes(key) ? '' : 'none';
      });
      const cap = view.charAt(0).toUpperCase()+view.slice(1);
      const h1 = $('#pgTitle'+cap); if(h1) h1.textContent = SUB_TITLES[view][key];
      const cr = $('#crumb'+cap);
      if(cr){
        const metode = ['rekening','va','qris'].includes(key) && view==='pembayaran';
        cr.innerHTML = '<a data-crumb="'+view+'">'+SUB_PARENT[view]+'</a> › '+(metode ? 'Metode Pembayaran › ' : '')+SUB_TITLES[view][key];
      }
    });
    // tombol aksi hanya di halaman yang relevan
    const bp = $('#btnAddPinjaman2'); if(bp) bp.classList.toggle('hide-by-sub', SUB.pinjaman!=='pengajuan');
    const bb = $('#btnAddPembayaran'); if(bb) bb.classList.toggle('hide-by-sub', SUB.pembayaran!=='riwayat');
  }
  function renderSubView(view){
    if(view==='anggota') renderDetailAnggota();
    if(view==='pinjaman') renderPinjaman();
    if(view==='pembayaran') renderMetode();
    if(view==='cicilan') renderCicilan();
    if(view==='laporan') renderLaporan();
  }
  function setSub(view, key){
    const active = $('.view.active');
    const onView = !!active && active.dataset.view===view;
    if(view==='anggota' && key==='tambah'){
      if(!onView){ SUB.anggota='data'; _keepSub=true; goView('anggota'); _keepSub=false; syncSubUI('anggota'); renderSubView('anggota'); }
      const b = $('#btnAddAnggota2'); if(b) b.click();
      return;
    }
    SUB[view] = key;
    if(!onView){ _keepSub=true; goView(view); _keepSub=false; }
    syncSubUI(view);
    renderSubView(view);
    if(onView){ if(isMobileWidth()) setSidebar(false); fxViewLoader(); }
  }
  document.addEventListener('click', e=>{
    const cr = e.target.closest('[data-crumb]');
    if(cr){ setSub(cr.dataset.crumb, SUB_DEFAULT[cr.dataset.crumb]); return; }
  });
  document.addEventListener('click', e=>{
    const pb = e.target.closest('#navTabs button[data-view]');
    if(pb && SUB[pb.dataset.view] && pb.classList.contains('active')){
      e.stopPropagation();
      const sn = $('.subnav[data-subnav="'+pb.dataset.view+'"]');
      const open = sn.classList.toggle('open');
      pb.classList.toggle('has-open', open);
    }
  }, true);
  document.addEventListener('click', e=>{
    const b = e.target.closest('.subnav-btn');
    if(!b) return;
    const view = b.dataset.go || b.closest('[data-subtabs]').dataset.subtabs;
    setSub(view, b.dataset.sub);
  });

  // ===== NAVIGASI =====
  function goView(v){
    const _prevView = $('.view.active');
    const _viewChanged = !!_prevView && _prevView.dataset.view !== v;
    $$('#navTabs button, #navSecondary button[data-view]').forEach(b=>b.classList.toggle('active', b.dataset.view===v));
    $$('.view').forEach(s=>s.classList.toggle('active', s.dataset.view===v));
    if(v==='pengaturan') renderPengaturan();
    if(v==='laporan') renderLaporan();
    if(v==='dashboard') replayDashboardAnim();
    if(_viewChanged && SUB[v] && !_keepSub){ SUB[v] = SUB_DEFAULT[v]; renderSubView(v); }
    if(typeof syncSubUI==='function') syncSubUI(v);
    if(isMobileWidth()) setSidebar(false);
    if(_viewChanged) fxViewLoader();
  }
  // animasi angka dashboard
  function replayDashboardAnim(){
    ['#stAnggota','#stPinjaman','#stPembayaran','#stLunas'].forEach(sel=>{
      const el = $(sel); if(el){ el.dataset.val = 0; }
    });
    const donutEl = $('#donut'); if(donutEl) donutEl.dataset.pct = 0;
    $$('#chartBars .bar').forEach(b=> b.style.height='0px');
    renderDashboard();
  }
  $$('#navTabs button[data-view], #navSecondary button[data-view]').forEach(btn=> btn.addEventListener('click', ()=> goView(btn.dataset.view)));
  $('#promoBackup').addEventListener('click', ()=> goView('pengaturan'));
  $('#chartPeriodSelect') && $('#chartPeriodSelect').addEventListener('change', async e=>{
    const val = Number(e.target.value)||7;
    state.prefs.chartHari = val;
    await persistPrefsPatch({chartHari: val});
    renderDashboard();
  });

  // ===== PENCARIAN =====
  function filterActiveView(q){
    const activeSection = $('.view.active');
    if(!activeSection) return;
    $$('tbody tr, .kat-card', activeSection).forEach(row=>{
      const text = row.textContent.toLowerCase();
      row.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  }
  function buildSearchIndex(){
    const items = [];
    scopedAnggota().forEach(a=> items.push({type:'anggota', view:'anggota', title:a.nama, sub:(a.no_hp||a.no||'Anggota'), q:(a.nama+' '+(a.no||'')+' '+(a.no_hp||'')).toLowerCase()}));
    scopedPinjaman().forEach(p=>{
      const a = state.anggota.find(x=>x.id===p.id_anggota);
      items.push({type:'pinjaman', view:'pinjaman', title:p.no, sub:(a?a.nama+' — ':'')+rupiah(p.total_pinjaman), q:(p.no+' '+(a?a.nama:'')).toLowerCase()});
    });
    return items;
  }
  const SR_ICO = {
    anggota:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20c1-3.5 3.6-5.5 5.5-5.5s4.5 2 5.5 5.5" stroke-linecap="round"/></svg>',
    pinjaman:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  function renderSearchResults(q){
    const box = $('#searchResults');
    if(!q){ box.classList.remove('show'); box.innerHTML=''; document.body.classList.remove('searching'); return; }
    const matches = buildSearchIndex().filter(it=>it.q.includes(q)).slice(0,7);
    if(matches.length===0){
      box.innerHTML = '<div class="sr-empty">Tidak ada hasil untuk "'+q+'"</div>';
    }else{
      box.innerHTML = matches.map(it=>
        '<div class="sr-item" data-view="'+it.view+'"><div class="sr-ico">'+SR_ICO[it.type]+'</div><div><div class="sr-t">'+it.title+'</div><div class="sr-s">'+it.sub+'</div></div></div>'
      ).join('');
    }
    box.classList.add('show');
    document.body.classList.add('searching');
    $$('.sr-item', box).forEach(el=> el.addEventListener('click', ()=>{
      goView(el.dataset.view);
      filterActiveView(q);
      box.classList.remove('show');
      document.body.classList.remove('searching');
    }));
  }
  $('#globalSearch').addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    filterActiveView(q);
    renderSearchResults(q);
  });
  $('#globalSearch').addEventListener('focus', e=>{
    if(e.target.value.trim()) renderSearchResults(e.target.value.trim().toLowerCase());
  });
  document.addEventListener('click', e=>{
    if(!$('#searchWrap').contains(e.target)){ $('#searchResults').classList.remove('show'); document.body.classList.remove('searching'); }
  });
  document.addEventListener('keydown', e=>{
    if((e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='f'){ e.preventDefault(); $('#globalSearch').focus(); }
    if(e.key==='Escape'){ $('#searchResults').classList.remove('show'); $('#notifPanel').classList.remove('show'); document.body.classList.remove('searching'); }
  });

  // ===== NOTIFIKASI =====
  function buildNotifications(){
    const list = [];
    if(state.prefs.notifAngsuran){
      scopedPinjaman().filter(p=>p.status==='pengajuan').forEach(p=>{
        const a = state.anggota.find(x=>x.id===p.id_anggota);
        list.push({ico:'amber',t:'Pengajuan Pinjaman Baru',s:(a?a.nama:'Anggota')+' — mengajukan '+rupiah(p.jumlah_pinjaman)+' ('+p.no+')',tgl:p.tanggal_pinjaman||''});
      });
      scopedPinjaman().filter(p=>p.status==='berjalan' && pinjamanSisa(p)>0).forEach(p=>{
        const a = state.anggota.find(x=>x.id===p.id_anggota);
        list.push({ico:'amber',t:'Pengingat Angsuran',s:(a?a.nama:'Anggota')+' — sisa '+rupiah(pinjamanSisa(p))+' ('+p.no+')',tgl:p.tanggal_pinjaman||''});
      });
    }
    if(state.prefs.notifTransaksi){
      [...scopedPembayaran()].sort((a,b)=>(b.tanggal_bayar||'').localeCompare(a.tanggal_bayar||'')).slice(0,20).forEach(b=>{
        const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
        const a = p ? state.anggota.find(x=>x.id===p.id_anggota) : null;
        list.push({ico:'green',t:'Pembayaran Diterima',s:(a?a.nama:'Anggota')+' — cicilan ke-'+b.cicilan_ke+' '+rupiah(b.jumlah_bayar),tgl:b.tanggal_bayar||''});
      });
    }
    if(state.prefs.notifJatuhTempo){
      scopedPinjaman().filter(p=>p.status==='berjalan').forEach(p=>{
        const jt = jatuhTempoBerikutnya(p); if(!jt) return;
        const sisa = sisaHari(jt.tanggal);
        const a = state.anggota.find(x=>x.id===p.id_anggota);
        if(sisa<0){
          const d = hitungDenda(p);
          const dendaTxt = (d && d.nominal>0) ? ' · Denda '+rupiah(d.nominal) : '';
          list.push({ico:'red',t:'Cicilan Terlambat',s:(a?a.nama:'Anggota')+' — cicilan ke-'+jt.ke+' ('+p.no+') terlambat '+Math.abs(sisa)+' hari'+dendaTxt,tgl:jt.tanggal});
        } else if(sisa<=(state.prefs.hariJatuhTempo??3)){
          const kapan = sisa===0?'jatuh tempo hari ini':sisa===1?'H-1, jatuh tempo besok':'jatuh tempo '+sisa+' hari lagi';
          list.push({ico:'amber',t:sisa===1?'Jatuh Tempo Besok (H-1)':'Jatuh Tempo Segera',s:(a?a.nama:'Anggota')+' — cicilan ke-'+jt.ke+' ('+p.no+') '+kapan,tgl:jt.tanggal});
        }
      });
    }
    return list.sort((x,y)=>(y.tgl||'').localeCompare(x.tgl||'')).slice(0,30);
  }
  function renderNotif(){
    const list = buildNotifications();
    const box = $('#notifList');
    box.innerHTML = list.length===0
      ? '<div class="notif-empty">Tidak ada notifikasi baru</div>'
      : list.map(n=>'<div class="ni"><div class="ni-ico '+n.ico+'">'+(n.ico==='green'
          ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v5M12 16.5h.01" stroke-linecap="round"/><circle cx="12" cy="12" r="9"/></svg>')
        +'</div><div><div class="ni-t">'+n.t+'</div><div class="ni-s">'+n.s+'</div><div class="ni-d">'+fmtDate(n.tgl)+'</div></div></div>').join('');
    $('#notifDot').style.display = list.length>notifSeen ? 'block' : 'none';
    return list.length;
  }
  let notifSeen = 0;
  $('#notifBtn').addEventListener('click', ()=>{
    $('#notifBtn').classList.remove('ring'); void $('#notifBtn').offsetWidth; $('#notifBtn').classList.add('ring');
    const count = renderNotif();
    $('#notifPanel').classList.toggle('show');
    if($('#notifPanel').classList.contains('show')){
      notifSeen = count;
      $('#notifDot').style.display = 'none';
    }
  });
  document.addEventListener('click', e=>{
    if(!$('#notifWrap').contains(e.target)) $('#notifPanel').classList.remove('show');
  });

  // ===== PENGATURAN =====
  function renderPengaturan(){
    if(!currentUser) return;
    $('#setUsername').value = currentUser.username || '';
    $('#setDisplayName').textContent = currentUser.nama || currentUser.username || 'Pengguna';
    setAvatarVisual($('#setAv'), currentUser);
    $('#btnHapusFoto').style.display = currentUser.foto ? 'inline' : 'none';
    $('#setHariJatuhTempo').value = state.prefs.hariJatuhTempo ?? 3;
    $('#setDendaPersen').value = state.prefs.dendaPersen ?? 0.5;
    $('#setBungaPersen').value = state.prefs.bungaPersen ?? 5;
    // denda & bunga
    $('#setDendaPersen').disabled = !isAdmin();
    $('#setBungaPersen').disabled = !isAdmin();
    $('#dendaPersenNote').style.display = isAdmin() ? 'none' : '';
    $('#bungaPersenNote').style.display = isAdmin() ? 'none' : '';
    if($('#setUkuranTeks')) $('#setUkuranTeks').value = state.prefs.ukuranTeks || 'sedang';
    $$('.switch[data-toggle]').forEach(sw=>{
      const key = sw.dataset.toggle;
      sw.classList.toggle('on', !!state.prefs[key]);
    });
    renderMemberInfoCard();
    renderLoginHistory();
  }

  // ===== INFORMASI KEANGGOTAAN =====
  function renderMemberInfoCard(){
    const wrap = $('#memberInfoCard'); if(!wrap) return;
    const aid = myAnggotaId();
    const m = aid ? state.anggota.find(x=>x.id===aid) : null;
    if(!m){ wrap.style.display = 'none'; return; }
    wrap.style.display = '';
    $('#miNoAnggota').textContent = m.no || '-';
    $('#miBergabung').textContent = fmtDate(m.tanggal_gabung);
    $('#miStatus').textContent = '🟢 Anggota Aktif';
    const totalPinjaman = state.pinjaman.filter(p=>p.id_anggota===m.id).reduce((s,p)=>s+p.total_pinjaman,0);
    $('#miTotalPinjaman').textContent = rupiah(totalPinjaman);
  }

  // ===== RIWAYAT LOGIN =====
  function deviceLabel(){
    const ua = navigator.userAgent || '';
    let browser = 'Browser';
    if(/Edg\//.test(ua)) browser = 'Edge';
    else if(/Chrome\//.test(ua) && !/OPR|Opera/.test(ua)) browser = 'Chrome';
    else if(/Firefox\//.test(ua)) browser = 'Firefox';
    else if(/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    else if(/OPR|Opera/.test(ua)) browser = 'Opera';
    let os = 'Perangkat';
    if(/Android/.test(ua)) os = 'Android';
    else if(/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if(/Windows/.test(ua)) os = 'Windows';
    else if(/Mac OS/.test(ua)) os = 'macOS';
    else if(/Linux/.test(ua)) os = 'Linux';
    return browser + ' · ' + os;
  }
  function renderLoginHistory(){
    const box = $('#loginHistoryList'); if(!box || !currentUser) return;
    const hist = [...(currentUser.loginHistory||[])].reverse();
    box.innerHTML = hist.length ? hist.map((h,i)=>`
      <div class="list-item">
        <div class="list-ico" style="background:var(--green-light);color:var(--green-deep);">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 18h2" stroke-linecap="round"/></svg>
        </div>
        <div><div class="t">${h.device||'Perangkat'}</div><div class="s">${fmtDate(h.waktu)} ${new Date(h.waktu).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div></div>
        ${i===0 ? '<span class="status-pill aktif">Aktif Sekarang</span>' : ''}
      </div>`).join('') : `<div class="empty">Belum ada riwayat login.</div>`;
  }
  $('#btnUbahFoto').addEventListener('click', ()=> $('#setFotoInput').click());

  // ===== CROP FOTO PROFIL =====
  const cropStage = $('#cropStage'), cropImg = $('#cropImg'), cropZoom = $('#cropZoom');
  let cropState = null;
  function cropRecalcTransform(){
    if(!cropState) return;
    const s = cropState;
    const dispW = s.naturalW*s.scale, dispH = s.naturalH*s.scale;
    s.panX = Math.min(0, Math.max(s.stageSize-dispW, s.panX));
    s.panY = Math.min(0, Math.max(s.stageSize-dispH, s.panY));
    cropImg.style.width = dispW+'px'; cropImg.style.height = dispH+'px';
    cropImg.style.left = s.panX+'px'; cropImg.style.top = s.panY+'px';
  }
  function cropSetZoom(newScale){
    const s = cropState; if(!s) return;
    const oldScale = s.scale;
    // posisi zoom
    const imgPtX = (s.stageSize/2 - s.panX)/oldScale, imgPtY = (s.stageSize/2 - s.panY)/oldScale;
    s.scale = newScale;
    s.panX = s.stageSize/2 - imgPtX*newScale;
    s.panY = s.stageSize/2 - imgPtY*newScale;
    cropRecalcTransform();
  }
  function openCropModal(file){
    const reader = new FileReader();
    reader.onload = () => {
      cropImg.onload = () => {
        openModal('#ovCropFoto');
        requestAnimationFrame(()=>{
          const stageSize = cropStage.clientWidth || 280;
          const naturalW = cropImg.naturalWidth, naturalH = cropImg.naturalHeight;
          const baseScale = Math.max(stageSize/naturalW, stageSize/naturalH);
          cropState = {naturalW, naturalH, baseScale, scale:baseScale, stageSize,
            panX:(stageSize-naturalW*baseScale)/2, panY:(stageSize-naturalH*baseScale)/2};
          cropZoom.value = 100;
          cropRecalcTransform();
        });
      };
      cropImg.src = reader.result;
    };
    reader.onerror = () => toast('Gagal membaca file gambar');
    reader.readAsDataURL(file);
  }
  cropZoom.addEventListener('input', ()=>{
    if(!cropState) return;
    cropSetZoom(cropState.baseScale * (Number(cropZoom.value)/100));
  });
  (function initCropDrag(){
    let dragging=false, startX=0, startY=0, startPanX=0, startPanY=0;
    cropStage.addEventListener('pointerdown', e=>{
      if(!cropState) return;
      dragging=true; startX=e.clientX; startY=e.clientY; startPanX=cropState.panX; startPanY=cropState.panY;
      cropStage.setPointerCapture(e.pointerId);
    });
    cropStage.addEventListener('pointermove', e=>{
      if(!dragging || !cropState) return;
      cropState.panX = startPanX + (e.clientX-startX);
      cropState.panY = startPanY + (e.clientY-startY);
      cropRecalcTransform();
    });
    ['pointerup','pointercancel','pointerleave'].forEach(ev=> cropStage.addEventListener(ev, ()=> dragging=false));
  })();
  $('#setFotoInput').addEventListener('change', e=>{
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if(!file || !currentUser) return;
    if(!file.type.startsWith('image/')){ toast('File harus berupa gambar'); return; }
    if(file.size > 8*1024*1024){ toast('Ukuran gambar maksimal 8MB'); return; }
    openCropModal(file);
  });
  $('#cropSave').addEventListener('click', async ()=>{
    if(!cropState || !currentUser){ closeModal('#ovCropFoto'); return; }
    try{
      const s = cropState, outputSize = 320;
      const sourceSize = s.stageSize/s.scale;
      const sourceX = -s.panX/s.scale, sourceY = -s.panY/s.scale;
      const canvas = document.createElement('canvas');
      canvas.width = outputSize; canvas.height = outputSize;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cropImg, sourceX, sourceY, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
      const blob = await new Promise(res=> canvas.toBlob(res, 'image/jpeg', 0.9));
      const fd = new FormData();
      fd.append('foto', blob, 'foto.jpg');
      fd.append('type', 'profil');
      fd.append('user_id', currentUser.id);
      const resp = await fetch(API + 'upload.php', {method:'POST', body:fd});
      const j = await resp.json();
      if(!j.ok){ toast('Gagal mengunggah foto: ' + (j.error||'')); return; }
      currentUser.foto = j.path;
      const u = users.find(x=>x.id===currentUser.id);
      if(u){ u.foto = j.path; }
      setAvatarVisual($('#setAv'), currentUser, true);
      setAvatarVisual($('#adminAv'), currentUser, true);
      $('#btnHapusFoto').style.display = 'inline';
      closeModal('#ovCropFoto');
      renderAll();
      toast('Foto profil diperbarui');
    }catch(err){
      console.error(err);
      toast('Gagal memproses gambar, coba file lain');
    }
  });
  $('#btnHapusFoto').addEventListener('click', async ()=>{
    if(!currentUser) return;
    currentUser.foto = null;
    const u = users.find(x=>x.id===currentUser.id);
    if(u) u.foto = null;
    await persistSelf({foto:null});
    setAvatarVisual($('#setAv'), currentUser, true);
    setAvatarVisual($('#adminAv'), currentUser, true);
    $('#btnHapusFoto').style.display = 'none';
    toast('Foto profil dihapus');
  });
  $('#btnGantiUsername').addEventListener('click', async ()=>{
    if(!currentUser) return;
    const baru = $('#setUsername').value.trim().toLowerCase();
    if(!baru){ toast('Username tidak boleh kosong'); return; }
    if(baru===currentUser.username){ toast('Username sama seperti sebelumnya'); return; }
    await loadUsers();
    if(users.some(x=>x.username===baru && x.id!==currentUser.id)){ toast('Username ini sudah dipakai akun lain'); return; }
    const u = users.find(x=>x.id===currentUser.id);
    if(u){
      const jr = await persistSelf({username: baru});
      if(!jr.ok) return;
      u.username = baru; currentUser.username = baru;
      $('.user .mail').textContent = baru;
    }
    $('#setUsername').value = baru;
    toast('Username berhasil diganti');
  });
  $('#btnGantiPassword').addEventListener('click', async ()=>{
    const p1 = $('#setPassBaru').value, p2 = $('#setPassKonfirmasi').value;
    if(!p1 || p1.length<6){ toast('Kata sandi minimal 6 karakter'); return; }
    if(p1!==p2){ toast('Konfirmasi kata sandi tidak cocok'); return; }
    if(currentUser){
      const jr = await persistSelf({hash: await sha256(p1)});
      if(!jr.ok) return;
    }
    $('#setPassBaru').value=''; $('#setPassKonfirmasi').value='';
    toast('Kata sandi berhasil diganti');
  });
  $('#setHariJatuhTempo').addEventListener('change', async ()=>{
    let v = Number($('#setHariJatuhTempo').value);
    if(!Number.isFinite(v) || v<0) v = 1;
    v = Math.min(3, Math.max(0, Math.round(v)));
    state.prefs.hariJatuhTempo = v;
    $('#setHariJatuhTempo').value = v;
    await persistPrefsPatch({hariJatuhTempo: v});
    renderAll();
    toast('Pengingat jatuh tempo diperbarui');
  });
  $('#setDendaPersen').addEventListener('change', async ()=>{
    if(!isAdmin()) return;
    let v = Number($('#setDendaPersen').value);
    if(!Number.isFinite(v) || v<0) v = 0.5;
    v = Math.min(100, Math.max(0, v));
    state.prefs.dendaPersen = v;
    $('#setDendaPersen').value = v;
    await persistPrefsPatch({dendaPersen: v});
    renderAll();
    toast('Persentase denda diperbarui');
  });
  $('#setBungaPersen').addEventListener('change', async ()=>{
    if(!isAdmin()) return;
    let v = Number($('#setBungaPersen').value);
    if(!Number.isFinite(v) || v<0) v = 5;
    v = Math.min(100, Math.max(0, v));
    state.prefs.bungaPersen = v;
    $('#setBungaPersen').value = v;
    await persistPrefsPatch({bungaPersen: v});
    renderAll();
    toast('Suku bunga pinjaman diperbarui');
  });
  $$('.switch[data-toggle]').forEach(sw=> sw.addEventListener('click', async ()=>{
    sw.classList.toggle('on');
    const key = sw.dataset.toggle;
    const val = sw.classList.contains('on');
    state.prefs[key] = val;
    if(key==='darkMode'){ applyTheme(); writeDark(val); } else { await persistPrefsPatch({[key]: val}); }
    toast(sw.classList.contains('on') ? 'Preferensi diaktifkan' : 'Preferensi dinonaktifkan');
  }));
  $('#btnExportData').addEventListener('click', ()=>{
    const backup = { exportedAt: new Date().toISOString() };
    STORE_KEYS.forEach(k=> backup[k]=state[k]);
    const blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cadangan-aliyahsmoney-' + todayISO() + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast('Cadangan data berhasil diunduh');
  });
  $('#importFile').addEventListener('change', async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const data = JSON.parse(text);
      const hasAny = STORE_KEYS.some(k=>Array.isArray(data[k]) || (k==='prefs' && data[k]));
      if(!hasAny){ toast('File cadangan tidak valid'); e.target.value=''; return; }
      if(!confirm('Memulihkan data akan menimpa seluruh data saat ini. Lanjutkan?')){ e.target.value=''; return; }
      STORE_KEYS.forEach(k=>{
        if(k==='prefs'){ if(data.prefs && typeof data.prefs==='object') state.prefs = Object.assign({}, state.prefs, data.prefs); }
        else if(Array.isArray(data[k])) state[k] = data[k];
      });
      for(const k of STORE_KEYS) await persist(k);
      applyPrefs(); renderAll(); renderPengaturan();
      toast('Data berhasil dipulihkan dari cadangan');
    }catch(err){
      toast('Gagal membaca file cadangan');
    }
    e.target.value = '';
  });
  $('#btnResetData').addEventListener('click', async ()=>{
    const aid = myAnggotaId();
    if(isAdmin() && !aid){ toast('Admin tidak memiliki data anggota sendiri untuk dihapus. Hapus anggota satu per satu di menu Anggota, atau fokuskan tampilan ke satu anggota dulu.'); return; }
    if(!aid){ toast('Akun Anda belum terhubung ke data anggota manapun.'); return; }
    const pinjamanSaya = state.pinjaman.filter(p=>p.id_anggota===aid);
    if(pinjamanSaya.some(p=>p.status==='berjalan')){
      toast('Tidak bisa menghapus: masih ada pinjaman yang sedang berjalan. Lunasi dulu semua pinjaman sebelum menghapus data.');
      return;
    }
    if(!confirm('Hapus data anggota, pinjaman, dan pembayaran milik akun Anda sendiri? Data akun/anggota lain tidak akan terpengaruh. Admin perlu menambahkan Anda kembali sebagai anggota bila ingin memakai fitur pinjaman lagi. Tindakan ini tidak dapat dibatalkan.')) return;
    const idPinjamanSaya = new Set(pinjamanSaya.map(p=>p.id));
    state.anggota = state.anggota.filter(m=>m.id!==aid);
    state.pinjaman = state.pinjaman.filter(p=>p.id_anggota!==aid);
    state.pembayaran = state.pembayaran.filter(b=>!idPinjamanSaya.has(b.id_pinjaman));
    for(const k of STORE_KEYS.filter(k=>k!=='prefs')) await persist(k);
    await lepasTautanAnggota();
    renderAll(); toast('Data Anda telah dihapus');
  });

  // ===== HAPUS AKUN =====
  $('#btnHapusAkun').addEventListener('click', ()=>{
    if(!currentUser) return;
    if(isAdmin()){ toast('Akun admin tidak dapat dihapus.'); return; }
    const aid = currentUser.id_anggota;
    if(aid && state.pinjaman.some(p=>p.id_anggota===aid && p.status==='berjalan')){
      toast('Tidak bisa menghapus akun: masih ada pinjaman yang sedang berjalan. Lunasi dulu pinjaman Anda.');
      return;
    }
    $('#hapusAkunPass').value=''; $('#hapusAkunErr').style.display='none';
    openModal('#ovHapusAkun');
  });
  $('#konfirmHapusAkun').addEventListener('click', async ()=>{
    if(!currentUser) return;
    const aid = currentUser.id_anggota;
    if(aid && state.pinjaman.some(p=>p.id_anggota===aid && p.status==='berjalan')){
      closeModal('#ovHapusAkun');
      toast('Tidak bisa menghapus akun: masih ada pinjaman yang sedang berjalan. Lunasi dulu pinjaman Anda.');
      return;
    }
    if(isAdmin()){ closeModal('#ovHapusAkun'); toast('Akun admin tidak dapat dihapus.'); return; }
    const pass = $('#hapusAkunPass').value;
    const showErr = msg=>{ const e=$('#hapusAkunErr'); e.textContent=msg; e.style.display='block'; };
    if(!pass){ showErr('Masukkan kata sandi Anda.'); return; }
    let jr;
    try{ jr = await usersApi({action:'delete_self', actor: currentUser.id, hash: await sha256(pass)}); }
    catch(err){ showErr('Tidak bisa terhubung ke server.'); return; }
    if(!jr.ok){ showErr(jr.error || 'Gagal menghapus akun.'); return; }
    users = users.filter(x=>x.id!==currentUser.id);
    closeModal('#ovHapusAkun');
    currentUser = null;
    setMode(null);
    await forgetSession();
    $('#authScreen').style.display='flex';
    $('#liPass').value=''; $('#liUsername').value=''; $('#liRemember').checked=false;
    showPanel('login');
    stopRealtimeSync();
    toast('Akun telah dihapus');
  });

  // ===== BANTUAN =====
  $('#faqSearch').addEventListener('input', e=>{
    const q = e.target.value.trim().toLowerCase();
    $$('#faqList .faq').forEach(f=>{
      const text = f.textContent.toLowerCase();
      f.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
  $('#viewAllTx') && $('#viewAllTx').addEventListener('click', ()=> goView('pembayaran'));
  $('#kasView').addEventListener('click', ()=> goView('pembayaran'));

  // ===== RENDER =====
  function renderAll(){
    if(typeof syncSubUI==='function') setTimeout(()=>syncSubUI(($('.view.active')||{dataset:{}}).dataset.view),0);
    renderDashboard(); renderAnggota(); renderMetode(); renderPinjaman(); renderPembayaran(); renderCicilan(); fillSelects(); renderNotif();
    if(isAdmin()) renderAdminScopeOptions();
  }

  function animateStat(el, to, formatter){
    formatter = formatter || (v=>String(v));
    const from = Number(el.dataset.val || 0);
    to = Number(to) || 0;
    el.dataset.val = to;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion || from===to){ el.textContent = formatter(to); return; }
    if(el._statRaf) cancelAnimationFrame(el._statRaf);
    const dur=750, start=performance.now();
    (function tick(now){
      const p = Math.min(1, (now-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = formatter(Math.round(from + (to-from)*eased));
      if(p<1) el._statRaf = requestAnimationFrame(tick);
    })(start);
  }
  function animateDonut(donutEl, labelEl, to){
    const from = Number(donutEl.dataset.pct || 0);
    to = Number(to) || 0;
    donutEl.dataset.pct = to;
    const paint = v => { donutEl.style.background = `conic-gradient(var(--green) ${v}%, rgba(217,164,65,.12) ${v}%)`; labelEl.textContent = Math.round(v) + '%'; };
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion || from===to){ paint(to); return; }
    if(donutEl._donutRaf) cancelAnimationFrame(donutEl._donutRaf);
    const dur=900, start=performance.now();
    (function tick(now){
      const p = Math.min(1, (now-start)/dur);
      const eased = 1 - Math.pow(1-p, 3);
      paint(from + (to-from)*eased);
      if(p<1) donutEl._donutRaf = requestAnimationFrame(tick);
    })(start);
  }
  function renderDashboard(){
    if($('#kasAdd')) $('#kasAdd').style.display = isAdmin() ? 'none' : '';
    if($('#chartPeriodSelect')) $('#chartPeriodSelect').value = String(state.prefs.chartHari || 7);
    animateStat($('#stAnggota'), scopedAnggota().length);
    const berjalan = scopedPinjaman().filter(p=>p.status==='berjalan');
    const pengajuanMenunggu = scopedPinjaman().filter(p=>p.status==='pengajuan');
    const sisaTotal = berjalan.reduce((s,p)=>s+pinjamanSisa(p),0);
    animateStat($('#stPinjaman'), sisaTotal, rupiah);
    $('#stPinjamanCount').textContent = berjalan.length + ' pinjaman berjalan'
      + (pengajuanMenunggu.length ? ' · ' + pengajuanMenunggu.length + ' menunggu persetujuan' : '');
    const totalBayar = scopedPembayaran().reduce((s,b)=>s+b.jumlah_bayar,0);
    animateStat($('#stPembayaran'), totalBayar, rupiah);
    const lunas = scopedPinjaman().filter(p=>p.status==='lunas').length;
    animateStat($('#stLunas'), lunas);
    $('#loanBadge').textContent = berjalan.length;
    $('#loanBadge').style.display = berjalan.length>0 ? 'inline-flex' : 'none';

    const dayNames=['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    const todayStr = todayISO();
    const rentang = Number(state.prefs.chartHari) || 7;
    const days = [];
    for(let i=rentang-1;i>=0;i--){ const dt=new Date(); dt.setDate(dt.getDate()-i); days.push(dayNames[dt.getDay()]+(rentang>10?' '+dt.getDate():'')); }
    const buckets = new Array(rentang).fill(0);
    scopedPembayaran().forEach(b=>{
      if(!b.tanggal_bayar) return;
      const diff = diffDaysISO(todayStr, b.tanggal_bayar);
      if(diff>=0 && diff<rentang){ const idx=(rentang-1)-diff; buckets[idx]+= b.jumlah_bayar; }
    });
    const max=Math.max(...buckets,1);
    $('#chartBars').innerHTML = buckets.map((v,i)=>{
      const h=Math.max(14, Math.round((v/max)*100));
      const on = i===buckets.length-1;
      return `<div class="bar-wrap"><div class="bar ${on?'on':''}" style="height:0px;transition-delay:${i*40}ms" data-h="${h}"></div><span>${days[i]}</span></div>`;
    }).join('');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      $$('#chartBars .bar').forEach(b=> b.style.height = b.dataset.h + 'px');
    }));

    const pengajuanSorted = [...pengajuanMenunggu].sort((a,b)=>(a.tanggal_pinjaman||'').localeCompare(b.tanggal_pinjaman||''));
    const sorted = [...berjalan].sort((a,b)=>(a.tanggal_pinjaman||'').localeCompare(b.tanggal_pinjaman||''));
    const jatuhTempoList = berjalan.map(p=>({p, jt:jatuhTempoBerikutnya(p)})).filter(x=>x.jt)
      .map(x=>({p:x.p, jt:x.jt, sisa:sisaHari(x.jt.tanggal)}))
      .filter(x=> x.sisa<0 || x.sisa<=(state.prefs.hariJatuhTempo??3))
      .sort((a,b)=>a.sisa-b.sisa);
    let dueSisa = null;
    if(state.prefs.notifJatuhTempo && jatuhTempoList.length){
      const jt = jatuhTempoList[0];
      dueSisa = jt.sisa;
      const lewat = jt.sisa<0;
      $('#reminderTag').textContent = lewat ? 'Terlambat' : 'Jatuh Tempo';
      $('#reminderTitle').textContent = `Pinjaman ${jt.p.no} — ${anggotaName(jt.p.id_anggota)}`;
      $('#reminderTime').innerHTML = `Cicilan ke-${jt.jt.ke} · ${fmtDate(jt.jt.tanggal)} — `
        + (lewat ? `<b style="color:var(--red)">terlambat ${Math.abs(jt.sisa)} hari</b>` : jt.sisa===0 ? `<b>jatuh tempo hari ini</b>` : `<b>${jt.sisa} hari lagi</b>`)
        + (jatuhTempoList.length>1 ? ` · +${jatuhTempoList.length-1} cicilan lainnya` : '');
      $('#btnReminder').textContent = isAdmin() ? 'Lihat Pinjaman' : 'Catat Pembayaran';
      $('#btnReminder').onclick = isAdmin() ? (()=> openPinjamanDetail(jt.p.id)) : (()=> openPembayaran(jt.p.id, jt.jt.ke));
    } else if(pengajuanSorted.length){
      const pend = pengajuanSorted[0];
      $('#reminderTag').textContent = 'Perlu Perhatian';
      $('#reminderTitle').textContent = `Pengajuan ${pend.no} — ${anggotaName(pend.id_anggota)}`;
      $('#reminderTime').innerHTML = `Menunggu persetujuan: <b>${rupiah(pend.jumlah_pinjaman)}</b>`
        + (pengajuanSorted.length>1 ? ` · +${pengajuanSorted.length-1} pengajuan lainnya` : '');
      $('#btnReminder').textContent = 'Tinjau Pengajuan';
      $('#btnReminder').onclick = ()=> openPinjamanDetail(pend.id);
    } else {
      const attn = sorted[0];
      $('#reminderTag').textContent = 'Perlu Perhatian';
      $('#btnReminder').textContent = 'Lihat Pinjaman';
      if(attn){
        $('#reminderTitle').textContent = `Pinjaman ${attn.no} — ${anggotaName(attn.id_anggota)}`;
        $('#reminderTime').innerHTML = `Sisa pinjaman: <b>${rupiah(pinjamanSisa(attn))}</b> · dari total ${rupiah(attn.total_pinjaman)}`;
        const nearJt = berjalan.map(p=>({jt:jatuhTempoBerikutnya(p)})).filter(x=>x.jt)
          .map(x=>({jt:x.jt, sisa:sisaHari(x.jt.tanggal)})).sort((a,b)=>a.sisa-b.sisa)[0];
        if(nearJt){
          dueSisa = nearJt.sisa;
          $('#reminderTime').innerHTML += ` · Cicilan berikutnya ${fmtDate(nearJt.jt.tanggal)}`;
        }
        $('#btnReminder').onclick = ()=> openPinjamanDetail(attn.id);
      } else {
        $('#reminderTitle').textContent = 'Tidak ada pinjaman berjalan';
        $('#reminderTime').textContent = 'Semua pinjaman lunas 🎉';
        $('#btnReminder').onclick = ()=> goView('pinjaman');
      }
    }

    applyDueState(state.prefs.notifJatuhTempo ? dueSisa : null);

    const recentPembayaran = scopedPembayaran().map(b=>{
      const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
      return {t:'pembayaran',tgl:b.tanggal_bayar,id_anggota:p?p.id_anggota:null,label:'Cicilan ke-'+b.cicilan_ke,nominal:b.jumlah_bayar,tipe:'Setor'};
    });
    const recentPinjaman = scopedPinjaman().map(p=>({t:'pinjaman',tgl:p.tanggal_pinjaman,id_anggota:p.id_anggota,label:'Pencairan Pinjaman '+p.no,nominal:p.jumlah_pinjaman,tipe:'Tarik'}));
    const recent = [...recentPembayaran,...recentPinjaman].sort((a,b)=>(b.tgl||'').localeCompare(a.tgl||'')).slice(0,5);
    const icon = t => t==='pembayaran' ? {bg:'var(--green-light)',color:'var(--green-deep)',glyph:'B'} : {bg:'var(--amber-light)',color:'var(--amber)',glyph:'P'};
    // ikon aktivitas
    const txFoto = id_anggota => {
      const linkedUser = users.find(u=>u.id_anggota===id_anggota);
      return linkedUser && linkedUser.foto ? linkedUser.foto : null;
    };
    $('#dashTxList').innerHTML = recent.length ? recent.map(t=>{
      const ic = icon(t.t); const cls = t.tipe==='Setor'?'in':'out'; const sign=t.tipe==='Setor'?'+':'−';
      const foto = txFoto(t.id_anggota);
      const icoHtml = foto
        ? `<div class="list-ico" style="background-image:url('${foto}');background-size:cover;background-position:center;"></div>`
        : `<div class="list-ico" style="background:${ic.bg};color:${ic.color}">${initials(anggotaName(t.id_anggota))}</div>`;
      return `<div class="list-item">${icoHtml}
        <div><div class="t">${t.label}</div><div class="s">${anggotaName(t.id_anggota)} · ${fmtDate(t.tgl)}</div></div>
        <div class="amt amount ${cls}">${sign} ${rupiah(t.nominal)}</div></div>`;
    }).join('') : `<div class="empty">Belum ada aktivitas.</div>`;

    const today = todayISO();
    const kas = scopedPembayaran().filter(b=>b.tanggal_bayar===today).reduce((s,b)=>s+b.jumlah_bayar,0);
    $('#kasHariIni').textContent = rupiah(kas);

    const recentMembers = [...scopedAnggota()].sort((a,b)=>(b.tanggal_gabung||'').localeCompare(a.tanggal_gabung||'')).slice(0,4);
    $('#memberList').innerHTML = recentMembers.length ? recentMembers.map(m=>{
      const loanRunning = state.pinjaman.find(p=>p.id_anggota===m.id && p.status==='berjalan');
      const loanPending = state.pinjaman.find(p=>p.id_anggota===m.id && p.status==='pengajuan');
      let statusTxt=t('stAktif'), cls='aktif';
      if(loanPending){ statusTxt=t('stMenunggu'); cls='pending'; }
      else if(loanRunning){ statusTxt=t('stBerjalan'); cls='aktif'; }
      const linkedUser = users.find(u=>u.id_anggota===m.id);
      const foto = linkedUser && linkedUser.foto;
      const avHtml = foto ? `<div class="avatar" style="background-image:url('${foto}');background-size:cover;background-position:center;"></div>` : `<div class="avatar">${initials(m.nama)}</div>`;
      return `<div class="member-row">${avHtml}
        <div><div class="t">${m.nama}</div><div class="s">${m.no} · ${m.no_hp||''}</div></div>
        <span class="status-pill ${cls}">${statusTxt}</span></div>`;
    }).join('') : `<div class="empty">${t('emptyAnggota')}</div>`;

    const totalPinjamanKeseluruhan = scopedPinjaman().reduce((s,p)=>s+p.total_pinjaman,0);
    const totalTerbayar = scopedPembayaran().reduce((s,b)=>s+b.jumlah_bayar,0);
    const pct = totalPinjamanKeseluruhan ? Math.min(100, Math.round((totalTerbayar/totalPinjamanKeseluruhan)*100)) : 0;
    animateDonut($('#donut'), $('#donutPct'), pct);
    $('#legDone').textContent = rupiah(totalTerbayar);
    $('#legTarget').textContent = rupiah(totalPinjamanKeseluruhan);
  }

  // ===== ANIMASI BARIS TABEL =====
  function animateRows(tbodyId){
    const tbody = document.getElementById(tbodyId); if(!tbody) return;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduceMotion) return;
    [...tbody.children].forEach((row,i)=>{
      row.classList.remove('row-anim'); void row.offsetWidth;
      row.style.animationDelay = (i*35)+'ms';
      row.classList.add('row-anim');
    });
  }

  function renderAnggota(){
    renderDetailAnggota();
    // tombol tambah anggota
    const btnAdd = $('#btnAddAnggota2');
    if(btnAdd) btnAdd.style.display = isAdmin() ? '' : 'none';
    renderPendingBadge();
    const list = scopedAnggota();
    $('#anggotaBody').innerHTML = list.length ? list.map(m=>{
      const linkedUser = users.find(u=>u.id_anggota===m.id);
      const foto = linkedUser && linkedUser.foto;
      const avHtml = foto
        ? `<span class="avatar" style="width:38px;height:38px;border-radius:10px;background-image:url('${foto}');background-size:cover;background-position:center;box-shadow:0 0 0 2px var(--card),0 0 0 3px var(--green-soft);flex-shrink:0;"></span>`
        : `<span class="avatar" style="width:38px;height:38px;border-radius:10px;font-size:13px;flex-shrink:0;">${initials(m.nama)}</span>`;
      return `<tr><td class="mono">${m.no}</td>
      <td style="display:flex;align-items:center;gap:9px;">${avHtml}<div>${m.nama}${(isAdmin() && !linkedUser) ? '<span class="tag-manual" title="Tidak terhubung ke akun user">Manual</span>' : ''}</div></td>
      <td>${m.alamat||'-'}</td><td>${m.no_hp||'-'}</td><td>${fmtDate(m.tanggal_gabung)}</td>
      <td style="display:flex;gap:6px;">
        <button class="btn small outline" data-edit-anggota="${m.id}">${t('aksiEdit')}</button>
        ${isAdmin() ? `<button class="btn small outline" data-del-anggota="${m.id}">${t('aksiHapus')}</button>` : ''}
      </td></tr>`;
    }).join('') : `<tr><td colspan="6" class="empty">${(isAdmin() && adminViewScope==='semua') ? t('emptyAnggota') : (isAdmin() ? t('emptyAnggotaSaya') : 'Data keanggotaan Anda belum tercatat. Hubungi admin agar akun Anda ditambahkan sebagai anggota.')}</td></tr>`;
    $$('[data-edit-anggota]').forEach(b=>b.addEventListener('click', ()=> launchEditAnggota(b.dataset.editAnggota)));
    $$('[data-del-anggota]').forEach(b=>b.addEventListener('click', async ()=>{
      if(!isAdmin()){ toast('Hanya Admin yang dapat menghapus anggota'); return; }
      if(!confirm('Hapus anggota ini? Data pinjaman dan pembayaran milik anggota ini juga ikut terhapus.')) return;
      const idHapus = b.dataset.delAnggota;
      const idPinjamanHapus = new Set(state.pinjaman.filter(p=>p.id_anggota===idHapus).map(p=>p.id));
      state.anggota = state.anggota.filter(m=>m.id!==idHapus);
      state.pinjaman = state.pinjaman.filter(p=>p.id_anggota!==idHapus);
      state.pembayaran = state.pembayaran.filter(x=>!idPinjamanHapus.has(x.id_pinjaman));
      await persist('anggota');
      await lepasTautanAnggota();
      renderAll(); toast('Anggota dihapus');
    }));
  }


  function renderDetailAnggota(){
    const sel = $('#detailAnggotaSelect'); if(!sel) return;
    const list = scopedAnggota();
    const cur = sel.value;
    sel.innerHTML = list.map(m=>`<option value="${m.id}">${m.no} — ${m.nama}</option>`).join('');
    if(cur && list.some(m=>m.id===cur)) sel.value = cur;
    const m = list.find(x=>x.id===sel.value) || list[0];
    const box = $('#detailAnggotaBody');
    if(!m){ box.innerHTML = '<div class="empty">Belum ada data anggota.</div>'; return; }
    const linkedUser = users.find(u=>u.id_anggota===m.id);
    const foto = linkedUser && linkedUser.foto;
    const av = foto
      ? `<span class="avatar" style="width:64px;height:64px;border-radius:16px;background-image:url('${foto}');background-size:cover;background-position:center;"></span>`
      : `<span class="avatar" style="width:64px;height:64px;border-radius:16px;font-size:20px;">${initials(m.nama)}</span>`;
    const pj = state.pinjaman.filter(p=>p.id_anggota===m.id);
    const pjRows = pj.length ? pj.map(p=>{
      const st = pinjamanStatusLabel(p);
      return `<tr><td class="mono">${p.no}</td><td>${fmtDate(p.tanggal_pinjaman)}</td>
        <td style="text-align:right" class="mono">${rupiah(p.total_pinjaman)}</td>
        <td style="text-align:right" class="mono">${rupiah(pinjamanSisa(p))}</td>
        <td><span class="status-pill ${st.cls}">${st.txt}</span></td></tr>`;
    }).join('') : '<tr><td colspan="5" class="empty">Belum ada pinjaman.</td></tr>';
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">${av}
        <div><div style="font-size:17px;font-weight:800;">${m.nama}</div><div class="reminder-time" style="margin:0;">${m.no}</div></div></div>
      <div class="detail-grid">
        <div><small>Alamat</small><b>${m.alamat||'-'}</b></div>
        <div><small>No. HP</small><b>${m.no_hp||'-'}</b></div>
        <div><small>Tanggal Gabung</small><b>${fmtDate(m.tanggal_gabung)}</b></div>
        <div><small>Metode Pembayaran Terakhir</small><b>${(()=>{const mt=metodeTerakhir(m); return metodeNama(mt)+(mt.metode_pembayaran!=='qris' && mt.nama_bank ? ' · '+mt.nama_bank : '')+(mt.metode_pembayaran && mt.metode_pembayaran!=='qris' && mt.no_rekening ? ' · '+mt.no_rekening : '');})()}</b></div>
      </div>
      <h3 style="font-size:14px;margin:6px 0 8px;">Pinjaman Anggota</h3>
      <table><thead><tr><th>id_pinjaman</th><th>tanggal</th><th style="text-align:right">total_pinjaman</th><th style="text-align:right">sisa</th><th>status</th></tr></thead>
      <tbody>${pjRows}</tbody></table>`;
  }
  document.addEventListener('change', e=>{ if(e.target && e.target.id==='detailAnggotaSelect') renderDetailAnggota(); });

  function pinjamanStatusLabel(p){
    if(p.status==='lunas') return {cls:'lunas',txt:t('stLunas')};
    if(p.status==='ditolak') return {cls:'ditolak',txt:t('stDitolak')};
    if(p.status==='pengajuan') return {cls:'pending',txt:t('stMenunggu')};
    return {cls:'aktif',txt:t('stBerjalan')};
  }
  function renderPinjaman(){
    // tombol ajukan pinjaman
    const btnAddP = $('#btnAddPinjaman2');
    if(btnAddP) btnAddP.style.display = isAdmin() ? 'none' : '';
    const _f = SUB.pinjaman;
    const listP = scopedPinjaman().filter(p=>
      _f==='pengajuan' ? (p.status==='pengajuan' || p.status==='ditolak') :
      _f==='aktif' ? p.status==='berjalan' :
      _f==='selesai' ? p.status==='lunas' : true);
    $('#pinjamanBody').innerHTML = listP.length ? listP.map(p=>{
      const st = pinjamanStatusLabel(p);
      const aksiTxt = p.status==='pengajuan' ? (isAdmin() ? t('aksiTinjau') : t('aksiLihat')) : t('aksiKelola');
      return `<tr style="cursor:pointer" data-open-pinjaman="${p.id}">
      <td class="mono">${p.no}</td>
      <td>${anggotaNo(p.id_anggota)} — ${anggotaName(p.id_anggota)}</td>
      <td>${fmtDate(p.tanggal_pinjaman)}</td>
      <td style="text-align:right" class="mono">${rupiah(p.jumlah_pinjaman)}</td>
      <td>${p.tenor} bln</td><td>${p.bunga}%</td>
      <td style="text-align:right" class="mono">${rupiah(p.total_pinjaman)}</td>
      <td><span class="status-pill ${st.cls}">${st.txt}</span>${dueTagHtml(p)}</td>
      <td style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn small primary" data-open-pinjaman="${p.id}">${aksiTxt}</button>
      </td></tr>`;
    }).join('') : `<tr><td colspan="9" class="empty">${(isAdmin() && adminViewScope==='semua') ? t('emptyPinjaman') : t('emptyPinjamanSaya')}</td></tr>`;
    $$('[data-open-pinjaman]').forEach(b=>b.addEventListener('click', (e)=>{ e.stopPropagation(); openPinjamanDetail(b.dataset.openPinjaman); }));
  }

  function bayarMetodeText(b){
    if(!b || !b.metode_pembayaran) return '—';
    const nm = b.metode_pembayaran==='qris' ? 'QRIS' : (b.metode_pembayaran==='va' ? 'Virtual Account' : 'Transfer Rekening');
    return nm + (b.metode_pembayaran!=='qris' && b.nama_bank ? ' · '+b.nama_bank : '');
  }
  function metodeTerakhir(m){
    if(!m) return m;
    const ids = new Set(state.pinjaman.filter(p=>p.id_anggota===m.id).map(p=>p.id));
    const last = state.pembayaran.filter(b=>ids.has(b.id_pinjaman) && b.metode_pembayaran).pop();
    return last ? {metode_pembayaran:last.metode_pembayaran, nama_bank:last.nama_bank, no_rekening:last.no_rekening} : {};
  }
  function renderPembayaran(){
    // tombol catat pembayaran
    const btnAddB = $('#btnAddPembayaran');
    if(btnAddB) btnAddB.style.display = isAdmin() ? 'none' : '';
    const rows=[...scopedPembayaran()].sort((a,b)=>(b.tanggal_bayar||'').localeCompare(a.tanggal_bayar||''));
    $('#pembayaranBody').innerHTML = rows.length ? rows.map(b=>{
      const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
      return `<tr><td class="mono">${b.no}</td><td>${fmtDate(b.tanggal_bayar)}</td>
      <td class="mono">${p?p.no:'—'}</td><td>${p?anggotaName(p.id_anggota):'—'}</td>
      <td>ke-${b.cicilan_ke}</td><td>${bayarMetodeText(b)}</td><td style="text-align:right" class="amount in">+ ${rupiah(b.jumlah_bayar)}</td>
      <td style="text-align:right" class="mono">${b.denda>0 ? rupiah(b.denda) : '—'}</td>
      <td style="text-align:right" class="mono">${rupiah(b.sisa_pinjaman)}</td>
      <td>${b.bukti_foto
        ? `<img class="bukti-thumb" src="${b.bukti_foto}" data-lihat-bukti="${b.id}" title="${t('lihatBuktiTt')}">`
        : `<span class="reminder-time">${t('belumAdaFoto')}</span>`}</td></tr>`;
    }).join('') : `<tr><td colspan="10" class="empty">${(isAdmin() && adminViewScope==='semua') ? t('emptyPembayaran') : t('emptyPembayaranSaya')}</td></tr>`;
    $$('#pembayaranBody [data-lihat-bukti]').forEach(b=>b.addEventListener('click', ()=> lihatBuktiFoto(b.dataset.lihatBukti)));
  }

  function lihatBuktiFoto(pembayaranId){
    const b = state.pembayaran.find(x=>x.id===pembayaranId); if(!b || !b.bukti_foto) return;
    const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
    if(p && !canSeePinjaman(p)){ toast('Anda tidak dapat mengakses data anggota lain'); return; }
    lihatFotoZoom(b.bukti_foto);
  }
  function lihatFotoZoom(url){
    if(!url) return;
    $('#lightboxImg').src = url;
    openModal('#ovLightbox');
  }

  // tabel cicilan

  function cicilanRows(){
    const rows = [];
    scopedPembayaran().forEach(b=>{
      const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
      rows.push({no:b.no, id_anggota:p?p.id_anggota:null, pinjamanNo:p?p.no:'—', ke:b.cicilan_ke, tgl:b.tanggal_bayar, jumlah:b.jumlah_bayar, sisa:b.sisa_pinjaman, st:'dibayar'});
    });
    scopedPinjaman().filter(p=>p.status==='berjalan' && pinjamanSisa(p)>0 && p.tanggal_pinjaman).forEach(p=>{
      const dibayar = state.pembayaran.filter(b=>b.id_pinjaman===p.id).length;
      for(let ke=dibayar+1; ke<=p.tenor; ke++){
        const tgl = addMonths(p.tanggal_pinjaman, ke);
        rows.push({no:'—', id_anggota:p.id_anggota, pinjamanNo:p.no, ke, tgl, jumlah:cicilanNominal(p), sisa:null, st: sisaHari(tgl)<0 ? 'terlambat' : 'belum'});
      }
    });
    return rows;
  }
  function cicilanStatusPill(st){
    return st==='dibayar' ? {cls:'lunas',txt:'Sudah Dibayar'} : st==='terlambat' ? {cls:'ditolak',txt:'Terlambat'} : {cls:'pending',txt:'Belum Dibayar'};
  }

  function renderCicilan(){
    const f = SUB.cicilan;
    const rows = cicilanRows()
      .filter(r=> f==='dibayar' ? r.st==='dibayar' : f==='belum' ? r.st!=='dibayar' : true)
      .sort((a,b)=> f==='belum' ? (a.tgl||'').localeCompare(b.tgl||'') : (b.tgl||'').localeCompare(a.tgl||''));
    const orang = r => `${anggotaNo(r.id_anggota)} — ${anggotaName(r.id_anggota)}`;
    let cols;
    if(f==='belum'){
      cols = [
        {h:'id_anggota', c:r=>orang(r)},
        {h:'id_pinjaman', c:r=>`<span class="mono">${r.pinjamanNo}</span>`},
        {h:'cicilan_ke', c:r=>'ke-'+r.ke},
        {h:'jatuh_tempo', c:r=>fmtDate(r.tgl)},
        {h:'jumlah', right:true, c:r=>`<span class="mono">${rupiah(r.jumlah)}</span>`},
        {h:'sisa_waktu', c:r=>{ const s=sisaHari(r.tgl); return s<0 ? `Terlambat ${Math.abs(s)} hari` : s===0 ? 'Jatuh tempo hari ini' : s+' hari lagi'; }},
        {h:'status', c:r=>{ const st=cicilanStatusPill(r.st); return `<span class="status-pill ${st.cls}">${st.txt}</span>`; }},
      ];
    } else if(f==='dibayar'){
      cols = [
        {h:'id_cicilan', c:r=>`<span class="mono">${r.no}</span>`},
        {h:'id_anggota', c:r=>orang(r)},
        {h:'id_pinjaman', c:r=>`<span class="mono">${r.pinjamanNo}</span>`},
        {h:'cicilan_ke', c:r=>'ke-'+r.ke},
        {h:'tanggal_bayar', c:r=>fmtDate(r.tgl)},
        {h:'jumlah_bayar', right:true, c:r=>`<span class="mono">${rupiah(r.jumlah)}</span>`},
        {h:'sisa_pinjaman', right:true, c:r=>`<span class="mono">${rupiah(r.sisa)}</span>`},
        {h:'status', c:r=>{ const st=cicilanStatusPill(r.st); return `<span class="status-pill ${st.cls}">${st.txt}</span>`; }},
      ];
    } else {
      cols = [
        {h:'id_anggota', c:r=>orang(r)},
        {h:'id_pinjaman', c:r=>`<span class="mono">${r.pinjamanNo}</span>`},
        {h:'cicilan_ke', c:r=>'ke-'+r.ke},
        {h:'tanggal', c:r=>fmtDate(r.tgl)},
        {h:'jumlah', right:true, c:r=>`<span class="mono">${rupiah(r.jumlah)}</span>`},
        {h:'status', c:r=>{ const st=cicilanStatusPill(r.st); return `<span class="status-pill ${st.cls}">${st.txt}</span>`; }},
      ];
    }
    $('#cicilanHead').innerHTML = '<tr>' + cols.map(c=>`<th${c.right?' style="text-align:right"':''}>${c.h}</th>`).join('') + '</tr>';
    $('#cicilanBody').innerHTML = rows.length
      ? rows.map(r=>'<tr>' + cols.map(c=>`<td${c.right?' style="text-align:right"':''}>${c.c(r)}</td>`).join('') + '</tr>').join('')
      : `<tr><td colspan="${cols.length}" class="empty">${f==='belum' ? 'Tidak ada cicilan yang belum dibayar.' : ((isAdmin() && adminViewScope==='semua') ? t('emptyCicilan') : t('emptyCicilanSaya'))}</td></tr>`;
  }

  // ===== LAPORAN =====
  const BULAN_NAMA = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  function lapPeriodRange(){
    const jenis = $('#lapJenis').value;
    const val = $('#lapNilai').value;
    const now = new Date();
    if(jenis==='harian'){
      const d = val || todayISO();
      return {start:d, end:d, label:fmtDate(d)};
    }
    if(jenis==='tahunan'){
      const y = Number(val) || now.getFullYear();
      return {start:`${y}-01-01`, end:`${y}-12-31`, label:'Tahun '+y};
    }
    const v = val || (now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0'));
    const [y,m] = v.split('-').map(Number);
    const start = `${y}-${String(m).padStart(2,'0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${y}-${String(m).padStart(2,'0')}-${String(lastDay).padStart(2,'0')}`;
    return {start, end, label:BULAN_NAMA[m-1]+' '+y};
  }
  function lapData(){
    const {start,end,label} = lapPeriodRange();
    const pinjamanCair = scopedPinjaman().filter(p=>p.tanggal_pinjaman>=start && p.tanggal_pinjaman<=end);
    const pembayaranMasuk = scopedPembayaran().filter(b=>b.tanggal_bayar>=start && b.tanggal_bayar<=end);
    const pinjamanLunasPeriode = scopedPinjaman().filter(p=>{
      if(p.status!=='lunas') return false;
      const riw = scopedPembayaran().filter(b=>b.id_pinjaman===p.id);
      if(!riw.length) return false;
      const tglLunas = riw.reduce((mx,b)=> (b.tanggal_bayar>mx?b.tanggal_bayar:mx), riw[0].tanggal_bayar);
      return tglLunas>=start && tglLunas<=end;
    });
    return {start,end,label,pinjamanCair,pembayaranMasuk,pinjamanLunasPeriode};
  }
  function lapRows(d){
    const rows = [
      ...d.pinjamanCair.map(p=>({tgl:p.tanggal_pinjaman, jenis:'Pencairan Pinjaman', anggota:anggotaName(p.id_anggota), ket:p.no, nominal:p.jumlah_pinjaman, tipe:'out'})),
      ...d.pembayaranMasuk.map(b=>{ const p=state.pinjaman.find(x=>x.id===b.id_pinjaman);
        return {tgl:b.tanggal_bayar, jenis:'Pembayaran Cicilan', anggota:p?anggotaName(p.id_anggota):'-', ket:(p?p.no:'-')+' · ke-'+b.cicilan_ke, nominal:b.jumlah_bayar, tipe:'in'}; })
    ];
    return rows.sort((a,b)=>(a.tgl||'').localeCompare(b.tgl||''));
  }

  function lapTable(d, mode){
    const R = 'style="text-align:right"';
    const inRange = x => x && x>=d.start && x<=d.end;
    if(mode==='anggota'){
      const rows = scopedAnggota().filter(m=>inRange(m.tanggal_gabung));
      return {judul:'Laporan Anggota', head:['Tanggal Gabung','ID','Nama','Alamat','No. HP','Metode'], right:[],
        rows: rows.map(m=>[fmtDate(m.tanggal_gabung), m.no, m.nama, m.alamat||'-', m.no_hp||'-', metodeNama(metodeTerakhir(m))]), empty:'Tidak ada anggota baru pada periode ini.'};
    }
    if(mode==='pinjaman'){
      return {judul:'Laporan Pinjaman', head:['Tanggal','ID','Anggota','Jumlah','Tenor','Total','Status'], right:[3,5],
        rows: d.pinjamanCair.map(p=>[fmtDate(p.tanggal_pinjaman), p.no, anggotaName(p.id_anggota), rupiah(p.jumlah_pinjaman), p.tenor+' bln', rupiah(p.total_pinjaman), pinjamanStatusLabel(p).txt]), empty:'Tidak ada pinjaman pada periode ini.'};
    }
    if(mode==='cicilan'){
      const rows = cicilanRows().filter(r=>inRange(r.tgl)).sort((a,b)=>(a.tgl||'').localeCompare(b.tgl||''));
      return {judul:'Laporan Cicilan', head:['Tanggal','Anggota','Pinjaman','Cicilan','Nominal','Status'], right:[4],
        rows: rows.map(r=>[fmtDate(r.tgl), anggotaName(r.id_anggota), r.pinjamanNo, 'ke-'+r.ke, rupiah(r.jumlah), cicilanStatusPill(r.st).txt]), empty:'Tidak ada cicilan pada periode ini.'};
    }
    return {judul:'Laporan Pembayaran', head:['Tanggal','Anggota','Pinjaman','Cicilan','Jumlah','Denda'], right:[4,5],
      rows: d.pembayaranMasuk.slice().sort((a,b)=>(a.tanggal_bayar||'').localeCompare(b.tanggal_bayar||'')).map(b=>{
        const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
        return [fmtDate(b.tanggal_bayar), p?anggotaName(p.id_anggota):'-', p?p.no:'-', 'ke-'+b.cicilan_ke, rupiah(b.jumlah_bayar), b.denda>0?rupiah(b.denda):'—'];
      }), empty:'Tidak ada pembayaran pada periode ini.'};
  }

  function renderLaporan(){
    if(!$('#lapNilai').value){
      const jenis=$('#lapJenis').value, now=new Date();
      if(jenis==='harian') $('#lapNilai').value = todayISO();
      else if(jenis==='tahunan') $('#lapNilai').value = now.getFullYear();
      else $('#lapNilai').value = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
    }
    const d = lapData();
    $('#lapPeriodeLabel').textContent = d.label;
    const totalCair = d.pinjamanCair.reduce((s,p)=>s+p.jumlah_pinjaman,0);
    const totalMasuk = d.pembayaranMasuk.reduce((s,b)=>s+b.jumlah_bayar,0);
    $('#lapCair').textContent = rupiah(totalCair);
    $('#lapCairCount').textContent = d.pinjamanCair.length + ' pinjaman';
    $('#lapMasuk').textContent = rupiah(totalMasuk);
    $('#lapMasukCount').textContent = d.pembayaranMasuk.length + ' transaksi';
    $('#lapLunas').textContent = d.pinjamanLunasPeriode.length;
    $('#lapTransaksi').textContent = d.pinjamanCair.length + d.pembayaranMasuk.length;
    const tb = lapTable(d, SUB.laporan);
    $('#lapJudul').textContent = tb.judul;
    $('#lapHead').innerHTML = '<tr>' + tb.head.map((h,i)=>`<th${tb.right.includes(i)?' style="text-align:right"':''}>${h}</th>`).join('') + '</tr>';
    $('#lapBody').innerHTML = tb.rows.length ? tb.rows.map(r=>
      '<tr>' + r.map((c,i)=>`<td${tb.right.includes(i)?' style="text-align:right" class="mono"':''}>${c}</td>`).join('') + '</tr>'
    ).join('') : `<tr><td colspan="${tb.head.length}" class="empty">${tb.empty}</td></tr>`;
    animateRows('lapBody');
    const _bc = $('#lapBuktiCard'); if(_bc) _bc.style.display = SUB.laporan==='pembayaran' ? '' : 'none';
    const buktiList = d.pembayaranMasuk.filter(b=>b.bukti_foto);
    $('#lapBukti').innerHTML = buktiList.length ? buktiList.map(b=>{
      const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
      return `<img class="bukti-thumb" style="width:64px;height:64px;" src="${b.bukti_foto}" data-lihat-bukti="${b.id}" title="${p?anggotaName(p.id_anggota):''} · ${fmtDate(b.tanggal_bayar)}">`;
    }).join('') : `<div class="empty">Belum ada foto bukti pembayaran pada periode ini.</div>`;
    $$('#lapBukti [data-lihat-bukti]').forEach(el=>el.addEventListener('click', ()=> lihatBuktiFoto(el.dataset.lihatBukti)));
  }
  $('#lapJenis').addEventListener('change', ()=>{
    const jenis = $('#lapJenis').value, inp = $('#lapNilai');
    if(jenis==='harian'){ inp.type='date'; inp.removeAttribute('min'); inp.removeAttribute('max'); $('#lapNilaiLabel').textContent='Tanggal'; }
    else if(jenis==='tahunan'){ inp.type='number'; inp.min=2000; inp.max=2100; $('#lapNilaiLabel').textContent='Tahun'; }
    else { inp.type='month'; inp.removeAttribute('min'); inp.removeAttribute('max'); $('#lapNilaiLabel').textContent='Bulan'; }
    inp.value='';
    renderLaporan();
  });
  $('#lapNilai').addEventListener('change', renderLaporan);
  $('#btnCetakLaporan').addEventListener('click', ()=>{
    const d = lapData();
    const totalCair = d.pinjamanCair.reduce((s,p)=>s+p.jumlah_pinjaman,0);
    const totalMasuk = d.pembayaranMasuk.reduce((s,b)=>s+b.jumlah_bayar,0);
    const tb = lapTable(d, SUB.laporan);
    const rowsHtml = tb.rows.length ? tb.rows.map(r=>
      '<tr>' + r.map((c,i)=>`<td${tb.right.includes(i)?' style="text-align:right"':''}>${c}</td>`).join('') + '</tr>'
    ).join('') : `<tr><td colspan="${tb.head.length}" style="text-align:center;padding:10px;">${tb.empty}</td></tr>`;
    // lampiran bukti
    const buktiCetak = SUB.laporan==='pembayaran' ? d.pembayaranMasuk.filter(b=>b.bukti_foto) : [];
    const buktiHtml = buktiCetak.length ? `
      <div class="p-total" style="margin-top:18px;">Lampiran Bukti Pembayaran (${buktiCetak.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
        ${buktiCetak.map(b=>{
          const p = state.pinjaman.find(x=>x.id===b.id_pinjaman);
          return `<div style="width:140px;text-align:center;font-size:10.5px;">
            <img src="${b.bukti_foto}" style="width:100%;height:140px;object-fit:cover;border:1px solid #ccc;border-radius:6px;">
            <div>${p?anggotaName(p.id_anggota):''}</div>
            <div>${fmtDate(b.tanggal_bayar)} · cicilan ke-${b.cicilan_ke}</div>
          </div>`;
        }).join('')}
      </div>` : '';
    $('#printArea').innerHTML = `
      <div class="p-head">
        <h2>${state.prefs.namaKoperasi || "Aliyah's Money"}</h2>
        <p>${tb.judul} — ${d.label}</p>
      </div>
      <table class="p-kv">
        <tr><td>Total Pinjaman Dicairkan</td><td style="text-align:right">${rupiah(totalCair)} (${d.pinjamanCair.length} pinjaman)</td></tr>
        <tr><td>Total Pembayaran Diterima</td><td style="text-align:right">${rupiah(totalMasuk)} (${d.pembayaranMasuk.length} transaksi)</td></tr>
        <tr><td>Pinjaman Lunas pada Periode Ini</td><td style="text-align:right">${d.pinjamanLunasPeriode.length}</td></tr>
      </table>
      <table class="p-detail">
        <thead><tr>${tb.head.map((h,i)=>`<th${tb.right.includes(i)?' style="text-align:right"':''}>${h}</th>`).join('')}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>
      ${buktiHtml}
      <div class="p-ttd"><div class="p-ttd-top">Disahkan oleh,</div><svg viewBox="0 0 160 70" width="150" height="66" fill="none" stroke="#1b2a4a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:block;margin:4px auto 0;"><path d="M10 56 C16 44 26 22 36 10 C42 4 47 10 46 22 C45 36 40 50 34 58 M36 40 C48 30 60 32 62 42 C63 50 56 56 52 52 C60 36 74 24 84 26 C92 28 88 42 82 50 C94 38 108 24 120 28 C128 31 122 44 118 50 C132 40 144 24 154 12"/><path d="M8 62 C46 58 96 64 156 50" stroke-width="1.8"/></svg><div class="p-ttd-name">${state.prefs.namaKoperasi || "Aliyah's Money"}</div></div>
      <div class="p-total">Dicetak: ${fmtDate(todayISO())}</div>`;
    window.print();
  });

  // ===== CETAK BUKTI PELUNASAN =====
  function cetakBuktiPelunasan(pid){
    const p = state.pinjaman.find(x=>x.id===pid); if(!p) return;
    if(!canSeePinjaman(p)){ toast('Anda tidak dapat mengakses data anggota lain'); return; }
    if(p.status!=='lunas'){ toast('Pinjaman belum lunas, bukti pelunasan belum bisa dicetak'); return; }
    const a = state.anggota.find(x=>x.id===p.id_anggota);
    const riwayat = state.pembayaran.filter(b=>b.id_pinjaman===p.id).sort((x,y)=>x.cicilan_ke-y.cicilan_ke);
    const tglLunas = riwayat.length ? riwayat.reduce((mx,b)=> (b.tanggal_bayar>mx?b.tanggal_bayar:mx), riwayat[0].tanggal_bayar) : p.tanggal_pinjaman;
    const totalDibayar = riwayat.reduce((s,b)=>s+b.jumlah_bayar,0);
    const totalDenda = riwayat.reduce((s,b)=>s+(b.denda||0),0);
    const rows = riwayat.map(b=>`<tr><td>${b.cicilan_ke}</td><td>${fmtDate(b.tanggal_bayar)}</td><td style="text-align:right">${rupiah(b.jumlah_bayar)}</td><td style="text-align:right">${b.denda>0?rupiah(b.denda):'—'}</td></tr>`).join('');
    // lampiran bukti
    const buktiRiwayat = riwayat.filter(b=>b.bukti_foto);
    const buktiHtml = buktiRiwayat.length ? `
      <div class="p-total" style="margin-top:18px;">Lampiran Bukti Pembayaran (${buktiRiwayat.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:8px;">
        ${buktiRiwayat.map(b=>`<div style="width:140px;text-align:center;font-size:10.5px;">
            <img src="${b.bukti_foto}" style="width:100%;height:140px;object-fit:cover;border:1px solid #ccc;border-radius:6px;">
            <div>Cicilan ke-${b.cicilan_ke}</div>
            <div>${fmtDate(b.tanggal_bayar)}</div>
          </div>`).join('')}
      </div>` : '';
    $('#printArea').innerHTML = `
      <div class="p-head">
        <h2>${state.prefs.namaKoperasi || "Aliyah's Money"}</h2>
        <p>Bukti Pelunasan Pinjaman</p>
      </div>
      <table class="p-kv">
        <tr><td>No. Pinjaman</td><td>: ${p.no}</td></tr>
        <tr><td>Nama Anggota</td><td>: ${a?a.nama:'-'}</td></tr>
        <tr><td>No. Anggota</td><td>: ${a?a.no:'-'}</td></tr>
        <tr><td>Tanggal Pinjaman</td><td>: ${fmtDate(p.tanggal_pinjaman)}</td></tr>
        <tr><td>Jumlah Pinjaman</td><td>: ${rupiah(p.jumlah_pinjaman)}</td></tr>
        <tr><td>Bunga</td><td>: ${p.bunga}%</td></tr>
        <tr><td>Total Pinjaman</td><td>: ${rupiah(p.total_pinjaman)}</td></tr>
        <tr><td>Tanggal Lunas</td><td>: ${fmtDate(tglLunas)}</td></tr>
      </table>
      <table class="p-detail">
        <thead><tr><th>Cicilan Ke-</th><th>Tanggal Bayar</th><th style="text-align:right">Jumlah Bayar</th><th style="text-align:right">Denda</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      ${buktiHtml}
      <div class="p-total">Total Dibayar: ${rupiah(totalDibayar)}${totalDenda>0?' (termasuk denda '+rupiah(totalDenda)+')':''}</div>
      <div class="p-sign">
        <div>
          <div>${state.prefs.namaKoperasi || "Aliyah's Money"}, ${fmtDate(todayISO())}</div>
          <div class="line">( ${currentUser ? currentUser.nama : 'Admin'} )</div>
        </div>
      </div>`;
    window.print();
  }

  function fillSelects(){
    const optsAnggota = scopedAnggota().map(m=>`<option value="${m.id}">${m.no} — ${m.nama}</option>`).join('');
    $('#pAnggota').innerHTML = optsAnggota || `<option value="">${(isAdmin() && adminViewScope==='semua') ? 'Belum ada anggota' : 'Akun Anda belum terhubung ke anggota'}</option>`;
  }

  // ===== MODAL =====
  function openModal(id){ $(id).classList.add('active'); }
  function closeModal(id){ $(id).classList.remove('active'); }
  $$('[data-close]').forEach(b=>b.addEventListener('click', e=> closeModal('#'+e.target.closest('.overlay').id)));
  $$('.overlay').forEach(ov=>ov.addEventListener('click', e=>{ if(e.target===ov) closeModal('#'+ov.id); }));

  // ===== ANGGOTA =====
  let editingAnggotaId = null;
  function updateNoRekeningLabel(animate){
    const metode = $('#fMetode').value;
    $('#fNoRekeningWrap').style.display = metode==='qris' ? 'none' : '';
    $('#fQrisWrap').style.display = metode==='qris' ? '' : 'none';
    $('#fNoRekeningLabel').textContent = metode==='va' ? 'No. Virtual Account (no_rekening)' : 'No. Rekening (no_rekening)';
    $('#fNoRekening').placeholder = metode==='va' ? 'cth. VA 8801234567' : 'cth. BCA 1234567890 a.n. Siti Rahma';
    syncMetodeCards(animate === true);
  }
  $('#fMetode').addEventListener('change', ()=> updateNoRekeningLabel(true));

  // ===== FOTO QRIS ADMIN =====
  function renderQrisAdminPreview(){
    const foto = state.prefs.qrisAdminFoto;
    const prev = $('#qrisAdminPreview'), ph = $('#qrisAdminPlaceholder'), hapus = $('#qrisAdminHapus');
    if(prev && !prev.dataset.zoomBound){ prev.dataset.zoomBound='1'; prev.style.cursor='zoom-in'; prev.addEventListener('click', e=>{ e.preventDefault(); if(prev.src) lihatFotoZoom(prev.src); }); }
    if(prev && ph && hapus){
      if(foto){ if(prev.src!==foto) prev.src = foto; prev.style.display = 'block'; ph.style.display = 'none'; hapus.style.display = 'inline-flex'; }
      else { prev.style.display = 'none'; prev.src=''; ph.style.display = 'flex'; hapus.style.display = 'none'; }
    }
    const wrap = $('#qrisAdminWrap');
    if(wrap) wrap.style.display = isAdmin() ? '' : 'none';
    // pratinjau QRIS
    const modalPrev = $('#fQrisAdminPreview');
    if(modalPrev){
      if(foto){ if(modalPrev.src!==foto) modalPrev.src = foto; modalPrev.style.display = 'block'; }
      else { modalPrev.style.display = 'none'; }
      if(!modalPrev.dataset.zoomBound){ modalPrev.dataset.zoomBound='1'; modalPrev.style.cursor='zoom-in'; modalPrev.addEventListener('click', ()=>{ if(modalPrev.src) lihatFotoZoom(modalPrev.src); }); }
    }
  }
  $('#qrisAdminInput') && $('#qrisAdminInput').addEventListener('change', async (e)=>{
    const file = e.target.files && e.target.files[0]; e.target.value = '';
    if(!file || !isAdmin()) return;
    try{
      const dataUrl = await resizeImageFile(file, 700);
      state.prefs.qrisAdminFoto = dataUrl;
      await persistPrefsPatch({qrisAdminFoto: dataUrl});
      renderQrisAdminPreview(); renderMetode();
      toast('Foto QRIS resmi diperbarui');
    }catch(err){ toast('Gagal memuat foto, coba file lain'); }
  });
  $('#qrisAdminHapus') && $('#qrisAdminHapus').addEventListener('click', async (e)=>{
    e.preventDefault(); if(!isAdmin()) return;
    state.prefs.qrisAdminFoto = null;
    await persistPrefsPatch({qrisAdminFoto: null});
    renderQrisAdminPreview(); renderMetode();
    toast('Foto QRIS resmi dihapus');
  });
  // akun user yang belum tercatat sebagai anggota
  function pendingAkun(){
    return users.filter(u=>u.role!=='admin' && !(u.id_anggota && state.anggota.some(a=>a.id===u.id_anggota)));
  }
  function renderPendingBadge(){
    if(!isAdmin()) return;
    const n = pendingAkun().length;
    ['#pendingAkunBadge','#pendingAkunBadge2','#tabOtoCount'].forEach(sel=>{
      const el = $(sel); if(!el) return;
      el.textContent = n; el.style.display = n ? '' : 'none';
    });
  }
  function renderPendingAkun(){
    const box = $('#pendingAkunList'); if(!box) return;
    const list = pendingAkun();
    renderPendingBadge();
    if(!list.length){
      box.innerHTML = `<div class="empty">Semua akun user sudah tercatat sebagai anggota. Akun baru yang mendaftar di web User akan otomatis masuk ke daftar Anggota.</div>`;
      return;
    }
    box.innerHTML = `<button type="button" class="pending-all" id="pendingPilihSemua">Pilih / lepas semua</button>` + list.map(u=>{
      const av = u.foto
        ? `<span class="avatar" style="background-image:url('${u.foto}');background-size:cover;background-position:center;"></span>`
        : `<span class="avatar">${initials(u.nama)}</span>`;
      return `<label class="pending-row"><input type="checkbox" value="${u.id}" checked>${av}<div><div class="t">${escHtml(u.nama)}</div><div class="s">@${escHtml(u.username)}</div></div></label>`;
    }).join('');
    $('#pendingPilihSemua').addEventListener('click', ()=>{
      const cbs = $$('#pendingAkunList input[type=checkbox]');
      const semua = cbs.every(c=>c.checked);
      cbs.forEach(c=> c.checked = !semua);
    });
  }
  function setAnggotaTab(tab){
    const oto = tab==='otomatis' && !!$('#paneOtomatis');
    $$('#anggotaTabs button').forEach(b=> b.classList.toggle('active', b.dataset.tab===(oto?'otomatis':'manual')));
    if($('#paneOtomatis')) $('#paneOtomatis').style.display = oto ? '' : 'none';
    $('#paneManual').style.display = oto ? 'none' : '';
    if($('#adoptAnggota')) $('#adoptAnggota').style.display = oto ? '' : 'none';
    $('#saveAnggota').style.display = oto ? 'none' : '';
  }
  $$('#anggotaTabs button').forEach(b=> b.addEventListener('click', ()=> setAnggotaTab(b.dataset.tab)));
  async function launchAddAnggota(){
    if(!isAdmin()){ toast('Hanya admin yang dapat menambah anggota'); return; }
    editingAnggotaId = null;
    await loadUsers(); await loadAll();
    $('#anggotaModalTitle').textContent='Tambah Anggota';
    $('#saveAnggota').textContent='Simpan';
    $('#fNama').value=''; $('#fAlamat').value=''; $('#fHp').value=''; $('#fTanggalGabung').value=todayISO();
    if($('#anggotaTabs')) $('#anggotaTabs').style.display='';
    renderPendingAkun();
    setAnggotaTab(pendingAkun().length ? 'otomatis' : 'manual');
    openModal('#ovAnggota');
  }
  function launchEditAnggota(id){
    const m = state.anggota.find(x=>x.id===id);
    if(!m){ toast('Data anggota tidak ditemukan'); return; }
    if(!isAdmin() && m.id!==myAnggotaId()){ toast('Anda tidak dapat mengubah data anggota lain'); return; }
    editingAnggotaId = id;
    if($('#anggotaTabs')) $('#anggotaTabs').style.display='none';
    setAnggotaTab('manual');
    $('#anggotaModalTitle').textContent='Edit Anggota';
    $('#saveAnggota').textContent='Simpan Perubahan';
    $('#fNama').value=m.nama||''; $('#fAlamat').value=m.alamat||''; $('#fHp').value=m.no_hp||'';
    $('#fTanggalGabung').value=m.tanggal_gabung||todayISO();
    openModal('#ovAnggota');
  }

  // ===== METODE PEMBAYARAN =====
  let editingMetodeId = null;

  // ===== PENGATURAN METODE (di Riwayat Pembayaran) =====
  const BANKS = ['BCA','BRI','BNI','Mandiri','BSI','CIMB Niaga','Permata','BTN','Danamon','Bank Mega','Panin','OCBC','Maybank','Bank Jago','SeaBank','Jenius (BTPN)','Bank Muamalat','BCA Syariah','Bank DKI','BJB','Bank Sumsel Babel'];
  let metodeDraft = null;
  function metodeLabelOf(k){ return k==='qris' ? 'QRIS' : k==='va' ? 'Virtual Account' : 'Transfer Rekening'; }
  function attrEsc(x){ return String(x==null?'':x).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
  function drawMetodeSetup(){
    const card = $('#metodeSetupCard'); if(!card || !metodeDraft) return;
    const m = state.anggota.find(x=>x.id===metodeDraft.id); if(!m) return;
    const d = metodeDraft;
    const opts = [['rekening','Transfer Rekening','Transfer ke rekening bank'],['va','Virtual Account','Bayar lewat nomor VA bank'],['qris','QRIS','Scan QRIS resmi']];
    const tersimpan = m.metode_pembayaran
      ? 'Tersimpan: ' + metodeLabelOf(m.metode_pembayaran) + (m.nama_bank ? ' · '+m.nama_bank : '') + (m.metode_pembayaran!=='qris' && m.no_rekening ? ' · '+m.no_rekening : '')
      : 'Belum ada metode tersimpan';
    card.innerHTML = `
      <div class="card-head"><h3>Metode Pembayaran Saya</h3></div>
      <div class="metode-opts">${opts.map(o=>`<button type="button" class="metode-opt${d.metode===o[0]?' on':''}" data-pick-metode="${o[0]}"><b>${o[1]}</b><small>${o[2]}</small></button>`).join('')}</div>
      ${(d.metode==='rekening'||d.metode==='va') ? `
        <div class="metode-step"><label>Pilih Bank</label>
          <div class="bank-grid">${BANKS.map(b=>`<button type="button" class="bank-chip${d.bank===b?' on':''}" data-pick-bank="${attrEsc(b)}">${b}</button>`).join('')}</div></div>
        ${d.bank ? `<div class="metode-step"><label>${d.metode==='va'?'Nomor Virtual Account':'Nomor Rekening'} ${attrEsc(d.bank)}</label>
          <input class="field" id="inpNoBank" inputmode="numeric" placeholder="Masukkan nomor" value="${attrEsc(d.nomor)}" style="max-width:340px;"></div>` : ''}
      ` : ''}
      ${d.metode==='qris' ? `<div class="reminder-time" style="margin:12px 0 0;">QRIS memakai kode resmi dari Admin. Setelah disimpan, kamu otomatis masuk kelompok QRIS.</div>` : ''}
      <div style="margin-top:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        <button type="button" class="btn primary" id="btnSimpanMetode"${d.metode?'':' disabled'}>Simpan Metode</button>
        <span class="reminder-time" style="margin:0;">${attrEsc(tersimpan)}</span>
      </div>`;
  }
  function renderMetodeSetup(force){
    const card = $('#metodeSetupCard'); if(!card) return;
    const m = state.anggota.find(x=>x.id===myAnggotaId());
    card.classList.toggle('hide-by-sub', !m);
    if(!m) return;
    if(!force && metodeDraft && metodeDraft.id===m.id && card.contains(document.activeElement)) return;
    if(force || !metodeDraft || metodeDraft.id!==m.id){
      metodeDraft = {id:m.id, metode:m.metode_pembayaran||'', bank:m.nama_bank||'',
        nomor:(m.metode_pembayaran && m.metode_pembayaran!=='qris') ? (m.no_rekening||'') : ''};
    }
    drawMetodeSetup();
  }
  async function simpanMetodeSetup(){
    const d = metodeDraft; if(!d) return;
    const m = state.anggota.find(x=>x.id===d.id);
    if(!m){ toast('Data anggota tidak ditemukan'); return; }
    if(m.id!==myAnggotaId()){ toast('Anda hanya dapat mengatur metode pembayaran akun Anda sendiri'); return; }
    if(!d.metode){ toast('Pilih metode pembayaran dulu'); return; }
    let nomor = '';
    if(d.metode!=='qris'){
      if(!d.bank){ toast('Pilih bank dulu'); return; }
      nomor = (d.nomor||'').replace(/[\s-]/g,'');
      if(!/^\d{5,20}$/.test(nomor)){ toast('Nomor harus berupa angka (5–20 digit)'); return; }
    }
    m.metode_pembayaran = d.metode;
    m.nama_bank = d.metode==='qris' ? '' : d.bank;
    m.no_rekening = nomor;
    m.foto_qris = null;
    await persist('anggota');
    renderAll(); renderMetodeSetup(true);
    toast('Metode disimpan — masuk kelompok ' + metodeLabelOf(d.metode));
  }
  document.addEventListener('click', async e=>{
    if(!e.target.closest('#metodeSetupCard') || !metodeDraft) return;
    const pm = e.target.closest('[data-pick-metode]');
    if(pm){
      const baru = pm.dataset.pickMetode;
      if(baru==='qris'){ metodeDraft.bank=''; metodeDraft.nomor=''; }
      else if(metodeDraft.metode!==baru){ metodeDraft.nomor=''; }
      metodeDraft.metode = baru; drawMetodeSetup(); return;
    }
    const pb = e.target.closest('[data-pick-bank]');
    if(pb){ metodeDraft.bank = pb.dataset.pickBank; drawMetodeSetup(); const i=$('#inpNoBank'); if(i) i.focus(); return; }
    if(e.target.closest('#btnSimpanMetode')) await simpanMetodeSetup();
  });
  document.addEventListener('input', e=>{ if(e.target && e.target.id==='inpNoBank' && metodeDraft) metodeDraft.nomor = e.target.value; });

  function metodeNama(m){ return !m || !m.metode_pembayaran ? t('metodeBelumDiatur') : (m.metode_pembayaran==='va' ? t('metodeVA') : (m.metode_pembayaran==='qris' ? t('metodeQRIS') : t('metodeRekening'))); }
  function renderMetode(){
    renderQrisAdminPreview();
    renderMetodeSetup();
    const mf = SUB.pembayaran;
    const label = mf==='qris' ? 'QRIS' : mf==='va' ? 'Virtual Account' : 'Transfer Rekening';
    const list = [...scopedPembayaran()].filter(b=>b.metode_pembayaran===mf).sort((x,y)=>(y.tanggal_bayar||'').localeCompare(x.tanggal_bayar||''));
    const ttl = $('#cardTitleMetode'); if(ttl) ttl.textContent = 'Pembayaran dengan metode ' + label;
    const note = $('#metodeNote'); if(note) note.textContent = 'Metode dipilih saat Catat Pembayaran dan hanya tercatat sebagai data pembayaran.';
    const namaAng = b => { const p = state.pinjaman.find(x=>x.id===b.id_pinjaman); return p ? anggotaName(p.id_anggota) : '—'; };
    let head, rowFn;
    if(mf==='qris'){
      head = ['id_pembayaran','tanggal_bayar','anggota','jumlah_bayar'];
      rowFn = b=>`<tr><td class="mono">${b.no}</td><td>${fmtDate(b.tanggal_bayar)}</td><td>${namaAng(b)}</td><td class="mono">${rupiah(b.jumlah_bayar)}</td></tr>`;
    } else {
      head = ['id_pembayaran','tanggal_bayar','anggota', mf==='va' ? 'e-wallet' : 'bank', mf==='va' ? 'no_va' : 'no_rekening','jumlah_bayar'];
      rowFn = b=>`<tr><td class="mono">${b.no}</td><td>${fmtDate(b.tanggal_bayar)}</td><td>${namaAng(b)}</td><td>${b.nama_bank||'-'}</td><td>${b.no_rekening||'-'}</td><td class="mono">${rupiah(b.jumlah_bayar)}</td></tr>`;
    }
    $('#metodeHead').innerHTML = '<tr>' + head.map(x=>`<th>${x}</th>`).join('') + '</tr>';
    $('#metodeBody').innerHTML = list.length ? list.map(rowFn).join('') : `<tr><td colspan="${head.length}" class="empty">Belum ada pembayaran dengan ${label}.</td></tr>`;
    const qw = $('#qrisAdminWrap'); if(qw && mf!=='qris') qw.style.display='none';
    $$('[data-edit-metode]').forEach(b=>{ if(b.dataset.editMetode) b.addEventListener('click', ()=> launchEditMetode(b.dataset.editMetode)); });
    $$('[data-lihat-qris]').forEach(img=>img.addEventListener('click', ()=> lihatFotoZoom(state.prefs.qrisAdminFoto)));
  }
  function launchEditMetode(id){
    const m = state.anggota.find(x=>x.id===id);
    if(!m){ toast('Data anggota tidak ditemukan'); return; }
    if(m.id!==myAnggotaId()){ toast('Anda hanya dapat mengatur metode pembayaran akun Anda sendiri'); return; }
    setSub('pembayaran','riwayat');
    renderMetodeSetup(true);
    const c = $('#metodeSetupCard'); if(c && c.scrollIntoView) c.scrollIntoView({behavior:'smooth', block:'start'});
  }
  $('#saveMetode').addEventListener('click', async ()=>{
    const m = state.anggota.find(x=>x.id===editingMetodeId);
    if(!m){ toast('Data anggota tidak ditemukan'); closeModal('#ovMetode'); return; }
    const metode_pembayaran = $('#fMetode').value || 'rekening';
    const no_rekening = metode_pembayaran==='qris' ? '' : $('#fNoRekening').value.trim();
    m.metode_pembayaran = metode_pembayaran;
    m.no_rekening = no_rekening;
    m.foto_qris = null;
    await persist('anggota');
    editingMetodeId = null;
    renderAll(); closeModal('#ovMetode'); toast('Metode pembayaran disimpan');
  });
  ['btnAddAnggota2'].forEach(id=> $('#'+id) && $('#'+id).addEventListener('click', async ()=>{
    try{ await launchAddAnggota(); }
    catch(err){ console.error('btnAddAnggota2:', err); toast('Gagal membuka form: '+err.message); }
  }));
  $('#saveAnggota').addEventListener('click', async ()=>{
    const nama=$('#fNama').value.trim();
    if(!nama){ toast('Nama wajib diisi'); return; }
    const alamat=$('#fAlamat').value.trim(), no_hp=$('#fHp').value.trim();
    const tanggal_gabung=$('#fTanggalGabung').value||todayISO();

    if(editingAnggotaId){
      const m = state.anggota.find(x=>x.id===editingAnggotaId);
      if(!m){ toast('Data anggota tidak ditemukan'); closeModal('#ovAnggota'); return; }
      m.nama=nama; m.alamat=alamat; m.no_hp=no_hp; m.tanggal_gabung=tanggal_gabung;
      await persist('anggota');
      editingAnggotaId = null;
      renderAll(); closeModal('#ovAnggota'); toast('Perubahan anggota disimpan');
      return;
    }

    if(!isAdmin()){ toast('Hanya admin yang dapat menambah anggota'); return; }
    await loadUsers(); await loadAll();
    const maxNo = state.anggota.reduce((mx,m)=>{ const n=parseInt(String(m.no||'').replace(/\D/g,''),10); return Number.isFinite(n)&&n>mx ? n : mx; }, 0);
    const no=fmtNo('AG', Math.max(maxNo, state.anggota.length)+1);
    const anggotaBaru={id:uid(),no,nama,alamat,no_hp,tanggal_gabung,metode_pembayaran:null,no_rekening:'',foto_qris:null};
    state.anggota.push(anggotaBaru);
    await persist('anggota');
    renderAll(); closeModal('#ovAnggota'); toast('Anggota berhasil ditambahkan (manual)');
  });

  // tambah otomatis dari akun user yang belum tercatat
  $('#adoptAnggota') && $('#adoptAnggota').addEventListener('click', async ()=>{
    if(!isAdmin()) return;
    const ids = $$('#pendingAkunList input[type=checkbox]:checked').map(c=>c.value);
    if(!ids.length){ toast('Pilih minimal satu akun'); return; }
    setBtnLoading($('#adoptAnggota'), true);
    let jr;
    try{ jr = await usersApi({action:'adopt', actor: currentUser.id, user_ids: ids}); }
    catch(err){ setBtnLoading($('#adoptAnggota'), false); toast('Tidak bisa terhubung ke server'); return; }
    setBtnLoading($('#adoptAnggota'), false);
    if(!jr.ok){ toast('Gagal menambahkan: ' + (jr.error||'')); return; }
    await loadUsers(); await loadAll();
    renderAll(); closeModal('#ovAnggota');
    toast(jr.dibuat + ' akun ditambahkan sebagai anggota');
  });

  // ===== PINJAMAN =====
  function updatePinjamanPreview(){
    const jumlah = Number($('#pJumlah').value)||0, bunga = Number($('#pBunga').value)||0;
    $('#pTotalPreview').textContent = rupiah(hitungTotalPinjaman(jumlah,bunga));
  }
  ['pJumlah','pBunga'].forEach(id=> $('#'+id).addEventListener('input', updatePinjamanPreview));
  function launchAddPinjaman(){
    if(state.anggota.length===0 || (!isAdmin() && !myAnggotaId())){ toast(isAdmin() ? 'Belum ada data anggota — tambahkan anggota dulu di menu Anggota' : 'Akun Anda belum tercatat sebagai anggota. Hubungi admin.'); return; }
    // reset form
    $('#pJumlah').value=''; $('#pTenor').value=''; $('#pTanggal').value=''; $('#pAlasan').value='';
    // bunga
    $('#pBunga').value = state.prefs.bungaPersen ?? 5;
    $('#pBunga').disabled = !isAdmin();
    $('#pBungaNote').style.display = isAdmin() ? 'none' : '';
    updatePinjamanPreview();
    openModal('#ovPinjaman');
  }
  ['btnAddPinjaman2'].forEach(id=> $('#'+id) && $('#'+id).addEventListener('click', ()=>{
    try{ launchAddPinjaman(); }
    catch(err){ console.error('btnAddPinjaman2:', err); toast('Gagal membuka form: '+err.message); }
  }));
  $('#savePinjaman').addEventListener('click', async ()=>{
    const id_anggota=$('#pAnggota').value;
    const jumlah_pinjaman=Number($('#pJumlah').value), tenor=Number($('#pTenor').value), bunga=Number($('#pBunga').value);
    const tanggal_pinjaman=$('#pTanggal').value;
    const alasan=$('#pAlasan').value.trim();
    if(!id_anggota||!jumlah_pinjaman||!tenor){ toast('Lengkapi semua data pinjaman'); return; }
    if(!tanggal_pinjaman){ toast('Pilih tanggal pinjaman terlebih dahulu'); return; }
    if(!alasan){ toast('Isi alasan peminjaman terlebih dahulu'); return; }
    await loadUsers(); await loadAll();
    if(!state.anggota.some(a=>a.id===id_anggota)){ toast('Data anggota sudah tidak ada'); closeModal('#ovPinjaman'); return; }
    const total_pinjaman = hitungTotalPinjaman(jumlah_pinjaman,bunga);
    const no=fmtNo('PJ',state.pinjaman.length+1);
    state.pinjaman.push({id:uid(),no,id_anggota,tanggal_pinjaman,jumlah_pinjaman,tenor,bunga,total_pinjaman,status:'pengajuan',alasan});
    await persist('pinjaman');
    renderAll(); closeModal('#ovPinjaman'); toast('Pengajuan pinjaman terkirim, menunggu persetujuan');
  });

  function openPinjamanDetail(id){
    const p = state.pinjaman.find(x=>x.id===id); if(!p) return;
    if(!canSeePinjaman(p)){ toast('Anda tidak dapat mengakses data anggota lain'); return; }
    $('#pdTitle').textContent = p.no;
    const st = pinjamanStatusLabel(p);
    const sisa = pinjamanSisa(p);
    $('#pdInfo').innerHTML = `
      <div class="kv"><label>id_pinjaman</label><div class="id-chip">${p.no}</div></div>
      <div class="kv"><label>id_anggota</label><div>${anggotaNo(p.id_anggota)} — ${anggotaName(p.id_anggota)}</div></div>
      <div class="kv"><label>tanggal_pinjaman</label><div>${fmtDate(p.tanggal_pinjaman)}</div></div>
      <div class="kv"><label>jumlah_pinjaman</label><div>${rupiah(p.jumlah_pinjaman)}</div></div>
      <div class="kv"><label>tenor</label><div>${p.tenor} bulan</div></div>
      <div class="kv"><label>bunga</label><div>${p.bunga}%</div></div>
      <div class="kv" style="grid-column:1/-1;"><label>alasan_peminjaman</label><div>${p.alasan ? escHtml(p.alasan) : '-'}</div></div>
      <div class="kv"><label>total_pinjaman</label><div>${rupiah(p.total_pinjaman)}</div></div>
      <div class="kv"><label>sisa_pinjaman</label><div>${rupiah(sisa)}</div></div>
      ${(()=>{ const jt=jatuhTempoBerikutnya(p); if(!jt) return ''; const s=sisaHari(jt.tanggal);
        const info = s<0 ? `<span style="color:var(--red);font-weight:800;">Terlambat ${Math.abs(s)} hari</span>` : (s===0?'<b>Hari ini</b>':`dalam ${s} hari`);
        return `<div class="kv"><label>jatuh_tempo_berikutnya</label><div>Cicilan ke-${jt.ke} · ${fmtDate(jt.tanggal)} (${info})</div></div>`; })()}
      ${(()=>{ const d=hitungDenda(p); if(!d || d.nominal<=0) return '';
        return `<div class="kv"><label>denda_penunggakan</label><div style="color:var(--red);font-weight:800;">${rupiah(d.nominal)} <span style="font-weight:700;color:var(--text-soft);">(${d.hari} hari × ${state.prefs.dendaPersen}%)</span></div></div>`; })()}`;
    let steps = 1;
    if(p.status==='berjalan') steps = 2;
    else if(p.status==='lunas') steps = 3;
    $('#pdSteps').innerHTML = [1,2,3].map(i=>`<div class="seg ${i<=steps?'on':''}"></div>`).join('');
    $('#pdSteps').nextElementSibling.querySelectorAll('span').forEach((s,i)=> s.classList.toggle('on', i+1<=steps));

    const actions = $('#pdActions');
    actions.innerHTML='';
    actions.style.flexDirection=''; actions.style.alignItems='';
    if(p.status==='pengajuan'){
      if(isAdmin()){
        const btnApprove=document.createElement('button'); btnApprove.className='btn primary'; btnApprove.style.flex='1'; btnApprove.style.justifyContent='center';
        btnApprove.textContent='Setujui Pinjaman';
        btnApprove.onclick=()=> approvePinjaman(p.id);
        const btnReject=document.createElement('button'); btnReject.className='btn outline'; btnReject.style.flex='1'; btnReject.style.justifyContent='center';
        btnReject.textContent='Tolak';
        btnReject.onclick=()=> rejectPinjaman(p.id);
        actions.appendChild(btnApprove); actions.appendChild(btnReject);
      } else {
        const badge=document.createElement('span'); badge.className='status-pill pending'; badge.textContent='Menunggu persetujuan admin';
        actions.appendChild(badge);
      }
    } else if(p.status==='berjalan'){
      const dendaInfo = hitungDenda(p);
      if(dendaInfo && dendaInfo.nominal>0){
        actions.style.flexDirection='column'; actions.style.alignItems='stretch';
        const warn=document.createElement('div');
        warn.style.cssText='width:100%;font-size:12.5px;font-weight:800;color:var(--red);background:var(--red-light);border-radius:9px;padding:8px 10px;';
        warn.textContent = `⚠ Denda keterlambatan ${dendaInfo.hari} hari: ${rupiah(dendaInfo.nominal)}`;
        actions.appendChild(warn);
      }
      const btn=document.createElement('button'); btn.className='btn outline'; btn.style.width='100%'; btn.style.justifyContent='center';
      btn.textContent = sisa>0 ? 'Kelola Pembayaran di menu Pembayaran' : 'Semua pembayaran lunas';
      btn.disabled = sisa<=0;
      btn.onclick=()=>{ closeModal('#ovPinjamanDetail'); goView('pembayaran'); };
      actions.appendChild(btn);
    } else if(p.status==='ditolak'){
      const badge=document.createElement('span'); badge.className='status-pill ditolak'; badge.textContent='Pengajuan ditolak';
      actions.appendChild(badge);
      if(p.alasan_ditolak){
        const reason=document.createElement('div'); reason.className='reminder-time'; reason.style.marginTop='8px'; reason.style.width='100%';
        reason.textContent='Alasan: '+p.alasan_ditolak;
        actions.appendChild(reason);
      }
    } else {
      actions.style.flexDirection = 'column'; actions.style.alignItems = 'stretch';
      const badge=document.createElement('span'); badge.className='status-pill lunas'; badge.textContent='Pinjaman lunas'; badge.style.alignSelf='flex-start';
      actions.appendChild(badge);
      const btnCetak=document.createElement('button'); btnCetak.className='btn primary'; btnCetak.style.width='100%'; btnCetak.style.justifyContent='center'; btnCetak.style.marginTop='10px';
      btnCetak.innerHTML = '🖨️ Cetak Bukti Pelunasan (PDF)';
      btnCetak.onclick=()=> cetakBuktiPelunasan(p.id);
      actions.appendChild(btnCetak);
    }

    const riwayat = state.pembayaran.filter(b=>b.id_pinjaman===p.id).sort((a,b)=>a.cicilan_ke-b.cicilan_ke);
    $('#pdSchedule').innerHTML = riwayat.length ? riwayat.map(b=>`
      <div class="sched-row">
        <div class="n">${b.cicilan_ke}</div>
        <div class="d">Dibayar ${fmtDate(b.tanggal_bayar)}</div>
        <div class="amt">${rupiah(b.jumlah_bayar)}</div>
        <span class="status-pill lunas" style="margin-left:6px;">Sisa ${rupiah(b.sisa_pinjaman)}</span>
        ${b.bukti_foto ? `<img class="bukti-thumb" style="margin-left:8px;" src="${b.bukti_foto}" data-lihat-bukti="${b.id}" title="Lihat bukti pembayaran">` : ''}
      </div>
    `).join('') : `<div class="empty">Belum ada pembayaran untuk pinjaman ini.</div>`;
    $$('#pdSchedule [data-lihat-bukti]').forEach(el=>el.addEventListener('click', ()=> lihatBuktiFoto(el.dataset.lihatBukti)));

    openModal('#ovPinjamanDetail');
  }

  async function approvePinjaman(id){
    if(!isAdmin()){ toast('Hanya Admin yang dapat menyetujui pinjaman'); return; }
    const p = state.pinjaman.find(x=>x.id===id); if(!p) return;
    if(p.status!=='pengajuan') return;
    p.status='berjalan';
    await persist('pinjaman');
    renderAll(); openPinjamanDetail(id);
    notifyPencairanPinjaman(p);
  }
  async function rejectPinjaman(id){
    if(!isAdmin()){ toast('Hanya Admin yang dapat menolak pinjaman'); return; }
    const p = state.pinjaman.find(x=>x.id===id); if(!p) return;
    if(p.status!=='pengajuan') return;
    if(!confirm('Tolak pengajuan pinjaman ini?')) return;
    const alasan = prompt('Alasan penolakan (opsional):','');
    p.status='ditolak';
    p.alasan_ditolak = (alasan||'').trim();
    await persist('pinjaman');
    renderAll(); openPinjamanDetail(id); toast('Pengajuan pinjaman ditolak');
  }

  // ===== PEMBAYARAN =====
  let pembayaranTarget=null;
  function updatePembayaranPreview(){
    if(!pembayaranTarget) return;
    const p = state.pinjaman.find(x=>x.id===pembayaranTarget.pinjamanId); if(!p) return;
    const sisaSaatIni = pinjamanSisa(p);
    const bayar = Number($('#bNominal').value)||0;
    const denda = Number($('#bDenda').value)||0;
    // hitung denda
    const porsiPinjaman = Math.max(0, bayar - denda);
    $('#bSisaPreview').textContent = rupiah(Math.max(0, sisaSaatIni - porsiPinjaman));
  }
  $('#bNominal').addEventListener('input', updatePembayaranPreview);
  $('#bDenda').addEventListener('input', ()=>{
    if(pembayaranTarget) $('#bDendaReset').style.display = (isAdmin() && Number($('#bDenda').value||0)!==pembayaranTarget.dendaSaran) ? 'inline' : 'none';
    updatePembayaranPreview();
  });
  $('#bDendaReset').addEventListener('click', ()=>{
    if(!pembayaranTarget) return;
    $('#bDenda').value = pembayaranTarget.dendaSaran||0;
    $('#bDendaReset').style.display = 'none';
    updatePembayaranPreview();
  });

  // ===== METODE PEMBAYARAN DI FORM CATAT PEMBAYARAN =====
  const EWALLETS = ['Dana','GoPay','OVO','ShopeePay','LinkAja','iSaku','Sakuku','DOKU'];
  let bMetode = {metode:'', bank:''};
  function drawBMetode(){
    const m = bMetode.metode;
    $$('#bMetodeOpts [data-bmetode]').forEach(b=> b.classList.toggle('on', b.dataset.bmetode===m));
    const detail = $('#bMetodeDetail'), qris = $('#bQrisWrap');
    const pakaiNomor = (m==='rekening' || m==='va');
    detail.style.display = pakaiNomor ? '' : 'none';
    qris.style.display = m==='qris' ? '' : 'none';
    if(pakaiNomor){
      const list = m==='va' ? EWALLETS : BANKS;
      $('#bPilihLabel').textContent = m==='va' ? 'Pilih E-Wallet' : 'Pilih Bank';
      $('#bPilihGrid').innerHTML = list.map(b=>`<button type="button" class="bank-chip${bMetode.bank===b?' on':''}" data-bpick="${attrEsc(b)}">${b}</button>`).join('');
      $('#bNomorWrap').style.display = bMetode.bank ? '' : 'none';
      $('#bNomorLabel').textContent = (m==='va' ? 'Nomor E-Wallet / Virtual Account ' : 'Nomor Rekening ') + (bMetode.bank||'');
    }
    if(m==='qris'){
      const foto = state.prefs.qrisAdminFoto, img = $('#bQrisImg');
      if(foto){ img.src = foto; img.style.display = 'block'; $('#bQrisNote').textContent = 'Scan kode QRIS di atas, lalu unggah bukti pembayarannya di bawah.'; }
      else { img.style.display = 'none'; img.removeAttribute('src'); $('#bQrisNote').textContent = t('qrisBelumAdmin'); }
    }
  }
  function resetBMetode(p){
    bMetode = {metode:'', bank:''};
    $('#bNomor').value = '';
    drawBMetode();
  }
  $('#bMetodeWrap').addEventListener('click', e=>{
    const pm = e.target.closest('[data-bmetode]');
    if(pm){
      const baru = pm.dataset.bmetode;
      if(baru!==bMetode.metode){ bMetode.bank=''; $('#bNomor').value=''; }
      bMetode.metode = baru; drawBMetode(); return;
    }
    const pb = e.target.closest('[data-bpick]');
    if(pb){ bMetode.bank = pb.dataset.bpick; drawBMetode(); $('#bNomor').focus(); return; }
    if(e.target.id==='bQrisImg' && state.prefs.qrisAdminFoto) lihatFotoZoom(state.prefs.qrisAdminFoto);
  });

  // ===== BUKTI PEMBAYARAN =====
  let bBuktiData = null;
  function resetBuktiUpload(){
    bBuktiData = null;
    $('#bBuktiInput').value = '';
    $('#bBuktiPreview').style.display = 'none';
    $('#bBuktiPreview').src = '';
    $('#bBuktiPlaceholder').style.display = 'flex';
    $('#bBuktiHapus').style.display = 'none';
  }
  $('#bBuktiInput').addEventListener('change', async (e)=>{
    const file = e.target.files && e.target.files[0]; if(!file) return;
    try{
      bBuktiData = await resizeImageFile(file, 900);
      $('#bBuktiPreview').src = bBuktiData;
      $('#bBuktiPreview').style.display = 'block';
      $('#bBuktiPlaceholder').style.display = 'none';
      $('#bBuktiHapus').style.display = 'inline-flex';
    }catch(err){ toast('Gagal memuat foto, coba file lain'); resetBuktiUpload(); }
  });
  $('#bBuktiHapus').addEventListener('click', (e)=>{ e.preventDefault(); resetBuktiUpload(); });

  function openPembayaran(pinjamanId, cicilanKe){
    if(isAdmin()){ toast('Admin tidak mencatat pembayaran — pembayaran dicatat oleh anggota sendiri'); return; }
    const p = state.pinjaman.find(x=>x.id===pinjamanId); if(!p) return;
    pembayaranTarget = {pinjamanId, cicilanKe};
    closeModal('#ovPinjamanDetail');
    const sisa = pinjamanSisa(p);
    const cicilanBulanan = Math.round(p.total_pinjaman/p.tenor);
    const dendaInfo = hitungDenda(p);
    const dendaSaran = (dendaInfo && dendaInfo.ke===cicilanKe) ? dendaInfo.nominal : 0;
    $('#pembayaranInfo').textContent = `${anggotaName(p.id_anggota)} — ${p.no} — Cicilan ke-${cicilanKe} · Sisa saat ini: ${rupiah(sisa)} · Cicilan/bulan: ${rupiah(cicilanBulanan)}`
      + (dendaSaran>0 ? ` · Denda keterlambatan: ${rupiah(dendaSaran)}` : '');
    $('#bKe').value = cicilanKe;
    $('#bNominal').value = '';
    $('#bNominal').placeholder = 'cth. ' + cicilanBulanan;
    $('#bTanggal').value = todayISO();
    pembayaranTarget.dendaSaran = dendaSaran;
    $('#bDenda').value = dendaSaran;
    // denda manual
    $('#bDenda').disabled = !isAdmin();
    $('#bDendaReset').style.display = 'none';
    $('#bDendaNote').textContent = !isAdmin()
      ? (dendaSaran>0 ? 'Denda dihitung otomatis dan hanya Admin yang dapat mengubahnya.' : 'Tidak ada denda untuk cicilan ini.')
      : (dendaSaran>0 ? `Otomatis: ${rupiah(dendaSaran)} (${dendaInfo.hari} hari). Bisa Anda ubah manual sesuai kebutuhan.` : 'Tidak ada denda otomatis. Isi manual jika ada denda yang perlu dicatat.');
    resetBuktiUpload();
    resetBMetode(p);
    updatePembayaranPreview();
    openModal('#ovPembayaran');
  }
  // buka form pembayaran
  function openPembayaranManual(){
    const loans = scopedPinjaman().filter(p=>p.status==='berjalan');
    if(!loans.length){ toast('Tidak ada pinjaman berjalan untuk dibayar'); return; }
    const wrap = $('#bPinjamanSelectWrap'), sel = $('#bPinjamanSelect');
    wrap.style.display = '';
    sel.innerHTML = loans.map(p=>`<option value="${p.id}">${p.no} — ${anggotaName(p.id_anggota)}</option>`).join('');
    const pickLoan = (loanId)=>{
      const p = state.pinjaman.find(x=>x.id===loanId);
      const ke = state.pembayaran.filter(b=>b.id_pinjaman===p.id).length + 1;
      openPembayaran(p.id, ke);
      wrap.style.display = '';
    };
    sel.value = loans[0].id;
    sel.onchange = ()=> pickLoan(sel.value);
    pickLoan(loans[0].id);
  }
  ['kasAdd'].forEach(id=> $('#'+id) && $('#'+id).addEventListener('click', ()=>{
    $('#bPinjamanSelectWrap').style.display = 'none';
    const p = scopedPinjaman().find(x=>x.status==='berjalan');
    if(!p){ toast('Tidak ada pinjaman berjalan untuk dibayar'); return; }
    const cicilanKeBerikutnya = state.pembayaran.filter(b=>b.id_pinjaman===p.id).length + 1;
    openPembayaran(p.id, cicilanKeBerikutnya);
  }));
  $('#btnAddPembayaran').addEventListener('click', ()=> openPembayaranManual());
  $('#savePembayaran').addEventListener('click', async ()=>{
    if(!pembayaranTarget) return;
    const p = state.pinjaman.find(x=>x.id===pembayaranTarget.pinjamanId); if(!p) return;
    const jumlah_bayar=Number($('#bNominal').value);
    if(!jumlah_bayar){ toast('Isi jumlah bayar'); return; }
    if(!bMetode.metode){ toast('Pilih metode pembayaran dulu'); return; }
    let nomorBayar = '';
    if(bMetode.metode!=='qris'){
      if(!bMetode.bank){ toast(bMetode.metode==='va' ? 'Pilih e-wallet dulu' : 'Pilih bank dulu'); return; }
      nomorBayar = ($('#bNomor').value||'').replace(/[\s-]/g,'');
      if(!/^\d{5,20}$/.test(nomorBayar)){ toast('Nomor harus berupa angka (5–20 digit)'); return; }
    }
    if(!bBuktiData){ toast('Bukti pembayaran wajib diunggah sebelum menyimpan'); return; }
    const tanggal_bayar=$('#bTanggal').value||todayISO();
    const sisaSebelum = pinjamanSisa(p);
    const denda = isAdmin() ? Math.max(0, Number($('#bDenda').value)||0) : (pembayaranTarget.dendaSaran||0);
    if(denda>jumlah_bayar){ toast('Denda tidak boleh melebihi jumlah bayar'); return; }
    // hitung denda
    const porsiPinjaman = Math.max(0, jumlah_bayar - denda);
    const sisa_pinjaman = Math.max(0, sisaSebelum - porsiPinjaman);
    const no=fmtNo('BY',state.pembayaran.length+1);
    const payObj = {id:uid(),no,id_pinjaman:p.id,cicilan_ke:pembayaranTarget.cicilanKe,jumlah_bayar,tanggal_bayar,sisa_pinjaman,denda,bukti_foto:bBuktiData||null,metode_pembayaran:bMetode.metode,nama_bank:bMetode.metode==='qris'?'':bMetode.bank,no_rekening:nomorBayar};
    state.pembayaran.push(payObj);
    if(sisa_pinjaman<=0){ p.status='lunas'; }
    // tandai denda lunas
    const dendaInfoSaatIni = hitungDenda(p);
    if(denda>0 && dendaInfoSaatIni && dendaInfoSaatIni.ke===pembayaranTarget.cicilanKe && denda>=dendaInfoSaatIni.nominal){
      p.denda_settled_ke = pembayaranTarget.cicilanKe;
      p.denda_settled_tanggal = tanggal_bayar;
    }
    await persist('pembayaran'); await persist('pinjaman');
    resetBuktiUpload();
    renderAll(); closeModal('#ovPembayaran');
    toast(denda>0 ? `Pembayaran tercatat (denda ${rupiah(denda)} lunas duluan)` : 'Pembayaran tercatat');
    notifyPembayaranMasuk(p, jumlah_bayar);
    fxPaymentSuccess({no, nama:anggotaName(p.id_anggota), pinjamanNo:p.no, ke:payObj.cicilan_ke, tenor:p.tenor, jumlah:jumlah_bayar, denda, sisa:sisa_pinjaman, tanggal:tanggal_bayar, lunas:sisa_pinjaman<=0}, fxBadges(p, payObj));
  });

  // ===== NADA NOTIFIKASI =====
  let _audioCtx = null;
  function playRingtone(){
    try{
      if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      _audioCtx = _audioCtx || new (window.AudioContext||window.webkitAudioContext)();
      const ctx = _audioCtx;
      const notes = [880, 1174.66];
      notes.forEach((freq,i)=>{
        const t0 = ctx.currentTime + i*0.12;
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.18, t0+0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0+0.35);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(t0); osc.stop(t0+0.4);
      });
    }catch(e){}
  }
  function metodeLabel(m){ return m && m.metode_pembayaran==='va' ? 'Virtual Account' : (m && m.metode_pembayaran==='qris' ? 'QRIS' : 'Rekening Bank'); }
  // notifikasi ke User
  function notifyPencairanPinjaman(p){
    const a = state.anggota.find(x=>x.id===p.id_anggota);
    const tujuan = a && a.metode_pembayaran ? (a.no_rekening ? `${metodeLabel(a)} ${a.no_rekening}` : metodeLabel(a)) : 'akun Anda';
    toast(`🎉 Hore! Uang pinjaman ${rupiah(p.jumlah_pinjaman)} dari Admin sudah masuk ke ${tujuan}`);
    playRingtone();
  }
  // notifikasi ke Admin
  function notifyPembayaranMasuk(p, jumlah){
    const a = state.anggota.find(x=>x.id===p.id_anggota);
    toast(`💰 Pembayaran dari ${a?a.nama:'anggota'} sebesar ${rupiah(jumlah)} sudah masuk`);
    playRingtone();
  }

  function toast(msg){
    const t=$('#toast'); t.textContent=msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'),2200);
    if(/tercatat|disetujui|berhasil|lunas|Selamat datang|dibuat|dihubungkan/i.test(msg)) celebrateFrom(t);
  }

  function setBtnLoading(btn, loading){
    if(loading){
      btn.dataset.label = btn.innerHTML;
      btn.disabled = true;
      btn.style.justifyContent = 'center';
      btn.innerHTML = '<span class="btn-spinner"></span>';
    } else {
      btn.disabled = false;
      if(btn.dataset.label) btn.innerHTML = btn.dataset.label;
    }
  }

  // ===== AKUN =====
  let users = [];
  let currentUser = null;
  function isAdmin(){ return !!(currentUser && currentUser.role==='admin'); }
  // cakupan tampilan Admin
  let adminViewScope = 'semua';
  let adminFocusAnggotaId = null;

  // SHA-256 (WebCrypto bila tersedia; cadangan murni-JS untuk akses lewat http:// dari perangkat lain)
  function sha256Fallback(text){
    const bytes = new TextEncoder().encode(text);
    const primes = []; for(let n=2; primes.length<64; n++){ if(primes.every(p=>n%p)) primes.push(n); }
    const frac = x => (x - Math.floor(x)) * 4294967296 | 0;
    const K = primes.map(p=>frac(Math.cbrt(p)));
    let H = primes.slice(0,8).map(p=>frac(Math.sqrt(p)));
    const len = bytes.length, total = (((len + 9 + 63) >> 6) << 6);
    const buf = new Uint8Array(total); buf.set(bytes); buf[len] = 0x80;
    const dv = new DataView(buf.buffer);
    dv.setUint32(total-8, Math.floor(len*8/4294967296)); dv.setUint32(total-4, (len*8)>>>0);
    const rotr = (x,n)=> (x>>>n)|(x<<(32-n));
    const W = new Int32Array(64);
    for(let o=0; o<total; o+=64){
      for(let i=0;i<16;i++) W[i] = dv.getInt32(o+i*4);
      for(let i=16;i<64;i++){
        const s0 = rotr(W[i-15],7)^rotr(W[i-15],18)^(W[i-15]>>>3);
        const s1 = rotr(W[i-2],17)^rotr(W[i-2],19)^(W[i-2]>>>10);
        W[i] = (W[i-16]+s0+W[i-7]+s1)|0;
      }
      let [a,b,c,d,e,f,g,h] = H;
      for(let i=0;i<64;i++){
        const S1 = rotr(e,6)^rotr(e,11)^rotr(e,25);
        const ch = (e&f)^(~e&g);
        const t1 = (h+S1+ch+K[i]+W[i])|0;
        const S0 = rotr(a,2)^rotr(a,13)^rotr(a,22);
        const maj = (a&b)^(a&c)^(b&c);
        const t2 = (S0+maj)|0;
        h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      H = [H[0]+a,H[1]+b,H[2]+c,H[3]+d,H[4]+e,H[5]+f,H[6]+g,H[7]+h].map(x=>x|0);
    }
    return H.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
  }
  async function sha256(text){
    if(window.crypto && crypto.subtle){
      try{
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
        return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
      }catch(e){ /* jatuh ke cadangan */ }
    }
    return sha256Fallback(text);
  }

  // kirim aksi ke api/users.php (selalu menyertakan mode web)
  async function usersApi(payload){
    const res = await fetch(API + 'users.php', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(Object.assign({mode: APP_MODE}, payload))
    });
    return res.json();
  }

  // ===== DAFTAR AKUN =====
  async function loadUsers(){
    try{
      const res = await fetch(API + 'users.php?action=list&mode=' + APP_MODE, {cache:'no-store'});
      const j = await res.json();
      if(j.ok){
        users = j.data || [];
        const terbaru = currentUser ? users.find(x=>x.id===currentUser.id) : null;
        if(terbaru){
          currentUser.id_anggota = terbaru.id_anggota || null;
          currentUser.foto = terbaru.foto || null;
        }
      }
    }catch(err){ console.error('loadUsers error', err); }
  }
  // tautan akun-anggota dilepas otomatis oleh server saat anggota dihapus; cukup muat ulang
  async function lepasTautanAnggota(){ await loadUsers(); }
  // simpan perubahan profil milik akun sendiri (nama, username, foto, kata sandi)
  async function persistSelf(patch){
    if(!currentUser) return {ok:false};
    try{
      const j = await usersApi(Object.assign({action:'update_self', actor: currentUser.id}, patch));
      if(!j.ok){ toast('Gagal menyimpan akun: ' + (j.error||'')); console.error(j); }
      return j;
    }catch(err){
      console.error('persistSelf error', err);
      toast('Tidak bisa terhubung ke server');
      return {ok:false};
    }
  }

  function showPanel(which){
    const pl = $('#panelLogin'), pr = $('#panelRegister');
    if(pl) pl.classList.toggle('active', which==='login' || !pr);
    if(pr) pr.classList.toggle('active', which==='register');
    $('#loginErr').classList.remove('show');
    if($('#regErr')) $('#regErr').classList.remove('show');
    if(which==='login') updateLoginAvatarPreview();
  }
  $('#toRegister') && $('#toRegister').addEventListener('click', ()=> showPanel('register'));
  $('#toLogin') && $('#toLogin').addEventListener('click', ()=> showPanel('login'));

  function setErr(id,msg){
    const e=$(id); e.textContent=msg; e.classList.add('show');
  }

  // ===== DAFTAR (web User) — otomatis tercatat sebagai anggota =====
  $('#btnRegister') && $('#btnRegister').addEventListener('click', async ()=>{
    const nama=$('#reNama').value.trim();
    const username=$('#reUsername').value.trim().toLowerCase();
    const pass=$('#rePass').value;
    const pass2=$('#rePass2').value;
    const alamat=$('#reAlamat') ? $('#reAlamat').value.trim() : '';
    const no_hp=$('#reHp') ? $('#reHp').value.trim() : '';
    if(!nama || !username || !pass){ setErr('#regErr','Nama, username, dan kata sandi wajib diisi.'); return; }
    if(!/^\S{3,40}$/.test(username)){ setErr('#regErr','Username 3–40 karakter tanpa spasi.'); return; }
    if(pass.length<6){ setErr('#regErr','Kata sandi minimal 6 karakter.'); return; }
    if(pass!==pass2){ setErr('#regErr','Konfirmasi kata sandi tidak cocok.'); return; }
    setBtnLoading($('#btnRegister'), true);
    let j;
    try{
      j = await usersApi({action:'register', nama, username, hash: await sha256(pass), alamat, no_hp});
    }catch(err){
      setBtnLoading($('#btnRegister'), false);
      setErr('#regErr','Tidak bisa terhubung ke server. Pastikan XAMPP (Apache + MySQL) menyala.');
      return;
    }
    setBtnLoading($('#btnRegister'), false);
    if(!j.ok){ setErr('#regErr', j.error || 'Gagal mendaftar.'); return; }
    toast('Akun berhasil dibuat dan tercatat sebagai anggota, silakan masuk');
    ['reNama','rePass','rePass2','reAlamat','reHp'].forEach(id=>{ if($('#'+id)) $('#'+id).value=''; });
    $('#liUsername').value = username; $('#liPass').value='';
    await loadUsers();
    showPanel('login');
  });

  // ===== MASUK (diverifikasi server; admin hanya di web Admin, user hanya di web User) =====
  $('#btnLogin').addEventListener('click', async ()=>{
    const username=$('#liUsername').value.trim().toLowerCase();
    const pass=$('#liPass').value;
    if(!username || !pass){ setErr('#loginErr','Masukkan username dan kata sandi.'); return; }
    setBtnLoading($('#btnLogin'), true);
    let j;
    try{
      j = await usersApi({action:'login', username, hash: await sha256(pass)});
    }catch(err){
      setBtnLoading($('#btnLogin'), false);
      setErr('#loginErr','Tidak bisa terhubung ke server. Pastikan XAMPP (Apache + MySQL) menyala.');
      return;
    }
    if(!j.ok){ setBtnLoading($('#btnLogin'), false); setErr('#loginErr', j.error || 'Gagal masuk.'); return; }
    await loadUsers();
    const u = users.find(x=>x.id===j.user.id) || j.user;
    await login(u, $('#liRemember').checked);
    setBtnLoading($('#btnLogin'), false);
  });

  let rememberedUserId = null;
  async function rememberSession(userId){ rememberedUserId = userId; }
  async function forgetSession(){ rememberedUserId = null; }

  async function login(u, remember){
    currentUser = u;
    setMode(u);
    await loadUsers();
    if(remember) await rememberSession(u.id); else await forgetSession();
    // riwayat login
    if(!Array.isArray(u.loginHistory)) u.loginHistory = [];
    u.loginHistory.push({waktu: new Date().toISOString(), device: deviceLabel()});
    if(u.loginHistory.length>6) u.loginHistory = u.loginHistory.slice(-6);
    currentUser.loginHistory = u.loginHistory;
    const scr = $('#authScreen');
    scr.style.display='none';
    setAvatarVisual($('#adminAv'), u);
    $('.user .name').textContent = u.nama;
    $('.user .mail').textContent = u.username;
    adminViewScope = 'semua';
    adminFocusAnggotaId = null;
    const scopeWrap = $('#adminScopeWrap');
    if(scopeWrap){
      scopeWrap.style.display = isAdmin() ? '' : 'none';
      renderAdminScopeOptions();
      const sel = $('#adminScopeSelect');
      if(sel) sel.value = 'semua';
    }
    toast('Selamat datang, ' + u.nama.split(' ')[0]);
    loadAll();
    startRealtimeSync();
  }
  function renderAdminScopeOptions(){
    const sel = $('#adminScopeSelect'); if(!sel || !isAdmin()) return;
    const current = sel.value;
    const optsAnggota = state.anggota.map(a=>`<option value="${a.id}">Fokus: ${a.nama}</option>`).join('');
    sel.innerHTML = `<option value="semua">Pantau Semua Akun</option>` + optsAnggota;
    sel.value = [...sel.options].some(o=>o.value===current) ? current : 'semua';
  }
  $('#adminScopeSelect') && $('#adminScopeSelect').addEventListener('change', e=>{
    const val = e.target.value;
    if(val==='semua'){ adminViewScope='semua'; adminFocusAnggotaId=null; }
    else { adminViewScope='fokus'; adminFocusAnggotaId=val; }
    renderAll();
  });

  $('#btnLogout').addEventListener('click', async ()=>{
    currentUser = null;
    setMode(null); loadUsers();
    adminViewScope = 'semua';
    const scopeWrap = $('#adminScopeWrap');
    if(scopeWrap) scopeWrap.style.display = 'none';
    stopRealtimeSync();
    await forgetSession();
    $('#authScreen').style.display='flex';
    $('#liPass').value=''; $('#liUsername').value=''; $('#liRemember').checked=false;
    showPanel('login');
  });

  ['liUsername','liPass'].forEach(id=> $('#'+id).addEventListener('keydown', e=>{ if(e.key==='Enter') $('#btnLogin').click(); }));
  ['reNama','reUsername','rePass','rePass2','reAlamat','reHp'].forEach(id=>{ const el=$('#'+id); if(el) el.addEventListener('keydown', e=>{ if(e.key==='Enter') $('#btnRegister').click(); }); });

  function updateLoginAvatarPreview(){
    const row = $('#loginAv').closest('.login-id-row');
    const val = $('#liUsername').value.trim().toLowerCase();
    const u = val ? users.find(x=>x.username===val) : null;
    if(u){
      row.classList.add('has-av');
      setAvatarVisual($('#loginAv'), u, true);
      $('#loginSub').textContent = 'Masuk sebagai ' + u.nama.split(' ')[0];
    } else {
      row.classList.remove('has-av');
      $('#loginSub').textContent = 'Masuk ke akun Anda untuk mengajukan pinjaman dan membayar cicilan.';
    }
  }
  $('#liUsername').addEventListener('input', updateLoginAvatarPreview);


  // =====================================================================
  // ANIMASI TAMBAHAN: loader menu, intro, refresh, pembayaran, struk,
  // badge pencapaian, kartu metode, dan status jatuh tempo bertahap
  // =====================================================================
  function fxReduced(){ return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }
  function fxEsc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; }); }

  // ---- 1. Loader singkat saat pindah menu (logo AM + spinner) ----
  var _vlTimer = null;
  function fxViewLoader(){
    const el = $('#viewLoader');
    if(!el || fxReduced() || !currentUser) return;
    const tb = $('.topbar'), sb = $('#sidebar');
    el.style.top = Math.max(0, tb ? tb.getBoundingClientRect().bottom : 0) + 'px';
    el.style.left = (sb && !sb.classList.contains('hidden') && !isMobileWidth()) ? sb.getBoundingClientRect().right + 'px' : '0px';
    el.style.right = '0px'; el.style.bottom = '0px';
    el.classList.add('show');
    clearTimeout(_vlTimer);
    _vlTimer = setTimeout(function(){
      el.classList.remove('show');
      const v = $('.view.active');
      if(v){ v.style.animation = 'none'; void v.offsetWidth; v.style.animation = ''; }
    }, 700);
  }

  // ---- 2. Intro ala Netflix sebelum halaman login ----
  (function fxIntro(){
    const el = $('#introSplash'), scr = $('#authScreen');
    if(!el) return;
    if(scr) scr.classList.add('intro-wait');
    let done = false;
    function end(){
      if(done) return; done = true;
      el.classList.add('out');
      if(scr){ scr.classList.remove('intro-wait'); scr.classList.add('auth-reveal'); }
      setTimeout(function(){ el.remove(); if(scr) scr.classList.remove('auth-reveal'); }, 850);
    }
    el.addEventListener('click', end);
    setTimeout(end, fxReduced() ? 500 : 3100);
  })();

  // ---- 6. Animasi tombol refresh data ----
  (function fxRefresh(){
    const b = $('#refreshBtn'); if(!b) return;
    b.addEventListener('click', async function(){
      if(b.classList.contains('refreshing') || !currentUser) return;
      b.classList.remove('done'); b.classList.add('refreshing');
      _lastRenderPayload = null; // paksa tampilan dimuat ulang
      try{
        await Promise.all([
          (async function(){ await loadUsers(); await loadAll(); })(),
          new Promise(function(r){ setTimeout(r, fxReduced() ? 100 : 850); })
        ]);
      }catch(e){}
      b.classList.remove('refreshing'); b.classList.add('done');
      toast('Data diperbarui');
      setTimeout(function(){ b.classList.remove('done'); }, 1300);
    });
  })();

  // ---- 3 & 5. Pencapaian (badge kecil) ----
  var _achQueue = [], _achBusy = false;
  function fxAchievements(list){
    (list || []).forEach(function(b){ _achQueue.push(b); });
    if(!_achBusy) fxAchNext();
  }
  function fxAchNext(){
    const stack = $('#achStack'), b = _achQueue.shift();
    if(!stack || !b){ _achBusy = false; return; }
    _achBusy = true;
    const el = document.createElement('div');
    el.className = 'ach';
    el.innerHTML = '<div class="ach-ico">' + b.icon + '</div><div><div class="ach-kicker">Pencapaian baru</div><div class="ach-title">' + fxEsc(b.title) + '</div><div class="ach-desc">' + fxEsc(b.desc) + '</div></div>';
    stack.appendChild(el);
    setTimeout(function(){ el.classList.add('out'); setTimeout(function(){ el.remove(); }, 420); }, 4300);
    setTimeout(fxAchNext, 900);
  }
  // kondisi pencapaian setelah sebuah pembayaran tercatat
  function fxBadges(p, pay){
    const out = [];
    const nama = anggotaName(p.id_anggota);
    const pinjIds = new Set(state.pinjaman.filter(function(x){ return x.id_anggota===p.id_anggota; }).map(function(x){ return x.id; }));
    const mine = state.pembayaran.filter(function(b){ return pinjIds.has(b.id_pinjaman); });
    function onTime(b){
      const pj = state.pinjaman.find(function(x){ return x.id===b.id_pinjaman; });
      if(!pj) return false;
      return b.tanggal_bayar <= addMonths(pj.tanggal_pinjaman, b.cicilan_ke) && !(Number(b.denda) > 0);
    }
    const D = function(userTxt, adminTxt){ return isAdmin() ? nama + ' \u2014 ' + adminTxt : userTxt; };
    if(p.status === 'lunas'){
      out.push({icon:'\uD83C\uDF89', title:'Pinjaman Lunas', desc:D('Selamat, pinjaman '+p.no+' sudah lunas!', 'pinjaman '+p.no+' sudah lunas')});
    }
    let streak = 0;
    for(let i=mine.length-1; i>=0; i--){ if(onTime(mine[i])) streak++; else break; }
    if(streak >= 3 && streak % 3 === 0){
      out.push({icon:'\uD83D\uDD25', title:streak+'x Tepat Waktu Beruntun', desc:D('Konsisten banget, pertahankan!', 'konsisten membayar tepat waktu')});
    }
    if(onTime(pay)){
      out.push({icon:'\u23F1\uFE0F', title:'Pembayaran Tepat Waktu', desc:D('Cicilan ke-'+pay.cicilan_ke+' dibayar sebelum jatuh tempo', 'cicilan ke-'+pay.cicilan_ke+' dibayar sebelum jatuh tempo')});
    }
    if(mine.length === 1){
      out.push({icon:'\uD83C\uDF31', title:'Cicilan Pertama', desc:D('Langkah awal yang bagus!', 'melakukan cicilan pertamanya')});
    }
    return out.slice(0, 3);
  }

  // ---- 4 & 5. Centang besar + struk yang "dicetak" ----
  var _fxPayClose = null;
  function fxPaymentSuccess(rec, badges){
    const ov = $('#payFx');
    if(!ov){ fxAchievements(badges); return; }
    if(_fxPayClose) _fxPayClose();
    const reduced = fxReduced();
    const row = function(html){ return '<div class="rc-row">' + html + '</div>'; };
    const line = function(a, b){ return '<div class="rc-line"><span>' + a + '</span><span>' + b + '</span></div>'; };
    const sep = '<hr class="rc-sep">';
    ov.innerHTML =
      '<div class="pfx-stage" id="pfxStage">' +
        '<div class="pfx-check">' +
          '<span class="pfx-ripple" style="--d:.2s"></span><span class="pfx-ripple" style="--d:.5s"></span><span class="pfx-ripple" style="--d:.8s"></span>' +
          '<div class="pfx-disc"><svg width="64" height="64" viewBox="0 0 52 52" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 27l8 8 16-17"/></svg></div>' +
        '</div>' +
        '<div class="pfx-title">Pembayaran Berhasil</div>' +
        '<div class="pfx-amt">' + rupiah(rec.jumlah) + '</div>' +
        '<div class="pfx-skip">Ketuk untuk lanjut</div>' +
      '</div>' +
      '<div class="receipt-wrap">' +
        '<div class="receipt-printer"><i></i></div>' +
        '<div class="receipt-clip"><div class="receipt-paper">' +
          '<div class="receipt">' +
            row('<div class="rc-head"><b>ALIYAH\u2019S MONEY</b><span>Bukti Pembayaran Cicilan</span></div>') +
            sep +
            row(line('No. Bukti', fxEsc(rec.no))) +
            row(line('Tanggal', fxEsc(fmtDate(rec.tanggal)))) +
            row(line('Anggota', fxEsc(rec.nama))) +
            row(line('Pinjaman', fxEsc(rec.pinjamanNo))) +
            row(line('Cicilan ke', rec.ke + ' / ' + rec.tenor)) +
            sep +
            row(line('Jumlah bayar', rupiah(rec.jumlah))) +
            (rec.denda > 0 ? row(line('Termasuk denda', rupiah(rec.denda))) : '') +
            row(line('Sisa pinjaman', rupiah(rec.sisa))) +
            sep +
            row('<div class="rc-total"><span>TOTAL</span><span>' + rupiah(rec.jumlah) + '</span></div>') +
            row('<div style="text-align:center;"><span class="rc-stamp ' + (rec.lunas ? 'lunas' : '') + '">' + (rec.lunas ? 'LUNAS' : 'BERHASIL') + '</span></div>') +
            row('<div class="rc-bars"></div>') +
            row('<div class="rc-thanks">Terima kasih sudah membayar \uD83D\uDE4F</div>') +
          '</div>' +
          '<svg class="receipt-edge" height="10"><defs><pattern id="rcZig" width="14" height="10" patternUnits="userSpaceOnUse"><polygon points="0,0 14,0 7,10" fill="#FFFDF7"/></pattern></defs><rect width="100%" height="10" fill="url(#rcZig)"/></svg>' +
        '</div></div>' +
        '<div class="receipt-actions"><button class="btn primary" id="pfxDone" type="button">Selesai</button></div>' +
      '</div>';
    ov.classList.remove('show-receipt');
    ov.classList.add('show');

    let phase = 1, t1 = null;
    setTimeout(function(){ if(phase===1) confettiBurst(window.innerWidth/2, window.innerHeight/2 - 60, 40); }, reduced ? 0 : 520);
    function toReceipt(){
      if(phase !== 1) return;
      phase = 2; clearTimeout(t1);
      const st = $('#pfxStage');
      if(st) st.classList.add('leave');
      setTimeout(function(){ if(st) st.style.display = 'none'; ov.classList.add('show-receipt'); }, reduced ? 0 : 340);
    }
    function onKey(e){ if(e.key === 'Escape'){ if(phase === 1) toReceipt(); else finish(); } }
    function finish(){
      if(phase === 0) return;
      phase = 0; clearTimeout(t1);
      document.removeEventListener('keydown', onKey);
      ov.classList.remove('show', 'show-receipt');
      ov.innerHTML = '';
      _fxPayClose = null;
      fxAchievements(badges);
    }
    _fxPayClose = finish;
    document.addEventListener('keydown', onKey);
    t1 = setTimeout(toReceipt, reduced ? 600 : 2300);
    $('#pfxStage').addEventListener('click', toReceipt);
    $('#pfxDone').addEventListener('click', finish);
  }

  // ---- 7. Kartu metode pembayaran bergeser halus ----
  var METODE_ORDER = ['rekening','va','qris'];
  var _metodePrev = 0;
  function syncMetodeCards(animate){
    const wrap = $('#metodeCards'), sel = $('#fMetode');
    if(!wrap || !sel) return;
    const val = sel.value || 'rekening';
    const i = Math.max(0, METODE_ORDER.indexOf(val));
    if(!animate) wrap.classList.add('no-anim');
    wrap.style.setProperty('--i', i);
    $$('.metode-card', wrap).forEach(function(b){
      const on = b.dataset.metode === val;
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    if(!animate){ void wrap.offsetWidth; wrap.classList.remove('no-anim'); }
    const dir = i >= _metodePrev ? 1 : -1;
    _metodePrev = i;
    if(animate && !fxReduced()){
      ['#fNoRekeningWrap','#fQrisWrap'].forEach(function(s){
        const el = $(s);
        if(el && el.style.display !== 'none'){
          el.style.setProperty('--mdx', (dir*18) + 'px');
          el.classList.remove('md-in'); void el.offsetWidth; el.classList.add('md-in');
        }
      });
    }
  }
  $$('.metode-card').forEach(function(b){
    b.addEventListener('click', function(){
      const sel = $('#fMetode');
      if(sel.value === b.dataset.metode) return;
      sel.value = b.dataset.metode;
      sel.dispatchEvent(new Event('change'));
    });
  });

  // ---- 8. Kartu jatuh tempo berubah warna bertahap ----
  function dueStateOf(sisa){
    if(sisa < 0)    return {cls:'due-late', label:'\u26A0\uFE0F Terlambat'};
    if(sisa === 0)  return {cls:'due-h0',   label:'\uD83D\uDD34 Jatuh tempo hari ini'};
    if(sisa === 1)  return {cls:'due-h1',   label:'\uD83D\uDFE0 Besok jatuh tempo'};
    if(sisa === 2)  return {cls:'due-h2',   label:'\uD83D\uDFE1 Segera jatuh tempo'};
    return {cls:'due-safe', label:'\uD83D\uDFE2 Masih aman'};
  }
  function applyDueState(sisa){
    const card = $('#reminderCard'), tag = $('#reminderTag');
    if(!card) return;
    const ALL = ['due-safe','due-h2','due-h1','due-h0','due-late'];
    if(sisa === null || sisa === undefined){
      ALL.forEach(function(c){ card.classList.remove(c); });
      return;
    }
    const st = dueStateOf(sisa);
    if(tag) tag.textContent = st.label;
    if(card.classList.contains(st.cls)) return;
    // jeda singkat supaya transisi warna terlihat perlahan, bukan mendadak
    setTimeout(function(){ ALL.forEach(function(c){ card.classList.toggle(c, c === st.cls); }); }, 150);
  }

  (async function initAuth(){
    await loadUsers();
    showPanel('login');
  })();
})();
