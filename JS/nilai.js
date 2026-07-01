    // ============================================================
    // KALKULASI STATISTIK SISWA
    // ============================================================
    function hitungStatistikSiswa(siswaRow) {
        let sumTotal = 0, countTotal = 0, mapelMerah = 0;
        let rincianMerah = [];

        daftarMapel.forEach((m, idx) => {
            let start = 6 + (idx * 6);
            for (let s = 0; s < 6; s++) {
                let valStr = siswaRow[start + s];
                if (valStr && valStr !== '-' && valStr.trim() !== '') {
                    let valNum = parseFloat(valStr);
                    if (!isNaN(valNum)) {
                        sumTotal += valNum;
                        countTotal++;
                        if (valNum < 75) {
                            mapelMerah++;
                            rincianMerah.push(`${m.kode} (S${s + 1}: ${valStr})`);
                        }
                    }
                }
            }
        });

        return {
            sum:         sumTotal,
            count:       countTotal,
            average:     countTotal > 0 ? (sumTotal / countTotal).toFixed(1) : "0.0",
            merah:       mapelMerah,
            rincianMerah: rincianMerah.join(", ")
        };
    }

    function dapatkanPeringkatKelasSiswa(nisn, rombel) {
        let siswaSatuKelas = dataSiswaGlobal.filter(row => row[3] === rombel);
        siswaSatuKelas.sort((a, b) => parseFloat(hitungStatistikSiswa(b).average) - parseFloat(hitungStatistikSiswa(a).average));
        let rank = siswaSatuKelas.findIndex(row => row[0] === nisn);
        return rank !== -1 ? (rank + 1) : "-";
    }

    // ============================================================
    // CARI NILAI PERSONAL (FIXED AUTO-LOAD & PRECISE MENU STRIPPER)
    // ============================================================
    function cariNilaiSiswa() {
        let searchKey = "";

        // 🔒 SEKAT KEAMANAN UTK SISWA (Toleransi 'SiswaSMAN1' atau 'siswaSMAN1')
        if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && 
           (sessionUserAktif.role === 'SiswaSMAN1' || sessionUserAktif.role === 'siswaSMAN1')) {
            
            searchKey = sessionUserAktif.username; // Ambil mutlak dari NISN akun login (Bypass input layar)

            // 🌟 SUNTIKKAN CSS KHUSUS PENGHANCUR ELEMEN SPESIFIK (TIDAK MERUSAK SIDEBAR UTAMA) 🌟
            if (!document.getElementById('siswaSearchProtector')) {
                const style = document.createElement('style');
                style.id = 'siswaSearchProtector';
                style.innerHTML = `
                    /* 1. Menyembunyikan seluruh komponen pencarian nilai secara fisik & visual */
                    .search-container, 
                    .search-box, 
                    .plotting-search, 
                    #searchKey, 
                    #searchSuggestions, 
                    #boxPencarianSiswaIndividu,
                    button[onclick="cariNilaiSiswa()"] {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    }

                    /* 2. Sembunyikan ID menu terlarang jika menggunakan ID standar */
                    #btnNavBiodata, #btnNavKehadiranSiswa, #btnNavKehadiranGuru, #btnNavKetidakhadiranGuru {
                        display: none !important;
                    }
                `;
                document.head.appendChild(style);
            }

            // 🌟 PRECISE SCANNING: Hanya cari elemen baris menu (item) yang mengandung teks terlarang
            // Kita batasi hanya memeriksa elemen link (a), list item (li), atau item menu bertingkat rendah
            document.querySelectorAll('a, li, .nav-item, .menu-item').forEach(el => {
                const txt = el.innerText || "";
                if (txt.includes("Ketidakhadiran Guru") || 
                    txt.includes("Kehadiran Guru") || 
                    txt.includes("Kehadiran Siswa") || 
                    txt.includes("Biodata Lengkap")) {
                    el.style.setProperty('display', 'none', 'important');
                }
            });

            // Pengaman tambahan: hapus isi rekomendasi nama siswa lain jika sempat muncul
            const suggestionsEl = document.getElementById('searchSuggestions');
            if (suggestionsEl) { 
                suggestionsEl.innerHTML = '';
                suggestionsEl.style.display = 'none'; 
            }
        } else {
            // JIKA LOGIN SEBAGAI GURU / ADMIN
            const inputEl = document.getElementById('searchKey');
            searchKey = inputEl ? inputEl.value.trim() : "";
        }

        // Jika tidak ada kata kunci (untuk admin yang baru membuka halaman), hentikan proses
        if (!searchKey) return;

        // Cari data siswa di database berdasarkan searchKey yang aman
        const siswa = dataSiswaGlobal.find(row =>
            row[0] === searchKey ||
            row[1] === searchKey ||
            row[2].toLowerCase() === searchKey.toLowerCase()
        );

        // 🔒 PERTAHANAN GANDA TINGKAT DATA: Cegah manipulasi objek via konsol browser
        if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && 
           (sessionUserAktif.role === 'SiswaSMAN1' || sessionUserAktif.role === 'siswaSMAN1')) {
            if (siswa && siswa[0] !== sessionUserAktif.username) {
                console.warn("Deteksi upaya bypass data! Sistem mengembalikan ke rapor mandiri.");
                const dataSiswaAsli = dataSiswaGlobal.find(row => row[0] === sessionUserAktif.username);
                if (dataSiswaAsli) renderNilaiKeHalamanWeb(dataSiswaAsli);
                return;
            }
        }

        if (!siswa) { 
            if (sessionUserAktif && (sessionUserAktif.role === 'SiswaSMAN1' || sessionUserAktif.role === 'siswaSMAN1')) {
                console.log("Menyinkronkan data...");
            } else {
                alert("Siswa tidak ditemukan!"); 
            }
            return; 
        }

        renderNilaiKeHalamanWeb(siswa);
    }

    // Fungsi steril khusus merender tabel nilai siswa
    function renderNilaiKeHalamanWeb(siswa) {
        // Helper aman — tidak crash jika elemen belum ada di DOM (panel tidak aktif)
        function setTeks(id, val) {
            var el = document.getElementById(id);
            if (el) el.innerText = val;
        }

        setTeks('resNama',    siswa[2]);
        setTeks('resKelas',   siswa[3]);
        setTeks('resNisnNis', siswa[0] + '/' + siswa[1]);

        let info = hitungStatistikSiswa(siswa);
        setTeks('resSumNilai',           info.sum.toFixed(1));
        setTeks('resCountNilai',         info.count + " Data");
        setTeks('resRataRata',           info.average);
        setTeks('resPeringkat',          siswa[5] || '-');
        setTeks('resMapelMerahPersonal', info.merah);
        setTeks('resPeringkatKelas',     "#" + dapatkanPeringkatKelasSiswa(siswa[0], siswa[3]));

        var nilaiTBody = document.getElementById('nilaiTableBody');
        if (!nilaiTBody) return;
        nilaiTBody.innerHTML = "";
        daftarMapel.forEach((m, idx) => {
            let start    = 6 + (idx * 6);
            let hasValue = false;
            for (let s = 0; s < 6; s++) { if (siswa[start + s]) hasValue = true; }

            if (hasValue) {
                let rHtml = `<tr><td><strong>${m.namaLengkap}</strong></td>`;
                for (let s = 0; s < 6; s++) {
                    let v = siswa[start + s] || '-';
                    rHtml += (parseFloat(v) < 75)
                        ? `<td><span class="text-nilai-kurang">${v}</span></td>`
                        : `<td>${v}</td>`;
                }
                document.getElementById('nilaiTableBody').innerHTML += rHtml + `</tr>`;
            }
        });

        // Pemetaan TKA UTBK & rekomendasi rumpun
        let totalSains = 0, cSains = 0, totalSos = 0, cSos = 0;
        let tkaScores = {
            "Matematika Tingkat Lanjut": 0, "Bahasa Indonesia Tingkat Lanjut": 0, "Bahasa Inggris Tingkat Lanjut": 0,
            "Fisika": 0, "Kimia": 0, "Biologi": 0, "Ekonomi": 0, "Sosiologi": 0, "Geografi": 0, "Sejarah": 0,
            "Pendidikan Pancasila/PPKN": 0, "Antropologi": 0, "Bahasa Jepang": 0
        };

        daftarMapel.forEach((m, mIdx) => {
            let start = 6 + (mIdx * 6);
            let s3 = parseFloat(siswa[start + 2]) || 0;
            let s4 = parseFloat(siswa[start + 3]) || 0;
            let pembagiSmt = (s3 > 0 ? 1 : 0) + (s4 > 0 ? 1 : 0);
            let rerataRiilMapel = pembagiSmt > 0 ? (s3 + s4) / pembagiSmt : 0;

            let s1 = parseFloat(siswa[start]) || 0;
            let s2 = parseFloat(siswa[start + 1]) || 0;
            let rerataAwal = (s1 + s2) / ((s1 > 0 ? 1 : 0) + (s2 > 0 ? 1 : 0) || 1);
            let rerataMapel = rerataRiilMapel > 0 ? rerataRiilMapel : rerataAwal;

            if (rerataMapel > 0) {
                if (['MATUM','IPA','BIO','KIM','FIS','MTL','INF'].includes(m.kode)) {
                    totalSains += rerataMapel; cSains++;
                } else if (!['AGM','PCSL','BIN','BING','PJOK','SB','PKWU','MULOK','MUH'].includes(m.kode)) {
                    totalSos += rerataMapel; cSos++;
                }
                if (m.kode === 'MTL')                       tkaScores["Matematika Tingkat Lanjut"]      = rerataMapel;
                if (m.kode === 'BIN')                       tkaScores["Bahasa Indonesia Tingkat Lanjut"] = rerataMapel;
                if (m.kode === 'BING')                      tkaScores["Bahasa Inggris Tingkat Lanjut"]  = rerataMapel;
                if (m.kode === 'FIS')                       tkaScores["Fisika"]                         = rerataMapel;
                if (m.kode === 'KIM')                       tkaScores["Kimia"]                          = rerataMapel;
                if (m.kode === 'BIO')                       tkaScores["Biologi"]                        = rerataMapel;
                if (m.kode === 'EKO')                       tkaScores["Ekonomi"]                        = rerataMapel;
                if (m.kode === 'SOS')                       tkaScores["Sosiologi"]                      = rerataMapel;
                if (m.kode === 'GEO')                       tkaScores["Geografi"]                       = rerataMapel;
                if (m.kode === 'SEJ' || m.kode === 'SEJMNT') tkaScores["Sejarah"]                       = rerataMapel;
                if (m.kode === 'PCSL')                      tkaScores["Pendidikan Pancasila/PPKN"]      = rerataMapel;
                if (m.kode === 'BJP')                       tkaScores["Bahasa Jepang"]                  = rerataMapel;
            }
        });

        let avgSains         = totalSains / (cSains || 1);
        let avgSos           = totalSos   / (cSos   || 1);
        let kelasSiswaMurni  = (siswa[3] || "").toUpperCase().trim();
        let htmlKontenHasil  = "";

        if (kelasSiswaMurni.startsWith("XI-") || kelasSiswaMurni.startsWith("XI ")) {
            let urutanTka    = Object.keys(tkaScores).filter(k => tkaScores[k] > 0).sort((a, b) => tkaScores[b] - tkaScores[a]);
            let top4Pilihan  = urutanTka.slice(0, 4);
            let tagsHtmlTka  = top4Pilihan.map(mPlh => {
                return `<div style="display:block; margin-bottom:6px; font-weight:600; color:#1e293b; font-size:13px;">
                    🔹 ${mPlh} <span style="color:#0369a1; background:#e0f2fe; padding:2px 8px; border-radius:4px; font-size:11px; font-weight:700; margin-left:5px;">(${tkaScores[mPlh].toFixed(1)})</span>
                </div>`;
            }).join('');

            htmlKontenHasil = `
                <p style="margin-bottom:12px; font-size:14px; color:#1e293b;"><strong>🎯 Rekomendasi Paket Mapel Pilihan TKA UTBK (Top 4 Nilai Tertinggi):</strong></p>
                <div style="background:#ffffff; border:1px solid #e2e8f0; padding:14px; border-radius:8px; margin-bottom:15px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">
                    ${tagsHtmlTka || '<span style="color:#64748b; font-style:italic;">Nilai rapor mapel pilihan belum memadai</span>'}
                </div>
                <p style="font-size:13px; line-height:1.5; color:#475569;"><strong>Rekomendasi Strategis Kelas XI:</strong><br>Paket mata pelajaran pilihan di atas direkomendasikan secara otomatis berdasarkan performa nilai rapor tertinggi siswa hingga semester berjalan ini. Rekomendasi ini dirancang khusus untuk mengoptimalkan pencapaian skor UTBK-SNBT maupun pemetaan portofolio pendaftaran SNBP pada program studi akademik pilihan siswa.</p>
            `;
        } else {
            let rekomendasiRumpun  = avgSains >= avgSos ? "Rumpun MIPA / Teknik Terapan" : "Rumpun IPS / Sosio-Humaniora";
            let detailSaran        = "";
            let listMapelRekomendasiSistem = [];

            if (avgSains >= avgSos) {
                listMapelRekomendasiSistem = ["Matematika Tingkat Lanjut","Fisika","Kimia","Biologi","Informatika"];
            } else {
                listMapelRekomendasiSistem = ["Ekonomi","Sosiologi","Geografi","Sejarah Peminatan","Bahasa Inggris Tingkat Lanjut"];
            }

            let tagsMapelKelasX = listMapelRekomendasiSistem.map(mp => {
                let warnaBadge  = avgSains >= avgSos ? "#1d4ed8" : "#b45309";
                let bgBadge     = avgSains >= avgSos ? "#eff6ff"  : "#fff7ed";
                let borderBadge = avgSains >= avgSos ? "#bfdbfe"  : "#ffedd5";
                return `<span class="plotting-tag" style="background:${bgBadge}; color:${warnaBadge}; font-weight:700; border-color:${borderBadge}; padding:4px 10px; margin-top:5px; border-radius:6px;">📌 ${mp}</span>`;
            }).join(' ');

            if (parseFloat(info.average) >= 88) {
                detailSaran = "Siswa memiliki konsistensi nilai akademis yang luar biasa tinggi (Top Tier). Disarankan mempertahankan kestabilan performa ini di Kelas XI agar memperbesar peluang kelulusan prodi favorit melalui jalur SNBP (Prestasi Rapor).";
            } else if (info.merah > 0) {
                detailSaran = `Perhatian Wali Kelas: Terdapat <strong>${info.merah} modul kompetensi nilai di bawah KKM (< 75)</strong>. Fokus utama adalah melakukan remedial intensif and pendampingan belajar sebelum memasuki penentuan penguncian kuota kelas pilihan esok hari.`;
            } else {
                detailSaran = "Performa akademis cenderung stabil, aman, dan merata. Disarankan untuk mulai aktif berkonsultasi dengan Guru BK guna memantapkan pemilihan paket peminatan karir yang selaras dengan cita-cita program studi perguruan tinggi.";
            }

            htmlKontenHasil = `
                <p style="margin-bottom:8px;"><strong>Analisis Kecenderungan Kemampuan Akademis (Fase E):</strong></p>
                <ul style="padding-left:20px; margin-bottom:16px; font-size:13px; color:#334155; line-height:1.6;">
                    <li>Rerata Klaster Eksakta / Sains: <strong style="color:#1d4ed8;">${avgSains.toFixed(1)}</strong></li>
                    <li>Rerata Klaster Sosial / Humaniora: <strong style="color:#b45309;">${avgSos.toFixed(1)}</strong></li>
                    <li>Rekomendasi Arah Rumpun: <span class="plotting-tag" style="background:var(--slate-900); color:white; padding:2px 8px; font-weight:700; border:none; border-radius:4px;">${rekomendasiRumpun}</span></li>
                </ul>
                <p style="margin-bottom:10px; font-size:14px; color:#1e293b;"><strong>🎯 Rekomendasi Paket Mata Pelajaran Pilihan (Saat Naik ke Kelas XI):</strong></p>
                <div style="background:#ffffff; border:1px solid #e2e8f0; padding:14px; border-radius:8px; margin-bottom:20px; display:flex; flex-wrap:wrap; gap:8px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.02);">
                    ${tagsMapelKelasX}
                </div>
                <p style="font-size:13px; color:#475569; line-height:1.6;"><strong>Rekomendasi Strategis Tatap Karir:</strong><br>${detailSaran}</p>
            `;
        }

        document.getElementById('kontenRekapEvaluasiPersonal').innerHTML = htmlKontenHasil;
        document.getElementById('resultSiswaSection').style.display = 'block';
    }



    // ============================================================
    // 3. FUNGSI AUTOCOMPLETE (KUNCI MATI TOTAL UNTUK SISWA)
    // ============================================================
    function handleSearchAutocomplete(inputEl) {
        const boxSuggestions = document.getElementById('searchSuggestions');

        // 🔒 JIKA SISWA: Hancurkan proses penayangan rekomendasi nama orang lain!
        if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.role === 'siswaSMAN1') {
            if (boxSuggestions) {
                boxSuggestions.innerHTML = "";
                boxSuggestions.style.display = 'none';
            }
            return; 
        }

        // Jalur normal untuk Guru / Admin
        const keyword = inputEl.value.trim().toLowerCase();
        if (keyword.length < 2) {
            if (boxSuggestions) boxSuggestions.style.display = 'none';
            return;
        }

        let matches = dataSiswaGlobal
            .filter(row => row[2].toLowerCase().includes(keyword) || row[0].includes(keyword))
            .slice(0, 8);

        if (matches.length > 0 && boxSuggestions) {
            boxSuggestions.innerHTML = "";
            matches.forEach(siswa => {
                boxSuggestions.innerHTML += `<div class="suggestion-item" onclick="pilihSiswaAutocomplete('${siswa[0]}', '${siswa[2]}')"><div><strong>${siswa[2]}</strong></div><div><code>NISN: ${siswa[0]}</code></div></div>`;
            });
            boxSuggestions.style.display = 'block';
        } else if (boxSuggestions) {
            boxSuggestions.style.display = 'none';
        }
    }

    // ============================================================
    // 4. DAEMON PEMANTAU MANDIRI (BERJALAN DI BALIK LAYAR)
    // ============================================================
    setInterval(() => {
        if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.role === 'siswaSMAN1') {
            // Paksa eksekusi penayangan rapor otomatis tanpa input ketikan layar
            cariNilaiSiswa();
        }
    }, 300);

    // ============================================================
    // LEGER KELAS
    // ============================================================
    function tampilkanLegerKelas() {
    const kelas    = document.getElementById('selectKelas').value;
    const mode     = document.getElementById('selectModeTampilan').value;
    const smt      = parseInt(document.getElementById('selectSemester').value) || 1;
    const sortMode = document.getElementById('selectSortMode').value;

    if (!kelas) { alert("Silakan pilih kelas terlebih dahulu!"); return; }

    const tHeader = document.getElementById('legerTableHeader');
    const tBody   = document.getElementById('legerTableBody');
    tHeader.innerHTML = '';
    tBody.innerHTML   = '';

    // Filter siswa berdasarkan kelas terpilih
    let fSiswa = dataSiswaGlobal.filter(row => row[3] === kelas);

    if (fSiswa.length === 0) {
        tBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b; padding:20px;">Tidak ada data siswa di kelas ini atau data belum tersinkron.</td></tr>`;
        document.getElementById('resultKelasSection').style.display = 'block';
        return;
    }

    // ============================================================
    // 🌟 SELEKSI PERINGKAT ASLI KELAS (BERDASARKAN RATA-RATA TERTINGGI)
    // ============================================================
    // Membuat salinan array terpisah untuk menyimpan urutan rangking yang absolut
    let siswaPeringkatAsli = [...fSiswa].sort((a, b) => {
        return parseFloat(hitungStatistikSiswa(b).average) - parseFloat(hitungStatistikSiswa(a).average);
    });

    // ============================================================
    // 🌟 PROSES PENGURUTAN MENU TAMPILAN (SORT MODE)
    // ============================================================
    if (sortMode === 'rank_kelas') {
        // Jika opsi urutkan rangking dipilih, gunakan urutan rangking asli
        fSiswa = [...siswaPeringkatAsli];
    } else {
        // Jika opsi nama dipilih, urutkan data fSiswa berdasarkan alfabet Nama (A-Z)
        fSiswa.sort((a, b) => (a[2] || "").localeCompare(b[2] || ""));
    }

    const fragment = document.createDocumentFragment();

    // ============================================================
    // MODE TAMPILAN 1: Summary (Ringkasan Total Nilai)
    // ============================================================
    if (mode === 'summary') {
        tHeader.innerHTML = `<tr>
            <th class="freeze-col-1" style="width:70px; text-align:center;">Rank</th>
            <th class="freeze-col-2">Nama Siswa</th>
            <th style="text-align:center;">Nomor NISN</th>
            <th style="text-align:center;">SUM TOTAL</th>
            <th style="text-align:center;">RATA-RATA KUMULATIF</th>
            <th style="text-align:center;">MAPEL &lt; 75</th>
        </tr>`;

        fSiswa.forEach((s) => {
            let inf = hitungStatistikSiswa(s);
            
            // 🌟 Cari posisi rangking asli siswa dari array referensi rangking
            let rankAsli = siswaPeringkatAsli.findIndex(item => item[0] === s[0]) + 1;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="freeze-col-1" style="text-align:center;">${rankAsli}</td>
                <td class="freeze-col-2"><strong>${s[2].toUpperCase()}</strong></td>
                <td style="text-align:center;"><code>${s[0]}</code></td>
                <td style="text-align:center; font-weight:700; color:var(--primary);">${inf.sum.toFixed(1)}</td>
                <td style="text-align:center; font-weight:700;">${inf.average}</td>
                <td style="text-align:center;"><span class="${inf.merah > 0 ? 'text-nilai-kurang' : ''}" style="font-weight:700;">${inf.merah} Mapel</span></td>
            `;
            fragment.appendChild(tr);
        });
        tBody.appendChild(fragment);

    // ============================================================
    // MODE TAMPILAN 2: Semester (Rincian Nilai Per Mapel di Semester X)
    // ============================================================
    } else if (mode === 'semester') {
        let headerHtml = `<tr>
            <th class="freeze-col-1" style="width:70px; text-align:center;">Rank</th>
            <th class="freeze-col-2">Nama Siswa</th>`;
        daftarMapel.forEach(m => { headerHtml += `<th style="text-align:center; min-width:120px;">${m.kode} (S${smt})</th>`; });
        headerHtml += `</tr>`;
        tHeader.innerHTML = headerHtml;

        fSiswa.forEach((s) => {
            // 🌟 Cari posisi rangking asli siswa dari array referensi rangking
            let rankAsli = siswaPeringkatAsli.findIndex(item => item[0] === s[0]) + 1;

            const tr = document.createElement('tr');
            let innerCols = `
                <td class="freeze-col-1" style="text-align:center;">${rankAsli}</td>
                <td class="freeze-col-2"><strong>${s[2].toUpperCase()}</strong></td>`;
            
            daftarMapel.forEach((m, mIdx) => {
                let valStr = s[6 + (mIdx * 6) + (smt - 1)] || "-";
                let valNum = parseFloat(valStr);
                innerCols += (!isNaN(valNum) && valNum < 75)
                    ? `<td style="text-align:center;"><span class="text-nilai-kurang">${valStr}</span></td>`
                    : `<td style="text-align:center;">${valStr}</td>`;
            });
            
            tr.innerHTML = innerCols;
            fragment.appendChild(tr);
        });
        tBody.appendChild(fragment);

    // ============================================================
    // MODE TAMPILAN 3: Rekap Total / Master Leger Lengkap (S1 s.d S6)
    // ============================================================
    } else if (mode === 'rekap_total') {
        let headerHtml = `<tr>
            <th class="freeze-col-1" style="width:70px; text-align:center;">Rank</th>
            <th class="freeze-col-2">Nama Siswa</th>`;
        daftarMapel.forEach(m => {
            for (let s = 1; s <= 6; s++) { headerHtml += `<th style="text-align:center; min-width:85px; font-size:11px;">${m.kode}<br>S${s}</th>`; }
        });
        headerHtml += `</tr>`;
        tHeader.innerHTML = headerHtml;

        fSiswa.forEach((s) => {
            // 🌟 Cari posisi rangking asli siswa dari array referensi rangking
            let rankAsli = siswaPeringkatAsli.findIndex(item => item[0] === s[0]) + 1;

            const tr = document.createElement('tr');
            let innerCols = `
                <td class="freeze-col-1" style="text-align:center;">${rankAsli}</td>
                <td class="freeze-col-2"><strong>${s[2].toUpperCase()}</strong></td>`;
            
            daftarMapel.forEach((m, mIdx) => {
                for (let sem = 0; sem < 6; sem++) {
                    let valStr = s[6 + (mIdx * 6) + sem] || "-";
                    let valNum = parseFloat(valStr);
                    innerCols += (!isNaN(valNum) && valNum < 75)
                        ? `<td style="text-align:center;"><span class="text-nilai-kurang">${valStr}</span></td>`
                        : `<td style="text-align:center;">${valStr}</td>`;
                }
            });
            
            tr.innerHTML = innerCols;
            fragment.appendChild(tr);
        });
        tBody.appendChild(fragment);
    }

    document.getElementById('resultKelasSection').style.display = 'block';
}

    // ============================================================
    // EKSPOR EXCEL KELAS
    // ============================================================
    function eksporExcelKelas() {
        const kelas = document.getElementById('selectKelas').value;
        if (!kelas) { alert("Silakan tentukan kelas terlebih dahulu!"); return; }

        let filterSiswa = dataSiswaGlobal
            .filter(row => row[3] === kelas)
            .sort((a, b) => parseFloat(hitungStatistikSiswa(b).average) - parseFloat(hitungStatistikSiswa(a).average));
        if (filterSiswa.length === 0) { alert("Tidak ada data siswa untuk diekspor!"); return; }

        let matrixData = [
            [`LEGER DATA NILAI AKADEMIK BERKALA`],
            [`SMAN 1 JAKARTA - ROMBONGAN BELAJAR: KELAS ${kelas.toUpperCase()}`],
            [`Waktu Ekspor: ${new Date().toLocaleDateString('id-ID')} | Total Siswa: ${filterSiswa.length}`],
            [],
            ["RANK\nKELAS", "NAMA LENGKAP SISWA", "NISN / ID", "SUM\nTOTAL", "RATA-RATA\nKUMULATIF", "RANK\nPARALEL"]
        ];

        let subHeaderRow = ["", "", "", "", "", ""];

        daftarMapel.forEach(m => {
            matrixData[4].push(m.namaLengkap);
            for (let s = 1; s <= 5; s++) { matrixData[4].push(""); }
            for (let s = 1; s <= 6; s++) { subHeaderRow.push(`S${s}`); }
        });
        matrixData.push(subHeaderRow);

        let merges = [
            { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } },
            { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } },
            { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } },
            { s: { r: 4, c: 3 }, e: { r: 5, c: 3 } },
            { s: { r: 4, c: 4 }, e: { r: 5, c: 4 } },
            { s: { r: 4, c: 5 }, e: { r: 5, c: 5 } }
        ];

        let colIndexStart = 6;
        daftarMapel.forEach(() => {
            merges.push({ s: { r: 4, c: colIndexStart }, e: { r: 4, c: colIndexStart + 5 } });
            colIndexStart += 6;
        });

        filterSiswa.forEach((siswa, idx) => {
            let stat       = hitungStatistikSiswa(siswa);
            let rankParalel = siswa[5] || "-";
            let rowSiswa   = [(idx + 1), siswa[2].toUpperCase(), siswa[0], parseFloat(stat.sum.toFixed(0)), parseFloat(stat.average.replace(',', '.')), rankParalel];
            daftarMapel.forEach((m, mIdx) => {
                for (let s = 0; s < 6; s++) {
                    let valStr = siswa[6 + (mIdx * 6) + s];
                    let valNum = parseFloat(valStr);
                    rowSiswa.push(!isNaN(valNum) ? valNum : "-");
                }
            });
            matrixData.push(rowSiswa);
        });

        let ws = XLSX.utils.aoa_to_sheet(matrixData);
        ws['!merges'] = merges;

        let borderGarisTipis = { top: { style: "thin", color: { rgb: "A0AEC0" } }, bottom: { style: "thin", color: { rgb: "A0AEC0" } }, left: { style: "thin", color: { rgb: "A0AEC0" } }, right: { style: "thin", color: { rgb: "A0AEC0" } } };
        let styleNavyHeader  = { fill: { fgColor: { rgb: "1A365D" } }, font: { color: { rgb: "FFFFFF" }, bold: true, name: "Arial", sz: 10 }, alignment: { horizontal: "center", vertical: "center", wrapText: true }, border: borderGarisTipis };
        let styleDataCenter  = { font: { name: "Arial", sz: 10, color: { rgb: "334155" } }, alignment: { horizontal: "center", vertical: "center" }, border: borderGarisTipis };
        let styleGoldTop3    = { fill: { fgColor: { rgb: "FEF3C7" } }, font: { name: "Arial", sz: 10, bold: true, color: { rgb: "92400E" } }, alignment: { horizontal: "center", vertical: "center" }, border: borderGarisTipis };

        let range = XLSX.utils.decode_range(ws['!ref']);
        for (let r = range.s.r; r <= range.e.r; r++) {
            for (let c = range.s.c; c <= range.e.c; c++) {
                let cell_ref = XLSX.utils.encode_cell({ r: r, c: c });
                if (!ws[cell_ref]) continue;

                if (r >= 0 && r <= 2) {
                    ws[cell_ref].s = { font: { bold: true, size: r === 0 ? 13 : 11, name: "Arial", color: { rgb: "1E293B" } }, alignment: { horizontal: "left", vertical: "center" } };
                } else if (r === 4 || r === 5) {
                    ws[cell_ref].s = styleNavyHeader;
                } else if (r > 5) {
                    let rankSiswa = matrixData[r][0];
                    let isTop3    = (typeof rankSiswa === 'number' && rankSiswa <= 3);
                    let cellStyle = isTop3 ? JSON.parse(JSON.stringify(styleGoldTop3)) : JSON.parse(JSON.stringify(styleDataCenter));

                    if (c === 1) {
                        cellStyle.alignment.horizontal = "left";
                        if (!isTop3) cellStyle.font.bold = false;
                    }
                    if (c === 3 || c === 4) {
                        cellStyle.font.bold = true;
                        if (isTop3) cellStyle.font.color = { rgb: "B45309" };
                    }
                    ws[cell_ref].s = cellStyle;

                    if (c >= 6 && typeof ws[cell_ref].v === 'number' && ws[cell_ref].v < 75) {
                        ws[cell_ref].s.font = { color: { rgb: "991B1B" }, bold: true, name: "Arial", sz: 10 };
                        ws[cell_ref].s.fill = { fgColor: { rgb: "FEE2E2" } };
                    }
                }
            }
        }

        let colWidths = [];
        let totalKolomTabel = 6 + (daftarMapel.length * 6);
        for (let c = 0; c < totalKolomTabel; c++) {
            if      (c === 0)           colWidths.push({ wch: 8  });
            else if (c === 1)           colWidths.push({ wch: 34 });
            else if (c === 2)           colWidths.push({ wch: 15 });
            else if (c === 3 || c === 4) colWidths.push({ wch: 14 });
            else if (c === 5)           colWidths.push({ wch: 12 });
            else                        colWidths.push({ wch: 6  });
        }
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Leger Kelas ${kelas}`);
        XLSX.writeFile(wb, `Leger_Kolektif_Kelas_${kelas}_Terformat.xlsx`);
    }

