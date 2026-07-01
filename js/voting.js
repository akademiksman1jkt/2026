    // VOTING SIDANG PLENO
    // ============================================================
    if (typeof sesiVotingSidangTerbuka      === "undefined") { var sesiVotingSidangTerbuka      = false; }
    if (typeof daftarSiswaKasusKhususManual === "undefined") { var daftarSiswaKasusKhususManual = []; }
    if (typeof daftarSiswaDihapusManual     === "undefined") { var daftarSiswaDihapusManual     = []; }
    if (typeof nisnYangSedangDisorot        === "undefined") { var nisnYangSedangDisorot        = null; }

    function toggleAksesVotingSidang() {
        if (!sessionUserAktif || sessionUserAktif.role !== 'AdminSMAN1') {
            alert("❌ Akses Ditolak! Hanya Admin Utama (Pimpinan Sidang) yang berhak membuka/menutup sesi voting.");
            return;
        }
        sesiVotingSidangTerbuka = !sesiVotingSidangTerbuka;
        const badge = document.getElementById("statusAksesVoteBadge");
        const btn   = document.getElementById("btnToggleAksesVote");
        if (badge && btn) {
            if (sesiVotingSidangTerbuka) {
                badge.className = "badge-vote-buka";
                badge.innerHTML = "🟢 SESI TERBUKA (LIVE)";
                btn.style.background = "#dc2626";
                btn.innerHTML = `<i class="ri-lock-line"></i> Tutup Sesi Voting`;
            } else {
                badge.className = "badge-vote-tutup";
                badge.innerHTML = "⬛ SESI DITUTUP";
                btn.style.background = "#0284c7";
                btn.innerHTML = `<i class="ri-lock-unlock-line"></i> Buka Sesi Voting`;
                // When closing session, also clear active student
                clearSiswaAktif(true);
            }
        }
        renderUIVotingDanChart();
    }

    function tetapkanSiswaAktif() {
        let sel  = document.getElementById('selectSiswaAktifSidang');
        let nisn = sel ? sel.value : '';
        if (!nisn) { alert('Pilih siswa yang akan ditayangkan terlebih dahulu.'); return; }
        if (!sesiVotingSidangTerbuka) {
            alert('Buka sesi voting terlebih dahulu sebelum menayangkan siswa.');
            return;
        }
        localStorage.setItem('nisn_siswa_sidang_aktif', nisn);
        // Sync to cloud if configured
        if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
            fetch(URL_GOOGLE_APPS_SCRIPT, { method:'POST', body: JSON.stringify({ aksi:'set_siswa_aktif', nisn }) }).catch(()=>{});
        }
        let siswa = dataSiswaGlobal.find(r => r[0] === nisn);
        let info  = document.getElementById('boxSiswaAktifInfo');
        if (info && siswa) {
            info.style.display = 'block';
            info.innerHTML = `<i class="ri-broadcast-line"></i> Sedang ditayangkan: <strong>${siswa[2].toUpperCase()}</strong> (${siswa[3]}) — NISN ${nisn}`;
        }
        renderUIVotingDanChart();
    }

    function clearSiswaAktif(silent) {
        localStorage.removeItem('nisn_siswa_sidang_aktif');
        let info = document.getElementById('boxSiswaAktifInfo');
        if (info) info.style.display = 'none';
        let sel = document.getElementById('selectSiswaAktifSidang');
        if (sel) sel.value = '';
        if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
            fetch(URL_GOOGLE_APPS_SCRIPT, { method:'POST', body: JSON.stringify({ aksi:'set_siswa_aktif', nisn:'' }) }).catch(()=>{});
        }
        if (!silent) renderUIVotingDanChart();
    }

    function resetSemuaSuaraVoting() {
        if (!confirm('Apakah Anda yakin ingin mereset SEMUA suara voting? Tindakan ini tidak dapat dibatalkan.')) return;
        Object.keys(localStorage).filter(k => k.startsWith('vote_naik_') || k.startsWith('vote_tinggal_')).forEach(k => localStorage.removeItem(k));
        renderUIVotingDanChart();
    }

    async function toggleKunciSiswaIndividu(nisn) {
    // 1. Baca status gembok saat ini (jika tidak ada, anggap sedang terkunci/true)
    let statusKunciSaatIni = JSON.parse(localStorage.getItem(`kunci_indiv_${nisn}`) || "true");
    
    // 2. Balik statusnya (jika terbuka jadi terkunci, jika terkunci jadi terbuka)
    let statusBaru = !statusKunciSaatIni; 
    localStorage.setItem(`kunci_indiv_${nisn}`, JSON.stringify(statusBaru));

    // ── KODE SINKRONISASI AKTIF CLOUD ──
    let nisnKirimCloud = (statusBaru === false) ? nisn : "";
    localStorage.setItem("nisn_siswa_sidang_aktif", nisnKirimCloud);

    if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
        try {
            console.log("⚡ Menyiarkan siswa aktif ke cloud: " + nisnKirimCloud);
            await fetch(URL_GOOGLE_APPS_SCRIPT, {
                method: 'POST',
                body: JSON.stringify({ 
                    aksi: 'set_siswa_aktif', 
                    nisn: nisnKirimCloud 
                })
            });
        } catch (e) {
            console.error("❌ Gagal sinkronisasi ke cloud:", e);
        }
    }

    // 3. Render ulang UI Rapat untuk memperbarui tampilan visual gembok di layar Admin
    renderUIVotingDanChart();
}
function loloskanSiswaTanpaVoting(nisn, namaSiswa) {
    // 1. Tampilkan konfirmasi pimpinan sidang demi keamanan data
    if (!confirm(`Apakah Anda yakin ingin MELOLOSKAN ${namaSiswa.toUpperCase()} secara mutlak tanpa melalui sesi voting dewan guru?`)) {
        return;
    }

    // 2. Masukkan NISN siswa ke dalam array daftarSiswaDihapusManual 
    // agar namanya hilang dari daftar antrean kerawanan sidang
    if (typeof daftarSiswaDihapusManual !== "undefined" && Array.isArray(daftarSiswaDihapusManual)) {
        if (!daftarSiswaDihapusManual.includes(nisn)) {
            daftarSiswaDihapusManual.push(nisn);
            // Simpan ke localStorage agar status lolosnya permanen (tidak hilang saat di-refresh)
            localStorage.setItem("db_siswa_lolos_manual_sman1", JSON.stringify(daftarSiswaDihapusManual));
        }
    }

    // 3. ── KODE SINKRONISASI ──
    // ── PERBAIKAN SINKRONISASI: HAPUS MEMORI LOKAL DAN BERSIHKAN SERVER CLOUD ──
    if (localStorage.getItem("nisn_siswa_sidang_aktif") === nisn) {
        // 1. Bersihkan memori internal laptop Admin
        localStorage.removeItem("nisn_siswa_sidang_aktif");
        
        // 2. TEMBAK CLOUD: Perintahkan Google Sheets untuk mengosongkan papan siaran
        if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
            fetch(URL_GOOGLE_APPS_SCRIPT, {
                method: 'POST',
                body: JSON.stringify({ 
                    aksi: 'set_siswa_aktif', 
                    nisn: '' // Mengirimkan teks kosong untuk membersihkan sel Sheets
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log("✓ Cloud: Sesi siaran berhasil ditutup, server kembali standby.");
            })
            .catch(err => console.log("Gagal membersihkan papan siaran cloud."));
        }
    }

    // 4. Pastikan gembok individunya diset terkunci kembali di memori lokal
    localStorage.setItem(`kunci_indiv_${nisn}`, "true");

    // 5. Render ulang UI untuk memperbarui tabel Admin seketika
    renderUIVotingDanChart();
    
    alert(`✓ Sukses! ${namaSiswa.toUpperCase()} telah diloloskan resmi dan dihapus dari antrean sidang.`);
}

    function muatDaftarSiswaBermasalah() {
        let isAdmin = (typeof sessionUserAktif !== "undefined" && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');
        // Show correct panel for role
        let adminPanel = document.getElementById('votingAdminPanel');
        let guruPanel  = document.getElementById('votingGuruPanel');
        let adminTblWrap = document.getElementById('adminVotingTableWrapper');
        if (adminPanel)  adminPanel.style.display  = isAdmin ? 'block' : 'none';
        if (guruPanel)   guruPanel.style.display   = isAdmin ? 'none'  : 'block';
        if (adminTblWrap) adminTblWrap.style.display = isAdmin ? 'block' : 'none';
        // Guru card placeholder
        let guruCard = document.getElementById('guruVotingCard');
        if (guruCard && isAdmin) guruCard.innerHTML = '';

        if (!isAdmin) {
            tarikSiswaAktifDariCloud();
        } else {
            renderUIVotingDanChart();
        }
    }

    function renderUIVotingDanChart() {
        const tBody          = document.getElementById('tableVotingRapatBody');
        const chartBox       = document.getElementById('liveProyektorChartBar');
        const elAngkatan     = document.getElementById('voteSelectAngkatan');
        const labelTotal     = document.getElementById('liveTotalHakSuara');
        if (!tBody) return;

        let isAdmin = (typeof sessionUserAktif !== "undefined" && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');
        let nisnAktif = (localStorage.getItem("nisn_siswa_sidang_aktif") || "").toString().trim();
        let usernameGuru = (typeof sessionUserAktif !== "undefined" && sessionUserAktif) ? sessionUserAktif.username : "Anonim";

        // ── GURU VIEW ──────────────────────────────────────────────────
        if (!isAdmin) {
            let guruCard    = document.getElementById('guruVotingCard');
            let closedBox   = document.getElementById('guruVotingClosed');
            let waitingBox  = document.getElementById('guruVotingWaiting');
            let adminTblWrap = document.getElementById('adminVotingTableWrapper');
            if (adminTblWrap) adminTblWrap.style.display = 'none';

            // Determine state
            if (!sesiVotingSidangTerbuka && !nisnAktif) {
                if (closedBox)  closedBox.style.display  = 'block';
                if (waitingBox) waitingBox.style.display = 'none';
                if (guruCard)   guruCard.innerHTML = '';
                if (chartBox)   chartBox.innerHTML = '<div style="text-align:center;color:#64748b;padding:40px 0;font-size:13px;">Menunggu sesi dibuka...</div>';
                if (labelTotal) labelTotal.innerText = '0 Suara';
                return;
            }

            // Session open but no active student
            if (!nisnAktif) {
                if (closedBox)  closedBox.style.display  = 'none';
                if (waitingBox) waitingBox.style.display = 'block';
                if (guruCard)   guruCard.innerHTML = '';
                if (chartBox)   chartBox.innerHTML = '<div style="text-align:center;color:#3b82f6;padding:40px 0;font-size:13px;font-weight:600;">⏳ Menunggu siswa ditayangkan...</div>';
                if (labelTotal) labelTotal.innerText = '0 Suara';
                return;
            }

            // Active student found
            let nisnClean = nisnAktif.replace(/^0+/, '');
            let siswa = dataSiswaGlobal.find(r => {
                let n = r[0].toString().trim();
                return n === nisnAktif || n.replace(/^0+/, '') === nisnClean;
            });

            if (!siswa) {
                if (closedBox)  closedBox.style.display  = 'none';
                if (waitingBox) waitingBox.style.display = 'block';
                if (guruCard)   guruCard.innerHTML = '';
                return;
            }
            if (closedBox)  closedBox.style.display  = 'none';
            if (waitingBox) waitingBox.style.display = 'none';

            let stat = hitungStatistikSiswa(siswa);
            let nisn = siswa[0];
            let dbVoteNaik    = JSON.parse(localStorage.getItem(`vote_naik_${nisn}`) || "[]");
            let dbVoteTinggal = JSON.parse(localStorage.getItem(`vote_tinggal_${nisn}`) || "[]");
            let sudahNaik     = dbVoteNaik.includes(usernameGuru);
            let sudahTinggal  = dbVoteTinggal.includes(usernameGuru);
            let total         = dbVoteNaik.length + dbVoteTinggal.length;
            let pNaik         = total > 0 ? Math.round(dbVoteNaik.length / total * 100) : 0;
            let pTinggal      = 100 - pNaik;

            let jenjang = (siswa[3] || '').toUpperCase().startsWith('XII') ? 'XII' : ((siswa[3] || '').toUpperCase().startsWith('XI') ? 'XI' : 'X');
            let smtMulai = jenjang === 'XII' ? 4 : (jenjang === 'XI' ? 2 : 0);
            let smtSelesai = smtMulai + 2;
            let merahBadges = [];
            daftarMapel.forEach((m, mIdx) => {
                for (let s = smtMulai; s < smtSelesai; s++) {
                    let v = parseFloat(siswa[6 + mIdx * 6 + s]);
                    if (!isNaN(v) && v > 0 && v < 75) merahBadges.push(`<span style="background:#fee2e2;color:#dc2626;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:700;display:inline-block;margin:2px;">${m.kode} S${s+1}: ${v}</span>`);
                }
            });
            let rekTeks = stat.merah > 3 ? '⚠️ Rekomendasi sistem: <strong>TINGGAL KELAS</strong>' : (stat.merah > 0 ? '🟡 Rekomendasi sistem: <strong>Naik Bersyarat</strong>' : '🟢 Rekomendasi sistem: <strong>Layak Naik Mutlak</strong>');
            let headerBg = sudahNaik ? '#107c41' : (sudahTinggal ? '#dc2626' : '#334155');
            let statusMyVote = sudahNaik ? '<span style="background:#dcfce7;color:#166534;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid #bbf7d0;">✓ SUARA ANDA: NAIK</span>' : (sudahTinggal ? '<span style="background:#fee2e2;color:#991b1b;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid #fecaca;">✓ SUARA ANDA: TINGGAL</span>' : '<span style="background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;border:1px solid #fde68a;">Belum Memilih</span>');

            if (guruCard) guruCard.innerHTML = `
            <div class="voting-guru-card-wrapper ${sudahNaik ? 'voted-naik' : (sudahTinggal ? 'voted-tinggal' : '')}">
                <div style="background:${headerBg}; padding:14px 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <div style="background:rgba(255,255,255,0.15); border-radius:50%; width:38px; height:38px; display:flex; align-items:center; justify-content:center; font-size:20px;">⚖️</div>
                        <div>
                            <div style="font-size:10px; color:rgba(255,255,255,0.75); font-weight:700; letter-spacing:1px; text-transform:uppercase;">Sidang Pleno — Voting Aktif</div>
                            <div style="font-size:15px; font-weight:900; color:white;">Siswa Sedang Disidangkan</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="background:rgba(255,255,255,0.12); color:white; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:700;">${siswa[3]}</span>
                        ${statusMyVote}
                    </div>
                </div>
                <div class="voting-card-grid" style="padding:20px; gap:20px;">
                    <div>
                        <div style="font-size:24px; font-weight:900; color:#0f172a; letter-spacing:-0.5px; margin-bottom:2px;">${siswa[2].toUpperCase()}</div>
                        <div style="font-size:12px; color:#64748b; font-family:monospace; margin-bottom:16px;">NISN: ${siswa[0]}</div>
                        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px;">
                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
                                <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase; margin-bottom:2px;">Rata-Rata</div>
                                <div style="font-size:20px; font-weight:900; color:var(--primary);">${stat.average}</div>
                            </div>
                            <div style="background:${stat.merah>0?'#fef2f2':'#f0fdf4'}; border:1px solid ${stat.merah>0?'#fecaca':'#bbf7d0'}; border-radius:8px; padding:10px; text-align:center;">
                                <div style="font-size:10px; color:${stat.merah>0?'#dc2626':'#059669'}; font-weight:700; text-transform:uppercase; margin-bottom:2px;">Mapel &lt; KKM</div>
                                <div style="font-size:20px; font-weight:900; color:${stat.merah>0?'#dc2626':'#059669'};">${stat.merah}</div>
                            </div>
                            <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px; text-align:center;">
                                <div style="font-size:10px; color:#1d4ed8; font-weight:700; text-transform:uppercase; margin-bottom:2px;">Total Suara</div>
                                <div style="font-size:20px; font-weight:900; color:#1d4ed8;">${total}</div>
                            </div>
                        </div>
                        <div style="background:#fef2f2; border-radius:8px; padding:10px; border-left:4px solid #ef4444; min-height:50px; max-height:110px; overflow-y:auto; margin-bottom:12px;">
                            <div style="font-size:10px; font-weight:700; color:#b91c1c; margin-bottom:4px;">Nilai di Bawah KKM (75):</div>
                            ${merahBadges.join('') || '<span style="color:#059669;font-size:11px;font-weight:600;">✓ Semua nilai di atas KKM</span>'}
                        </div>
                        <div style="font-size:12px; color:#475569; line-height:1.5; background:#f8fafc; border-radius:8px; padding:8px 12px;">${rekTeks}</div>
                        <button onclick="popupDetailSiswaPleno('${nisn}')" style="margin-top:10px; width:100%; background:transparent; border:1px solid var(--slate-300); padding:7px; border-radius:8px; font-size:12px; font-weight:600; color:var(--slate-600); cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
                            <i class="ri-file-search-line"></i> Lihat Berkas Lengkap Siswa
                        </button>
                    </div>
                    
                    <!-- KANAN: AREA BILIK SUARA DENGAN KONFIRMASI SUBMIT DATA -->
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div style="font-size:12px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                            <i class="ri-how-to-vote-line" style="color:var(--primary);"></i> BILIK SUARA ANDA
                            <span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700;">✓ SESI TERBUKA</span>
                        </div>
                        
                        <!-- Pilihan Naik Kelas (Berfungsi Mengunci Pilihan Sementara) -->
                        <button id="btnOptNaik" onclick="pilihOpsiSementara('${nisn}', 'NAIK')"
                            style="background:${sudahNaik?'#107c41':'white'}; color:${sudahNaik?'white':'#107c41'}; border:2.5px solid #107c41; padding:16px; font-size:15px; border-radius:12px; cursor:pointer; font-weight:800; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:${sudahNaik?'0 4px 12px rgba(16,124,65,0.35)':'none'}; transition:all 0.15s;">
                            <i class="ri-thumb-up-fill" style="font-size:22px;"></i>
                            <div style="text-align:left;">
                                <div>NAIK KELAS</div>
                                <div style="font-size:11px; font-weight:600; opacity:0.85;">${dbVoteNaik.length} Suara Masuk</div>
                            </div>
                            ${sudahNaik ? '<i class="ri-checkbox-circle-fill" style="margin-left:auto;font-size:20px;"></i>' : ''}
                        </button>
                        
                        <!-- Pilihan Tinggal Kelas (Berfungsi Mengunci Pilihan Sementara) -->
                        <button id="btnOptTinggal" onclick="pilihOpsiSementara('${nisn}', 'TINGGAL')"
                            style="background:${sudahTinggal?'#dc2626':'white'}; color:${sudahTinggal?'white':'#dc2626'}; border:2.5px solid #dc2626; padding:16px; font-size:15px; border-radius:12px; cursor:pointer; font-weight:800; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow:${sudahTinggal?'0 4px 12px rgba(220,38,38,0.35)':'none'}; transition:all 0.15s;">
                            <i class="ri-thumb-down-fill" style="font-size:22px;"></i>
                            <div style="text-align:left;">
                                <div>TINGGAL KELAS</div>
                                <div style="font-size:11px; font-weight:600; opacity:0.85;">${dbVoteTinggal.length} Suara Masuk</div>
                            </div>
                            ${sudahTinggal ? '<i class="ri-checkbox-circle-fill" style="margin-left:auto;font-size:20px;"></i>' : ''}
                        </button>

                        <!-- TOMBOL SUBMIT UTAMA (MUNCUL JIKA SUDAH KLIK SALAH SATU OPSI DI ATAS) -->
                        <div id="wrapperSubmitVote" style="margin-top:4px; display:none;">
                            <button onclick="eksekusiKirimKeCloud('${nisn}')"
                                style="width:100%; background:#2563eb; color:white; border:none; padding:15px; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 14px rgba(37,99,235,0.3); transition:all 0.2s;">
                                <i class="ri-send-plane-fill" style="font-size:18px;"></i> KIRIM HAK SUARA SEKARANG
                            </button>
                        </div>

                        <div style="background:#f1f5f9; border-radius:10px; padding:12px;">
                            <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#475569; margin-bottom:8px;">
                                <span style="color:#107c41;">🟢 Naik: ${pNaik}%</span>
                                <span style="color:#dc2626;">🔴 Tinggal: ${pTinggal}%</span>
                            </div>
                            <div style="background:#e2e8f0; height:12px; border-radius:8px; overflow:hidden; display:flex;">
                                <div style="background:#107c41; width:${pNaik}%; transition:width 0.4s ease;"></div>
                                <div style="background:#ef4444; width:${pTinggal}%; transition:width 0.4s ease;"></div>
                            </div>
                            <div style="font-size:10px; color:#64748b; margin-top:6px; text-align:center;">${total} total suara masuk</div>
                        </div>
                    </div>
                </div>
            </div>`;

            // Live chart for teacher: single student bar
            if (chartBox) chartBox.innerHTML = `
                <div style="background:#1e293b; border-radius:10px; padding:14px;">
                    <div style="font-size:11px; font-weight:700; color:#cbd5e1; margin-bottom:10px; text-align:center;">📊 PEROLEHAN SUARA SAAT INI</div>
                    <div style="margin-bottom:8px;">
                        <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#cbd5e1; margin-bottom:4px;">
                            <span style="color:#22c55e;">🟢 Naik: ${pNaik}% (${dbVoteNaik.length})</span>
                            <span style="color:#ef4444;">🔴 Tinggal: ${pTinggal}% (${dbVoteTinggal.length})</span>
                        </div>
                        <div style="background:#334155; height:18px; border-radius:6px; overflow:hidden; display:flex; box-shadow:inset 0 1px 3px rgba(0,0,0,0.3);">
                            <div style="background:#22c55e; width:${pNaik}%; transition:width 0.4s; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:white;">${pNaik > 15 ? pNaik+'%' : ''}</div>
                            <div style="background:#ef4444; width:${pTinggal}%; transition:width 0.4s; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700; color:white;">${pTinggal > 15 ? pTinggal+'%' : ''}</div>
                        </div>
                    </div>
                    <div style="text-align:center; font-size:12px; color:#94a3b8; margin-top:8px;">${total > 0 ? (pNaik > pTinggal ? '🟢 <strong style="color:#22c55e;">Sementara: Naik Kelas</strong>' : (pTinggal > pNaik ? '🔴 <strong style="color:#ef4444;">Sementara: Tinggal Kelas</strong>' : '🟡 <strong style="color:#fbbf24;">Seri — Suara Imbang</strong>')) : 'Belum ada suara masuk'}</div>
                </div>`;
            if (labelTotal) labelTotal.innerText = `${total} Suara`;
            return;
        }

        // ── ADMIN VIEW ─────────────────────────────────────────────────
        let adminPanel   = document.getElementById('votingAdminPanel');
        let guruCard2    = document.getElementById('guruVotingCard');
        let adminTblWrap = document.getElementById('adminVotingTableWrapper');
        if (adminPanel)  adminPanel.style.display   = 'block';
        if (guruCard2)   guruCard2.innerHTML         = '';
        if (adminTblWrap) adminTblWrap.style.display = 'block';

        let jenjang = elAngkatan ? elAngkatan.value : '';
        if (!jenjang) {
            tBody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:#64748b;font-style:italic;padding:24px;">Pilih angkatan sidang untuk memetakan siswa.</td></tr>`;
            if (chartBox) chartBox.innerHTML = `<div style="text-align:center;color:#64748b;padding:40px 0;font-size:13px;">Pilih angkatan untuk visualisasi...</div>`;
            return;
        }

        // Build list
        let list = dataSiswaGlobal.filter(row => {
            let kelas = (row[3] || '').toUpperCase().trim();
            if (jenjang === 'X'   && !(kelas.startsWith('X-')   || kelas.startsWith('X ')))   return false;
            if (jenjang === 'XI'  && !(kelas.startsWith('XI-')  || kelas.startsWith('XI ')))  return false;
            if (jenjang === 'XII' && !(kelas.startsWith('XII-') || kelas.startsWith('XII '))) return false;
            return hitungStatistikSiswa(row).merah > 0;
        });
        // Add manual
        if (Array.isArray(daftarSiswaKasusKhususManual)) {
            daftarSiswaKasusKhususManual.forEach(nid => {
                let s = dataSiswaGlobal.find(r => r[0] === nid);
                if (s) {
                    let k = (s[3] || '').toUpperCase().trim();
                    let ok = (jenjang === 'X' && (k.startsWith('X-') || k.startsWith('X '))) ||
                             (jenjang === 'XI' && (k.startsWith('XI-') || k.startsWith('XI '))) ||
                             (jenjang === 'XII' && (k.startsWith('XII-') || k.startsWith('XII ')));
                    if (ok && !list.some(r => r[0] === nid)) list.push(s);
                }
            });
        }
        if (Array.isArray(daftarSiswaDihapusManual)) {
            list = list.filter(s => !daftarSiswaDihapusManual.includes(s[0]));
        }

        if (list.length === 0) {
            tBody.innerHTML = `<tr><td colspan="10" style="text-align:center;color:var(--success);font-weight:700;padding:24px;">🎉 Bersih! Semua siswa angkatan ${jenjang} memenuhi KKM.</td></tr>`;
            if (chartBox) chartBox.innerHTML = `<div style="text-align:center;color:#059669;padding:40px 0;font-size:13px;font-weight:600;">Semua siswa aman.</div>`;
            return;
        }

        list.sort((a, b) => hitungStatistikSiswa(b).merah - hitungStatistikSiswa(a).merah);

        // Populate active student selector
        let sel = document.getElementById('selectSiswaAktifSidang');
        if (sel) {
            let currentVal = sel.value;
            sel.innerHTML = '<option value="">-- Pilih siswa yang sedang dibahas --</option>';
            list.forEach(s => {
                let stat2 = hitungStatistikSiswa(s);
                sel.innerHTML += `<option value="${s[0]}" ${s[0] === currentVal ? 'selected' : ''}>${s[2].toUpperCase()} (${s[3]}) — ${stat2.merah} mapel &lt; KKM</option>`;
            });
        }

        // Build table rows
        tBody.innerHTML = '';
        let totalSuaraAll = 0;
        let selesaiCount  = 0;
        let smtMulai  = jenjang === 'XII' ? 4 : (jenjang === 'XI' ? 2 : 0);
        let smtSelesai = smtMulai + 2;

        list.forEach((siswa, index) => {
            let stat = hitungStatistikSiswa(siswa);
            let nisn = siswa[0];
            let safe = siswa[2].replace(/'/g, "\\'");
            let dbNaik    = JSON.parse(localStorage.getItem(`vote_naik_${nisn}`) || '[]');
            let dbTinggal = JSON.parse(localStorage.getItem(`vote_tinggal_${nisn}`) || '[]');
            let totalRow  = dbNaik.length + dbTinggal.length;
            totalSuaraAll += totalRow;

            // Determine keputusan badge
            let keputusanBadge = '<span class="vote-result-badge vote-result-pending">⏳ Proses</span>';
            if (totalRow > 0) {
                if (dbNaik.length > dbTinggal.length)      keputusanBadge = `<span class="vote-result-badge vote-result-naik">✓ NAIK (${dbNaik.length}v${dbTinggal.length})</span>`;
                else if (dbTinggal.length > dbNaik.length) keputusanBadge = `<span class="vote-result-badge vote-result-tinggal">✗ TINGGAL (${dbNaik.length}v${dbTinggal.length})</span>`;
                else                                        keputusanBadge = `<span class="vote-result-badge vote-result-pending">⚖️ SERI (${dbNaik.length}v${dbTinggal.length})</span>`;
                selesaiCount++;
            }

            // Rincian merah
            let rincian = [];
            daftarMapel.forEach((m, mIdx) => {
                for (let s = smtMulai; s < smtSelesai; s++) {
                    let v = parseFloat(siswa[6 + mIdx * 6 + s]);
                    if (!isNaN(v) && v > 0 && v < 75) rincian.push(`${m.kode}(S${s+1}:${v})`);
                }
            });

            let isAktif = (nisn === nisnAktif);
            let tombolBisaDiklik = sesiVotingSidangTerbuka;
            let myNaik    = dbNaik.includes(usernameGuru);
            let myTinggal = dbTinggal.includes(usernameGuru);

            tBody.innerHTML += `<tr style="${isAktif ? 'background:#fef3c7;' : ''}">
                <td style="text-align:center;font-weight:700;">${index + 1}${isAktif ? '<br><span style="font-size:9px;color:#059669;font-weight:700;">▶ AKTIF</span>' : ''}</td>
                <td>
                    <strong onclick="popupDetailSiswaPleno('${nisn}')" style="color:#1e293b;cursor:pointer;text-decoration:underline;">${siswa[2].toUpperCase()} <i class="ri-external-link-line" style="font-size:10px;color:#94a3b8;"></i></strong>
                    ${stat.merah === 0 ? '<span class="plotting-tag" style="background:#e0f2fe;color:#0369a1;border-color:#bae6fd;font-size:10px;margin-left:4px;">Non-Akademik</span>' : ''}
                    <br><small style="color:#64748b;font-family:monospace;">${nisn}</small>
                    ${rincian.length ? `<br><small style="color:#b91c1c;font-size:10px;line-height:1.3;">${rincian.slice(0,4).join(', ')}${rincian.length>4?' ...':''}</small>` : ''}
                </td>
                <td style="text-align:center;"><span class="plotting-tag" style="font-size:11px;">${siswa[3]}</span></td>
                <td style="text-align:center;font-weight:800;color:var(--primary);">${stat.average}</td>
                <td style="text-align:center;">
                    <span class="${stat.merah>0?'text-nilai-kurang':''}" style="font-weight:700;">${stat.merah}</span>
                </td>
                <td style="text-align:center;">
                    <button onclick="let s=document.getElementById('selectSiswaAktifSidang');if(s)s.value='${nisn}';tetapkanSiswaAktif();" 
                        style="background:${isAktif?'#059669':'#f1f5f9'};color:${isAktif?'white':'#475569'};border:1px solid ${isAktif?'#059669':'#cbd5e1'};padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                        ${isAktif ? '<i class="ri-broadcast-fill"></i> Live' : '<i class="ri-broadcast-line"></i> Set'}
                    </button>
                </td>
                <td style="text-align:center;">
                    <button onclick="submitSuaraRapat('${nisn}','NAIK')" ${!tombolBisaDiklik?'disabled':''} 
                        style="background:${myNaik?'#107c41':'white'};color:${myNaik?'white':'#107c41'};border:2px solid #107c41;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;opacity:${!tombolBisaDiklik?'0.4':'1'};">
                        👍 ${dbNaik.length}
                    </button>
                </td>
                <td style="text-align:center;">
                    <button onclick="submitSuaraRapat('${nisn}','TINGGAL')" ${!tombolBisaDiklik?'disabled':''}
                        style="background:${myTinggal?'#dc2626':'white'};color:${myTinggal?'white':'#dc2626'};border:2px solid #dc2626;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;opacity:${!tombolBisaDiklik?'0.4':'1'};">
                        👎 ${dbTinggal.length}
                    </button>
                </td>
                <td style="text-align:center;">${keputusanBadge}</td>
                <td style="text-align:center;">
                    <button onclick="loloskanSiswaTanpaVoting('${nisn}','${safe}')" style="background:#7c3aed;color:white;border:none;padding:5px 9px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer;">
                        <i class="ri-vip-crown-line"></i>
                    </button>
                </td>
            </tr>`;
        });

        // Update stats
        let elVsTotal   = document.getElementById('vsTotal');
        let elVsSuara   = document.getElementById('vsSuara');
        let elVsSelesai = document.getElementById('vsSelesai');
        if (elVsTotal)   elVsTotal.innerText   = list.length;
        if (elVsSuara)   elVsSuara.innerText   = totalSuaraAll;
        if (elVsSelesai) elVsSelesai.innerText = selesaiCount;
        if (labelTotal)  labelTotal.innerText  = `${totalSuaraAll} Suara`;

        // Live monitor chart — all students
        if (chartBox) {
            let chartHtml = '';
            list.forEach(siswa => {
                let n  = siswa[0];
                let dn = JSON.parse(localStorage.getItem(`vote_naik_${n}`) || '[]');
                let dt = JSON.parse(localStorage.getItem(`vote_tinggal_${n}`) || '[]');
                let tot = dn.length + dt.length;
                let pN  = tot > 0 ? Math.round(dn.length / tot * 100) : 0;
                let pT  = 100 - pN;
                let isAktifRow = (n === nisnAktif);
                let singkatan  = siswa[2].split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
                chartHtml += `
                <div class="live-student-row ${isAktifRow ? 'active-student' : ''}">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            ${isAktifRow ? '<span style="color:#fbbf24;font-size:10px;font-weight:800;">▶</span>' : '<span style="width:14px;display:inline-block;"></span>'}
                            <div style="background:${isAktifRow?'#fbbf24':'#475569'};color:${isAktifRow?'#1e293b':'white'};width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;">${singkatan}</div>
                            <div>
                                <div style="font-size:11px; font-weight:700; color:${isAktifRow?'#fbbf24':'#f1f5f9'}; line-height:1.2;">${siswa[2].split(' ').slice(0,2).join(' ')}${siswa[2].split(' ').length > 2 ? '…' : ''}</div>
                                <div style="font-size:10px; color:#64748b;">${siswa[3]}</div>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px; align-items:center;">
                            ${tot > 0 ? `<span style="font-size:10px;font-weight:700;color:${pN > pT ? '#22c55e' : (pT > pN ? '#ef4444' : '#fbbf24')}">${pN > pT ? '↑ Naik' : (pT > pN ? '↓ Tinggal' : '⚖ Seri')}</span>` : '<span style="font-size:10px;color:#475569;">—</span>'}
                            <span style="font-size:10px;color:#94a3b8;">${tot} suara</span>
                        </div>
                    </div>
                    <div style="display:flex; gap:2px; height:8px; border-radius:4px; overflow:hidden; background:#0f172a;">
                        <div style="background:#22c55e; width:${pN}%; transition:width 0.3s;"></div>
                        <div style="background:#ef4444; width:${pT}%; transition:width 0.3s;"></div>
                        ${tot === 0 ? '<div style="background:#475569; width:100%; border-radius:4px;"></div>' : ''}
                    </div>
                </div>`;
            });
            chartBox.innerHTML = chartHtml || '<div style="text-align:center;color:#64748b;padding:30px;font-size:13px;">Tidak ada siswa.</div>';
        }
    }

    // ── PERBAIKAN TOTAL: FUNGSI SUBMIT VOTING LANGSUNG KE GOOGLE SHEETS ──
function submitSuaraRapat(nisn, pilihanOpsi) {
    if (!nisn || !pilihanOpsi) return;

    let usernameGuru = (typeof sessionUserAktif !== "undefined" && sessionUserAktif) ? sessionUserAktif.username : "Anonim";
    
    // 1. Amankan Cadangan di Memori Lokal Guru Terlebih Dahulu
    if (pilihanOpsi === "NAIK") {
        let currentVote = JSON.parse(localStorage.getItem(`vote_naik_${nisn}`) || "[]");
        if (!currentVote.includes(usernameGuru)) currentVote.push(usernameGuru);
        localStorage.setItem(`vote_naik_${nisn}`, JSON.stringify(currentVote));
        
        let seberang = JSON.parse(localStorage.getItem(`vote_tinggal_${nisn}`) || "[]");
        localStorage.setItem(`vote_tinggal_${nisn}`, JSON.stringify(seberang.filter(u => u !== usernameGuru)));
    } else {
        let currentVote = JSON.parse(localStorage.getItem(`vote_tinggal_${nisn}`) || "[]");
        if (!currentVote.includes(usernameGuru)) currentVote.push(usernameGuru);
        localStorage.setItem(`vote_tinggal_${nisn}`, JSON.stringify(currentVote));
        
        let seberang = JSON.parse(localStorage.getItem(`vote_naik_${nisn}`) || "[]");
        localStorage.setItem(`vote_naik_${nisn}`, JSON.stringify(seberang.filter(u => u !== usernameGuru)));
    }

    // 2. TEMBAK DATA KE GOOGLE APPS SCRIPT (AGAR REKAP DI ADMIN & PROYEKTOR TIDAK 0)
    if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
        
        // Ganti visual tombol submit menjadi teks loading jika elemennya ada
        const wrapSubmit = document.getElementById('wrapperSubmitVote');
        if (wrapSubmit) wrapSubmit.innerHTML = `<div style="text-align:center; color:#2563eb; font-weight:800; font-size:13px; padding:10px 0;">⏳ Menyimpan Hak Suara Anda ke Cloud...</div>`;

        fetch(URL_GOOGLE_APPS_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({
                aksi: 'simpan_suara_voting',
                nisn: nisn,
                username: usernameGuru,
                pilihan: pilihanOpsi
            })
        })
        .then(res => res.json())
        .then(data => {
            alert("✓ Berhasil! Hak suara Anda resmi dikirim dan terekap di server sidang.");
            
            // Sembunyikan kembali tombol submit setelah terkirim
            if (wrapSubmit) wrapSubmit.style.display = 'none';
            if (typeof pilihanSementaraGuru !== "undefined") pilihanSementaraGuru = ""; 
            
            // Perbarui tampilan local Guru
            renderUIVotingDanChart();
        })
        .catch(err => {
            alert("Suara Anda gagal dikirim ke Cloud karena jaringan padat, namun berhasil dicadangkan di memori lokal.");
            renderUIVotingDanChart();
        });
    } else {
        // Fallback jika URL script belum siap
        renderUIVotingDanChart();
    }
}

    // ============================================================
    // POP-UP DETAIL SISWA PLENO
    // ============================================================
    function popupDetailSiswaPleno(nisn) {
        let siswa = dataSiswaGlobal.find(row => row[0] === nisn);
        if (!siswa) return;

        let stat       = hitungStatistikSiswa(siswa);
        let elAngkatan = document.getElementById('voteSelectAngkatan');
        let jenjang    = elAngkatan ? elAngkatan.value : 'X';

        document.getElementById("popNama").innerText   = siswa[2].toUpperCase();
        document.getElementById("popNisn").innerText   = siswa[0];
        document.getElementById("popRombel").innerText = siswa[3];
        document.getElementById("popRerata").innerText = stat.average;

        let semesterMulai  = 0, semesterSelesai = 2;
        if (jenjang === "XI")  { semesterMulai = 2; semesterSelesai = 4; }
        if (jenjang === "XII") { semesterMulai = 4; semesterSelesai = 6; }

        let containerNilai = document.getElementById("popListNilaiMerah");
        containerNilai.innerHTML = "";

        if (typeof daftarMapel !== "undefined" && Array.isArray(daftarMapel)) {
            daftarMapel.forEach((m, mIdx) => {
                for (let s = semesterMulai; s < semesterSelesai; s++) {
                    let targetIndexData = 6 + (mIdx * 6) + s;
                    if (targetIndexData < siswa.length) {
                        let nilaiStr = siswa[targetIndexData];
                        if (nilaiStr && nilaiStr !== "-") {
                            let nilaiNum = parseFloat(nilaiStr);
                            if (!isNaN(nilaiNum) && nilaiNum < 75) {
                                containerNilai.innerHTML += `
                                    <div class="pop-card-nilai">
                                        <span style="font-weight:600; color:#1e293b;">${m.namaLengkap || m.nama}</span>
                                        <span style="color:#dc2626; font-weight:700; background:#fef2f2; padding:2px 8px; border-radius:4px; font-size:11px;">Semester ${s + 1} (Nilai: ${nilaiNum})</span>
                                    </div>`;
                            }
                        }
                    }
                }
            });
        }

        if (containerNilai.innerHTML === "") {
            containerNilai.innerHTML = `<div style="text-align:center; color:#059669; padding:10px; font-weight:600;">✓ Tidak ada nilai di bawah KKM pada semester peninjauan.</div>`;
        }

        let dbVoteNaik    = JSON.parse(localStorage.getItem(`vote_naik_${nisn}`)    || "[]");
        let dbVoteTinggal = JSON.parse(localStorage.getItem(`vote_tinggal_${nisn}`) || "[]");
        let totalSuara    = dbVoteNaik.length + dbVoteTinggal.length;

        let persenNaik    = totalSuara > 0 ? Math.round((dbVoteNaik.length    / totalSuara) * 100) : 50;
        let persenTinggal = totalSuara > 0 ? Math.round((dbVoteTinggal.length / totalSuara) * 100) : 50;
        let warnaDominan  = dbVoteNaik.length >= dbVoteTinggal.length ? "#107c41" : "#ef4444";
        let statusTeksKecenderungan = dbVoteNaik.length >= dbVoteTinggal.length ? "KENAIKAN KELAS" : "TINGGAL KELAS";

        let strokeDashOffsetValue = 188.4 - (188.4 * persenNaik) / 100;

        let deskripsiVotingSiswa = totalSuara === 0
            ? "Belum ada guru yang menyalurkan aspirasi suara untuk siswa ini."
            : `Sidang pleno mengumpulkan <strong>${totalSuara} Hak Suara</strong>. Hasil akhir bilik suara menyatakan dewan guru condong mengarah pada keputusan <strong style="color:${warnaDominan}">${statusTeksKecenderungan}</strong> dengan persentase kemantapan forum sebesar <strong>${dbVoteNaik.length >= dbVoteTinggal.length ? persenNaik : persenTinggal}%</strong>.`;

        let containerHighlightVote = document.getElementById("popHighlightVoting");
        if (containerHighlightVote) {
            containerHighlightVote.innerHTML = `
                <div style="grid-column:span 2; display:flex; justify-content:center; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:15px; border-radius:8px; gap:24px; margin-bottom:4px;">
                    <div style="position:relative; width:70px; height:70px; flex-shrink:0;">
                        <svg width="70" height="70" viewBox="0 0 70 70" style="transform:rotate(-90deg);">
                            <circle cx="35" cy="35" r="30" fill="transparent" stroke="#e2e8f0" stroke-width="5"/>
                            <circle cx="35" cy="35" r="30" fill="transparent" stroke="${warnaDominan}" stroke-width="5"
                                stroke-dasharray="188.4" stroke-dashoffset="${strokeDashOffsetValue}" stroke-linecap="round" style="transition:stroke-dashoffset 0.4s ease-out;"/>
                        </svg>
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; color:${warnaDominan};">
                            ${dbVoteNaik.length >= dbVoteTinggal.length ? persenNaik : persenTinggal}%
                        </div>
                    </div>
                    <div>
                        <div style="font-size:13px; font-weight:700; color:#1e293b;">Kecenderungan Sidang</div>
                        <div style="font-size:18px; font-weight:800; color:${warnaDominan}; margin-top:2px;">${statusTeksKecenderungan}</div>
                        <div style="font-size:11px; color:#64748b; margin-top:4px;">${totalSuara} Hak Suara Masuk</div>
                    </div>
                </div>
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:12px; border-radius:8px; display:flex; align-items:center; gap:8px;">
                    <div style="font-size:12px; color:#059669; font-weight:600;"><i class="ri-thumb-up-fill"></i> NAIK KELAS</div>
                    <div style="font-size:20px; font-weight:800; color:#059669;">${dbVoteNaik.length} <span style="font-size:12px; font-weight:600;">Suara</span></div>
                </div>
                <div style="background:#fef2f2; border:1px solid #fecaca; padding:12px; border-radius:8px; display:flex; align-items:center; gap:8px;">
                    <div style="font-size:12px; color:#dc2626; font-weight:600;"><i class="ri-thumb-down-fill"></i> TINGGAL KELAS</div>
                    <div style="font-size:20px; font-weight:800; color:#dc2626;">${dbVoteTinggal.length} <span style="font-size:12px; font-weight:600;">Suara</span></div>
                </div>`;
        }

        document.getElementById("popRekomendasiTeks").innerHTML = deskripsiVotingSiswa;

        nisnYangSedangDisorot = nisn;
        renderUIVotingDanChart();

        const modal = document.getElementById("modalDetailSiswaPleno");
        if (modal) { modal.style.display = 'flex'; }
    }

    function tutupPopupDetailSiswa() {
        const modal = document.getElementById("modalDetailSiswaPleno");
        if (modal) { modal.style.display = 'none'; }
        nisnYangSedangDisorot = null;
        renderUIVotingDanChart();
    }

    // ============================================================
    // PENGUATAN KARIR (EVALUASI KELAS X)
    // ============================================================
