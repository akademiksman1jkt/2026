    // ============================================================
    function SinkronDropdownEvaluasiKelas() {
        const select = document.getElementById('evalSelectKelas');
        if (!select) return;
        select.innerHTML = '<option value="">-- Pilih Angkatan / Kelas --</option>';
        let listK = [...new Set(dataSiswaGlobal.map(row => row[3]))].filter(k => k !== "").sort();
        listK.forEach(k => { select.innerHTML += `<option value="${k}">${k}</option>`; });
    }

    function GantiKombinasiFormEvaluasi() {
        const kelas = document.getElementById('evalSelectKelas').value.toUpperCase();
        document.getElementById('formKolektifKelasX').style.display =
            (kelas.startsWith('X-') || kelas === 'X') ? 'flex' : 'none';
    }

    function ProsesAnalisisEvaluasiSistem() {
        const kelas = document.getElementById('evalSelectKelas').value;
        if (!kelas) return;

        const tHeader         = document.getElementById('headerEvaluasiSistem');
        const tBody           = document.getElementById('bodyEvaluasiSistem');
        const widgetContainer = document.getElementById('boxWidgetStatistikEvaluasi');
        tHeader.innerHTML = "";
        tBody.innerHTML   = "";
        widgetContainer.innerHTML = "";

        let filterSiswa = dataSiswaGlobal
            .filter(row => row[3] === kelas)
            .sort((a, b) => (a[2] || "").localeCompare(b[2] || ""));
        if (filterSiswa.length === 0) { alert("Tidak ada data siswa."); return; }

        let jenjang = kelas.toUpperCase().startsWith("XII") ? "XII" : (kelas.toUpperCase().startsWith("XI") ? "XI" : "X");

        if (jenjang === "X") {
            let smt2Terisi = false;
            filterSiswa.forEach(siswa => {
                daftarMapel.forEach((m, mIdx) => {
                    if ((parseFloat(siswa[6 + (mIdx * 6) + 1]) || 0) > 0) smt2Terisi = true;
                });
            });

            tHeader.innerHTML = `<tr>
                <th>No</th><th>Identitas</th><th>Nama Lengkap</th>
                <th>Skor Sains</th><th>Skor Soshum</th>
                ${smt2Terisi ? '<th>Rerata (S1+S2)</th>' : ''}
                <th>Input Bakat</th><th>Input Rencana Studi</th>
                <th>&lt; 75 (Rincian Mapel)</th><th>Status Kenaikan</th>
                <th>Peringkat Kelas</th><th>Peringkat Angkatan</th>
                <th style="color:var(--primary)">Rekomendasi Rumpun</th>
                <th style="color:#0f766e">Rekomendasi Penguatan</th>
            </tr>`;

            let JmlAman = 0, JmlRingan = 0, JmlSedang = 0, JmlParah = 0;

            filterSiswa.forEach((siswa, index) => {
                let totalSains = 0, cSains = 0, totalSos = 0, cSos = 0, sumAll = 0, cAll = 0;
                let infoS  = hitungStatistikSiswa(siswa);
                let merah  = 0;

                daftarMapel.forEach((m, mIdx) => {
                    let s1 = parseFloat(siswa[6 + (mIdx * 6)]) || 0;
                    let s2 = parseFloat(siswa[6 + (mIdx * 6) + 1]) || 0;
                    if (smt2Terisi) { if (s1 > 0 && s1 < 75) merah++; if (s2 > 0 && s2 < 75) merah++; }
                    else            { if (s1 > 0 && s1 < 75) merah++; }
                    if (s1 > 0) { sumAll += s1; cAll++; }
                    if (s2 > 0) { sumAll += s2; cAll++; }

                    let rM = (s1 + s2) / ((s1 > 0 ? 1 : 0) + (s2 > 0 ? 1 : 0) || 1);
                    if (rM > 0) {
                        if (['AGM','PCSL','BIN','BING','PJOK','SB','PKWU','MULOK','MUH'].includes(m.kode)) {
                            totalSains += rM; cSains++; totalSos += rM; cSos++;
                        } else if (['MATUM','IPA','BIO','KIM','FIS','MTL','INF'].includes(m.kode)) {
                            totalSains += rM; cSains++;
                        } else {
                            totalSos += rM; cSos++;
                        }
                    }
                });

                let finalSains = totalSains / (cSains || 1);
                let finalSos   = totalSos   / (cSos   || 1);

                let stBadge = "status-approved", stTxt = "AMAN";
                if      (merah >= 5) { stBadge = "status-rejected"; stTxt = "🔴 PARAH";   JmlParah++; }
                else if (merah >= 3) { stBadge = "status-waiting";  stTxt = "🟠 SEDANG";  JmlSedang++; }
                else if (merah > 0)  { stBadge = "status-waiting";  stTxt = "🟡 RINGAN";  JmlRingan++; }
                else                   JmlAman++;

                // Factor bakat & studi into rumpun recommendation
                let storedBakat = localStorage.getItem('eval_bakat_'+siswa[0]) || "";
                let storedStudi = localStorage.getItem('eval_studi_'+siswa[0]) || "";
                let sainsBakat  = ['Coding / Informatika','Robotika','Matematika','Fisika','Kimia','Biologi'].includes(storedBakat);
                let soshumBakat = ['Ekonomi','Akuntansi','Bisnis','Manajemen','Hukum','Psikologi','Bahasa','Seni','Desain Grafis','Musik','Olahraga'].includes(storedBakat);
                let sainsStudi  = ['Teknik Informatika','Sistem Informasi','Teknik Elektro','Teknik Mesin','Teknik Sipil','Arsitektur','Kedokteran','Farmasi','Keperawatan'].includes(storedStudi);
                let soshumStudi = ['Akuntansi','Manajemen','Ekonomi','Hukum','Psikologi','Ilmu Komunikasi','Pendidikan','Sastra','DKV'].includes(storedStudi);
                let finalSainsAdj = finalSains + (sainsBakat?3:0) + (sainsStudi?2:0) - (soshumBakat?1:0);
                let finalSosAdj   = finalSos   + (soshumBakat?3:0) + (soshumStudi?2:0) - (sainsBakat?1:0);
                let bakatInfluence = (storedBakat||storedStudi) ? '<br><span style="font-size:10px;color:#64748b;font-style:italic;">*Disesuaikan bakat/studi</span>' : "";
                let rek      = finalSainsAdj >= finalSosAdj ? "Rumpun MIPA / Teknik Terapan" : "Rumpun IPS / Sosio-Humaniora";
                let warnaRek = finalSainsAdj >= finalSosAdj ? "#1d4ed8" : "#b45309";

                tBody.innerHTML += `<tr>
                    <td>${index + 1}</td><td><code>${siswa[0]}</code></td><td><strong>${siswa[2]}</strong></td>
                    <td style="color:#1d4ed8; font-weight:600;">${finalSains.toFixed(1)}</td>
                    <td style="color:#b45309; font-weight:600;">${finalSos.toFixed(1)}</td>
                    ${smt2Terisi ? `<td>${(sumAll / (cAll || 1)).toFixed(1)}</td>` : ''}
                    <td>
                        <select id='bakat_${siswa[0]}' style='padding:4px; width:160px;' onchange='updatePenguatan("${siswa[0]}")'>
                            <option value=''>Pilih</option>
                            <option value='Coding / Informatika'>Coding / Informatika</option><option value='Robotika'>Robotika</option>
                            <option value='Matematika'>Matematika</option><option value='Fisika'>Fisika</option>
                            <option value='Kimia'>Kimia</option><option value='Biologi'>Biologi</option>
                            <option value='Ekonomi'>Ekonomi</option><option value='Akuntansi'>Akuntansi</option>
                            <option value='Bisnis'>Bisnis</option><option value='Manajemen'>Manajemen</option>
                            <option value='Hukum'>Hukum</option><option value='Psikologi'>Psikologi</option>
                            <option value='Bahasa'>Bahasa</option><option value='Seni'>Seni</option>
                            <option value='Desain Grafis'>Desain Grafis</option><option value='Musik'>Musik</option>
                            <option value='Olahraga'>Olahraga</option>
                        </select>
                    </td>
                    <td>
                        <select id='studi_${siswa[0]}' style='padding:4px; width:180px;' onchange='updatePenguatan("${siswa[0]}")'>
                            <option value=''>Pilih</option>
                            <option value='Teknik Informatika'>Teknik Informatika</option><option value='Sistem Informasi'>Sistem Informasi</option>
                            <option value='Teknik Elektro'>Teknik Elektro</option><option value='Teknik Mesin'>Teknik Mesin</option>
                            <option value='Teknik Sipil'>Teknik Sipil</option><option value='Arsitektur'>Arsitektur</option>
                            <option value='Kedokteran'>Kedokteran</option><option value='Farmasi'>Farmasi</option>
                            <option value='Keperawatan'>Keperawatan</option><option value='Akuntansi'>Akuntansi</option>
                            <option value='Manajemen'>Manajemen</option><option value='Ekonomi'>Ekonomi</option>
                            <option value='Hukum'>Hukum</option><option value='Psikologi'>Psikologi</option>
                            <option value='Ilmu Komunikasi'>Ilmu Komunikasi</option><option value='Pendidikan'>Pendidikan</option>
                            <option value='Sastra'>Sastra</option><option value='DKV'>DKV</option>
                        </select>
                    </td>
                    <td style='color:var(--danger); font-weight:bold; font-size:12px;'>${merah} Mapel ${merah > 0 ? `<br><span style="color:#64748b; font-weight:normal; font-style:italic;">(${infoS.rincianMerah})</span>` : ''}</td>
                    <td><span class='status-badge ${stBadge}'>${stTxt}</span></td>
                    <td style="text-align:center; font-weight:700;">#${dapatkanPeringkatKelasSiswa(siswa[0], siswa[3])}</td>
                    <td style="text-align:center;">#${siswa[5] || '-'}</td>
                    <td id='rek_${siswa[0]}' style='font-weight:bold; color:${warnaRek};'><i class="ri-checkbox-circle-fill"></i> ${rek}${bakatInfluence}</td>
                    <td id='penguatan_${siswa[0]}' style='font-size:12px; text-align:left; max-width:280px;'>Silakan pilih bakat dan rencana studi.</td>
                </tr>`;
            });

            widgetContainer.innerHTML = `
                <div class="info-card" style="border-left:5px solid var(--success);"><div class="stat-label">🟢 Kenaikan Aman</div>  <div class="big-number">${JmlAman}</div></div>
                <div class="info-card" style="border-left:5px solid var(--warning);"><div class="stat-label">🟡 Risiko Ringan</div> <div class="big-number">${JmlRingan}</div></div>
                <div class="info-card" style="border-left:5px solid var(--danger);" ><div class="stat-label">🔴 Risiko Parah</div>  <div class="big-number" style="color:var(--danger);">${JmlParah}</div></div>`;

        } else if (jenjang === "XI") {
            let smt4Terisi = false;
            filterSiswa.forEach(siswa => {
                daftarMapel.forEach((m, mIdx) => {
                    if ((parseFloat(siswa[6 + (mIdx * 6) + 3]) || 0) > 0) smt4Terisi = true;
                });
            });

            tHeader.innerHTML = `<tr>
                <th>No</th><th>Nama Lengkap</th><th>NISN</th><th>Peringkat Kelas</th>
                ${smt4Terisi ? '<th>Rerata (S3+S4)</th>' : ''}
                <th>&lt; 75 (Rincian Mapel)</th><th>Status Kenaikan</th>
                <th style="color:var(--success); min-width:320px;">Rekomendasi Paket Mapel TKA UTBK</th>
            </tr>`;

            let JmlAman = 0, JmlRingan = 0, JmlSedang = 0, JmlParah = 0;

            filterSiswa.forEach((siswa, index) => {
                let sumAll = 0, cAll = 0;
                let infoS  = hitungStatistikSiswa(siswa);
                let merah  = 0;
                let tkaScores = {
                    "Matematika Tingkat Lanjut": 75, "Bahasa Indonesia Tingkat Lanjut": 75, "Bahasa Inggris Tingkat Lanjut": 75,
                    "Fisika": 75, "Kimia": 75, "Biologi": 75, "Ekonomi": 75, "Sosiologi": 75, "Geografi": 75, "Sejarah": 75,
                    "Pendidikan Pancasila/PPKN": 75, "Antropologi": 75, "Bahasa Jepang": 75
                };

                daftarMapel.forEach((m, mIdx) => {
                    let s3 = parseFloat(siswa[6 + (mIdx * 6) + 2]) || 0;
                    let s4 = parseFloat(siswa[6 + (mIdx * 6) + 3]) || 0;
                    if (smt4Terisi) { if (s3 > 0 && s3 < 75) merah++; if (s4 > 0 && s4 < 75) merah++; }
                    else            { if (s3 > 0 && s3 < 75) merah++; }
                    if (s3 > 0) { sumAll += s3; cAll++; }
                    if (s4 > 0) { sumAll += s4; cAll++; }

                    let pembagiSmt       = (s3 > 0 ? 1 : 0) + (s4 > 0 ? 1 : 0);
                    let rerataRiilMapel  = pembagiSmt > 0 ? (s3 + s4) / pembagiSmt : 0;
                    if (rerataRiilMapel > 0) {
                        if (m.kode === 'MTL')                        tkaScores["Matematika Tingkat Lanjut"]      = rerataRiilMapel;
                        if (m.kode === 'BIN')                        tkaScores["Bahasa Indonesia Tingkat Lanjut"] = rerataRiilMapel;
                        if (m.kode === 'BING')                       tkaScores["Bahasa Inggris Tingkat Lanjut"]  = rerataRiilMapel;
                        if (m.kode === 'FIS')                        tkaScores["Fisika"]                         = rerataRiilMapel;
                        if (m.kode === 'KIM')                        tkaScores["Kimia"]                          = rerataRiilMapel;
                        if (m.kode === 'BIO')                        tkaScores["Biologi"]                        = rerataRiilMapel;
                        if (m.kode === 'EKO')                        tkaScores["Ekonomi"]                        = rerataRiilMapel;
                        if (m.kode === 'SOS')                        tkaScores["Sosiologi"]                      = rerataRiilMapel;
                        if (m.kode === 'GEO')                        tkaScores["Geografi"]                       = rerataRiilMapel;
                        if (m.kode === 'SEJ' || m.kode === 'SEJMNT') tkaScores["Sejarah"]                        = rerataRiilMapel;
                        if (m.kode === 'PCSL')                       tkaScores["Pendidikan Pancasila/PPKN"]      = rerataRiilMapel;
                        if (m.kode === 'BJP')                        tkaScores["Bahasa Jepang"]                  = rerataRiilMapel;
                    }
                });

                let urutanRekomendasiTka = Object.keys(tkaScores).sort((a, b) => tkaScores[b] - tkaScores[a]);
                let top4Pilihan          = urutanRekomendasiTka.slice(0, 4);

                let stBadge = "status-approved", stTxt = "AMAN";
                if      (merah >= 5) { stBadge = "status-rejected"; stTxt = "🔴 PARAH";  JmlParah++; }
                else if (merah >= 3) { stBadge = "status-waiting";  stTxt = "🟠 SEDANG"; JmlSedang++; }
                else if (merah > 0)  { stBadge = "status-waiting";  stTxt = "🟡 RINGAN"; JmlRingan++; }
                else                   JmlAman++;

                let tagsHtml = top4Pilihan.map(mPlh => `<span class="plotting-tag" style="background:#e0f2fe; color:#0369a1; font-weight:700; border-color:#bae6fd; padding:4px 8px;">${mPlh}</span>`).join('');

                tBody.innerHTML += `<tr>
                    <td>${index + 1}</td><td><strong>${siswa[2]}</strong></td><td><code>${siswa[0]}</code></td>
                    <td style="text-align:center; font-weight:700;">#${dapatkanPeringkatKelasSiswa(siswa[0], siswa[3])}</td>
                    ${smt4Terisi ? `<td>${(sumAll / (cAll || 1)).toFixed(1)}</td>` : ''}
                    <td style="color:var(--danger); font-weight:bold; font-size:12px;">${merah} Mapel<br><span style="color:#64748b; font-weight:normal; font-style:italic;">(${infoS.rincianMerah})</span></td>
                    <td><span class="status-badge ${stBadge}">${stTxt}</span></td>
                    <td><div style="display:flex; flex-wrap:wrap; gap:4px;">${tagsHtml}</div></td>
                </tr>`;
            });

            widgetContainer.innerHTML = `
                <div class="info-card" style="border-left:5px solid var(--success);"><div class="stat-label">🟢 Kenaikan Aman</div>  <div class="big-number">${JmlAman}</div></div>
                <div class="info-card" style="border-left:5px solid var(--warning);"><div class="stat-label">🟡 Risiko Ringan</div> <div class="big-number">${JmlRingan}</div></div>
                <div class="info-card" style="border-left:5px solid var(--danger);" ><div class="stat-label">🔴 Risiko Parah</div>  <div class="big-number" style="color:var(--danger);">${JmlParah}</div></div>`;

        } else if (jenjang === "XII") {
            tHeader.innerHTML = `<tr>
                <th>No</th><th>Nama Siswa</th><th>Rerata Kumulatif</th>
                <th>Rank P. Kelas</th><th>Rank Paralel</th>
                <th>Rekomendasi Peminatan TKA</th>
                <th style="color:var(--success)">Rekomendasi Jurusan Perguruan Tinggi (PTN/PTS)</th>
            </tr>`;

            filterSiswa.forEach((siswa, index) => {
                let stat = hitungStatistikSiswa(siswa);
                let avg  = parseFloat(stat.average) || 0;
                let tka  = "Saintek Reguler (Matematika & Fisika)";
                let prodi = "Teknik Sipil, Informatika, Elektro, Sains Data, Sistem Informasi";

                if (avg >= 88) {
                    tka   = "Top Tier Stem-Saintek / Medis";
                    prodi = "Kedokteran Umum, Teknologi Informasi, Aktuaria, Biomedis, Teknik Dirgantara";
                } else if (avg < 82) {
                    tka   = "Soshum Core (Ekonomi & Bisnis)";
                    prodi = "Manajemen Akuntansi, Ilmu Hukum, Ilmu Komunikasi, Hubungan Internasional, Psikologi Soshum";
                }

                tBody.innerHTML += `<tr>
                    <td style="text-align:center;">${index + 1}</td><td><strong>${siswa[2]}</strong></td>
                    <td style="text-align:center; font-weight:700; color:var(--primary);">${stat.average}</td>
                    <td style="text-align:center; font-weight:700;">#${dapatkanPeringkatKelasSiswa(siswa[0], siswa[3])}</td>
                    <td style="text-align:center;">#${siswa[5] || '-'}</td>
                    <td><span class="plotting-tag">${tka}</span></td>
                    <td style="font-weight:700; color:var(--slate-800);"><i class="ri-graduation-cap-line" style="color:var(--success)"></i> ${prodi}</td>
                </tr>`;
            });

            widgetContainer.innerHTML = `<div class="info-card" style="grid-column:span 4; text-align:center;"><p>🎓 **Hasil Evaluasi Karir Kelas XII:** Pemetaan rasionalitas pilihan program studi SNBP/SNBT.</p></div>`;
        }

        document.getElementById('sectionHasilEvaluasi').style.display = 'block';
    }

    function eksporExcelEvaluasi() {
        const kelas = document.getElementById('evalSelectKelas').value;
        if (!kelas) return;
        const wb      = XLSX.utils.book_new();
        let tableEl   = document.querySelector("#sectionHasilEvaluasi table");
        if (!tableEl) { alert("Jalankan analisis terlebih dahulu!"); return; }
        let ws = XLSX.utils.table_to_sheet(tableEl);
        XLSX.utils.book_append_sheet(wb, ws, "Evaluasi Sistem");
        XLSX.writeFile(wb, `Analisis_Evaluasi_Kelas_${kelas}.xlsx`);
    }

    // ============================================================
    // KOREKSI NILAI
    // ============================================================
    function populateMapelDropdownKoreksi() {
        const select = document.getElementById('revMapel');
        if (select.options.length > 1) return;
        daftarMapel.forEach(m => {
            let opt      = document.createElement('option');
            opt.value    = m.kode;
            opt.innerText = m.namaLengkap;
            select.appendChild(opt);
        });
    }

    // ============================================================
    // AI HUB
    // ============================================================
    function setAiPresetPrompt(id) {
        const box = document.getElementById('txtAiPrompt');
        if (id === 1) box.value = "Buatkan draf 3 baris catatan Wali Kelas yang memotivasi untuk siswa berprestasi peringkat 1 paralel yang ingin kuliah jurusan IT.";
        if (id === 2) box.value = "Buatkan 3 butir soal standar HOTS (High Order Thinking Skills) untuk mata pelajaran Pendidikan Pancasila materi Sejarah Amandemen UUD 1945.";
        if (id === 3) box.value = "Buatkan lirik jingle lagu promosi kreatif 2 bait bertema industrialisasi produk unggulan lokal Sekolah SMAN 1 Jakarta.";
    }

    function generateAiContentKlien() {
        const prompt = document.getElementById('txtAiPrompt').value.trim();
        if (!prompt) return;
        const resBox = document.getElementById('boxAiOutputResult');
        resBox.innerText = "⏳ Sedang memproses prompt teks dengan Generative AI Engine...";
        setTimeout(() => {
            if (prompt.includes("catatan Wali Kelas")) {
                resBox.innerText = "1. \"Pertahankan prestasi gemilangmu! Teruslah mengasah logika coding-mu demi meraih impian di jurusan Teknik Informatika.\"\n2. \"Kemampuan akademikmu sangat solid. Jadikan disiplin ini modal berharga untuk menjadi ahli IT masa depan.\"\n3. \"Selamat atas capaian peringkat 1! Tetap rendah hati, kuasai matematika, dan bersiaplah menaklukkan dunia teknologi digital!\"";
            } else if (prompt.includes("HOTS")) {
                resBox.innerText = "Soal 1 (Pilihan Ganda Kompleks):\nAnalisis kedudukan konstitusi pasca-amandemen UUD 1945 terhadap stabilitas checks and balances antar lembaga tinggi negara...\n\nSoal 2 (Studi Kasus):\nDiketahui kasus sengketa kewenangan antara MK dan MA. Berdasarkan pasal 24C, rumuskan solusi hukum rasional jika terjadi benturan yurisdiksi...";
            } else {
                resBox.innerText = "[Bait 1]\nLangkah tegap penuh dengan karya\nSMAN 1 Jakarta maju bersama\nDengan inovasi produk unggulan nyata\nSiap bersaing pimpin dunia!\n\n[Bait 2]\nKreativitas lokal berdaya global\nTeknologi canggih, akhlaknya mulia\nMari bergabung bangun masa depan\nBersama kita jaya selamanya!";
            }
        }, 1200);
    }

    // ============================================================
    // LEGER SATU ANGKATAN
    // ============================================================
    function tampilkanLegerSatuAngkatan() {
        const jenjang  = document.getElementById('selectAngkatanJenjang').value;
        const sortMode = document.getElementById('selectSortModeAngkatan').value;
        const tHeader  = document.getElementById('angkatanLegerTableHeader');
        const tBody    = document.getElementById('angkatanLegerTableBody');
        if (!jenjang) return;

        let filterAngkatan = dataSiswaGlobal.filter(row => {
            let kelasSiswa = (row[3] || "").toUpperCase().trim();
            if (jenjang === "X")   return kelasSiswa.startsWith("X-")   || kelasSiswa.startsWith("X ");
            if (jenjang === "XI")  return kelasSiswa.startsWith("XI-")  || kelasSiswa.startsWith("XI ");
            if (jenjang === "XII") return kelasSiswa.startsWith("XII-") || kelasSiswa.startsWith("XII ");
            return false;
        });

        if (filterAngkatan.length === 0) {
            tBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#64748b; font-style:italic; padding:20px;">Data siswa angkatan jenjang ${jenjang} tidak ditemukan atau belum sinkron.</td></tr>`;
            return;
        }

        if      (sortMode === 'rank_paralel') filterAngkatan.sort((a, b) => (parseFloat(hitungStatistikSiswa(b).average) || 0) - (parseFloat(hitungStatistikSiswa(a).average) || 0));
        else if (sortMode === 'nama_asc')     filterAngkatan.sort((a, b) => (a[2] || "").localeCompare(b[2] || ""));
        else if (sortMode === 'kelas_asc')    filterAngkatan.sort((a, b) => (a[3] || "").localeCompare(b[3] || "") || (a[2] || "").localeCompare(b[2] || ""));

        tHeader.innerHTML = `<tr>
            <th class="freeze-col-1" style="text-align:center; width:80px;">Rank P.</th>
            <th class="freeze-col-2">Nama Lengkap Siswa</th>
            <th style="text-align:center; width:100px;">Kelas</th>
            <th style="text-align:center; width:130px;">NISN / ID</th>
            <th style="text-align:center; width:120px;">Rata-Rata Rapor</th>
            <th style="text-align:center; width:140px; color:var(--danger)">&lt; 75 (KKM)</th>
        </tr>`;

        tBody.innerHTML  = "";
        const fragment   = document.createDocumentFragment();

        filterAngkatan.forEach((siswa, index) => {
            let stat       = hitungStatistikSiswa(siswa);
            let rankParalel = (sortMode === 'rank_paralel') ? (index + 1) : (siswa[5] || "-");
            let isTop3     = index < 3 && sortMode === 'rank_paralel';
            const tr       = document.createElement('tr');
            if (isTop3) tr.className = "highlight-rank";

            tr.innerHTML = `
                <td class="freeze-col-1" style="text-align:center; font-weight:700;">#${rankParalel}</td>
                <td class="freeze-col-2"><strong>${siswa[2].toUpperCase()}</strong></td>
                <td style="text-align:center;"><span class="plotting-tag">${siswa[3]}</span></td>
                <td style="text-align:center;"><code>${siswa[0]}</code></td>
                <td style="font-weight:800; color:var(--primary); text-align:center;">${stat.average}</td>
                <td style="text-align:center;"><span class="${stat.merah > 0 ? 'text-nilai-kurang' : ''}" style="font-weight:700;">${stat.merah} Mapel</span></td>
            `;
            fragment.appendChild(tr);
        });

        tBody.appendChild(fragment);
        document.getElementById('resultAngkatanSection').style.display = 'block';
    }

    // ============================================================
    // EKSPOR EXCEL ANGKATAN
    // ============================================================
    function eksporExcelAngkatan() {
        const jenjang = document.getElementById('selectAngkatanJenjang').value;
        if (!jenjang) { alert("Silakan tentukan jenjang angkatan terlebih dahulu!"); return; }

        let filterAngkatan = dataSiswaGlobal.filter(row => {
            let kelasSiswa = (row[3] || "").toUpperCase().trim();
            if (jenjang === "X")   return kelasSiswa.startsWith("X-")   || kelasSiswa.startsWith("X ");
            if (jenjang === "XI")  return kelasSiswa.startsWith("XI-")  || kelasSiswa.startsWith("XI ");
            if (jenjang === "XII") return kelasSiswa.startsWith("XII-") || kelasSiswa.startsWith("XII ");
            return false;
        });

        filterAngkatan.sort((a, b) => (parseFloat(hitungStatistikSiswa(b).average) || 0) - (parseFloat(hitungStatistikSiswa(a).average) || 0));
        if (filterAngkatan.length === 0) { alert("Tidak ada data untuk diekspor!"); return; }

        let matrixData = [
            [`MASTER LEGER DATA COMPREHENSIVE SATU ANGKATAN JENJANG KELAS ${jenjang}`],
            [`SMAN 1 JAKARTA - TOTAL RECORD DATA: ${filterAngkatan.length} SISWA`],
            [`Waktu Unduh: ${new Date().toLocaleString('id-ID')}`],
            [],
            ["RANK\nPARALEL", "NAMA LENGKAP SISWA", "ROMBEL\nKELAS", "NOMOR NISN", "SUM\nTOTAL", "RATA-RATA\nKUMULATIF", "JUMLAH MAPEL\n< KKM"]
        ];

        let subHeaderRow = ["", "", "", "", "", "", ""];
        daftarMapel.forEach(m => {
            matrixData[4].push(m.namaLengkap);
            for (let s = 1; s <= 5; s++) { matrixData[4].push(""); }
            for (let s = 1; s <= 6; s++) { subHeaderRow.push(`S${s}`); }
        });
        matrixData.push(subHeaderRow);

        let merges = [
            { s: { r: 4, c: 0 }, e: { r: 5, c: 0 } }, { s: { r: 4, c: 1 }, e: { r: 5, c: 1 } },
            { s: { r: 4, c: 2 }, e: { r: 5, c: 2 } }, { s: { r: 4, c: 3 }, e: { r: 5, c: 3 } },
            { s: { r: 4, c: 4 }, e: { r: 5, c: 4 } }, { s: { r: 4, c: 5 }, e: { r: 5, c: 5 } },
            { s: { r: 4, c: 6 }, e: { r: 5, c: 6 } }
        ];

        let colIndexStart = 7;
        daftarMapel.forEach(() => {
            merges.push({ s: { r: 4, c: colIndexStart }, e: { r: 4, c: colIndexStart + 5 } });
            colIndexStart += 6;
        });

        filterAngkatan.forEach((siswa, idx) => {
            let stat    = hitungStatistikSiswa(siswa);
            let rowSiswa = [(idx + 1), siswa[2].toUpperCase(), siswa[3], siswa[0], parseFloat(stat.sum.toFixed(0)), parseFloat(stat.average.replace(',', '.')), parseInt(stat.merah)];
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
                    ws[cell_ref].s = { font: { bold: true, size: r === 0 ? 13 : 11, name: "Arial", color: { rgb: "0F172A" } }, alignment: { horizontal: "left" } };
                } else if (r === 4 || r === 5) {
                    ws[cell_ref].s = styleNavyHeader;
                } else if (r > 5) {
                    let rankSiswa = matrixData[r][0];
                    let isTop3    = (typeof rankSiswa === 'number' && rankSiswa <= 3);
                    let cellStyle = isTop3 ? JSON.parse(JSON.stringify(styleGoldTop3)) : JSON.parse(JSON.stringify(styleDataCenter));

                    if (c === 1)            cellStyle.alignment.horizontal = "left";
                    if (c === 4 || c === 5) cellStyle.font.bold = true;
                    if (c === 6 && ws[cell_ref].v > 0) { cellStyle.font.color = { rgb: "B91C1C" }; cellStyle.font.bold = true; }
                    ws[cell_ref].s = cellStyle;

                    if (c >= 7 && typeof ws[cell_ref].v === 'number' && ws[cell_ref].v < 75) {
                        ws[cell_ref].s.font = { color: { rgb: "991B1B" }, bold: true, name: "Arial", sz: 10 };
                        ws[cell_ref].s.fill = { fgColor: { rgb: "FEE2E2" } };
                    }
                }
            }
        }

        let colWidths = [];
        let totalKolomTabel = 7 + (daftarMapel.length * 6);
        for (let c = 0; c < totalKolomTabel; c++) {
            if      (c === 0)           colWidths.push({ wch: 14 });
            else if (c === 1)           colWidths.push({ wch: 32 });
            else if (c === 2 || c === 3) colWidths.push({ wch: 14 });
            else if (c === 4 || c === 5) colWidths.push({ wch: 14 });
            else if (c === 6)           colWidths.push({ wch: 16 });
            else                        colWidths.push({ wch: 6  });
        }
        ws['!cols'] = colWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Master Angkatan");
        XLSX.writeFile(wb, `Master_Leger_Angkatan_${jenjang}_Terformat.xlsx`);
    }

    // ============================================================
