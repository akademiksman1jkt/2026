    // ============================================================
    // CETAK RAPOR INDIVIDU — Konfigurasi Lengkap (Kop, Kolom, Mapel)
    // ============================================================

    function _raporCfgGet(key, def) {
        try { let v = localStorage.getItem('rapor_cfg_'+key); return v !== null ? JSON.parse(v) : def; } catch(e) { return def; }
    }
    function _raporCfgSet(key, val) { localStorage.setItem('rapor_cfg_'+key, JSON.stringify(val)); }

    function bukaDialogCetakRapor() {
        let kelas = document.getElementById('rlSelectKelas')?.value || '';
        let smt   = document.getElementById('rlSelectSemester')?.value || '1';
        if (!kelas) { alert('Pilih kelas terlebih dahulu!'); return; }

        // Load saved config
        let cfgNamaSekolah  = _raporCfgGet('namaSekolah',  'SMA NEGERI 1 JAKARTA');
        let cfgSubjudul     = _raporCfgGet('subjudul',     'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi');
        let cfgAlamat       = _raporCfgGet('alamat',       'Jl. Budi Utomo No.7, Ps. Baru, Jakarta Pusat 10710');
        let cfgKota         = _raporCfgGet('kota',         'Jakarta');
        let cfgNamaKepsek   = _raporCfgGet('namaKepsek',   '');
        let cfgNipKepsek    = _raporCfgGet('nipKepsek',    '');
        let cfgNamaWali     = _raporCfgGet('namaWali',     '');
        let cfgNipWali      = _raporCfgGet('nipWali',      '');
        let cfgShowRank     = _raporCfgGet('showRank',     true);
        let cfgShowAvg      = _raporCfgGet('showAvg',      true);
        let cfgShowKode     = _raporCfgGet('showKode',     true);
        let cfgShowKetuntasan= _raporCfgGet('showKetuntasan', true);
        let cfgShowKKMNote  = _raporCfgGet('showKKMNote',  true);
        let cfgHideEmptyMapel = _raporCfgGet('hideEmptyMapel', true);
        let cfgShowNisn     = _raporCfgGet('showNisn',     true);
        let cfgShowNis      = _raporCfgGet('showNis',      false);
        let cfgTtdWali      = _raporCfgGet('ttdWali',      true);
        let cfgTtdKepsek    = _raporCfgGet('ttdKepsek',    true);

        let modalHtml = `
        <div id="modalCetakRapor" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;padding:16px;">
            <div style="background:white;border-radius:16px;max-width:680px;width:100%;max-height:90vh;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.35);display:flex;flex-direction:column;">

                <!-- Header -->
                <div style="background:#0f172a;color:white;padding:16px 24px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
                    <div>
                        <div style="font-size:16px;font-weight:800;"><i class="ri-file-user-line" style="color:#9d7e56;margin-right:6px;"></i> Cetak Rapor Individu</div>
                        <div style="font-size:12px;color:#94a3b8;margin-top:2px;">Kelas <strong style="color:white;">${kelas}</strong> &mdash; Semester <strong style="color:white;">${smt}</strong></div>
                    </div>
                    <button onclick="document.getElementById('modalCetakRapor').remove()" style="background:transparent;border:none;color:#94a3b8;cursor:pointer;font-size:22px;line-height:1;">✕</button>
                </div>

                <!-- Tabs -->
                <div style="display:flex;border-bottom:2px solid #e2e8f0;flex-shrink:0;padding:0 20px;background:#f8fafc;">
                    <button class="rapor-cfg-tab active" id="rcTab1" onclick="rcSwitchTab(1)">🏫 Kop Instansi</button>
                    <button class="rapor-cfg-tab" id="rcTab2" onclick="rcSwitchTab(2)">📊 Kolom & Tampilan</button>
                    <button class="rapor-cfg-tab" id="rcTab3" onclick="rcSwitchTab(3)">📚 Mata Pelajaran</button>
                    <button class="rapor-cfg-tab" id="rcTab4" onclick="rcSwitchTab(4)">✍️ Tanda Tangan</button>
                </div>

                <!-- Content -->
                <div style="overflow-y:auto;flex:1;padding:20px 24px;">

                    <!-- TAB 1: Kop Instansi -->
                    <div id="rcSection1" class="rapor-cfg-section active">
                        <div style="font-size:12px;color:#64748b;margin-bottom:16px;">Informasi sekolah yang akan tampil di bagian atas (kop) setiap halaman rapor.</div>
                        <div style="display:grid;gap:12px;">
                            <div>
                                <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Nama Instansi / Sekolah</label>
                                <input id="rcNamaSekolah" value="${cfgNamaSekolah}" style="width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:14px;font-weight:700;font-family:inherit;">
                            </div>
                            <div>
                                <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Sub-judul / Naungan</label>
                                <input id="rcSubjudul" value="${cfgSubjudul}" style="width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;">
                            </div>
                            <div>
                                <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Alamat Sekolah</label>
                                <input id="rcAlamat" value="${cfgAlamat}" style="width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;">
                            </div>
                            <div>
                                <label style="font-size:12px;font-weight:700;color:#334155;display:block;margin-bottom:4px;">Kota / Kabupaten (untuk tanda tangan)</label>
                                <input id="rcKota" value="${cfgKota}" style="width:100%;padding:9px 12px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-family:inherit;">
                            </div>
                        </div>
                    </div>

                    <!-- TAB 2: Kolom & Tampilan -->
                    <div id="rcSection2" class="rapor-cfg-section">
                        <div style="font-size:12px;color:#64748b;margin-bottom:16px;">Pilih kolom dan elemen yang ingin ditampilkan di rapor cetak.</div>
                        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                            <div style="padding:12px 16px;background:#f8fafc;font-size:12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">KOLOM TABEL NILAI</div>
                            <div style="padding:4px 16px;">
                                <div class="rapor-toggle-row"><span>Kolom Kode Mapel</span><label class="toggle-switch"><input type="checkbox" id="rcShowKode" ${cfgShowKode?'checked':''}><span class="toggle-slider"></span></label></div>
                                <div class="rapor-toggle-row"><span>Kolom Ketuntasan (Tuntas/Belum)</span><label class="toggle-switch"><input type="checkbox" id="rcShowKetuntasan" ${cfgShowKetuntasan?'checked':''}><span class="toggle-slider"></span></label></div>
                                <div class="rapor-toggle-row"><span>Kolom Rata-Rata di footer tabel</span><label class="toggle-switch"><input type="checkbox" id="rcShowAvg" ${cfgShowAvg?'checked':''}><span class="toggle-slider"></span></label></div>
                                <div class="rapor-toggle-row"><span>Kolom Peringkat Kelas di footer tabel</span><label class="toggle-switch"><input type="checkbox" id="rcShowRank" ${cfgShowRank?'checked':''}><span class="toggle-slider"></span></label></div>
                            </div>
                        </div>
                        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-top:14px;">
                            <div style="padding:12px 16px;background:#f8fafc;font-size:12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">IDENTITAS SISWA</div>
                            <div style="padding:4px 16px;">
                                <div class="rapor-toggle-row"><span>Tampilkan NISN</span><label class="toggle-switch"><input type="checkbox" id="rcShowNisn" ${cfgShowNisn?'checked':''}><span class="toggle-slider"></span></label></div>
                                <div class="rapor-toggle-row"><span>Tampilkan NIS / Nomor Induk Sekolah</span><label class="toggle-switch"><input type="checkbox" id="rcShowNis" ${cfgShowNis?'checked':''}><span class="toggle-slider"></span></label></div>
                            </div>
                        </div>
                        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-top:14px;">
                            <div style="padding:12px 16px;background:#f8fafc;font-size:12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">CATATAN BAWAH</div>
                            <div style="padding:4px 16px;">
                                <div class="rapor-toggle-row"><span>Tampilkan catatan KKM (*)  di bawah tabel</span><label class="toggle-switch"><input type="checkbox" id="rcShowKKMNote" ${cfgShowKKMNote?'checked':''}><span class="toggle-slider"></span></label></div>
                            </div>
                        </div>
                    </div>

                    <!-- TAB 3: Mata Pelajaran -->
                    <div id="rcSection3" class="rapor-cfg-section">
                        <div style="font-size:12px;color:#64748b;margin-bottom:14px;">Atur mata pelajaran yang muncul di rapor cetak.</div>
                        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:14px;">
                            <div style="padding:12px 16px;background:#f8fafc;font-size:12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">FILTER OTOMATIS</div>
                            <div style="padding:4px 16px;">
                                <div class="rapor-toggle-row">
                                    <div>
                                        <div style="font-weight:600;">Sembunyikan mapel yang tidak ada nilainya</div>
                                        <div style="font-size:11px;color:#64748b;margin-top:2px;">Mapel dengan nilai "-" atau kosong tidak akan ditampilkan di rapor</div>
                                    </div>
                                    <label class="toggle-switch"><input type="checkbox" id="rcHideEmptyMapel" ${cfgHideEmptyMapel?'checked':''}><span class="toggle-slider"></span></label>
                                </div>
                            </div>
                        </div>
                        <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:8px;padding:12px;font-size:12px;color:#92400e;">
                            <strong>ℹ️ Catatan:</strong> Opsi di atas akan otomatis menyembunyikan mata pelajaran yang nilai semester-nya kosong atau belum diinput untuk siswa bersangkutan, sehingga rapor lebih ringkas dan relevan.
                        </div>
                    </div>

                    <!-- TAB 4: Tanda Tangan -->
                    <div id="rcSection4" class="rapor-cfg-section">
                        <div style="font-size:12px;color:#64748b;margin-bottom:16px;">Konfigurasi penanda tangan yang muncul di bagian bawah rapor.</div>
                        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;margin-bottom:16px;">
                            <div style="padding:12px 16px;background:#f8fafc;font-size:12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">WALI KELAS</div>
                            <div style="padding:12px 16px;">
                                <div class="rapor-toggle-row" style="margin-bottom:12px;"><span style="font-weight:600;">Tampilkan kolom tanda tangan Wali Kelas</span><label class="toggle-switch"><input type="checkbox" id="rcTtdWali" ${cfgTtdWali?'checked':''}><span class="toggle-slider"></span></label></div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                    <div>
                                        <label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px;">Nama Wali Kelas</label>
                                        <input id="rcNamaWali" value="${cfgNamaWali}" placeholder="Nama lengkap + gelar..." style="width:100%;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:13px;">
                                    </div>
                                    <div>
                                        <label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px;">NIP Wali Kelas</label>
                                        <input id="rcNipWali" value="${cfgNipWali}" placeholder="NIP (opsional)" style="width:100%;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:13px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style="border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
                            <div style="padding:12px 16px;background:#f8fafc;font-size:12px;font-weight:700;color:#334155;border-bottom:1px solid #e2e8f0;">KEPALA SEKOLAH</div>
                            <div style="padding:12px 16px;">
                                <div class="rapor-toggle-row" style="margin-bottom:12px;"><span style="font-weight:600;">Tampilkan kolom tanda tangan Kepala Sekolah</span><label class="toggle-switch"><input type="checkbox" id="rcTtdKepsek" ${cfgTtdKepsek?'checked':''}><span class="toggle-slider"></span></label></div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                                    <div>
                                        <label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px;">Nama Kepala Sekolah</label>
                                        <input id="rcNamaKepsek" value="${cfgNamaKepsek}" placeholder="Nama lengkap + gelar..." style="width:100%;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:13px;">
                                    </div>
                                    <div>
                                        <label style="font-size:11px;font-weight:700;color:#64748b;display:block;margin-bottom:4px;">NIP Kepala Sekolah</label>
                                        <input id="rcNipKepsek" value="${cfgNipKepsek}" placeholder="NIP..." style="width:100%;padding:8px 12px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:13px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="padding:14px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;display:flex;gap:10px;justify-content:flex-end;flex-shrink:0;">
                    <button onclick="document.getElementById('modalCetakRapor').remove()" style="padding:10px 20px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;background:white;color:#334155;">Batal</button>
                    <button onclick="eksekusiCetakRaporIndividu('${kelas}',${smt})" style="padding:10px 24px;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;background:#0f766e;color:white;display:flex;align-items:center;gap:6px;">
                        <i class="ri-printer-line"></i> Cetak Rapor Sekarang
                    </button>
                </div>
            </div>
        </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    function rcSwitchTab(n) {
        for (let i = 1; i <= 4; i++) {
            document.getElementById('rcTab'+i)?.classList.toggle('active', i===n);
            document.getElementById('rcSection'+i)?.classList.toggle('active', i===n);
        }
    }

    function eksekusiCetakRaporIndividu(kelas, smt) {
        // Save all config
        _raporCfgSet('namaSekolah',    document.getElementById('rcNamaSekolah')?.value    || 'SMA NEGERI 1 JAKARTA');
        _raporCfgSet('subjudul',       document.getElementById('rcSubjudul')?.value       || '');
        _raporCfgSet('alamat',         document.getElementById('rcAlamat')?.value         || '');
        _raporCfgSet('kota',           document.getElementById('rcKota')?.value           || 'Jakarta');
        _raporCfgSet('namaKepsek',     document.getElementById('rcNamaKepsek')?.value     || '');
        _raporCfgSet('nipKepsek',      document.getElementById('rcNipKepsek')?.value      || '');
        _raporCfgSet('namaWali',       document.getElementById('rcNamaWali')?.value       || '');
        _raporCfgSet('nipWali',        document.getElementById('rcNipWali')?.value        || '');
        _raporCfgSet('showRank',       document.getElementById('rcShowRank')?.checked      ?? true);
        _raporCfgSet('showAvg',        document.getElementById('rcShowAvg')?.checked       ?? true);
        _raporCfgSet('showKode',       document.getElementById('rcShowKode')?.checked      ?? true);
        _raporCfgSet('showKetuntasan', document.getElementById('rcShowKetuntasan')?.checked ?? true);
        _raporCfgSet('showKKMNote',    document.getElementById('rcShowKKMNote')?.checked   ?? true);
        _raporCfgSet('hideEmptyMapel', document.getElementById('rcHideEmptyMapel')?.checked ?? true);
        _raporCfgSet('showNisn',       document.getElementById('rcShowNisn')?.checked      ?? true);
        _raporCfgSet('showNis',        document.getElementById('rcShowNis')?.checked       ?? false);
        _raporCfgSet('ttdWali',        document.getElementById('rcTtdWali')?.checked       ?? true);
        _raporCfgSet('ttdKepsek',      document.getElementById('rcTtdKepsek')?.checked     ?? true);

        document.getElementById('modalCetakRapor')?.remove();
        cetakRaporIndividu(kelas, parseInt(smt));
    }

    function cetakRaporIndividu(kelas, smt) {
    // 1. MEMBACA KONFIGURASI SETUP TAMPILAN RAPOR
    let cfg = {
        namaSekolah:    _raporCfgGet('namaSekolah',    'SMA NEGERI 1 JAKARTA'),
        subjudul:       _raporCfgGet('subjudul',       'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi'),
        alamat:         _raporCfgGet('alamat',         'Jl. Budi Utomo No.7, Ps. Baru, Jakarta Pusat 10710'),
        kota:           _raporCfgGet('kota',           'Jakarta'),
        namaKepsek:     _raporCfgGet('namaKepsek',     '___________________________'),
        nipKepsek:      _raporCfgGet('nipKepsek',      ''),
        namaWali:       _raporCfgGet('namaWali',       '___________________________'),
        nipWali:        _raporCfgGet('nipWali',        ''),
        showRank:       _raporCfgGet('showRank',       true),
        showAvg:        _raporCfgGet('showAvg',        true),
        showKode:       _raporCfgGet('showKode',       true),
        showKetuntasan: _raporCfgGet('showKetuntasan', true),
        showKKMNote:    _raporCfgGet('showKKMNote',    true),
        hideEmptyMapel: _raporCfgGet('hideEmptyMapel', true),
        showNisn:       _raporCfgGet('showNisn',       true),
        showNis:        _raporCfgGet('showNis',        false),
        ttdWali:        _raporCfgGet('ttdWali',        true),
        ttdKepsek:      _raporCfgGet('ttdKepsek',      true),
    };
    if (!cfg.namaKepsek.trim()) cfg.namaKepsek = '___________________________';
    if (!cfg.namaWali.trim())   cfg.namaWali   = '___________________________';

    // Menyaring daftar siswa berdasarkan Rombel Kelas yang dipilih
    const fSiswa = dataSiswaGlobal
        .filter(r => r[3] === kelas)
        .sort((a, b) => (a[2] || '').localeCompare(b[2] || ''));
    if (fSiswa.length === 0) { alert('Tidak ada siswa di rombel kelas ini.'); return; }

    // AMBIL DAFTAR MAPEL PILIHAN ADMIN UNTUK KELAS INI
    let mapelPilihanAdmin = getMapelAktifPerKelas(kelas); 

    // 2. LOGIKA PERINGKAT (RANK)
    let rankData = fSiswa.map(siswa => {
        let totalNilaiRerataMapel = 0;
        let totalMapelTerhitung = 0;
        
        daftarMapel.forEach((m) => {
            if (!mapelPilihanAdmin.includes(m.kode)) return;

            let keyUnik = 'ep_draft_' + m.kode + '_' + kelas + '_' + smt + '_' + siswa[0];
            let dataMentah = {};
            try { dataMentah = JSON.parse(localStorage.getItem(keyUnik) || '{}'); } catch(e) {}
            
            let subVals = Object.values(dataMentah).map(v => parseFloat(v) || 0).filter(v => v > 0);
            let rataMapel = subVals.length > 0 ? subVals.reduce((a,b)=>a+b, 0) / subVals.length : 0;
            
            if (rataMapel > 0) {
                totalNilaiRerataMapel += rataMapel;
                totalMapelTerhitung++;
            }
        });
        
        let rataRataSiswa = totalMapelTerhitung > 0 ? (totalNilaiRerataMapel / totalMapelTerhitung) : 0;
        return { nisn: siswa[0], avg: rataRataSiswa };
    });
    
    rankData.sort((a, b) => b.avg - a.avg);

    let getRank = nisn => rankData.findIndex(r => r.nisn === nisn) + 1;
    let getAvg  = nisn => { let r = rankData.find(x => x.nisn === nisn); return r ? r.avg.toFixed(2) : '-'; };

    let tglCetak  = new Date().toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });
    let y = new Date().getFullYear();
    let tahunAjar = smt % 2 === 1 ? `${y}/${y+1}` : `${y-1}/${y}`;

    // 3. SUSUN HEADERS TABEL (KOLOM KKM SUDAH DIHAPUS DI SINI)
    let colHeaders = '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:32px;">No</th>';
    colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:left;">Mata Pelajaran</th>';
    if (cfg.showKode) colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:50px;">Kode</th>';
    
    // Header komponen sub-nilai
    colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:60px;">Harian</th>';
    colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:60px;">Tugas</th>';
    colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:60px;">UTS</th>';
    colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:60px;">UAS</th>';
    
    colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:65px;background:#e2e8f0;color:#0f172a;">Rata-Rata</th>';
    if (cfg.showKetuntasan) colHeaders += '<th style="padding:8px 10px;border:1px solid #334155;font-size:11px;text-align:center;width:90px;">Ketuntasan</th>';
    
    // Penyesuaian Colspan karena kolom KKM dihapus (asalnya 3 base menjadi 2 base)
    let colSpanFoot = 2 + (cfg.showKode ? 1 : 0) + 4; 

    function buildIdentityHtml(siswa) {
        let nisnSiswa = siswa[0] || '';
        let namaLengkap = (siswa[2] || '').toUpperCase();
        let kelasSiswa  = siswa[3] || kelas;

        return `
        <div style="padding:10px 14px;background:#f8fafc;border-right:1px solid #e2e8f0;grid-column:span 1;">
            <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Nama Siswa</div>
            <div style="font-size:14px;font-weight:800;color:#0f172a;margin-top:2px;">${namaLengkap}</div>
        </div>
        <div style="padding:10px 14px;background:#f8fafc;grid-column:span 1;">
            <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;">NISN</div>
            <div style="font-size:13px;font-weight:800;color:#0f172a;margin-top:2px;font-family:monospace;">${nisnSiswa}</div>
        </div>
        <div style="padding:10px 14px;border-top:1px solid #e2e8f0;border-right:1px solid #e2e8f0;">
            <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Kelas / Rombel</div>
            <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">${kelasSiswa}</div>
        </div>
        <div style="padding:10px 14px;border-top:1px solid #e2e8f0;">
            <div style="font-size:10px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Periode Laporan</div>
            <div style="font-size:13px;font-weight:700;color:#0f172a;margin-top:2px;">Tengah Semester Berkala</div>
        </div>`;
    }

    // 4. LOOPING BARIS DATA SISWA & MAPEL (KOLOM KKM DI DALAM TD JUGA DIHAPUS)
    let raporPages = fSiswa.map((siswa, siswaIdx) => {
        let nisnSiswa = siswa[0] || '';
        let avgSiswa  = getAvg(nisnSiswa);
        let rank      = getRank(nisnSiswa);
        let rowCount  = 1;

        let barisNilai = '';

        daftarMapel.forEach((m) => {
            if (!mapelPilihanAdmin.includes(m.kode)) return;

            let keyUnik = 'ep_draft_' + m.kode + '_' + kelas + '_' + smt + '_' + siswa[0];
            let dataMentah = {};
            try { dataMentah = JSON.parse(localStorage.getItem(keyUnik) || '{}'); } catch(e) {}

            let harian = dataMentah.harian && dataMentah.harian > 0 ? dataMentah.harian : '-';
            let tugas  = dataMentah.tugas  && dataMentah.tugas > 0  ? dataMentah.tugas  : '-';
            let uts    = dataMentah.uts    && dataMentah.uts > 0    ? dataMentah.uts    : '-';
            let uas    = dataMentah.uas    && dataMentah.uas > 0    ? dataMentah.uas    : '-';

            let subVals = Object.values(dataMentah).map(v => parseFloat(v) || 0).filter(v => v > 0);
            let nilaiAkhirMurni = subVals.length > 0 ? subVals.reduce((a,b)=>a+b, 0) / subVals.length : 0;

            let subCellsHtml = `
                <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;font-weight:500;">${harian}</td>
                <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;font-weight:500;">${tugas}</td>
                <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;font-weight:500;">${uts}</td>
                <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;font-weight:500;">${uas}</td>
            `;

            let warnaVal   = nilaiAkhirMurni > 0 && nilaiAkhirMurni < 75 ? '#dc2626' : '#0f172a';
            let bgVal      = nilaiAkhirMurni > 0 && nilaiAkhirMurni < 75 ? '#fef2f2' : 'transparent';
            let ketTeks    = nilaiAkhirMurni > 0 && nilaiAkhirMurni < 75 ? '<span style="color:#dc2626;font-weight:700;">Belum Tuntas</span>' : (nilaiAkhirMurni > 0 ? 'Tuntas' : '-');

            barisNilai += `<tr>
                <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;">${rowCount++}</td>
                <td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;font-weight:600;">${m.namaLengkap}</td>`;
            if (cfg.showKode) barisNilai += `<td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;font-family:monospace;">${m.kode}</td>`;
            
            // NOTE: Baris td KKM (75) sebelumnya sudah dihapus dari rentang ini
            barisNilai += subCellsHtml;
            barisNilai += `<td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:13px;text-align:center;font-weight:700;color:${warnaVal};background:${bgVal};">${nilaiAkhirMurni > 0 ? nilaiAkhirMurni.toFixed(1) : '-'}</td>`;
            if (cfg.showKetuntasan) barisNilai += `<td style="padding:6px 10px;border:1px solid #e2e8f0;font-size:12px;text-align:center;color:#64748b;">${ketTeks}</td>`;
            barisNilai += `</tr>`;
        });

        let footerRow = `<tr style="background:#f1f5f9;">
            <td colspan="${colSpanFoot}" style="padding:8px 10px;border:1px solid #e2e8f0;font-size:12px;font-weight:700;text-align:right;color:#334155;">Rata-rata Progress Nilai</td>
            <td style="padding:8px 10px;border:1px solid #e2e8f0;font-size:14px;font-weight:900;text-align:center;color:#9d7e56;">${avgSiswa}</td>`;
        if (cfg.showKetuntasan) {
            footerRow += `<td style="padding:8px 10px;border:1px solid #e2e8f0;font-size:11px;text-align:center;color:#166534;font-weight:700;background:#dcfce7;">Peringkat #${rank}</td>`;
        }
        footerRow += `</tr>`;

        let ttdHtml = '';
        if (cfg.ttdWali || cfg.ttdKepsek) {
            let tglTanda = `${cfg.kota}, ${tglCetak}`;
            let colWali = cfg.ttdWali ? `<td style="width:45%;padding:0 12px;text-align:center;vertical-align:top;border:1px solid #cbd5e1;border-radius:4px;">
                <div style="font-size:11px;font-weight:700;color:#334155;padding-top:8px;">Wali Kelas,</div>
                <div style="height:64px;"></div>
                <div style="border-top:1.5px solid #334155;margin:0 20px;"></div>
                <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">${cfg.namaWali}</div>
                <div style="font-size:10px;color:#64748b;margin-bottom:6px;">NIP. ${cfg.nipWali || '________________________'}</div>
            </td>` : '';
            let colKepsek = cfg.ttdKepsek ? `<td style="width:45%;padding:0 12px;text-align:center;vertical-align:top;border:1px solid #cbd5e1;border-radius:4px;">
                <div style="font-size:11px;font-weight:700;color:#334155;padding-top:8px;">Kepala Sekolah,</div>
                <div style="height:64px;"></div>
                <div style="border-top:1.5px solid #334155;margin:0 20px;"></div>
                <div style="font-size:12px;font-weight:800;color:#0f172a;margin-top:4px;">${cfg.namaKepsek}</div>
                <div style="font-size:10px;color:#64748b;margin-bottom:6px;">NIP. ${cfg.nipKepsek || '________________________'}</div>
            </td>` : '';
            let spacer = (cfg.ttdWali && cfg.ttdKepsek) ? '<td style="width:10%;"></td>' : '';
            ttdHtml = `<div style="margin-top:24px;">
                <div style="font-size:11px;color:#64748b;margin-bottom:10px;text-align:right;">${tglTanda}</div>
                <table style="width:100%;border-collapse:separate;border-spacing:8px;"><tr>${colWali}${spacer}${colKepsek}</tr></table>
            </div>`;
        }

        let isLast = siswaIdx === fSiswa.length - 1;
        return `
        <div style="${isLast ? '' : 'page-break-after:always;'}padding:28px 32px;max-width:820px;margin:0 auto;background:white;">
            <div style="display:flex;align-items:center;border-bottom:3px solid #0f172a;padding-bottom:12px;margin-bottom:16px;">
                <div style="flex:1;">
                    <div style="font-size:10px;font-weight:700;color:#64748b;letter-spacing:1px;text-transform:uppercase;">${cfg.subjudul}</div>
                    <div style="font-size:20px;font-weight:900;color:#0f172a;line-height:1.1;">${cfg.namaSekolah}</div>
                    <div style="font-size:11px;color:#475569;margin-top:2px;">${cfg.alamat}</div>
                </div>
                <div style="text-align:right;">
                    <div style="background:#0f172a;color:white;padding:6px 14px;border-radius:6px;font-size:11px;font-weight:700;">TRANSPARANSI NILAI</div>
                    <div style="font-size:11px;color:#64748b;margin-top:4px;">Tahun Pelajaran ${tahunAjar}</div>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:0;border:1.5px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px;">
                ${buildIdentityHtml(siswa)}
            </div>
            <table style="width:100%;border-collapse:collapse;font-family:inherit;">
                <thead><tr style="background:#1e293b;color:white;">${colHeaders}</tr></thead>
                <tbody>${barisNilai || '<tr><td colspan="9" style="padding:12px;text-align:center;color:#94a3b8;font-size:12px;border:1px solid #e2e8f0;">Belum ada riwayat komponen masuk</td></tr>'}</tbody>
                <tfoot>${footerRow}</tfoot>
            </table>
            <div style="margin-top:8px;font-size:10px;color:#a3a3a3;font-style:italic;">* Nilai murni rata-rata berlatar merah menandakan subkompetensi mapel berada di bawah standar ketuntasan (75)</div>
            ${ttdHtml}
        </div>`;
    }).join('<div style="page-break-after:always;"></div>');

    // 5. PRINT AREA POP-UP WINDOWS
    let winPrint = window.open('', '_blank', 'width=950,height=950');
    winPrint.document.write(`<!DOCTYPE html>
    <html lang="id"><head>
        <meta charset="UTF-8">
        <title>Rapor Transparansi Komponen — Kelas ${kelas}</title>
        <style>
            * { box-sizing:border-box; margin:0; padding:0; }
            body { font-family:'Segoe UI',Arial,sans-serif; background:#f1f5f9; color:#0f172a; }
            @page { size:A4 portrait; margin:15mm; }
            @media print { body { background:white; } .no-print { display:none !important; } .rapor-page { margin:0 !important; box-shadow:none !important; } }
            .toolbar { position:fixed; top:0; left:0; right:0; background:#0f172a; color:white; padding:10px 20px; display:flex; align-items:center; justify-content:space-between; z-index:9999; }
            .toolbar button { padding:8px 20px; border:none; border-radius:6px; font-size:13px; font-weight:700; cursor:pointer; }
            th, td { padding:8px; border:1px solid #cbd5e1; font-size:12px; }
            th { background:#1e293b; color:white; font-weight:700; }
            .rapor-page { background:white; margin:70px auto 20px; max-width:850px; box-shadow:0 4px 20px rgba(0,0,0,0.1); border-radius:8px; }
        </style>
    </head>
    <body>
        <div class="toolbar no-print">
            <span>📊 Dokumen Progress Transparansi Belajar Rombel Kelas ${kelas} (Semester ${smt})</span>
            <button style="background:#0f766e; color:white;" onclick="window.print()">🖨 Cetak Dokumen Rapor</button>
        </div>
        <div class="rapor-page">${raporPages}</div>
    </body></html>`);
    winPrint.document.close();
    winPrint.focus();
}



// Variabel global penampung klik sementara user guru
let opsiDipilihGuru = "";

function pilihOpsiSementara(nisn, kesimpulan) {
    opsiDipilihGuru = kesimpulan;
    
    const tombolNaik = document.getElementById('btnOptNaik');
    const tombolTinggal = document.getElementById('btnOptTinggal');
    const areaSubmit = document.getElementById('wrapperSubmitVote');
    
    // Ubah warna latar tombol secara instan untuk meyakinkan guru sebelum klik submit
    if (kesimpulan === 'NAIK') {
        if (tombolNaik) { tombolNaik.style.background = '#107c41'; tombolNaik.style.color = 'white'; }
        if (tombolTinggal) { tombolTinggal.style.background = 'white'; tombolTinggal.style.color = '#dc2626'; }
    } else {
        if (tombolNaik) { tombolNaik.style.background = 'white'; tombolNaik.style.color = '#107c41'; }
        if (tombolTinggal) { tombolTinggal.style.background = '#dc2626'; tombolTinggal.style.color = 'white'; }
    }
    
    // Munculkan tombol biru konfirmasi kirim suara ke cloud
    if (areaSubmit) areaSubmit.style.display = 'block';
}

function eksekusiKirimKeCloud(nisn) {
    if (!opsiDipilihGuru) {
        alert("Silakan pilih opsi terlebih dahulu sebelum mengirim!");
        return;
    }
    
    // Gunakan fungsi bawaan template asli Anda untuk menembakkan data secara resmi
    if (typeof submitSuaraRapat === "function") {
        submitSuaraRapat(nisn, opsiDipilihGuru);
        
        // Sembunyikan kembali tombol submit setelah berhasil diproses
        const areaSubmit = document.getElementById('wrapperSubmitVote');
        if (areaSubmit) areaSubmit.style.display = 'none';
        opsiDipilihGuru = ""; 
    } else {
        alert("Fungsi pengiriman utama sistem tidak ditemukan.");
    }
}
// =====================================================================
// 1. MEMPERBAIKI MASALAH PINDAH MENU (AGAR SISWA AKTIF TETAP TERSIMPAN)
// =====================================================================
// Bungkus fungsi penayangan siswa asli Anda agar datanya dikunci di localStorage Admin
function tayangkanSiswaKeVotingRapat(nisn) {
    if (!nisn) return;
    
    // Simpan di memori lokal Admin agar saat ganti menu, data ini TIDAK HILANG
    localStorage.setItem("nisn_siswa_sidang_aktif", nisn);
    localStorage.setItem("sesi_voting_sidang_terbuka", "true");
    
    // Jalankan fungsi pengiriman asli ke Google Apps Script bawaan sistem Anda
    if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
        fetch(URL_GOOGLE_APPS_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({
                aksi: 'set_siswa_aktif', // Menyesuaikan aksi asli backend Anda
                nisn: nisn
            })
        })
        .then(res => res.json())
        .then(data => {
            console.log("✓ Cloud: Siswa berhasil ditayangkan secara luas.");
            renderUIVotingDanChart();
        })
        .catch(err => console.log("Gagal menyinkronkan ke cloud, menggunakan mode lokal."));
    }
}

// =====================================================================
// 2. MEMPERBAIKI REKAP SUARA KOSONG (TARIK REKAP CLOUD SECARA BERKALA)
// =====================================================================
function tarikRekapSuaraTerbaruDariCloud() {
    // Pastikan hanya laptop Admin/Proyektor yang menarik rekapitulasi massal
    let isAdmin = (typeof sessionUserAktif !== "undefined" && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');
    if (!isAdmin) return; 

    let nisnAktifAdmin = localStorage.getItem("nisn_siswa_sidang_aktif");
    if (!nisnAktifAdmin || !URL_GOOGLE_APPS_SCRIPT) return;

    // Ambil rekap data mentah dari Google Sheets secara real-time
    let urlGetRekap = URL_GOOGLE_APPS_SCRIPT + "?aksi=get_rekap_voting&nisn=" + nisnAktifAdmin + "&t=" + new Date().getTime();

    fetch(urlGetRekap, { method: 'GET' })
    .then(response => response.json())
    .then(resData => {
        if (resData.success && resData.data_vote) {
            // resData.data_vote diharapkan berisi objek: { naik: ["guru1", "guru2"], tinggal: ["guru3"] }
            let listNaik = resData.data_vote.naik || [];
            let listTinggal = resData.data_vote.tinggal || [];

            // Suntikkan hasil dari cloud ke dalam localStorage Admin agar grafik terupdate otomatis
            localStorage.setItem(`vote_naik_${nisnAktifAdmin}`, JSON.stringify(listNaik));
            localStorage.setItem(`vote_tinggal_${nisnAktifAdmin}`, JSON.stringify(listTinggal));

            // Gambar ulang bagan persentase dan tabel rekap di layar Admin/Proyektor
            renderUIVotingDanChart();
        }
    })
    .catch(err => console.log("⏳ Sinkronisasi rekap suara..."));
}

// Jalankan penarikan suara otomatis khusus Admin setiap 3 detik sekali secara background
setInterval(function() {
    let isAdmin = (typeof sessionUserAktif !== "undefined" && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');
    if (isAdmin) {
        tarikRekapSuaraTerbaruDariCloud();
    }
}, 3000);

// =========================================================================
// SINKRONISASI KURIKULUM: LOGIKA PENGATURAN MAPEL PER KELAS
// =========================================================================

// 1. Fungsi untuk menyimpan daftar kode mapel yang aktif di kelas tertentu
function simpanPengaturanMapelPerKelas(kelas, daftarKodeMapelAktif) {
    localStorage.setItem(`mapel_aktif_kelas_${kelas}`, JSON.stringify(daftarKodeMapelAktif));
    alert(`✓ Sukses menyimpan struktur kurikulum untuk Kelas ${kelas}!`);
    
    // Refresh visual jika fungsi render kurikulum/rapor sedang terbuka
    if (typeof renderRaporKunciSection === "function") renderRaporKunciSection(); 
}

// 2. Fungsi untuk mengambil daftar kode mapel yang aktif di kelas tertentu
function getMapelAktifPerKelas(kelas) {
    let data = localStorage.getItem(`mapel_aktif_kelas_${kelas}`);
    if (data) {
        try {
            return JSON.parse(data); // Mengembalikan array kode mapel, misal: ["PANCASILA", "MAT_W"]
        } catch (e) {
            return daftarMapel.map(m => m.kode);
        }
    }
    // Jika Admin belum pernah mengatur kelas ini, default-nya munculkan SEMUA mapel (Fallback)
    return daftarMapel.map(m => m.kode);
}

// Fungsi otomatis menggambar kotak centang saat admin memilih kelas
function renderPilihanCeklisMapelAdmin() {
    // Membaca element seleksi kelas bawaan dari file HTML Anda
    let elKelas = document.getElementById('rlSelectKelas') || document.getElementById('baseSelectKelasRapor');
    let container = document.getElementById('containerCheckboxMapel');
    if (!elKelas || !container) return;

    let kelasTerpilih = elKelas.value;
    if (!kelasTerpilih) {
        container.innerHTML = `<div style="font-size: 12px; color: #94a3b8; font-style: italic;">Silakan pilih kelas terlebih dahulu...</div>`;
        return;
    }

    let mapelAktif = getMapelAktifPerKelas(kelasTerpilih);
    let htmlCheckboxes = "";

    daftarMapel.forEach(m => {
        let isChecked = mapelAktif.includes(m.kode) ? "checked" : "";
        htmlCheckboxes += `
            <label style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 600; color: #334155;">
                <input type="checkbox" name="chkMapelRapor" value="${m.kode}" ${isChecked} style="cursor: pointer; width:15px; height:15px;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${m.namaLengkap}">
                    [${m.kode}] ${m.namaLengkap}
                </div>
            </label>
        `;
    });
    container.innerHTML = htmlCheckboxes;
}

// Eksekusi tombol simpan konfigurasi mapel kelas
function prosesSimpanCeklisMapelAdmin() {
    let elKelas = document.getElementById('rlSelectKelas') || document.getElementById('baseSelectKelasRapor');
    if (!elKelas || !elKelas.value) {
        alert("Pilih kelasnya terlebih dahulu!");
        return;
    }
    let checkboxes = document.querySelectorAll('input[name="chkMapelRapor"]:checked');
    let daftarKodeTerpilih = [];
    checkboxes.forEach(chk => { daftarKodeTerpilih.push(chk.value); });

    simpanPengaturanMapelPerKelas(elKelas.value, daftarKodeTerpilih);
}

// Otomatis pasang pemicu saat dropdown kelas bawaan Anda diubah oleh Admin
document.getElementById('rlSelectKelas')?.addEventListener('change', renderPilihanCeklisMapelAdmin);
