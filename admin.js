    // ============================================================
    function renderRiwayatKoreksiSistem() {
        const tBody = document.getElementById('tableRiwayatKoreksiBody');
        if (!tBody) return;
        tBody.innerHTML  = "";
        const listKoreksi = JSON.parse(localStorage.getItem("db_koreksi_sman1")) || [];
        let filterList   = (sessionUserAktif.role === 'AdminSMAN1')
            ? listKoreksi
            : listKoreksi.filter(k => k.pengaju === sessionUserAktif.username);

        filterList.forEach(k => {
            let imgHtml = (k.bukti && k.bukti !== "KOSONG")
                ? `<img src="${k.bukti}" class="img-preview-bukti" onclick="window.open(this.src)">`
                : `<span class="no-photo-badge">Tanpa Bukti</span>`;
            let stClass = k.status === 'DISETUJUI' ? 'status-approved' : (k.status === 'DITOLAK' ? 'status-rejected' : 'status-waiting');
            tBody.innerHTML += `<tr>
                <td>${k.waktu}</td><td>${k.nisnNis}</td><td><strong>${k.nama}</strong></td>
                <td>${k.mapel}</td><td style="text-align:center;">${k.semester}</td>
                <td style="text-align:center; color:var(--primary); font-weight:700;">${k.nilaiBaru}</td>
                <td style="text-align:center;">${imgHtml}</td>
                <td style="text-align:center;"><span class="status-badge ${stClass}">${k.status}</span></td>
            </tr>`;
        });
    }

    // ============================================================
    // MANAJEMEN AKUN (ADMIN)
    // ============================================================
    async function tambahUserBaruCloud() {
        const uInput = document.getElementById('newUsername');
        const pInput = document.getElementById('newPassword');
        const rInput = document.getElementById('newRole');
        if (!uInput || !pInput || !rInput) return;

        const usernameBaru = uInput.value.trim();
        const passwordBaru = pInput.value.trim();
        const roleBaru     = rInput.value;

        if (!usernameBaru || !passwordBaru || !roleBaru) {
            alert("⚠️ Gagal menyimpan! Mohon isi data Username dan Password terlebih dahulu.");
            return;
        }

        let userEksis = cloudUsersCache.find(u => u.username.toLowerCase() === usernameBaru.toLowerCase());
        if (userEksis) {
            alert("❌ Username tersebut sudah terdaftar di sistem SMAN 1 Jakarta!");
            return;
        }

        if (!confirm(`Apakah Anda yakin ingin mendaftarkan akun baru "${usernameBaru}" dengan role ${roleBaru}?`)) return;

        document.getElementById('loading').style.display = 'flex';
        try {
            await fetch(URL_GOOGLE_APPS_SCRIPT, {
                method: 'POST',
                body: JSON.stringify({ action: 'tambahUser', username: usernameBaru, password: passwordBaru, role: roleBaru })
            });
            cloudUsersCache.push({ username: usernameBaru, pass: passwordBaru, role: roleBaru });
            uInput.value = "";
            pInput.value = "";
            renderTabelUserAdmin();
            alert(`🎉 Sukses! Akun "${usernameBaru}" berhasil disimpan secara permanen di server pusat.`);
        } catch (error) {
            console.error("Gagal sinkronisasi cloud:", error);
            alert("⚠️ Gangguan koneksi ke Cloud Google Sheets. Namun data dicoba simpan lokal sementara.");
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }

    function renderTabelUserAdmin(page = 1, pageSize = 100) {
    try {
        if (!Array.isArray(cloudUsersCache)) cloudUsersCache = [];
        if (!Array.isArray(cloudPlottingCache)) cloudPlottingCache = [];

        const tBody = document.getElementById('adminUserTableBody');
        if (!tBody) return;

        // Pagination: hitung offset
        const total = cloudUsersCache.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;
        const start = (page - 1) * pageSize;
        const end = Math.min(start + pageSize, total);

        // Clear table body
        tBody.innerHTML = '';

        // If no users, show friendly message
        if (total === 0) {
            tBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding:18px;">Tidak ada akun terdaftar.</td></tr>`;
        } else {
            // Build rows using DocumentFragment for performance
            const frag = document.createDocumentFragment();

            // Render only the current page slice
            const slice = cloudUsersCache.slice(start, end);
            slice.forEach(user => {
                const tr = document.createElement('tr');

                // Build plotting badges (but limited to show-first-6 to avoid heavy DOM)
                let plots = cloudPlottingCache
                    .filter(p => p.username === user.username)
                    .map(p => {
                        if (p.mapel === 'WALI') return `<span class="plotting-tag">Wali Kelas ${p.kelas || ''}</span>`;
                        return `<span class="plotting-tag">${(p.mapel||'').toString().toUpperCase()} (${p.kelas||''})</span>`;
                    });

                if (plots.length > 6) {
                    const first = plots.slice(0,6);
                    first.push(`<span style="font-size:11px;color:#64748b;">+${plots.length-6} lagi</span>`);
                    plots = first;
                }

                // Use safe encoding for onclick parameter
                const safeUsername = String(user.username).replace(/'/g, "\\'");
                tr.innerHTML = `
                    <td style="padding:12px 8px;"><strong>${user.username}</strong></td>
                    <td style="padding:12px 8px;"><code>${user.pass}</code></td>
                    <td style="padding:12px 8px;">${user.role || '-'}</td>
                    <td style="padding:12px 8px;">${plots.join(' ') || '<span style="color:#94a3b8;font-style:italic;">Belum diplot</span>'}</td>
                    <td style="text-align:center;padding:12px 8px;">
                        <button class="btn-danger" style="padding:6px 8px;" onclick="hapusUserCloud('${safeUsername}')"><i class="ri-delete-bin-line"></i></button>
                    </td>
                `;
                frag.appendChild(tr);
            });

            tBody.appendChild(frag);
        }

        // ========== Pagination Controls (render di footer row) ==========
        // Hapus kontrol lama terlebih dahulu jika ada
        let pagerRow = document.getElementById('adminUserPagerRow');
        if (pagerRow) pagerRow.remove();

        // Buat baris baru untuk pager (full-width)
        const pager = document.createElement('tr');
        pager.id = 'adminUserPagerRow';
        pager.innerHTML = `<td colspan="5" style="padding:10px 12px; text-align:right; background:#ffffff;">
            <span style="font-size:13px; color:#64748b; margin-right:12px;">Menampilkan ${Math.min(total, end) === 0 ? 0 : start + 1}–${end} dari ${total}</span>
            <button id="pagerPrev" style="margin-right:6px; padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1; background:#fff;">Prev</button>
            <button id="pagerNext" style="padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1; background:#fff;">Next</button>
        </td>`;
        tBody.parentElement.querySelector('table > tbody').appendChild(pager);

        // Attach handlers (lightweight)
        document.getElementById('pagerPrev').onclick = function() {
            if (page > 1) renderTabelUserAdmin(page - 1, pageSize);
        };
        document.getElementById('pagerNext').onclick = function() {
            if (page < totalPages) renderTabelUserAdmin(page + 1, pageSize);
        };

        // ========== Update dropdowns safely ==========
        try {
            const plotGuruEl = document.getElementById('plotSelectGuru');
            if (plotGuruEl) {
                const prev = plotGuruEl.value || '';
                plotGuruEl.innerHTML = '<option value="">-- Pilih --</option>';
                cloudUsersCache
                    .filter(u => ['GuruSMAN1','WaliSMAN1'].includes(u.role))
                    .sort((a,b) => a.username.localeCompare(b.username))
                    .forEach(u => { plotGuruEl.innerHTML += `<option value="${u.username}">${u.username} (${u.role})</option>`; });
                if (prev) plotGuruEl.value = prev;
            }

            const plotKelasEl = document.getElementById('plotSelectKelas');
            if (plotKelasEl) {
                const prevK = plotKelasEl.value;
                // Only unique classes, limit to first 200 to avoid huge option lists
                const listK = [...new Set((dataSiswaGlobal||[]).map(r => r[3]))].filter(k => k).sort();
                plotKelasEl.innerHTML = '';
                listK.slice(0, 200).forEach(k => { plotKelasEl.innerHTML += `<option value="${k}">${k}</option>`; });
                plotKelasEl.innerHTML += `<option value="__WALI__">WALI (Wali Kelas)</option>`;
                if (prevK) plotKelasEl.value = prevK;
            }

            const plotMapelEl = document.getElementById('plotSelectMapel');
            if (plotMapelEl) {
                const prevM = plotMapelEl.value;
                plotMapelEl.innerHTML = '';
                daftarMapel.forEach(m => { plotMapelEl.innerHTML += `<option value="${m.kode}">${m.namaLengkap}</option>`; });
                plotMapelEl.innerHTML += `<option value="WALI">WALI KELAS</option>`;
                if (prevM) plotMapelEl.value = prevM;
            }
        } catch(e) {
            console.warn('[renderTabelUserAdmin] gagal update dropdowns:', e);
        }

    } catch (err) {
        console.error('[renderTabelUserAdmin] error:', err);
        const tBody = document.getElementById('adminUserTableBody');
        if (tBody) tBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#ef4444;padding:18px;">Terjadi kesalahan saat memuat tabel pengguna. Baca konsol untuk detail.</td></tr>`;
    }
}

    function renderAdminValidasiSistem() {
        const tBody = document.getElementById('adminValidasiTableBody');
        if (!tBody) return;
        tBody.innerHTML = "";
        const listKoreksi = JSON.parse(localStorage.getItem("db_koreksi_sman1")) || [];
        let waitingList   = listKoreksi.filter(k => k.status === "MENUNGGU PERSETUJUAN");

        if (waitingList.length === 0) {
            tBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#64748b; font-style:italic;">Tidak ada pengajuan revisi nilai yang mengantre.</td></tr>`;
            return;
        }

        waitingList.forEach(k => {
            let imgHtml = (k.bukti && k.bukti !== "KOSONG")
                ? `<img src="${k.bukti}" class="img-preview-bukti" onclick="window.open(this.src)">`
                : `<span class="no-photo-badge">Tanpa Bukti</span>`;
            tBody.innerHTML += `<tr>
                <td><strong>${k.pengaju}</strong><br><small style="color:#64748b;">${k.waktu}</small></td>
                <td><strong>${k.nama}</strong><br><code>${k.nisnNis}</code></td>
                <td>${k.mapel}</td>
                <td style="text-align:center;">${k.semester}</td>
                <td style="text-align:center; font-weight:700; color:var(--primary);">${k.nilaiBaru}</td>
                <td style="text-align:center;">${imgHtml}</td>
                <td style="text-align:center; gap:8px; display:flex; justify-content:center;">
                    <button class="btn-success" onclick="eksekusiKeputusanValidasi(${k.id}, 'DISETUJUI')"><i class="ri-check-line"></i> Setujui</button>
                    <button class="btn-danger"  onclick="eksekusiKeputusanValidasi(${k.id}, 'DITOLAK')"> <i class="ri-close-line"></i> Tolak</button>
                </td>
            </tr>`;
        });
    }

    // ============================================================
    // PLOTTING GURU — SIMPAN, HAPUS, IMPORT MASSAL
    // ============================================================
    function simpanPlottingGuruInstanCloud() {
        const guruSel  = document.getElementById('plotSelectGuru');
        const kelasSel = document.getElementById('plotSelectKelas');
        const mapelSel = document.getElementById('plotSelectMapel');
        if (!guruSel || !kelasSel || !mapelSel) return;

        const username = guruSel.value;
        if (!username) { alert('Pilih guru terlebih dahulu!'); return; }

        // Handle WALI assignment: jika kelas __WALI__ dipilih, gunakan mapel WALI
        const kelasList = Array.from(kelasSel.selectedOptions).map(o => o.value).filter(v => v);
        const mapelList = Array.from(mapelSel.selectedOptions).map(o => o.value).filter(v => v);

        if (kelasList.length === 0) { alert('Pilih minimal satu kelas!'); return; }
        if (mapelList.length === 0) { alert('Pilih minimal satu mata pelajaran!'); return; }

        if (!confirm(`Sinkronkan plotting ${kelasList.length} kelas × ${mapelList.length} mapel untuk akun "${username}"?`)) return;

        // Bangun entri plotting
        const newEntries = [];
        kelasList.forEach(k => {
            if (k === '__WALI__') {
                // Wali kelas: gunakan kelas pertama dari kelas yang ada, atau biarkan admin memilih kelas normal
                newEntries.push({ username, kelas: kelasList.filter(x => x !== '__WALI__')[0] || '', mapel: 'WALI' });
            } else {
                mapelList.forEach(m => {
                    if (m === 'WALI') {
                        newEntries.push({ username, kelas: k, mapel: 'WALI' });
                    } else {
                        newEntries.push({ username, kelas: k, mapel: m });
                    }
                });
            }
        });

        // Hapus duplikat
        const unique = newEntries.filter((e, i, self) =>
            e.kelas && e.mapel && i === self.findIndex(x => x.username === e.username && x.kelas === e.kelas && x.mapel === e.mapel)
        );

        document.getElementById('loading').style.display = 'flex';
        fetch(URL_GOOGLE_APPS_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({ aksi: 'simpanPlotting', username, entries: unique })
        })
        .then(r => r.json())
        .catch(() => ({}))
        .finally(() => {
            // Tambahkan ke cache lokal (hindari duplikat)
            unique.forEach(e => {
                if (!cloudPlottingCache.find(p => p.username === e.username && p.kelas === e.kelas && p.mapel === e.mapel)) {
                    cloudPlottingCache.push(e);
                }
            });
            renderTabelUserAdmin();
            document.getElementById('loading').style.display = 'none';
            alert(`✅ Plotting "${username}" berhasil disinkronkan! (${unique.length} entri ditambahkan)`);
        });
    }

    async function hapusUserCloud(username) {
        if (!confirm(`Hapus akun "${username}" dari sistem? Seluruh data plotting akun ini juga akan dihapus.`)) return;
        document.getElementById('loading').style.display = 'flex';
        try {
            await fetch(URL_GOOGLE_APPS_SCRIPT, {
                method: 'POST',
                body: JSON.stringify({ aksi: 'hapusUser', username })
            });
        } catch(e) { /* tetap lanjutkan hapus lokal */ }
        cloudUsersCache    = cloudUsersCache.filter(u => u.username !== username);
        cloudPlottingCache = cloudPlottingCache.filter(p => p.username !== username);
        renderTabelUserAdmin();
        document.getElementById('loading').style.display = 'none';
        alert(`✅ Akun "${username}" berhasil dihapus dari sistem.`);
    }

    function prosesImportAkunMassal() {
        const fileEl = document.getElementById('importFileExcel');
        const file   = fileEl?.files?.[0];
        if (!file) { alert('Pilih file Excel (.xlsx) terlebih dahulu!'); return; }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const wb   = XLSX.read(e.target.result, { type: 'array' });
                const ws   = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
                if (rows.length < 2) { alert('File tidak memiliki data (minimal 2 baris: header + data).'); return; }

                let added = 0, skipped = 0, toAdd = [];
                rows.slice(1).forEach(row => {
                    if (!row || !row[0]) return;
                    let u = String(row[0]).trim();
                    let p = String(row[1] || '').trim();
                    let r = String(row[2] || 'GuruSMAN1').trim();
                    if (!u || !p) return;
                    if (cloudUsersCache.find(x => x.username.toLowerCase() === u.toLowerCase())) { skipped++; return; }
                    toAdd.push({ username: u, pass: p, role: r });
                    added++;
                });

                if (toAdd.length === 0) {
                    alert(`Tidak ada akun baru untuk diimport.\n${skipped} akun sudah terdaftar di sistem.`);
                    return;
                }
                if (!confirm(`Import ${toAdd.length} akun baru? (${skipped} dilewati karena sudah ada)`)) return;

                document.getElementById('loading').style.display = 'flex';
                fetch(URL_GOOGLE_APPS_SCRIPT, {
                    method: 'POST',
                    body: JSON.stringify({ aksi: 'importAkunMassal', users: toAdd })
                })
                .catch(() => ({}))
                .finally(() => {
                    toAdd.forEach(u => cloudUsersCache.push(u));
                    renderTabelUserAdmin();
                    if (fileEl) fileEl.value = '';
                    document.getElementById('loading').style.display = 'none';
                    alert(`✅ Berhasil import ${toAdd.length} akun baru ke sistem!`);
                });
            } catch(err) {
                console.error(err);
                alert('Gagal membaca file Excel. Pastikan format file valid (.xlsx). Gunakan kolom: Username | Password | Role');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    // ============================================================
    // EVALUASI & ANALISIS KELAS
