
// =====================================================================
// MODUL KEHADIRAN SISWA & GURU
// Data dibaca dari sheet "Kehadiran_Siswa" dan "Kehadiran_Guru"
// Kolom Kehadiran_Siswa : [0]Tanggal [1]Kelas [2]NISN [3]Nama Siswa [4]Status [5]Keterangan
// Kolom Kehadiran_Guru  : [0]Tanggal [1]Kelas [2]Nama Guru [3]Mata Pelajaran [4]Jam Ke [5]Status [6]Keterangan
// Status: H=Hadir, S=Sakit, I=Izin, A=Alpha
// =====================================================================

let dataKehadiranSiswaGlobal = [];
let dataKehadiranGuruGlobal  = [];
let kehadiranSiswaTermuat    = false;
let kehadiranGuruTermuat     = false;

// =====================================================================
// INPUT KEHADIRAN SISWA
// =====================================================================

function muatDaftarSiswaUntukInput() {
    let kelas  = (document.getElementById('inputKelasKehadiranSiswa').value || "").trim();
    let tanggal = (document.getElementById('inputTanggalSiswa').value || "").trim();
    if (!kelas)   { alert("Pilih kelas terlebih dahulu."); return; }
    if (!tanggal) { alert("Pilih tanggal terlebih dahulu."); return; }

    let siswaDiKelas = dataSiswaGlobal.filter(r => (r[3] || "").toString().trim() === kelas);
    if (siswaDiKelas.length === 0) { alert("Tidak ada siswa ditemukan untuk kelas " + kelas); return; }

    // Format tanggal ke DD/MM/YYYY untuk disimpan ke sheet
    let parts = tanggal.split('-');
    let tanggalFormatted = parts[2] + '/' + parts[1] + '/' + parts[0];

    let html = "";
    siswaDiKelas.forEach(function(s, i) {
        let nisn = (s[0] || "").toString().trim();
        let nama = (s[2] || "").toString().trim();
        html += `<tr id="rowSiswaInput_${i}" data-nisn="${nisn}" data-nama="${nama}" data-kelas="${kelas}" data-tanggal="${tanggalFormatted}" data-status="" style="background:${i%2===0?'#f8fafc':'#fff'};">
            <td style="padding:8px 10px; color:#64748b;">${i+1}</td>
            <td style="padding:8px 10px; font-family:monospace; font-size:12px;">${nisn}</td>
            <td style="padding:8px 10px; font-weight:600;">${nama}</td>
            <td style="padding:8px 10px; text-align:center;">
                <div style="display:inline-flex; gap:4px;">
                    <button onclick="setStatusSiswa(this,'H')" data-val="H" style="padding:5px 11px; border-radius:6px; border:2px solid #16a34a; background:white; color:#16a34a; font-weight:800; cursor:pointer; font-size:12px; transition:all .15s;">H</button>
                    <button onclick="setStatusSiswa(this,'S')" data-val="S" style="padding:5px 11px; border-radius:6px; border:2px solid #ea580c; background:white; color:#ea580c; font-weight:800; cursor:pointer; font-size:12px; transition:all .15s;">S</button>
                    <button onclick="setStatusSiswa(this,'I')" data-val="I" style="padding:5px 11px; border-radius:6px; border:2px solid #2563eb; background:white; color:#2563eb; font-weight:800; cursor:pointer; font-size:12px; transition:all .15s;">I</button>
                    <button onclick="setStatusSiswa(this,'A')" data-val="A" style="padding:5px 11px; border-radius:6px; border:2px solid #dc2626; background:white; color:#dc2626; font-weight:800; cursor:pointer; font-size:12px; transition:all .15s;">A</button>
                </div>
            </td>
            <td style="padding:8px 10px;"><input type="text" placeholder="Keterangan..." style="width:100%; padding:5px 8px; border:1px solid #e2e8f0; border-radius:6px; font-size:12px; box-sizing:border-box;"></td>
        </tr>`;
    });
    document.getElementById('bodyInputKehadiranSiswa').innerHTML = html;
    // Default semua siswa = Hadir
    tandaiSemuaSiswa('H');
    document.getElementById('wrapperInputKehadiranSiswa').style.display = 'block';
}

function setStatusSiswa(btn, status) {
    let row = btn.closest('tr');
    row.dataset.status = status;
    // Reset semua tombol di baris ini
    row.querySelectorAll('td button[data-val]').forEach(function(b) {
        let colors = {H:'#16a34a', S:'#ea580c', I:'#2563eb', A:'#dc2626'};
        let v = b.dataset.val;
        if (v === status) {
            b.style.background = colors[v];
            b.style.color = 'white';
        } else {
            b.style.background = 'white';
            b.style.color = colors[v];
        }
    });
}

function tandaiSemuaSiswa(status) {
    document.querySelectorAll('#bodyInputKehadiranSiswa tr').forEach(function(row) {
        let btn = row.querySelector('button[data-val="' + status + '"]');
        if (btn) setStatusSiswa(btn, status);
    });
}

function simpanKehadiranSiswa() {
    let rows = document.querySelectorAll('#bodyInputKehadiranSiswa tr');
    if (rows.length === 0) { alert("Tidak ada data untuk disimpan."); return; }

    let data = [];
    let adaYangKosong = false;
    rows.forEach(function(row) {
        let status = row.dataset.status || "";
        if (!status) adaYangKosong = true;
        let ket = (row.querySelector('td input') || {}).value || "";
        data.push({
            tanggal:    row.dataset.tanggal,
            kelas:      row.dataset.kelas,
            nisn:       row.dataset.nisn,
            nama:       row.dataset.nama,
            status:     status,
            keterangan: ket
        });
    });

    if (adaYangKosong) {
        if (!confirm("Ada siswa yang belum ditandai statusnya. Lanjutkan simpan?")) return;
    }

    let info = document.getElementById('infoSimpanKehadiranSiswa');
    let btn  = document.getElementById('btnSimpanKehadiranSiswa');
    btn.disabled = true;
    info.innerText = "⏳ Menyimpan...";

    if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
        fetch(URL_GOOGLE_APPS_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({ aksi: 'simpan_kehadiran_siswa', data: data })
        })
        .then(function(r) { return r.json(); })
        .then(function(res) {
            if (res && res.success === false) throw new Error(res.message || "Gagal");
            info.innerText = "✅ Berhasil disimpan! (" + data.length + " siswa)";
            // Update cache lokal agar rekap langsung menampilkan data baru
            data.forEach(function(d) { if (d.status) dataKehadiranSiswaGlobal.push([d.tanggal, d.kelas, d.nisn, d.nama, d.status, d.keterangan]); });
        })
        .catch(function(e) {
            info.innerText = "⚠️ " + (e.message || "Gagal terhubung ke Apps Script.");
        })
        .finally(function() { btn.disabled = false; });
    } else {
        // Simpan ke cache lokal saja (mode offline / preview)
        data.forEach(function(d) { if (d.status) dataKehadiranSiswaGlobal.push([d.tanggal, d.kelas, d.nisn, d.nama, d.status, d.keterangan]); });
        info.innerText = "✅ Tersimpan di sesi ini. (Hubungkan Apps Script untuk simpan permanen)";
        btn.disabled = false;
    }
}

// =====================================================================
// INPUT KEHADIRAN GURU
// =====================================================================

function _buatOpsiKelas() {
    let listK = [...new Set(dataSiswaGlobal.map(r => (r[3]||"").toString().trim()))].filter(k => k && k.toLowerCase() !== "kelas").sort();
    return '<option value="">-- Kelas --</option>' + listK.map(k => `<option value="${k}">${k}</option>`).join('');
}

let _guruInputCounter = 0;

function tambahBarisGuruInput() {
    _guruInputCounter++;
    let n = _guruInputCounter;
    let tbody = document.getElementById('bodyInputKehadiranGuru');
    let rowCount = tbody.rows.length + 1;
    let tr = document.createElement('tr');
    tr.id = 'rowGuruInput_' + n;
    tr.dataset.status = 'H';
    tr.style.background = rowCount % 2 === 0 ? '#f8fafc' : '#fff';
    tr.innerHTML = `
        <td style="padding:8px 6px; text-align:center; color:#64748b; font-size:12px;">${rowCount}</td>
        <td style="padding:6px;"><select style="width:100%; padding:6px; border:1px solid #d1fae5; border-radius:6px; font-size:12px;">${_buatOpsiKelas()}</select></td>
        <td style="padding:6px;"><input type="text" placeholder="Nama Guru..." style="width:100%; padding:6px; border:1px solid #d1fae5; border-radius:6px; font-size:12px; box-sizing:border-box;"></td>
        <td style="padding:6px;"><input type="text" placeholder="Mata Pelajaran..." style="width:100%; padding:6px; border:1px solid #d1fae5; border-radius:6px; font-size:12px; box-sizing:border-box;"></td>
        <td style="padding:6px; text-align:center;"><input type="number" min="1" max="12" value="1" style="width:55px; padding:6px; border:1px solid #d1fae5; border-radius:6px; font-size:12px; text-align:center;"></td>
        <td style="padding:6px; text-align:center;">
            <div style="display:inline-flex; gap:3px;">
                <button onclick="setStatusGuru(this,'H')" data-val="H" style="padding:4px 9px; border-radius:5px; border:2px solid #16a34a; background:#16a34a; color:white; font-weight:800; cursor:pointer; font-size:11px;">H</button>
                <button onclick="setStatusGuru(this,'S')" data-val="S" style="padding:4px 9px; border-radius:5px; border:2px solid #ea580c; background:white; color:#ea580c; font-weight:800; cursor:pointer; font-size:11px;">S</button>
                <button onclick="setStatusGuru(this,'I')" data-val="I" style="padding:4px 9px; border-radius:5px; border:2px solid #2563eb; background:white; color:#2563eb; font-weight:800; cursor:pointer; font-size:11px;">I</button>
                <button onclick="setStatusGuru(this,'A')" data-val="A" style="padding:4px 9px; border-radius:5px; border:2px solid #dc2626; background:white; color:#dc2626; font-weight:800; cursor:pointer; font-size:11px;">A</button>
            </div>
        </td>
        <td style="padding:6px;"><input type="text" placeholder="Keterangan..." style="width:100%; padding:6px; border:1px solid #d1fae5; border-radius:6px; font-size:12px; box-sizing:border-box;"></td>
        <td style="padding:6px; text-align:center;"><button onclick="hapusBarisGuru(this)" style="padding:4px 8px; background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; color:#dc2626; cursor:pointer; font-size:14px; font-weight:700;">✕</button></td>`;
    tbody.appendChild(tr);
    document.getElementById('wrapperInputKehadiranGuru').style.display = 'block';
    document.getElementById('btnSimpanKehadiranGuru').style.display = 'inline-block';
    document.getElementById('emptyGuruInput').style.display = 'none';
}

function hapusBarisGuru(btn) {
    btn.closest('tr').remove();
    if (document.getElementById('bodyInputKehadiranGuru').rows.length === 0) {
        document.getElementById('wrapperInputKehadiranGuru').style.display = 'none';
        document.getElementById('btnSimpanKehadiranGuru').style.display = 'none';
        document.getElementById('emptyGuruInput').style.display = 'block';
    }
}

function setStatusGuru(btn, status) {
    let row = btn.closest('tr');
    row.dataset.status = status;
    let colors = {H:'#16a34a', S:'#ea580c', I:'#2563eb', A:'#dc2626'};
    row.querySelectorAll('button[data-val]').forEach(function(b) {
        if (b.dataset.val === status) { b.style.background = colors[status]; b.style.color = 'white'; }
        else { b.style.background = 'white'; b.style.color = colors[b.dataset.val]; }
    });
}

function simpanKehadiranGuru() {
    let tanggal = (document.getElementById('inputTanggalGuru').value || "").trim();
    if (!tanggal) { alert("Pilih tanggal terlebih dahulu."); return; }
    let parts = tanggal.split('-');
    let tanggalFormatted = parts[2] + '/' + parts[1] + '/' + parts[0];

    let rows = document.querySelectorAll('#bodyInputKehadiranGuru tr');
    if (rows.length === 0) { alert("Tidak ada baris guru untuk disimpan."); return; }

    let data = [];
    rows.forEach(function(row) {
        let cols   = row.querySelectorAll('td');
        let kelas  = cols[1].querySelector('select').value;
        let nama   = cols[2].querySelector('input').value.trim();
        let mapel  = cols[3].querySelector('input').value.trim();
        let jamKe  = cols[4].querySelector('input').value;
        let status = row.dataset.status || 'H';
        let ket    = cols[6].querySelector('input').value;
        if (!nama) return;
        data.push({ tanggal: tanggalFormatted, kelas, namaGuru: nama, mapel, jamKe, status, keterangan: ket });
    });

    if (data.length === 0) { alert("Isi minimal satu nama guru."); return; }

    let info = document.getElementById('infoSimpanKehadiranGuru');
    let btn  = document.getElementById('btnSimpanKehadiranGuru');
    btn.disabled = true;
    info.innerText = "⏳ Menyimpan...";

    if (typeof URL_GOOGLE_APPS_SCRIPT !== 'undefined' && URL_GOOGLE_APPS_SCRIPT) {
        fetch(URL_GOOGLE_APPS_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({ aksi: 'simpan_kehadiran_guru', data: data })
        })
        .then(function(r) { return r.json(); })
        .then(function(res) {
            if (res && res.success === false) throw new Error(res.message || "Gagal");
            info.innerText = "✅ Berhasil disimpan! (" + data.length + " baris guru)";
            data.forEach(function(d) { dataKehadiranGuruGlobal.push([d.tanggal, d.kelas, d.namaGuru, d.mapel, d.jamKe, d.status, d.keterangan]); });
        })
        .catch(function(e) { info.innerText = "⚠️ " + (e.message || "Gagal terhubung ke Apps Script."); })
        .finally(function() { btn.disabled = false; });
    } else {
        data.forEach(function(d) { dataKehadiranGuruGlobal.push([d.tanggal, d.kelas, d.namaGuru, d.mapel, d.jamKe, d.status, d.keterangan]); });
        info.innerText = "✅ Tersimpan di sesi ini. (Hubungkan Apps Script untuk simpan permanen)";
        btn.disabled = false;
    }
}

function _parseBarisCellGviz(row) {
    // downloadCloudSheet melempar json.table.rows ke callback
    // Setiap row adalah objek GVIZ: { c: [{v: val, f: fmt}, ...] }
    if (!row || !row.c) return null;
    return row.c.map(function(cell) {
        if (!cell) return "";
        // Gunakan .f (formatted) dulu agar tanggal, angka nol di depan tetap utuh
        let val = (cell.f !== undefined && cell.f !== null) ? cell.f : (cell.v !== null && cell.v !== undefined ? cell.v : "");
        return String(val).trim();
    });
}

function muatDataKehadiranSiswa(callback) {
    if (kehadiranSiswaTermuat) { if (callback) callback(); return; }
    downloadCloudSheet("Kehadiran_Siswa", function(rows) {
        try {
            dataKehadiranSiswaGlobal = [];
            (rows || []).forEach(function(row) {
                let cells = _parseBarisCellGviz(row);
                if (!cells) return;
                if (cells.join("").trim() === "") return;
                if (cells[0].toLowerCase() === "tanggal") return; // baris header
                dataKehadiranSiswaGlobal.push(cells);
            });
            kehadiranSiswaTermuat = true;
            isiDropdownKelasKehadiran();
            console.log("🟢 [Kehadiran] Memuat " + dataKehadiranSiswaGlobal.length + " baris kehadiran siswa.");
        } catch(e) {
            console.warn("[Kehadiran] Gagal memproses baris kehadiran siswa:", e);
        }
        if (callback) callback();
    });
}

function muatDataKehadiranGuru(callback) {
    if (kehadiranGuruTermuat) { if (callback) callback(); return; }
    downloadCloudSheet("Kehadiran_Guru", function(rows) {
        try {
            dataKehadiranGuruGlobal = [];
            (rows || []).forEach(function(row) {
                let cells = _parseBarisCellGviz(row);
                if (!cells) return;
                if (cells.join("").trim() === "") return;
                if (cells[0].toLowerCase() === "tanggal") return; // baris header
                dataKehadiranGuruGlobal.push(cells);
            });
            kehadiranGuruTermuat = true;
            isiDropdownKelasKehadiranGuru();
            console.log("🟢 [Kehadiran] Memuat " + dataKehadiranGuruGlobal.length + " baris kehadiran guru.");
        } catch(e) {
            console.warn("[Kehadiran] Gagal memproses baris kehadiran guru:", e);
        }
        if (callback) callback();
    });
}

function isiDropdownKelasKehadiran() {
    let kelasList = [...new Set(dataKehadiranSiswaGlobal.map(r => (r[1] || "").toString().trim()).filter(k => k !== ""))].sort();
    ["filterKelasKehadiranSiswa"].forEach(function(id) {
        let sel = document.getElementById(id);
        if (!sel) return;
        let curVal = sel.value;
        while (sel.options.length > 1) sel.remove(1);
        kelasList.forEach(function(k) { sel.add(new Option(k, k)); });
        if (curVal) sel.value = curVal;
    });
}

function isiDropdownKelasKehadiranGuru() {
    let kelasList = [...new Set(dataKehadiranGuruGlobal.map(r => (r[1] || "").toString().trim()).filter(k => k !== ""))].sort();
    ["filterKelasKehadiranGuru", "filterKelasAbsenGuru"].forEach(function(id) {
        let sel = document.getElementById(id);
        if (!sel) return;
        let curVal = sel.value;
        while (sel.options.length > 1) sel.remove(1);
        kelasList.forEach(function(k) { sel.add(new Option(k, k)); });
        if (curVal) sel.value = curVal;
    });
}

function badgeStatus(status) {
    let s = (status || "").toString().trim().toUpperCase();
    let colors = { H: "#16a34a", S: "#ea580c", I: "#2563eb", A: "#dc2626" };
    let labels = { H: "Hadir", S: "Sakit", I: "Izin", A: "Alpha" };
    let col = colors[s] || "#64748b";
    let lbl = labels[s] || s;
    return `<span style="display:inline-block; padding: 3px 10px; border-radius: 999px; background: ${col}22; color: ${col}; font-weight: 700; font-size: 12px; border: 1px solid ${col}55;">${lbl}</span>`;
}

function filterBulanDariTanggal(tanggal, bulan) {
    if (!bulan) return true;
    if (!tanggal) return false;
    let t = tanggal.toString();
    // Mendukung format: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
    let parts = t.replace(/-/g, "/").split("/");
    if (parts.length === 3) {
        let m = parts[1].length === 4 ? parts[0] : (parts[0].length === 4 ? parts[1] : parts[1]);
        return m.toString().padStart(2, "0") === bulan;
    }
    return false;
}

// ----------- KEHADIRAN SISWA -----------

function tampilkanKehadiranSiswa() {
    muatDataKehadiranSiswa(function() {
        let kelas  = document.getElementById('filterKelasKehadiranSiswa').value.trim();
        let bulan  = document.getElementById('filterBulanKehadiranSiswa').value.trim();
        let cari   = (document.getElementById('cariSiswaKehadiran').value || "").trim().toLowerCase();

        let filtered = dataKehadiranSiswaGlobal.filter(function(row) {
            if (kelas  && (row[1] || "").toString().trim() !== kelas) return false;
            if (bulan  && !filterBulanDariTanggal(row[0], bulan)) return false;
            if (cari   && !(row[2]||"").toString().toLowerCase().includes(cari) && !(row[3]||"").toString().toLowerCase().includes(cari)) return false;
            return true;
        });

        let statusEl = document.getElementById('statusMuatKehadiranSiswa');
        let tabelEl  = document.getElementById('tabelWrapperKehadiranSiswa');
        let bodyEl   = document.getElementById('bodyKehadiranSiswa');
        let summEl   = document.getElementById('summaryKehadiranSiswa');

        if (dataKehadiranSiswaGlobal.length === 0) {
            statusEl.innerHTML = '<i class="ri-alert-line" style="font-size:32px; display:block; margin-bottom:10px; color:#fca5a5;"></i><strong>Sheet "Kehadiran_Siswa" tidak ditemukan atau masih kosong.</strong><br><small>Pastikan nama sheet di Google Sheets tepat (huruf besar/kecil diperhatikan).</small>';
            statusEl.style.display = 'block';
            tabelEl.style.display  = 'none';
            summEl.style.display   = 'none';
            return;
        }

        if (filtered.length === 0) {
            statusEl.innerHTML = '<i class="ri-search-line" style="font-size:32px; display:block; margin-bottom:10px; color:#cbd5e1;"></i>Tidak ada data yang sesuai filter.';
            statusEl.style.display = 'block';
            tabelEl.style.display  = 'none';
            summEl.style.display   = 'none';
            return;
        }

        let cH = 0, cS = 0, cI = 0, cA = 0;
        let html = "";
        filtered.forEach(function(row, i) {
            let st = (row[4] || "").toString().trim().toUpperCase();
            if (st === "H") cH++; else if (st === "S") cS++;
            else if (st === "I") cI++; else cA++;
            let bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
            html += `<tr style="background:${bg};">
                <td style="padding:10px;">${i+1}</td>
                <td style="padding:10px;">${row[0]||""}</td>
                <td style="padding:10px;">${row[1]||""}</td>
                <td style="padding:10px;">${row[2]||""}</td>
                <td style="padding:10px; font-weight:600;">${row[3]||""}</td>
                <td style="padding:10px; text-align:center;">${badgeStatus(row[4])}</td>
                <td style="padding:10px; color:#64748b;">${row[5]||"-"}</td>
            </tr>`;
        });

        bodyEl.innerHTML = html;
        document.getElementById('sumHadir').innerText      = cH;
        document.getElementById('sumSakit').innerText      = cS;
        document.getElementById('sumIzin').innerText       = cI;
        document.getElementById('sumAlpa').innerText       = cA;
        document.getElementById('sumTotalSiswa').innerText = filtered.length;

        statusEl.style.display = 'none';
        tabelEl.style.display  = 'block';
        summEl.style.display   = 'block';
    });
}

function eksporKehadiranSiswaExcel() {
    if (dataKehadiranSiswaGlobal.length === 0) { alert("Data belum termuat. Klik Tampilkan terlebih dahulu."); return; }
    let kelas = document.getElementById('filterKelasKehadiranSiswa').value.trim();
    let bulan = document.getElementById('filterBulanKehadiranSiswa').value.trim();
    let cari  = (document.getElementById('cariSiswaKehadiran').value || "").trim().toLowerCase();
    let filtered = dataKehadiranSiswaGlobal.filter(function(row) {
        if (kelas && (row[1]||"").toString().trim() !== kelas) return false;
        if (bulan && !filterBulanDariTanggal(row[0], bulan)) return false;
        if (cari  && !(row[2]||"").toString().toLowerCase().includes(cari) && !(row[3]||"").toString().toLowerCase().includes(cari)) return false;
        return true;
    });
    let matrix = [["REKAP KEHADIRAN SISWA - SMAN 1 JAKARTA"],[],["NO","TANGGAL","KELAS","NISN","NAMA SISWA","STATUS","KETERANGAN"]];
    filtered.forEach(function(row, i) { matrix.push([i+1, row[0]||"", row[1]||"", row[2]||"", row[3]||"", row[4]||"", row[5]||""]); });
    let ws = XLSX.utils.aoa_to_sheet(matrix);
    ws['!cols'] = [{wch:5},{wch:14},{wch:10},{wch:15},{wch:30},{wch:10},{wch:35}];
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kehadiran_Siswa");
    XLSX.writeFile(wb, `Rekap_Kehadiran_Siswa${kelas ? "_"+kelas : ""}.xlsx`);
}

// ----------- KEHADIRAN GURU -----------

function tampilkanKehadiranGuru() {
    muatDataKehadiranGuru(function() {
        let kelas = document.getElementById('filterKelasKehadiranGuru').value.trim();
        let bulan = document.getElementById('filterBulanKehadiranGuru').value.trim();
        let cari  = (document.getElementById('cariGuruKehadiran').value || "").trim().toLowerCase();

        let filtered = dataKehadiranGuruGlobal.filter(function(row) {
            if (kelas && (row[1]||"").toString().trim() !== kelas) return false;
            if (bulan && !filterBulanDariTanggal(row[0], bulan)) return false;
            if (cari  && !(row[2]||"").toString().toLowerCase().includes(cari) && !(row[3]||"").toString().toLowerCase().includes(cari)) return false;
            return true;
        });

        let statusEl = document.getElementById('statusMuatKehadiranGuru');
        let tabelEl  = document.getElementById('tabelWrapperKehadiranGuru');
        let bodyEl   = document.getElementById('bodyKehadiranGuru');
        let summEl   = document.getElementById('summaryKehadiranGuru');

        if (dataKehadiranGuruGlobal.length === 0) {
            statusEl.innerHTML = '<i class="ri-alert-line" style="font-size:32px; display:block; margin-bottom:10px; color:#fca5a5;"></i><strong>Sheet "Kehadiran_Guru" tidak ditemukan atau masih kosong.</strong><br><small>Pastikan nama sheet di Google Sheets tepat.</small>';
            statusEl.style.display = 'block';
            tabelEl.style.display  = 'none';
            summEl.style.display   = 'none';
            return;
        }

        if (filtered.length === 0) {
            statusEl.innerHTML = '<i class="ri-search-line" style="font-size:32px; display:block; margin-bottom:10px; color:#cbd5e1;"></i>Tidak ada data yang sesuai filter.';
            statusEl.style.display = 'block';
            tabelEl.style.display  = 'none';
            summEl.style.display   = 'none';
            return;
        }

        let cH = 0, cS = 0, cI = 0, cA = 0;
        let html = "";
        filtered.forEach(function(row, i) {
            let st = (row[5] || "").toString().trim().toUpperCase();
            if (st === "H") cH++; else if (st === "S") cS++;
            else if (st === "I") cI++; else cA++;
            let bg = i % 2 === 0 ? "#f8fafc" : "#ffffff";
            html += `<tr style="background:${bg};">
                <td style="padding:10px;">${i+1}</td>
                <td style="padding:10px;">${row[0]||""}</td>
                <td style="padding:10px;">${row[1]||""}</td>
                <td style="padding:10px; font-weight:600;">${row[2]||""}</td>
                <td style="padding:10px;">${row[3]||""}</td>
                <td style="padding:10px; text-align:center;">${row[4]||"-"}</td>
                <td style="padding:10px; text-align:center;">${badgeStatus(row[5])}</td>
                <td style="padding:10px; color:#64748b;">${row[6]||"-"}</td>
            </tr>`;
        });

        bodyEl.innerHTML = html;
        document.getElementById('sumHadirGuru').innerText = cH;
        document.getElementById('sumSakitGuru').innerText = cS;
        document.getElementById('sumIzinGuru').innerText  = cI;
        document.getElementById('sumAlpaGuru').innerText  = cA;
        document.getElementById('sumTotalGuru').innerText = filtered.length;

        statusEl.style.display = 'none';
        tabelEl.style.display  = 'block';
        summEl.style.display   = 'block';
    });
}

function eksporKehadiranGuruExcel() {
    if (dataKehadiranGuruGlobal.length === 0) { alert("Data belum termuat. Klik Tampilkan terlebih dahulu."); return; }
    let kelas = document.getElementById('filterKelasKehadiranGuru').value.trim();
    let bulan = document.getElementById('filterBulanKehadiranGuru').value.trim();
    let cari  = (document.getElementById('cariGuruKehadiran').value || "").trim().toLowerCase();
    let filtered = dataKehadiranGuruGlobal.filter(function(row) {
        if (kelas && (row[1]||"").toString().trim() !== kelas) return false;
        if (bulan && !filterBulanDariTanggal(row[0], bulan)) return false;
        if (cari  && !(row[2]||"").toString().toLowerCase().includes(cari) && !(row[3]||"").toString().toLowerCase().includes(cari)) return false;
        return true;
    });
    let matrix = [["REKAP KEHADIRAN GURU DI KELAS - SMAN 1 JAKARTA"],[],["NO","TANGGAL","KELAS","NAMA GURU","MATA PELAJARAN","JAM KE","STATUS","KETERANGAN"]];
    filtered.forEach(function(row, i) { matrix.push([i+1, row[0]||"", row[1]||"", row[2]||"", row[3]||"", row[4]||"", row[5]||"", row[6]||""]); });
    let ws = XLSX.utils.aoa_to_sheet(matrix);
    ws['!cols'] = [{wch:5},{wch:14},{wch:10},{wch:30},{wch:25},{wch:8},{wch:10},{wch:35}];
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Kehadiran_Guru");
    XLSX.writeFile(wb, `Rekap_Kehadiran_Guru${kelas ? "_"+kelas : ""}.xlsx`);
}

// ----------- KETIDAKHADIRAN GURU -----------

function tampilkanAbsenGuru() {
    muatDataKehadiranGuru(function() {
        let kelas  = document.getElementById('filterKelasAbsenGuru').value.trim();
        let bulan  = document.getElementById('filterBulanAbsenGuru').value.trim();
        let status = document.getElementById('filterStatusAbsenGuru').value.trim().toUpperCase();
        let cari   = (document.getElementById('cariNamaAbsenGuru').value || "").trim().toLowerCase();

        // Hanya tampilkan baris yang TIDAK hadir (S, I, A)
        let filtered = dataKehadiranGuruGlobal.filter(function(row) {
            let st = (row[5] || "").toString().trim().toUpperCase();
            if (st === "H" || st === "HADIR" || st === "") return false;
            if (kelas  && (row[1]||"").toString().trim() !== kelas) return false;
            if (bulan  && !filterBulanDariTanggal(row[0], bulan)) return false;
            if (status && st !== status) return false;
            if (cari   && !(row[2]||"").toString().toLowerCase().includes(cari)) return false;
            return true;
        });

        let statusEl = document.getElementById('statusMuatAbsenGuru');
        let tabelEl  = document.getElementById('tabelWrapperAbsenGuru');
        let bodyEl   = document.getElementById('bodyAbsenGuru');
        let rankEl   = document.getElementById('rankAbsenGuru');
        let rankBody = document.getElementById('bodyRankAbsenGuru');

        if (dataKehadiranGuruGlobal.length === 0) {
            statusEl.innerHTML = '<i class="ri-alert-line" style="font-size:32px; display:block; margin-bottom:10px; color:#fca5a5;"></i><strong>Sheet "Kehadiran_Guru" tidak ditemukan atau masih kosong.</strong><br><small>Pastikan nama sheet di Google Sheets tepat.</small>';
            statusEl.style.display = 'block';
            tabelEl.style.display  = 'none';
            rankEl.style.display   = 'none';
            return;
        }

        if (filtered.length === 0) {
            statusEl.innerHTML = '<i class="ri-check-line" style="font-size:32px; display:block; margin-bottom:10px; color:#86efac;"></i>Tidak ada ketidakhadiran guru sesuai filter ini.';
            statusEl.style.display = 'block';
            tabelEl.style.display  = 'none';
            rankEl.style.display   = 'none';
            return;
        }

        // Hitung rekap per guru
        let perGuru = {};
        filtered.forEach(function(row) {
            let nama = (row[2] || "Tidak Diketahui").toString().trim();
            perGuru[nama] = (perGuru[nama] || 0) + 1;
        });
        let sortedGuru = Object.entries(perGuru).sort((a, b) => b[1] - a[1]);
        rankBody.innerHTML = sortedGuru.map(function(g) {
            return `<span style="display:inline-flex; align-items:center; gap:6px; background:#fef2f2; border:1px solid #fca5a5; border-radius:8px; padding:6px 12px; font-size:13px;">
                <i class="ri-user-line" style="color:#dc2626;"></i>
                <strong>${g[0]}</strong>
                <span style="background:#dc2626; color:white; border-radius:999px; padding:1px 8px; font-size:12px; font-weight:700;">${g[1]}x</span>
            </span>`;
        }).join("");

        let html = "";
        filtered.forEach(function(row, i) {
            let bg = i % 2 === 0 ? "#fff5f5" : "#ffffff";
            html += `<tr style="background:${bg};">
                <td style="padding:10px;">${i+1}</td>
                <td style="padding:10px;">${row[0]||""}</td>
                <td style="padding:10px;">${row[1]||""}</td>
                <td style="padding:10px; font-weight:700; color:#dc2626;">${row[2]||""}</td>
                <td style="padding:10px;">${row[3]||""}</td>
                <td style="padding:10px; text-align:center;">${row[4]||"-"}</td>
                <td style="padding:10px; text-align:center;">${badgeStatus(row[5])}</td>
                <td style="padding:10px; color:#64748b;">${row[6]||"-"}</td>
            </tr>`;
        });

        bodyEl.innerHTML = html;
        statusEl.style.display = 'none';
        tabelEl.style.display  = 'block';
        rankEl.style.display   = 'block';
    });
}

function eksporAbsenGuruExcel() {
    if (dataKehadiranGuruGlobal.length === 0) { alert("Data belum termuat. Klik Tampilkan terlebih dahulu."); return; }
    let kelas  = document.getElementById('filterKelasAbsenGuru').value.trim();
    let bulan  = document.getElementById('filterBulanAbsenGuru').value.trim();
    let status = document.getElementById('filterStatusAbsenGuru').value.trim().toUpperCase();
    let cari   = (document.getElementById('cariNamaAbsenGuru').value || "").trim().toLowerCase();
    let filtered = dataKehadiranGuruGlobal.filter(function(row) {
        let st = (row[5] || "").toString().trim().toUpperCase();
        if (st === "H" || st === "HADIR" || st === "") return false;
        if (kelas  && (row[1]||"").toString().trim() !== kelas) return false;
        if (bulan  && !filterBulanDariTanggal(row[0], bulan)) return false;
        if (status && st !== status) return false;
        if (cari   && !(row[2]||"").toString().toLowerCase().includes(cari)) return false;
        return true;
    });
    let matrix = [["REKAP KETIDAKHADIRAN GURU DI KELAS - SMAN 1 JAKARTA"],[],["NO","TANGGAL","KELAS","NAMA GURU","MATA PELAJARAN","JAM KE","STATUS","KETERANGAN"]];
    filtered.forEach(function(row, i) { matrix.push([i+1, row[0]||"", row[1]||"", row[2]||"", row[3]||"", row[4]||"", row[5]||"", row[6]||""]); });
    let ws = XLSX.utils.aoa_to_sheet(matrix);
    ws['!cols'] = [{wch:5},{wch:14},{wch:10},{wch:30},{wch:25},{wch:8},{wch:10},{wch:35}];
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ketidakhadiran_Guru");
    XLSX.writeFile(wb, `Rekap_Ketidakhadiran_Guru${kelas ? "_"+kelas : ""}.xlsx`);
}

