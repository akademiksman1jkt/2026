    function updatePenguatan(nisn) {
        const bakatEl    = document.getElementById(`bakat_${nisn}`);
        const studiEl    = document.getElementById(`studi_${nisn}`);
        const targetCell = document.getElementById(`penguatan_${nisn}`);
        if (!bakatEl || !studiEl || !targetCell) return;

        const bakat = bakatEl.value;
        const studi = studiEl.value;

        // Persist to localStorage for rumpun recalculation
        localStorage.setItem('eval_bakat_'+nisn, bakat);
        localStorage.setItem('eval_studi_'+nisn, studi);

        if (!bakat || !studi) {
            targetCell.innerHTML = "<span style='color:#94a3b8; font-style:italic;'>Pilih bakat & rencana studi untuk melihat rekomendasi penguatan.</span>";
            hitungUlangKolomRek(nisn);
            perbaruiCounterPanel();
            return;
        }

        let narasiPenguatan = "";
        let ikonPenguatan   = "✅";
        let warnaNarasi     = "#0f766e";

        if (['Kedokteran','Farmasi','Keperawatan'].includes(studi)) {
            const selaras = ['Biologi','Kimia','Fisika','Matematika'].includes(bakat);
            ikonPenguatan = selaras ? "💪" : "⚠️";
            warnaNarasi   = selaras ? "#047857" : "#92400e";
            narasiPenguatan = selaras
                ? `<strong>Sangat Selaras!</strong> Penguatan di olimpiade/klub sains <em>${bakat}</em> akan memperkuat portofolio SNBP menuju <em>${studi}</em>.`
                : `<strong>Perlu Penyesuaian:</strong> Prodi <em>${studi}</em> butuh penguatan ekstra di Kimia/Biologi, meskipun berbakat di <em>${bakat}</em>.`;
        } else if (['Teknik Informatika','Sistem Informasi','Teknik Elektro','Teknik Mesin','Teknik Sipil','Arsitektur'].includes(studi)) {
            const selaras = ['Coding / Informatika','Robotika','Matematika','Desain Grafis','Fisika'].includes(bakat);
            ikonPenguatan = selaras ? "🚀" : "💡";
            warnaNarasi   = selaras ? "#1d4ed8" : "#0369a1";
            narasiPenguatan = selaras
                ? `<strong>Akselerasi Teknik:</strong> Bakat <em>${bakat}</em> sangat mendukung pilar utama prodi <em>${studi}</em>.`
                : `<strong>Saran Strategis:</strong> Kolaborasikan bakat <em>${bakat}</em> ke dalam implementasi berbasis teknik/IT.`;
        } else if (['DKV','Sastra','Ilmu Komunikasi'].includes(studi)) {
            const selaras = ['Seni','Desain Grafis','Bahasa','Musik'].includes(bakat);
            ikonPenguatan = selaras ? "🎨" : "💡";
            warnaNarasi   = "#7c3aed";
            narasiPenguatan = selaras
                ? `<strong>Kreativitas Terdukung!</strong> Bakat <em>${bakat}</em> menjadi aset utama prodi <em>${studi}</em>.`
                : `<strong>Saran:</strong> Kembangkan sensibilitas estetik dan portofolio karya untuk mendukung prodi <em>${studi}</em>.`;
        } else if (['Akuntansi','Manajemen','Ekonomi','Hukum','Psikologi','Pendidikan'].includes(studi)) {
            const selaras = ['Ekonomi','Akuntansi','Bisnis','Manajemen','Hukum','Psikologi','Bahasa'].includes(bakat);
            ikonPenguatan = selaras ? "📈" : "🎯";
            warnaNarasi   = selaras ? "#854d0e" : "#0f766e";
            narasiPenguatan = selaras
                ? `<strong>Prospek Kompetitif:</strong> Kompetensi <em>${bakat}</em> memberi landasan matang untuk jurusan <em>${studi}</em>.`
                : `<strong>Rekomendasi:</strong> Pertahankan bakat <em>${bakat}</em>, tingkatkan pendalaman literasi sesuai rumpun <em>${studi}</em>.`;
        } else {
            narasiPenguatan = `<strong>Rekomendasi Formatif:</strong> Bakat <em>${bakat}</em> menjadi nilai tambah jika diintegrasikan dengan studi <em>${studi}</em>.`;
        }

        targetCell.innerHTML = `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px; color:${warnaNarasi}; font-size:12px; line-height:1.5;">
                <span style="font-size:16px;">${ikonPenguatan}</span> ${narasiPenguatan}
                <div style="margin-top:6px; display:flex; gap:8px; flex-wrap:wrap;">
                    <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700;">🎯 ${bakat}</span>
                    <span style="background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700;">🎓 ${studi}</span>
                </div>
            </div>`;

        hitungUlangKolomRek(nisn);
        perbaruiCounterPanel();
    }

    function hitungUlangKolomRek(nisn) {
        const rekCell = document.getElementById('rek_'+nisn);
        if (!rekCell) return;
        let siswaRow = dataSiswaGlobal.find(r => r[0] === nisn);
        if (!siswaRow) return;

        let totalSains=0, cSains=0, totalSos=0, cSos=0;
        daftarMapel.forEach((m, mIdx) => {
            let s1 = parseFloat(siswaRow[6+(mIdx*6)]) || 0;
            let s2 = parseFloat(siswaRow[6+(mIdx*6)+1]) || 0;
            let rM = (s1+s2) / ((s1>0?1:0)+(s2>0?1:0)||1);
            if (rM>0) {
                if (['AGM','PCSL','BIN','BING','PJOK','SB','PKWU','MULOK','MUH'].includes(m.kode)) { totalSains+=rM; cSains++; totalSos+=rM; cSos++; }
                else if (['MATUM','IPA','BIO','KIM','FIS','MTL','INF'].includes(m.kode)) { totalSains+=rM; cSains++; }
                else { totalSos+=rM; cSos++; }
            }
        });
        let finalSains = totalSains/(cSains||1), finalSos = totalSos/(cSos||1);
        let storedBakat = localStorage.getItem('eval_bakat_'+nisn)||"";
        let storedStudi = localStorage.getItem('eval_studi_'+nisn)||"";
        let sainsBakat  = ['Coding / Informatika','Robotika','Matematika','Fisika','Kimia','Biologi'].includes(storedBakat);
        let soshumBakat = ['Ekonomi','Akuntansi','Bisnis','Manajemen','Hukum','Psikologi','Bahasa','Seni','Desain Grafis','Musik','Olahraga'].includes(storedBakat);
        let sainsStudi  = ['Teknik Informatika','Sistem Informasi','Teknik Elektro','Teknik Mesin','Teknik Sipil','Arsitektur','Kedokteran','Farmasi','Keperawatan'].includes(storedStudi);
        let soshumStudi = ['Akuntansi','Manajemen','Ekonomi','Hukum','Psikologi','Ilmu Komunikasi','Pendidikan','Sastra','DKV'].includes(storedStudi);
        let finalSainsAdj = finalSains+(sainsBakat?3:0)+(sainsStudi?2:0)-(soshumBakat?1:0);
        let finalSosAdj   = finalSos+(soshumBakat?3:0)+(soshumStudi?2:0)-(sainsBakat?1:0);
        let rek      = finalSainsAdj>=finalSosAdj ? "Rumpun MIPA / Teknik Terapan" : "Rumpun IPS / Sosio-Humaniora";
        let warnaRek = finalSainsAdj>=finalSosAdj ? "#1d4ed8" : "#b45309";
        let infl     = (storedBakat||storedStudi) ? '<br><span style="font-size:10px;color:#64748b;font-style:italic;">*Disesuaikan bakat/studi</span>' : "";
        rekCell.style.color      = warnaRek;
        rekCell.style.fontWeight = "700";
        rekCell.innerHTML = '<i class="ri-checkbox-circle-fill"></i> '+rek+infl;
    }

    function perbaruiCounterPanel() {
        let cSains=0, cSoshum=0, cSelaras=0;
        document.querySelectorAll('[id^="bakat_"]').forEach(el => {
            const nisn  = el.id.replace('bakat_','');
            const bakat = el.value;
            const studi = (document.getElementById('studi_'+nisn)||{}).value||"";
            if (!bakat) return;
            const sains  = ['Coding / Informatika','Robotika','Matematika','Fisika','Kimia','Biologi'].includes(bakat);
            if (sains) cSains++; else cSoshum++;
            const sainsStudi = ['Teknik Informatika','Sistem Informasi','Teknik Elektro','Teknik Mesin','Teknik Sipil','Arsitektur','Kedokteran','Farmasi','Keperawatan'].includes(studi);
            const sosStudi   = ['Akuntansi','Manajemen','Ekonomi','Hukum','Psikologi','Ilmu Komunikasi','Pendidikan','Sastra','DKV'].includes(studi);
            if ((sains&&sainsStudi)||(!sains&&sosStudi)) cSelaras++;
        });
        const elS=document.getElementById('evalCountSains');
        const elO=document.getElementById('evalCountSoshum');
        const elL=document.getElementById('evalCountSelaras');
        if(elS) elS.textContent=cSains;
        if(elO) elO.textContent=cSoshum;
        if(elL) elL.textContent=cSelaras;
    }

    // ============================================================
    // ERAPOR — TAB SWITCHER
    // ============================================================
    function switchTabErapor(tabId) {
        let isAdmin = (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');
        // Guard: non-admin cannot access admin-only tabs
        if (!isAdmin && (tabId === 'kelolaKolom' || tabId === 'importExcel')) {
            alert('Fitur ini hanya tersedia untuk Admin. Hubungi admin sekolah untuk keperluan konfigurasi kolom atau import massal.');
            return;
        }
        ['inputNilai','kelolaKolom','importExcel','raporLeger'].forEach(id => {
            const sec = document.getElementById('epSection_'+id);
            const btn = document.getElementById('epTabBtn_'+id);
            if (sec) sec.style.display = (id===tabId)?'block':'none';
            if (btn) {
                btn.style.background = (id===tabId)?'#1e293b':'var(--slate-100)';
                btn.style.color      = (id===tabId)?'white':'var(--slate-600)';
            }
        });
        if (tabId==='kelolaKolom') renderDaftarKolom();
        if (tabId==='raporLeger') {
            if (isAdmin) { syncDropdownRaporLeger(); updateReleaseDaftarUI(); }
            else { syncDropdownLegerGuru(); }
        }
        if (tabId==='importExcel') syncDropdownImportErapor();
    }

    // ============================================================
    // ERAPOR — KOLOM KONFIGURASI (localStorage)
    // ============================================================
    const DEFAULT_KOLOM_ERAPOR = [
        {id:'harian',nama:'Nilai Harian',bobot:25},
        {id:'tugas', nama:'Nilai Tugas', bobot:25},
        {id:'uts',   nama:'Nilai UTS',   bobot:25},
        {id:'uas',   nama:'Nilai UAS',   bobot:25},
    ];

    function getKolomErapor() {
        let saved = localStorage.getItem('erapor_kolom_config');
        if (saved) { try { return JSON.parse(saved); } catch(e) {} }
        return DEFAULT_KOLOM_ERAPOR.slice();
    }
    function setKolomErapor(kolom) { localStorage.setItem('erapor_kolom_config', JSON.stringify(kolom)); }

    function renderDaftarKolom() {
        const kolom = getKolomErapor();
        const el = document.getElementById('daftarKolomErapor');
        if (!el) return;
        el.innerHTML = '';
        kolom.forEach((k, idx) => {
            el.innerHTML += '<div style="background:white;border:1px solid var(--slate-200);border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:12px;min-width:180px;">'
                + '<div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#1e293b;">' + k.nama + '</div>'
                + '<div style="font-size:11px;color:#64748b;margin-top:2px;">Bobot: <strong>' + k.bobot + '%</strong></div></div>'
                + '<button onclick="hapusKolomNilai(' + idx + ')" style="background:#fee2e2;color:#dc2626;border:none;border-radius:6px;padding:5px 9px;cursor:pointer;font-size:12px;" title="Hapus kolom">'
                + '<i class="ri-delete-bin-line"></i></button></div>';
        });
        let totalBobot = kolom.reduce((s,k)=>s+(k.bobot||0),0);
        let statusBg  = totalBobot===100?'#f0fdf4':'#fef2f2';
        let statusBdr = totalBobot===100?'#bbf7d0':'#fecaca';
        let statusClr = totalBobot===100?'#059669':'#dc2626';
        let statusTxt = totalBobot===100?'✓ Total Pas':'⚠ Harus 100%';
        el.innerHTML += '<div style="background:'+statusBg+';border:1px solid '+statusBdr+';border-radius:8px;padding:12px 14px;display:flex;align-items:center;gap:8px;">'
            + '<span style="font-size:14px;font-weight:900;color:'+statusClr+';">'+totalBobot+'%</span>'
            + '<span style="font-size:11px;color:'+statusClr+';">'+statusTxt+'</span></div>';
    }

    function tambahKolomNilai() {
        const nama  = (document.getElementById('inputNamaKolomBaru')?.value||'').trim();
        const bobot = parseInt(document.getElementById('inputBobotKolomBaru')?.value||'0');
        if (!nama)  { alert('Nama kolom tidak boleh kosong!'); return; }
        if (!bobot||bobot<1||bobot>100) { alert('Bobot harus antara 1-100!'); return; }
        let kolom = getKolomErapor();
        let total = kolom.reduce((s,k)=>s+k.bobot,0);
        if (total+bobot>100) { alert('Total bobot akan melebihi 100%. Kurangi bobot kolom lain terlebih dahulu.'); return; }
        kolom.push({id:'custom_'+Date.now(),nama,bobot});
        setKolomErapor(kolom);
        document.getElementById('inputNamaKolomBaru').value='';
        document.getElementById('inputBobotKolomBaru').value='';
        renderDaftarKolom();
    }

    function hapusKolomNilai(idx) {
        let kolom = getKolomErapor();
        if (kolom.length<=1) { alert('Minimal harus ada 1 kolom!'); return; }
        kolom.splice(idx,1);
        setKolomErapor(kolom);
        renderDaftarKolom();
    }

    function resetKolomKeDefault() {
        if (!confirm('Reset ke konfigurasi default? (Harian 25%, Tugas 25%, UTS 25%, UAS 25%)')) return;
        setKolomErapor(DEFAULT_KOLOM_ERAPOR.slice());
        renderDaftarKolom();
    }

    function simpanKonfigurasiKolom() {
        let kolom = getKolomErapor();
        let total = kolom.reduce((s,k)=>s+k.bobot,0);
        if (total!==100) { alert('Total bobot harus tepat 100% sebelum disimpan! Saat ini: '+total+'%'); return; }
        alert('Konfigurasi kolom berhasil disimpan! Buka tab "Input Nilai" untuk mulai mengisi data.');
        switchTabErapor('inputNilai');
    }

    // ============================================================
    // ERAPOR — LEMBAR KERJA FLEKSIBEL
    // ============================================================
    function muatLembarKerjaErapor() {
        const kelas    = document.getElementById('epSelectKelas')?.value;
        const mapel    = document.getElementById('epSelectMapel')?.value;
        const smt      = parseInt(document.getElementById('epSelectSemester')?.value||'1');
        if (!kelas||!mapel) { alert('Pilih kelas dan mata pelajaran terlebih dahulu!'); return; }

        const kolom     = getKolomErapor();
        const mapelInfo = daftarMapel.find(m=>m.kode===mapel);
        const mapelIdx  = daftarMapel.indexOf(mapelInfo);
        if (!mapelInfo) { alert('Mata pelajaran tidak ditemukan!'); return; }

        // Rebuild header
        const headerRow = document.getElementById('headerEraporKolom');
        if (headerRow) {
            let hHtml = '<th style="width:60px;text-align:center;">No</th><th>Identitas</th><th>Nama Lengkap</th>';
            kolom.forEach(k => { hHtml += '<th>'+k.nama+' <small style="color:#94a3b8;font-weight:400;">('+k.bobot+'%)</small></th>'; });
            hHtml += '<th style="background-color:var(--primary-light);color:var(--primary);">Akhir Rapor</th>';
            headerRow.innerHTML = hHtml;
        }

        const label = document.getElementById('labelMetodeHitung');
        if (label) {
            let bobotTxt = kolom.map(k=>k.nama+' '+k.bobot+'%').join(' + ');
            label.innerHTML = '<strong>Metode:</strong> Rata-rata berbobot | '+bobotTxt+' = <strong>Nilai Akhir Rapor</strong>.';
        }

        const tBody = document.getElementById('tableBodyErapor');
        if (!tBody) return;
        tBody.innerHTML = '';

        const fSiswa = dataSiswaGlobal.filter(r=>r[3]===kelas);
        if (fSiswa.length===0) { alert('Tidak ada siswa di kelas ini.'); return; }

        fSiswa.forEach((siswa, i) => {
            let savedNilai = {};
            try { savedNilai = JSON.parse(localStorage.getItem('ep_draft_'+mapel+'_'+kelas+'_'+smt+'_'+siswa[0])||'{}'); } catch(e) {}
            let cloudVal = parseFloat(siswa[6+(mapelIdx*6)+(smt-1)])||0;

            let kolomInputs = '';
            kolom.forEach(k => {
                let savedVal = savedNilai[k.id]!==undefined ? savedNilai[k.id] : '';
                kolomInputs += '<td><input type="number" id="ep_'+k.id+'_'+siswa[0]+'" value="'+savedVal
                    +'" min="0" max="100" step="0.5" style="width:80px;padding:5px;border:1px solid var(--slate-200);border-radius:4px;text-align:center;"'
                    +' oninput="hitungNilaiAkhirErapor(\''+siswa[0]+'\')"></td>';
            });

            let nilaiAkhirDisplay = cloudVal>0 ? cloudVal.toFixed(1) : '-';
            tBody.innerHTML += '<tr>'
                + '<td style="text-align:center;font-weight:700;">'+(i+1)+'</td>'
                + '<td><code>'+siswa[0]+'</code></td>'
                + '<td><strong>'+siswa[2]+'</strong></td>'
                + kolomInputs
                + '<td style="text-align:center;font-weight:800;color:var(--primary);" id="ep_akhir_'+siswa[0]+'">'+nilaiAkhirDisplay+'</td>'
                + '</tr>';
        });

        const sectionEl = document.getElementById('sectionLembarKerjaErapor');
        if (sectionEl) { sectionEl.style.display='block'; sectionEl.scrollIntoView({behavior:'smooth',block:'start'}); }
    }

    function hitungNilaiAkhirErapor(nisn) {
        const kolom = getKolomErapor();
        let total=0, totalBobot=0;
        kolom.forEach(k => {
            const val = parseFloat(document.getElementById('ep_'+k.id+'_'+nisn)?.value||'');
            if (!isNaN(val)) { total+=val*(k.bobot/100); totalBobot+=k.bobot; }
        });
        const akhirEl = document.getElementById('ep_akhir_'+nisn);
        if (akhirEl) {
            if (totalBobot>0) {
                let akhir = totalBobot<100?(total/totalBobot)*100:total;
                akhirEl.textContent = akhir.toFixed(1);
                akhirEl.style.color = akhir<75?'var(--danger)':'var(--primary)';
            } else { akhirEl.textContent='-'; }
        }
    }

    function simpanKomponenNilaiCloud() {
        const kelas    = document.getElementById('epSelectKelas')?.value;
        const mapel    = document.getElementById('epSelectMapel')?.value;
        const smt      = parseInt(document.getElementById('epSelectSemester')?.value||'1');
        if (!kelas||!mapel) { alert('Pilih kelas dan mata pelajaran terlebih dahulu!'); return; }

        const kolom     = getKolomErapor();
        const fSiswa    = dataSiswaGlobal.filter(r=>r[3]===kelas);
        const mapelInfo = daftarMapel.find(m=>m.kode===mapel);
        const mapelIdx  = daftarMapel.indexOf(mapelInfo);
        let saved=0;

        fSiswa.forEach(siswa => {
            let draftObj={};
            kolom.forEach(k => {
                const val=(document.getElementById('ep_'+k.id+'_'+siswa[0])?.value||'').trim();
                if (val!=='') draftObj[k.id]=parseFloat(val)||0;
            });
            if (Object.keys(draftObj).length>0) {
                localStorage.setItem('ep_draft_'+mapel+'_'+kelas+'_'+smt+'_'+siswa[0], JSON.stringify(draftObj));
                saved++;
            }
            let total=0, totalBobot=0;
            kolom.forEach(k => {
                const v=draftObj[k.id];
                if (v!==undefined&&!isNaN(v)) { total+=v*(k.bobot/100); totalBobot+=k.bobot; }
            });
            if (totalBobot>0&&mapelIdx>=0) {
                let finalVal = totalBobot<100?(total/totalBobot)*100:total;
                const targetIdx = 6+(mapelIdx*6)+(smt-1);
                while(siswa.length<=targetIdx) siswa.push('-');
                siswa[targetIdx]=finalVal.toFixed(1);
            }
        });

        if (typeof URL_GOOGLE_APPS_SCRIPT!=='undefined') {
            document.getElementById('loading').style.display='block';
            const guruUsername = (typeof sessionUserAktif !== 'undefined' && sessionUserAktif) ? sessionUserAktif.username : 'Unknown';
            const mapelNama    = mapelInfo ? (mapelInfo.namaLengkap || mapelInfo.kode) : mapel;
            const legerData    = fSiswa.map(s => {
                let rowData = { nisn: s[0], nama: s[2] };
                kolom.forEach(k => {
                    rowData[k.nama] = (document.getElementById('ep_'+k.id+'_'+s[0])?.value || '').trim();
                });
                rowData['Nilai Akhir Rapor'] = document.getElementById('ep_akhir_'+s[0])?.textContent || '-';
                return rowData;
            });
            fetch(URL_GOOGLE_APPS_SCRIPT, {
                method: 'POST',
                body: JSON.stringify({
                    aksi:      'simpanLegerNilai',
                    guru:      guruUsername,
                    kelas,
                    mapel,
                    mapelNama,
                    semester:  smt,
                    kolom:     kolom.map(k => k.nama),
                    data:      legerData
                })
            })
            .catch(e => console.error(e))
            .finally(() => { document.getElementById('loading').style.display='none'; });
        }
        alert('Berhasil menyimpan nilai '+saved+' siswa ke draft lokal & cloud. Data ter-update di sistem!');
    }

    // ============================================================
    // ERAPOR — TEMPLATE EXPORT
    // ============================================================
    function eksporTemplateErapor() {
        const kelas = document.getElementById('epSelectKelas')?.value||'KELAS';
        const mapel = document.getElementById('epSelectMapel')?.value||'MAPEL';
        const smt   = document.getElementById('epSelectSemester')?.value||'1';
        const kolom = getKolomErapor();
        const fSiswa = (kelas&&kelas!=='')?dataSiswaGlobal.filter(r=>r[3]===kelas):dataSiswaGlobal.slice(0,5);
        const header = ['NISN','Nama Lengkap'].concat(kolom.map(k=>k.nama));
        const rows   = fSiswa.map(s=>[s[0],s[2]].concat(kolom.map(()=>'')));
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet([header].concat(rows));
        ws['!cols'] = [{wch:14},{wch:30}].concat(kolom.map(()=>({wch:14})));
        XLSX.utils.book_append_sheet(wb,ws,'Template_Nilai');
        XLSX.writeFile(wb,'Template_Nilai_'+kelas+'_'+mapel+'_S'+smt+'.xlsx');
    }

    function unduhTemplateImportErapor() { eksporTemplateErapor(); }

    function syncDropdownImportErapor() {
        const skEl = document.getElementById('epImportSelectKelas');
        const smEl = document.getElementById('epImportSelectMapel');
        if (!skEl||!smEl) return;
        skEl.innerHTML = '<option value="">-- Pilih Kelas --</option>';
        smEl.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>';
        [...new Set(dataSiswaGlobal.map(r=>r[3]))].filter(k=>k).sort().forEach(k=>{
            skEl.innerHTML += '<option value="'+k+'">'+k+'</option>';
        });
        daftarMapel.forEach(m=>{ smEl.innerHTML += '<option value="'+m.kode+'">'+m.namaLengkap+'</option>'; });
    }

    // ============================================================
    // ERAPOR — IMPORT EXCEL NILAI
    // ============================================================
    var dataImportBuffer = null;

    function prosesImportNilaiExcel() {
        const kelas  = document.getElementById('epImportSelectKelas')?.value;
        const mapel  = document.getElementById('epImportSelectMapel')?.value;
        const smt    = parseInt(document.getElementById('epImportSelectSemester')?.value||'1');
        const file   = document.getElementById('importFileErapor')?.files?.[0];
        if (!kelas||!mapel) { alert('Pilih kelas dan mata pelajaran target terlebih dahulu!'); return; }
        if (!file)           { alert('Pilih file Excel (.xlsx) terlebih dahulu!'); return; }

        const kolom  = getKolomErapor();
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const wb   = XLSX.read(e.target.result, {type:'array'});
                const ws   = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(ws, {header:1});
                if (rows.length<2) { alert('File tidak memiliki data (minimal 2 baris).'); return; }

                const fSiswa   = dataSiswaGlobal.filter(r=>r[3]===kelas);
                const matched  = [], notFound = [];

                rows.slice(1).forEach(row => {
                    if (!row||!row[0]) return;
                    const nisnRow = String(row[0]).trim();
                    const siswa   = fSiswa.find(s=>String(s[0]).trim()===nisnRow);
                    if (!siswa) { notFound.push(nisnRow); return; }
                    let nilaiKolom = {};
                    kolom.forEach((k,idx) => { let v=parseFloat(row[2+idx]); if(!isNaN(v)) nilaiKolom[k.id]=v; });
                    let total=0, bobot=0;
                    kolom.forEach(k => { if(nilaiKolom[k.id]!==undefined){total+=nilaiKolom[k.id]*(k.bobot/100);bobot+=k.bobot;} });
                    let akhir = bobot>0?(bobot<100?(total/bobot)*100:total):0;
                    matched.push({nisn:nisnRow, nama:siswa[2], nilaiKolom, akhir:akhir.toFixed(1)});
                });

                dataImportBuffer = {kelas,mapel,smt,matched,kolom};

                const hdr = document.getElementById('headerPreviewImport');
                const bdy = document.getElementById('bodyPreviewImport');
                if (hdr) {
                    hdr.innerHTML = '<th>NISN</th><th>Nama</th>'
                        + kolom.map(k=>'<th>'+k.nama+'</th>').join('')
                        + '<th>Akhir Rapor</th>';
                }
                if (bdy) {
                    bdy.innerHTML = matched.map(m => {
                        let warna = parseFloat(m.akhir)<75?'var(--danger)':'var(--primary)';
                        let kolomCells = kolom.map(k=>{
                            let val = m.nilaiKolom[k.id]!==undefined ? m.nilaiKolom[k.id] : '<span style="color:#94a3b8">-</span>';
                            return '<td style="text-align:center;">'+val+'</td>';
                        }).join('');
                        return '<tr><td><code>'+m.nisn+'</code></td><td><strong>'+m.nama+'</strong></td>'
                            + kolomCells
                            + '<td style="text-align:center;font-weight:800;color:'+warna+';">'+m.akhir+'</td></tr>';
                    }).join('');
                }

                const lbl = document.getElementById('labelHasilImport');
                if (lbl) {
                    let notFoundTxt = notFound.length>0
                        ? ' <span style="color:#dc2626;">'+notFound.length+' NISN tidak ditemukan: '+notFound.slice(0,5).join(', ')+(notFound.length>5?'...':'')+'</span>'
                        : '';
                    lbl.innerHTML = 'Import berhasil membaca <strong>'+matched.length+' siswa</strong>.'+notFoundTxt;
                    lbl.style.background = matched.length>0?'#f0fdf4':'#fef2f2';
                }
                const hasilEl = document.getElementById('hasilImportErapor');
                if (hasilEl) hasilEl.style.display='block';

            } catch(err) {
                console.error(err);
                alert('Gagal membaca file Excel. Gunakan tombol "Template" untuk mendapatkan format yang benar.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function konfirmasiImportNilai() {
        if (!dataImportBuffer) { alert('Tidak ada data import untuk dikonfirmasi.'); return; }
        const {kelas,mapel,smt,matched,kolom} = dataImportBuffer;
        const mapelInfo = daftarMapel.find(m=>m.kode===mapel);
        const mapelIdx  = daftarMapel.indexOf(mapelInfo);
        matched.forEach(m => {
            let siswa = dataSiswaGlobal.find(s=>s[0]===m.nisn);
            if (!siswa||mapelIdx<0) return;
            localStorage.setItem('ep_draft_'+mapel+'_'+kelas+'_'+smt+'_'+m.nisn, JSON.stringify(m.nilaiKolom));
            const targetIdx = 6+(mapelIdx*6)+(smt-1);
            while(siswa.length<=targetIdx) siswa.push('-');
            siswa[targetIdx] = m.akhir;
        });
        alert(matched.length+' data nilai berhasil dikonfirmasi dan disimpan ke sistem!');
        dataImportBuffer = null;
        document.getElementById('hasilImportErapor').style.display='none';
        document.getElementById('importFileErapor').value='';
    }

    // ============================================================
    // ERAPOR — RAPOR & LEGER GENERATOR
    // ============================================================
    function syncDropdownRaporLeger() {
        const el = document.getElementById('rlSelectKelas');
        if (!el) return;
        el.innerHTML = '<option value="">-- Pilih Kelas --</option>';
        [...new Set(dataSiswaGlobal.map(r=>r[3]))].filter(k=>k).sort().forEach(k=>{
            el.innerHTML += '<option value="'+k+'">'+k+'</option>';
        });
        updateReleaseDaftarUI();
    }

    function generateRaporLeger() {
        const kelas = document.getElementById('rlSelectKelas')?.value;
        const smt   = parseInt(document.getElementById('rlSelectSemester')?.value||'1');
        if (!kelas) { alert('Pilih kelas terlebih dahulu!'); return; }

        const fSiswa = dataSiswaGlobal.filter(r=>r[3]===kelas).sort((a,b)=>(a[2]||'').localeCompare(b[2]||''));
        if (fSiswa.length===0) { alert('Tidak ada siswa di kelas ini.'); return; }

        let rankData = fSiswa.map(siswa=>{
            let sum=0,cnt=0;
            daftarMapel.forEach((m,mIdx)=>{ let v=parseFloat(siswa[6+mIdx*6+(smt-1)])||0; if(v>0){sum+=v;cnt++;} });
            return {siswa, avg:cnt>0?sum/cnt:0};
        }).sort((a,b)=>b.avg-a.avg);

        let headerCols = daftarMapel.map(m=>
            '<th style="writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;height:100px;font-size:11px;text-align:center;padding:4px 6px;background:#1e293b;color:white;">'+m.namaLengkap+'</th>'
        ).join('');

        let bodyRows = rankData.map((item,rankIdx) => {
            const siswa = item.siswa;
            let mapelCols = daftarMapel.map((m,mIdx) => {
                let v=parseFloat(siswa[6+mIdx*6+(smt-1)])||0;
                let txt = v>0?v.toFixed(0):'-';
                let style = v>0&&v<75?'color:#dc2626;font-weight:700;background:#fee2e2;':'';
                return '<td style="text-align:center;font-size:12px;'+style+'">'+txt+'</td>';
            }).join('');
            let avg = item.avg;
            return '<tr>'
                + '<td style="text-align:center;font-weight:700;">'+(rankIdx+1)+'</td>'
                + '<td style="font-weight:700;">'+siswa[2].toUpperCase()+'</td>'
                + '<td style="text-align:center;font-size:11px;"><code>'+siswa[0]+'</code></td>'
                + mapelCols
                + '<td style="text-align:center;font-weight:800;color:var(--primary);">'+(avg>0?avg.toFixed(1):'-')+'</td>'
                + '<td style="text-align:center;font-weight:700;">#'+(rankIdx+1)+'</td>'
                + '</tr>';
        }).join('');

        let raporCards = fSiswa.map(siswa => {
            let inf  = hitungStatistikSiswa(siswa);
            let rank = rankData.findIndex(r=>r.siswa[0]===siswa[0])+1;
            let avg  = rankData.find(r=>r.siswa[0]===siswa[0])?.avg||0;
            let bgCard     = inf.merah>0?'#fef2f2':'#f0fdf4';
            let bdrCard    = inf.merah>0?'#fecaca':'#bbf7d0';
            let clrMerah   = inf.merah>0?'#dc2626':'#059669';
            return '<div style="background:white;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.05);">'
                + '<div style="background:#1e293b;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">'
                + '<div style="font-size:12px;font-weight:800;color:white;">'+siswa[2].toUpperCase()+'</div>'
                + '<span style="background:var(--primary);color:white;padding:2px 8px;border-radius:8px;font-size:11px;font-weight:700;">#'+rank+'</span>'
                + '</div><div style="padding:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">'
                + '<div style="text-align:center;background:#f8fafc;border-radius:6px;padding:8px;">'
                + '<div style="font-size:11px;color:#64748b;font-weight:600;">Rata-rata Sem.'+smt+'</div>'
                + '<div style="font-size:18px;font-weight:900;color:var(--primary);">'+(avg>0?avg.toFixed(1):'-')+'</div></div>'
                + '<div style="text-align:center;background:'+bgCard+';border:1px solid '+bdrCard+';border-radius:6px;padding:8px;">'
                + '<div style="font-size:11px;color:'+clrMerah+';font-weight:600;">Mapel &lt; KKM</div>'
                + '<div style="font-size:18px;font-weight:900;color:'+clrMerah+';">'+inf.merah+'</div></div></div>'
                + '<div style="padding:0 12px 12px 12px;font-size:11px;color:#64748b;">NISN: <code>'+siswa[0]+'</code> | Kelas: <strong>'+siswa[3]+'</strong></div>'
                + '</div>';
        }).join('');

        const hasilEl = document.getElementById('hasilRaporLeger');
        if (!hasilEl) return;

        let tglGenerate = new Date().toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'});

        hasilEl.innerHTML =
            '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">'
            + '<div><div style="font-size:14px;font-weight:800;color:#1e293b;">LEGER KELAS '+kelas+' \u2014 SEMESTER '+smt+'</div>'
            + '<div style="font-size:12px;color:#64748b;margin-top:2px;">Total: '+fSiswa.length+' Siswa | '+daftarMapel.length+' Mata Pelajaran</div></div>'
            + '<span style="background:#dbeafe;color:#1d4ed8;padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;">'+tglGenerate+'</span></div>'
            + '<div class="table-responsive" style="max-height:500px;overflow:auto;"><table style="font-size:12px;"><thead><tr>'
            + '<th style="width:50px;text-align:center;">Rank</th><th style="min-width:180px;">Nama Siswa</th><th style="min-width:120px;">NISN</th>'
            + headerCols
            + '<th style="background:var(--primary-light);color:var(--primary);text-align:center;min-width:70px;">Rata-rata</th>'
            + '<th style="text-align:center;min-width:60px;">Peringkat</th>'
            + '</tr></thead><tbody>'+bodyRows+'</tbody></table></div>'
            + '<div style="margin-top:24px;">'
            + '<h4 style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:16px;display:flex;align-items:center;gap:8px;">'
            + '<i class="ri-file-text-line" style="color:var(--primary);"></i> Ringkasan Rapor Individual</h4>'
            + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">'
            + raporCards + '</div></div>';

        document.getElementById('btnEksporLeger').style.display='inline-flex';
        document.getElementById('btnCetakRapor').style.display='inline-flex';
        let btnRI = document.getElementById('btnCetakRaporIndividu');
        if (btnRI) btnRI.style.display='inline-flex';
        hasilEl.scrollIntoView({behavior:'smooth',block:'start'});
    }


    // ============================================================
    // ERAPOR — ROLE-BASED TAB VISIBILITY
    // ============================================================
    function updateTabVisibilityErapor() {
        let isAdmin = (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');

        // Show/hide admin-only tab buttons
        document.querySelectorAll('.ep-tab-admin-only').forEach(btn => {
            btn.style.display = isAdmin ? 'inline-flex' : 'none';
        });

        // Update raporLeger tab label
        let rlLabel = document.getElementById('epTabLabelRaporLeger');
        if (rlLabel) rlLabel.textContent = isAdmin ? 'Rapor & Leger' : 'Lihat Leger';

        // Show/hide sub-sections in raporLeger
        let rlAdmin = document.getElementById('rlAdminSection');
        let rlGuru  = document.getElementById('rlGuruSection');
        if (rlAdmin) rlAdmin.style.display = isAdmin ? 'block' : 'none';
        if (rlGuru)  rlGuru.style.display  = isAdmin ? 'none' : 'block';

        // Update header description
        let desc = document.getElementById('epHeaderDesc');
        if (desc) {
            desc.textContent = isAdmin
                ? 'Kelola kolom nilai, import Excel massal, generate rapor/leger, dan release data ke guru.'
                : 'Input nilai mata pelajaran Anda sesuai penugasan, unduh template, dan simpan ke cloud. Leger tersedia jika sudah di-release oleh admin.';
        }

        // ── SINKRONISASI DROPDOWN ANGKATAN VOTING ──
        const elVoteAngkatan = document.getElementById('voteSelectAngkatan');
        if (elVoteAngkatan) {
            let isAdminActive = (typeof sessionUserAktif !== "undefined" && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');
            elVoteAngkatan.style.display = isAdminActive ? 'inline-block' : 'none';
        }
    } // <--- Batas akhir fungsi hanya butuh satu penutup di sini

    // ============================================================
    // ERAPOR — RELEASE LEGER KE GURU (Admin Feature)
    // ============================================================
    function releaseAtauKunciLeger() {
        let kelas = document.getElementById('rlSelectKelas')?.value;
        let smt   = document.getElementById('rlSelectSemester')?.value || '1';
        if (!kelas) { alert('Pilih kelas terlebih dahulu!'); return; }
        let key       = 'leger_released_'+kelas+'_'+smt;
        let isReleased = localStorage.getItem(key) === 'true';
        let newState   = !isReleased;
        localStorage.setItem(key, newState ? 'true' : 'false');
        if (newState) {
            localStorage.setItem(key+'_at', new Date().toLocaleString('id-ID'));
            localStorage.setItem(key+'_by', sessionUserAktif?.username || 'Admin');
        }
        updateReleaseDaftarUI();
        let btn = document.getElementById('btnReleaseLeger');
        if (btn) {
            btn.style.background = newState ? '#059669' : '#0284c7';
        }
        alert(newState
            ? '✅ Leger kelas '+kelas+' Semester '+smt+' berhasil di-release ke seluruh guru!'
            : '🔒 Akses leger kelas '+kelas+' Semester '+smt+' telah dikunci kembali dari guru.');
    }

    function updateReleaseDaftarUI() {
        let kelas = document.getElementById('rlSelectKelas')?.value;
        let smt   = document.getElementById('rlSelectSemester')?.value || '1';

        // Update current release status button
        let btnRel = document.getElementById('btnReleaseLeger');
        let lblRel = document.getElementById('lblReleaseLeger');
        let statRel = document.getElementById('statusReleaseLeger');
        if (kelas && btnRel) {
            let isReleased = localStorage.getItem('leger_released_'+kelas+'_'+smt) === 'true';
            let relAt = localStorage.getItem('leger_released_'+kelas+'_'+smt+'_at') || '';
            btnRel.style.background = isReleased ? '#059669' : '#0284c7';
            if (lblRel) lblRel.textContent = isReleased ? '🔒 Kunci Kembali' : '📤 Release Leger ke Guru';
            if (statRel) statRel.innerHTML = isReleased
                ? '<span style="color:#059669; font-weight:700;"><i class="ri-checkbox-circle-fill"></i> Aktif sejak '+relAt+'</span>'
                : '<span style="color:#64748b;">Belum di-release</span>';
        }

        // Show all released legers
        let daftarEl = document.getElementById('daftarReleaseAktif');
        if (!daftarEl) return;
        let released = [];
        for (let i=0; i<localStorage.length; i++) {
            let k = localStorage.key(i);
            if (k && k.startsWith('leger_released_') && !k.endsWith('_at') && !k.endsWith('_by') && localStorage.getItem(k)==='true') {
                let parts = k.replace('leger_released_','').split('_');
                let smtNum = parts.pop();
                let kelasName = parts.join('_');
                released.push({kelas:kelasName, smt:smtNum});
            }
        }
        daftarEl.innerHTML = released.length > 0
            ? '<div style="font-size:11px;color:#64748b;margin-bottom:6px;font-weight:600;">LEGER AKTIF UNTUK GURU:</div>'
              + released.map(r=>'<span style="background:#dcfce7;color:#166534;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700; display:inline-flex; align-items:center; gap:6px;">'
                + '<i class="ri-checkbox-circle-fill"></i> '+r.kelas+' Sem.'+r.smt
                + '<button onclick="cabutReleaseLeger(this)" data-kelas="'+r.kelas+'" data-smt="'+r.smt+'" style="background:none;border:none;cursor:pointer;color:#dc2626;font-size:12px;padding:0 0 0 4px;" title="Cabut release"><i class="ri-close-circle-line"></i></button>'
                + '</span>').join('')
            : '<span style="font-size:11px;color:#94a3b8;font-style:italic;">Belum ada leger yang di-release</span>';
    }

    // ============================================================
    function cabutReleaseLeger(btn) {
        var kelas = btn.dataset.kelas;
        var smt   = btn.dataset.smt;
        localStorage.setItem('leger_released_' + kelas + '_' + smt, 'false');
        updateReleaseDaftarUI();
    }

    // ERAPOR — LIHAT LEGER (Guru view — read-only if released)
    // ============================================================
    function syncDropdownLegerGuru() {
        let el = document.getElementById('rlGuruSelectKelas');
        if (!el) return;
        el.innerHTML = '<option value="">-- Pilih Kelas --</option>';
        [...new Set(dataSiswaGlobal.map(r=>r[3]))].filter(k=>k).sort().forEach(k=>{
            el.innerHTML += '<option value="'+k+'">'+k+'</option>';
        });
    }

    function lihatLegerGuru() {
        let kelas = document.getElementById('rlGuruSelectKelas')?.value;
        let smt   = parseInt(document.getElementById('rlGuruSelectSemester')?.value||'1');
        if (!kelas) { alert('Pilih kelas terlebih dahulu!'); return; }

        let statusEl = document.getElementById('rlGuruStatusPanel');
        let hasilEl  = document.getElementById('hasilLegerGuru');
        if (!statusEl || !hasilEl) return;

        let isReleased = localStorage.getItem('leger_released_'+kelas+'_'+smt) === 'true';
        let relAt = localStorage.getItem('leger_released_'+kelas+'_'+smt+'_at') || '';

        if (!isReleased) {
            statusEl.innerHTML = '<div style="background:#fef2f2; border:1.5px solid #fecaca; border-radius:12px; padding:20px; text-align:center; margin-bottom:12px;">'
                + '<div style="font-size:32px; margin-bottom:12px;">🔒</div>'
                + '<div style="font-size:15px; font-weight:800; color:#b91c1c; margin-bottom:6px;">Leger Belum Di-release</div>'
                + '<div style="font-size:12px; color:#dc2626; line-height:1.6;">Leger kelas <strong>'+kelas+' Semester '+smt+'</strong> belum tersedia untuk guru.<br>'
                + 'Hubungi Admin untuk melakukan release leger.</div></div>';
            hasilEl.innerHTML = '';
            return;
        }

        statusEl.innerHTML = '<div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px 16px; display:flex; align-items:center; gap:10px; margin-bottom:16px;">'
            + '<i class="ri-checkbox-circle-fill" style="color:#059669; font-size:18px;"></i>'
            + '<div><div style="font-size:12px; font-weight:700; color:#166534;">Leger Tersedia (Read-Only)</div>'
            + '<div style="font-size:11px; color:#059669;">Di-release sejak: '+relAt+'</div></div></div>';

        // Generate the leger table (same as generateRaporLeger but read-only, no export buttons)
        let fSiswa = dataSiswaGlobal.filter(r=>r[3]===kelas).sort((a,b)=>(a[2]||'').localeCompare(b[2]||''));
        if (fSiswa.length===0) { hasilEl.innerHTML='<p style="color:#64748b;text-align:center;">Tidak ada data siswa untuk kelas ini.</p>'; return; }

        let rankData = fSiswa.map(siswa=>{
            let sum=0,cnt=0;
            daftarMapel.forEach((m,mIdx)=>{ let v=parseFloat(siswa[6+mIdx*6+(smt-1)])||0; if(v>0){sum+=v;cnt++;} });
            return {siswa, avg:cnt>0?sum/cnt:0};
        }).sort((a,b)=>b.avg-a.avg);

        let headerCols = daftarMapel.map(m=>
            '<th style="writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;height:90px;font-size:10px;text-align:center;padding:4px;background:#1e293b;color:white;">'+m.namaLengkap+'</th>'
        ).join('');

        let bodyRows = rankData.map((item,rankIdx) => {
            let siswa = item.siswa;
            let mapelCols = daftarMapel.map((m,mIdx) => {
                let v=parseFloat(siswa[6+mIdx*6+(smt-1)])||0;
                let style = v>0&&v<75?'color:#dc2626;font-weight:700;background:#fee2e2;':'';
                return '<td style="text-align:center;font-size:12px;'+style+'">'+(v>0?v.toFixed(0):'-')+'</td>';
            }).join('');
            return '<tr><td style="text-align:center;font-weight:700;">'+(rankIdx+1)+'</td>'
                +'<td style="font-weight:700;">'+siswa[2].toUpperCase()+'</td>'
                +'<td style="text-align:center;font-size:11px;"><code>'+siswa[0]+'</code></td>'
                +mapelCols
                +'<td style="text-align:center;font-weight:800;color:var(--primary);">'+(item.avg>0?item.avg.toFixed(1):'-')+'</td>'
                +'<td style="text-align:center;font-weight:700;">#'+(rankIdx+1)+'</td>'
                +'</tr>';
        }).join('');

        hasilEl.innerHTML = '<div class="table-responsive" style="max-height:500px;overflow:auto;"><table style="font-size:12px;">'
            +'<thead><tr><th style="width:50px;text-align:center;">No</th><th style="min-width:180px;">Nama Siswa</th><th style="min-width:110px;">NISN</th>'
            +headerCols
            +'<th style="background:var(--primary-light);color:var(--primary);text-align:center;min-width:70px;">Rata-rata</th>'
            +'<th style="text-align:center;min-width:60px;">Peringkat</th></tr></thead>'
            +'<tbody>'+bodyRows+'</tbody></table></div>'
            +'<div style="margin-top:10px;text-align:right;"><button class="excel-btn" onclick="eksporLegerGuruExcelBtn(this)" data-kelas="'+kelas+'" data-smt="'+smt+'"><i class="ri-file-excel-2-line"></i> Unduh Leger (.xlsx)</button></div>';
    }

    function eksporLegerGuruExcelBtn(btn) {
        eksporLegerGuruExcel(btn.dataset.kelas, btn.dataset.smt);
    }

    function eksporLegerGuruExcel(kelas, smt) {
        // Read-only export for guru - same as eksporLegerExcel but locked to their kelas
        let fSiswa = dataSiswaGlobal.filter(r=>r[3]===kelas).sort((a,b)=>{
            let aA=daftarMapel.reduce((s,m,i)=>s+(parseFloat(a[6+i*6+(smt-1)])||0),0);
            let bA=daftarMapel.reduce((s,m,i)=>s+(parseFloat(b[6+i*6+(smt-1)])||0),0);
            return bA-aA;
        });
        let header = ['Rank','Nama Siswa','NISN'].concat(daftarMapel.map(m=>m.namaLengkap)).concat(['Rata-rata','Peringkat']);
        let rows = fSiswa.map((siswa,idx)=>{
            let sum=0,cnt=0;
            let mapelVals = daftarMapel.map((m,mIdx)=>{let v=parseFloat(siswa[6+mIdx*6+(smt-1)])||0;if(v>0){sum+=v;cnt++;}return v>0?v:'-';});
            return [idx+1, siswa[2].toUpperCase(), siswa[0]].concat(mapelVals).concat([cnt>0?(sum/cnt).toFixed(1):'-','#'+(idx+1)]);
        });
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([['LEGER NILAI KELAS '+kelas+' SEMESTER '+smt+' — SMA NEGERI 1 JAKARTA'],[],header].concat(rows));
        ws['!cols'] = [{wch:6},{wch:28},{wch:14}].concat(daftarMapel.map(()=>({wch:13}))).concat([{wch:12},{wch:10}]);
        XLSX.utils.book_append_sheet(wb,ws,'Leger_'+kelas+'_S'+smt);
        XLSX.writeFile(wb,'Leger_'+kelas+'_Sem'+smt+'.xlsx');
    }

    // ============================================================
    function eksporLegerExcel() {
        const kelas = document.getElementById('rlSelectKelas')?.value||'KELAS';
        const smt   = parseInt(document.getElementById('rlSelectSemester')?.value||'1');
        const fSiswa = dataSiswaGlobal.filter(r=>r[3]===kelas).sort((a,b)=>{
            let aAvg=daftarMapel.reduce((s,m,i)=>s+(parseFloat(a[6+i*6+(smt-1)])||0),0);
            let bAvg=daftarMapel.reduce((s,m,i)=>s+(parseFloat(b[6+i*6+(smt-1)])||0),0);
            return bAvg-aAvg;
        });
        const header = ['Rank','Nama Siswa','NISN'].concat(daftarMapel.map(m=>m.namaLengkap)).concat(['Rata-rata','Peringkat Kelas']);
        const rows = fSiswa.map((siswa,idx) => {
            let sum=0,cnt=0;
            let mapelVals = daftarMapel.map((m,mIdx)=>{
                let v=parseFloat(siswa[6+mIdx*6+(smt-1)])||0;
                if(v>0){sum+=v;cnt++;}
                return v>0?v:'-';
            });
            return [idx+1, siswa[2].toUpperCase(), siswa[0]].concat(mapelVals).concat([cnt>0?(sum/cnt).toFixed(1):'-', '#'+(idx+1)]);
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(
            [['LEGER NILAI KELAS '+kelas+' SEMESTER '+smt+' \u2014 SMA NEGERI 1 JAKARTA'],[],header].concat(rows)
        );
        ws['!cols'] = [{wch:6},{wch:28},{wch:14}].concat(daftarMapel.map(()=>({wch:14}))).concat([{wch:12},{wch:12}]);
        XLSX.utils.book_append_sheet(wb,ws,'Leger_'+kelas+'_S'+smt);
        XLSX.writeFile(wb,'Leger_'+kelas+'_Sem'+smt+'_SMAN1Jakarta.xlsx');
    }

    // ============================================================
    // SYNC DROPDOWN SAAT SWITCH MENU ERAPOR
    // ============================================================
    (function() {
        document.addEventListener('DOMContentLoaded', function() {
            // Observe menu clicks to populate dropdowns when erapor tab opens
            document.addEventListener('click', function(e) {
                let el = e.target.closest('[onclick]');
                if (el) {
                    let onc = el.getAttribute('onclick')||'';
                    if (onc.includes('eraporTab')) {
                        setTimeout(function() {
                            if (typeof renderDropdownEraporKunci==='function') renderDropdownEraporKunci();
                            syncDropdownImportErapor();
                            syncDropdownRaporLeger();
                        }, 350);
                    }
                }
            });
        });
    })();


    // ============================================================
    // AUTO-LOGOUT IDLE (10 MENIT TANPA AKTIVITAS)
    // ============================================================
    let timerIdleOtomatis;
    const WAKTU_TUNGGU_IDLE = 10 * 60 * 1000;

    function resetTimerKeamananMurni() {
        clearTimeout(timerIdleOtomatis);
        timerIdleOtomatis = setTimeout(eksekusiLogoutBiasa, WAKTU_TUNGGU_IDLE);
    }

    function eksekusiLogoutBiasa() {
        localStorage.removeItem("session_user_aktif");
        if (typeof sessionUserAktif !== "undefined") sessionUserAktif = null;
        sessionStorage.removeItem("status_lockscreen_terbuka");
        alert("Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan masukkan password kembali pada menu login utama.");

        if (typeof logoutUser === "function") {
            logoutUser();
        } else if (typeof switchSidebarMenu === "function") {
            document.querySelectorAll('.tab-content-view').forEach(el => el.style.display = 'none');
            if (document.getElementById('votingRapatSection')) document.getElementById('votingRapatSection').style.display = 'none';
            const boxLoginAsli = document.getElementById('loginSection') || document.getElementById('authForm');
            if (boxLoginAsli) boxLoginAsli.style.display = 'block';
            else window.location.reload();
        } else {
            window.location.reload();
        }
    }

    (function pasangSensorAktivitas() {
        resetTimerKeamananMurni();
        ['mousemove','mousedown','keydown','scroll','click'].forEach(evt => {
            window.addEventListener(evt, resetTimerKeamananMurni);
        });
    })();

    // ============================================================
    // LOCKSCREEN SETELAH REFRESH
    // ============================================================
    window.addEventListener('DOMContentLoaded', function() {
        let statusTerbuka = sessionStorage.getItem("status_lockscreen_terbuka");
        let tirai         = document.getElementById('tiraiLockscreenMurni');
        if (statusTerbuka === "true" && tirai) tirai.style.display = 'none';
        else if (tirai) tirai.style.display = 'flex';
    });

    window.onbeforeunload = function() {
        // Opsional: hapus baris berikut jika ingin setiap refresh selalu meminta password
        // sessionStorage.removeItem("status_lockscreen_terbuka");
    };

    // ============================================================
    // EKSPOR EXCEL SISWA INDIVIDUAL
    // ============================================================
    function eksporExcelSiswa() {
        const namaSiswa  = document.getElementById('resNama')?.innerText   || "Siswa";
        const kelasSiswa = document.getElementById('resKelas')?.innerText  || "Kelas";
        const nisnNis    = document.getElementById('resNisnNis')?.innerText || "";

        const sumTotal   = document.getElementById('resSumNilai')?.innerText          || "0";
        const rataRata   = document.getElementById('resRataRata')?.innerText          || "0.0";
        const rankKelas  = document.getElementById('resPeringkatKelas')?.innerText    || "-";
        const rankParalel = document.getElementById('resPeringkat')?.innerText        || "-";
        const mapelMerah = document.getElementById('resMapelMerahPersonal')?.innerText || "0";

        const sectionResult = document.getElementById('resultSiswaSection');
        const tabelNilai    = sectionResult ? sectionResult.querySelector('table') : null;

        if (!tabelNilai) {
            alert("⚠️ Tidak ada data nilai yang bisa diekspor. Silakan cari data siswa terlebih dahulu!");
            return;
        }

        const matrixData = [
            ["RAPOR REKAPITULASI CAPAIAN HASIL BELAJAR SISWA"],
            ["SMA NEGERI 1 JAKARTA - PORTAL AKADEMIK CLOUD LEGER"],
            [],
            ["IDENTITAS SISWA", "", "", "", "RINGKASAN STATISTIK AKADEMIK"],
            ["Nama Lengkap",       ": " + namaSiswa.toUpperCase(),  "", "", "Jumlah Nilai (SUM)",    parseFloat(sumTotal) || 0],
            ["Kelas / Rombel",     ": " + kelasSiswa.toUpperCase(), "", "", "Rata-Rata Gabungan",    parseFloat(rataRata) || 0],
            ["Identitas (NISN/NIS)", ": " + nisnNis,                "", "", "Peringkat Kelas",       rankKelas],
            ["Waktu Unduh",        ": " + new Date().toLocaleDateString('id-ID'), "", "", "Peringkat Paralel", rankParalel],
            ["Status Evaluasi",    ": AMAN",                        "", "", "Modul di bawah KKM",    mapelMerah + " Mata Pelajaran"],
            [],
            ["MATA PELAJARAN", "SEMESTER 1", "SEMESTER 2", "SEMESTER 3", "SEMESTER 4", "SEMESTER 5", "SEMESTER 6"]
        ];

        tabelNilai.querySelectorAll("tbody tr").forEach(tr => {
            const rowData = [];
            tr.querySelectorAll("td").forEach((td, colIdx) => {
                let teksSel = td.innerText.trim();
                if (colIdx > 0) {
                    let angkaSel = parseFloat(teksSel);
                    rowData.push(!isNaN(angkaSel) ? angkaSel : teksSel);
                } else {
                    rowData.push(teksSel);
                }
            });
            if (rowData.length > 0) matrixData.push(rowData);
        });

        const batasAkhirTabelNilai = matrixData.length;

        const boxRekomendasi = document.getElementById('kontenRekapEvaluasiPersonal');
        if (boxRekomendasi) {
            matrixData.push([]);
            matrixData.push(["HASIL REKAPAN EVALUASI KARIR & REKOMENDASI STUDI:"]);
            const textLines = boxRekomendasi.innerText.split('\n');
            textLines.forEach(line => { if (line.trim() !== "") matrixData.push([line.trim()]); });
        }

        const localWorkbook = XLSX.utils.book_new();
        const ws            = XLSX.utils.aoa_to_sheet(matrixData);

        const borderHitam = {
            top:    { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left:   { style: "thin", color: { rgb: "000000" } },
            right:  { style: "thin", color: { rgb: "000000" } }
        };

        let range = XLSX.utils.decode_range(ws['!ref']);
        for (let r = range.s.r; r <= range.e.r; r++) {
            for (let c = range.s.c; c <= range.e.c; c++) {
                let cell_ref = XLSX.utils.encode_cell({ r: r, c: c });
                if (!ws[cell_ref]) continue;

                if (r === 10) {
                    ws[cell_ref].s = {
                        fill:      { fgColor: { rgb: "1A365D" } },
                        font:      { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 10 },
                        alignment: { horizontal: "center", vertical: "center", wrapText: false },
                        border:    borderHitam
                    };
                } else if (r > 10 && r < batasAkhirTabelNilai) {
                    let isKolomMapel = (c === 0);
                    let nilaiNum     = parseFloat(ws[cell_ref].v);
                    let isDiBawahKkm = (!isNaN(nilaiNum) && nilaiNum < 75 && !isKolomMapel);
                    ws[cell_ref].s = {
                        font:      { name: "Arial", sz: 10, bold: isKolomMapel, color: { rgb: isDiBawahKkm ? "991B1B" : "000000" } },
                        fill:      { fgColor: { rgb: isDiBawahKkm ? "FEE2E2" : "FFFFFF" } },
                        alignment: { horizontal: isKolomMapel ? "left" : "center", vertical: "center" },
                        border:    borderHitam
                    };
                } else if (r >= batasAkhirTabelNilai) {
                    if (ws[cell_ref].v && String(ws[cell_ref].v).includes("HASIL REKAPAN EVALUASI")) {
                        ws[cell_ref].s = { font: { bold: true, color: { rgb: "0F766E" }, name: "Arial", sz: 11 }, alignment: { wrapText: false } };
                    } else {
                        ws[cell_ref].s = { font: { name: "Arial", sz: 10, color: { rgb: "334155" } }, alignment: { horizontal: "left", vertical: "top", wrapText: false } };
                    }
                }
            }
        }

        ws['!cols'] = [
            { wch: 28 }, { wch: 35 }, { wch: 5 }, { wch: 5 }, { wch: 26 }, { wch: 15 }, { wch: 15 }
        ];

        XLSX.utils.book_append_sheet(localWorkbook, ws, "Transkrip_Siswa");
        const namaFileBersih = namaSiswa.replace(/[/\\?%*:|"<>]/g, '-').trim();
        XLSX.writeFile(localWorkbook, `Rekap_Rapor_${kelasSiswa.trim()}_${namaFileBersih}.xlsx`);
    }

    // ============================================================
    // INISIALISASI HALAMAN (VERSI AMAN FIX LOGIN STUCK)
    // ============================================================
    window.onload = function() {
        // Siapkan XLSX patch
        if (typeof XLSX !== "undefined" && XLSX.utils && !XLSX.utils.aoa_to_sheet_original) {
            XLSX.utils.aoa_to_sheet_original = XLSX.utils.aoa_to_sheet;
        }

        // Pulihkan sesi tersimpan (jika ada)
        let savedSession = localStorage.getItem("session_user_sman1");
        if (savedSession) {
            try { sessionUserAktif = JSON.parse(savedSession); } catch(e) {
                localStorage.removeItem("session_user_sman1");
            }
        }

        // ── LOAD CACHE OFFLINE DULU ──────────────────────────────────
        try {
            let cachedUsers = localStorage.getItem("offline_users_sman1");
            let cachedSiswa = localStorage.getItem("offline_siswa_sman1");
            
            if (cachedUsers) {
                cloudUsersCache = JSON.parse(cachedUsers);
                // Kita set true hanya jika data hasil parse valid dan ada isinya
                if (cloudUsersCache && cloudUsersCache.length > 0) {
                    cloudDataLoaded = true;
                }
            }
            if (cachedSiswa) {
                dataSiswaGlobal = JSON.parse(cachedSiswa);
                
                // Isi dropdown kelas dari cache secara aman
                if (dataSiswaGlobal && Array.isArray(dataSiswaGlobal)) {
                    let listKls = [...new Set(dataSiswaGlobal.map(r => r && r[3] ? r[3] : ""))].filter(k => k && k !== "Kelas").sort();
                    const selK = document.getElementById('selectKelas');
                    if (selK) {
                        selK.innerHTML = '<option value="">-- Tentukan Kelas --</option>';
                        listKls.forEach(k => { selK.innerHTML += '<option value="'+k+'">'+k+'</option>'; });
                    }
                }
            }
        } catch(e) { console.warn('[Portal] Cache load error:', e); }

        // PENGAMAN ABSOLUT: Pastikan variabel tidak null sebelum dicek agar website TIDAK STUCK
        if (!cloudUsersCache) { cloudUsersCache = []; }
        if (!dataSiswaGlobal) { dataSiswaGlobal = []; }

        // Update status indikator login secara aman
        const st = document.getElementById('loginCloudStatus');
        if (st) {
            if (cloudDataLoaded && cloudUsersCache.length > 0) {
                st.textContent = '✅ ' + cloudUsersCache.length + ' akun siap (dari cache) — menyegarkan...';
                st.style.color = '#f59e0b'; // Oranye mendandakan cache siap
            } else {
                st.textContent = '⏳ Menyiapkan data akun dari cloud...';
                st.style.color = '#888888';
            }
        }

        // Login screen selalu tampil langsung
        const loginScr = document.getElementById('loginScreen');
        if (loginScr) {
            loginScr.style.display = 'flex';
        }

        // Jika ada sesi tersimpan dan cache sudah ada, langsung buka dashboard
        if (sessionUserAktif && cloudDataLoaded && cloudUsersCache.length > 0) {
            bukaHalamanDashboard();
            return;
        }

        // Muat/refresh cloud data terbaru di background
        muatDataCloud();
    };

    // Deteksi role saat DOM siap (untuk class CSS is-admin-theme)
    document.addEventListener("DOMContentLoaded", function() {
        setTimeout(function() {
            if (typeof sessionUserAktif !== "undefined" && sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1') {
                document.body.classList.add('is-admin-theme');
            } else {
                document.body.classList.remove('is-admin-theme');
            }
        }, 500);
    });
// ── FUNGSI STRATEGIS: AMBIL DATA LIVE DARI CLOUD TANPA CACHE BROWSER ──
function tarikSiswaAktifDariCloud() {
    if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
        
        // Membawa parameter waktu unik (?t=...) agar browser dipaksa mengambil data terbaru dari Google Sheets
        let urlAntiCache = URL_GOOGLE_APPS_SCRIPT + "?aksi=get_siswa_aktif&t=" + new Date().getTime();

        fetch(urlAntiCache, {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) throw new Error("Jaringan sibuk");
            return response.json();
        })
        .then(resData => {
            if (resData.success) {
                let nisnDariCloud = resData.nisn ? resData.nisn.toString().trim() : "";
                let nisnLokalLama = localStorage.getItem("nisn_siswa_sidang_aktif") || "";
                
                // JIKA TERDETEKSI ADA PERUBAHAN DI SPREADSHEET, PAKSA UPDATE DETIK ITU JUGA
                if (nisnDariCloud !== nisnLokalLama.trim()) {
                    console.log("🔔 SINKRONISASI AKTIF: Terdeteksi perubahan gembok dari Admin! NISN: " + nisnDariCloud);
                    
                    if (nisnDariCloud) {
                        localStorage.setItem("nisn_siswa_sidang_aktif", nisnDariCloud);
                    } else {
                        localStorage.removeItem("nisn_siswa_sidang_aktif");
                    }

                    // Bersihkan sisa kunci_indiv_* lama agar tidak memblokir render baru
                    // (Guru tidak perlu kunci ini — hanya Admin yang menulisnya)
                    Object.keys(localStorage).filter(k => k.startsWith("kunci_indiv_")).forEach(k => {
                        localStorage.removeItem(k);
                    });

                    // Eksekusi gambar ulang kartu voting guru secara instan
                    renderUIVotingDanChart();
                }
            }
        })
        .catch(err => console.log("⏳ Mencoba menghubungkan kembali ke cloud..."));
    }
}

// ── MESIN PENGGERAK OTOMATIS BERKALA ──
// Polling cloud setiap 4 detik — hanya aktif setelah user login sebagai Guru
(function startVotingPoller() {
    setInterval(function() {
        // Guard: hanya jalankan jika sudah login DAN bukan Admin
        if (typeof sessionUserAktif === "undefined" || !sessionUserAktif) return;
        let isAdmin = (sessionUserAktif.role === 'AdminSMAN1');
        if (isAdmin) return; // Admin tidak perlu polling

        // Guru: tarik NISN aktif dari cloud dan render ulang jika ada perubahan
        tarikSiswaAktifDariCloud();
    }, 4000); // 4 detik sekali
})();

