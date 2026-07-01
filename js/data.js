    // ============================================================
    // UNDUH DATA DARI CLOUD (GOOGLE SHEETS)
    // ============================================================
    function downloadCloudSheet(sheetName, callbackAction) {
        return new Promise((resolve) => {
            const script     = document.createElement('script');
            
            // 🌟 PERBAIKAN UTAMA: Menggunakan format teks acak murni tanpa angka dinamis/nama sheet
            // Ini agar Google API tidak mogok dan patuh membaca parameter &range=A:P
            const cbName     = 'cb' + Math.random().toString(36).substring(2, 9);
            let done         = false;

            function finish() {
                if (!done) { 
                    done = true; 
                    // Bersihkan element script dari dokumen agar memori web tetap ringan
                    if (script.parentNode) script.parentNode.removeChild(script);
                    resolve(); 
                }
            }

            window[cbName] = function(json) {
                try { 
                    if (json && json.table && json.table.rows) {
                        callbackAction(json.table.rows);
                    } else {
                        callbackAction([]);
                    }
                } catch(e) { 
                    console.warn('[Portal] Callback error pada sheet "' + sheetName + '":', e); 
                    callbackAction([]);
                }
                finish();
                delete window[cbName]; // Hapus variabel window setelah selesai agar bersih
            };

            script.onerror = function() {
                console.warn('[Portal] Script error: sheet "' + sheetName + '"');
                callbackAction([]);
                finish();
            };

            // Timeout diperpanjang sedikit menjadi 5 detik agar koneksi internet lambat tidak mudah stuck
            setTimeout(function() {
                if (!done) {
                    console.warn('[Portal] Timeout 5s: sheet "' + sheetName + '"');
                    callbackAction([]);
                    finish();
                }
            }, 5000);

            // Tembak langsung dengan encoding nama sheet yang aman dan parameter jangkauan A sampai P utuh
            script.src = 'https://docs.google.com/spreadsheets/d/1AXfHu142bWpeOHb2aJpEmZI-AT_doa62fIVJVvJCrlY/gviz/tq?sheet=' + encodeURIComponent(sheetName) + '&tqx=responseHandler:' + cbName;
            document.body.appendChild(script);
        });
    }

    // Muat cloud data di BACKGROUND — tidak memblokir login screen
    async function muatDataCloud() {
    const st = document.getElementById('loginCloudStatus');
    
    // =========================================================================
        // PROSES PENGAMBILAN DATA UTAMA (VERSI GABUNGAN PARALEL - ANTI STUCK & ANTI BLANK)
        // =========================================================================
        try {
            // Jalankan ketiga database PARALEL (bukan berurutan) — hemat waktu & anti-stuck
        await Promise.all([
            downloadCloudSheet("Database_Web", function(rows) {
                try {
                    if (!rows) return; // PENGAMAN: Jika sheet kosong atau bermasalah
                    dataSiswaGlobal = [];
                    rows.forEach(function(row) {
                        if (!row || !row.c) return;
                        let cells = row.c.map(function(cell) {
                            return cell ? (cell.f ? String(cell.f) : String(cell.v)) : "";
                        });
                        if (cells[0]) dataSiswaGlobal.push(cells);
                    });
                } catch(e) { console.warn('[Portal] DB_Web parse err:', e); }
            }),
            downloadCloudSheet("Sistem_Users", function(rows) {
                try {
                    if (!rows) return; // PENGAMAN: Jika sheet kosong atau bermasalah
                    cloudUsersCache = [];
                    rows.forEach(function(row) {
                        if (!row || !row.c) return;
                        let cells = row.c.map(function(cell) { return cell ? String(cell.v) : ""; });
                        if (cells[0] && cells[0] !== "Username") {
                            cloudUsersCache.push({ username: cells[0], pass: cells[1], role: cells[2] });
                        }
                    });
                } catch(e) { console.warn('[Portal] Users parse err:', e); }
            }),
            // 🌟 BERHASIL DIMASUKKAN: Pengunduh Tab Biodata Secara Mandiri & Paralel
            downloadCloudSheet("Sheet_Biodata", function(rows) {
                try {
                    dataBiodataGlobal = []; 
                    if (!rows || rows.length === 0) return;

                    // ── Deteksi header kolom otomatis dari baris pertama ──
                    let firstRow = rows[0];
                    if (firstRow && firstRow.c) {
                        let hcells = firstRow.c.map(function(c){ return c ? String(c.v || '').trim().toUpperCase() : ''; });
                        function fi(tests) { return hcells.findIndex(function(h){ return tests.some(function(t){ return h.includes(t); }); }); }
                        let detected = {
                            nisn:       fi(['NISN']),
                            nama:       hcells.findIndex(function(h){ return h.includes('NAMA') && !h.includes('AYAH') && !h.includes('IBU') && !h.includes('WALI') && !h.includes('ORTU'); }),
                            kelas:      fi(['KELAS']),
                            nis:        hcells.findIndex(function(h){ return h === 'NIS'; }),
                            alamat:     hcells.findIndex(function(h){ return h.includes('ALAMAT') && !h.includes('ORTU') && !h.includes('WALI'); }),
                            status:     fi(['STATUS']),
                            anakKe:     fi(['ANAK']),
                            asal:       fi(['ASAL']),
                            diterima:   fi(['DITERIMA','MASUK']),
                            ayah:       fi(['AYAH']),
                            ibu:        fi(['IBU']),
                            alamatOrtu: hcells.findIndex(function(h){ return h.includes('ALAMAT') && (h.includes('ORTU') || h.includes('OT') || h.includes('TUA')); }),
                            telpOrtu:   hcells.findIndex(function(h){ return (h.includes('TELP')||h.includes('HP')||h.includes('NO.H')) && (h.includes('ORTU')||h.includes('OT')||h.includes('TUA')); }),
                            wali:       hcells.findIndex(function(h){ return h.includes('WALI') && !h.includes('ALAMAT') && !h.includes('TELP') && !h.includes('HP'); }),
                            alamatWali: hcells.findIndex(function(h){ return h.includes('ALAMAT') && h.includes('WALI'); }),
                            telpWali:   hcells.findIndex(function(h){ return (h.includes('TELP')||h.includes('HP')) && h.includes('WALI'); }),
                        };
                        // Terapkan hasil deteksi, fallback ke default jika tidak ditemukan
                        Object.keys(detected).forEach(function(k){
                            if (detected[k] >= 0) bioBioColMap[k] = detected[k];
                        });
                        if (bioBioColMap.nisn < 0) bioBioColMap.nisn = 3;
                        if (bioBioColMap.nama < 0) bioBioColMap.nama = 1;
                        if (bioBioColMap.kelas < 0) bioBioColMap.kelas = 2;
                        console.log("🟡 [Portal] Biodata kolom terdeteksi:", JSON.stringify(bioBioColMap));
                    }

                    rows.forEach(function(row) {
                        if (!row || !row.c) return;
                        let cells = row.c.map(function(cell) { 
                            if (!cell) return "";
                            let val = cell.f ? cell.f : (cell.v !== null ? cell.v : "");
                            return String(val).trim(); 
                        });
                        let nisnIdx = bioBioColMap.nisn >= 0 ? bioBioColMap.nisn : 3;
                        let nisnVal = cells[nisnIdx] || "";
                        // Terima baris yang punya NISN numerik (minimal 5 digit), tolak header
                        if (nisnVal && !nisnVal.match(/NISN|NAMA|KELAS|NO/i) && nisnVal.replace(/\D/g,'').length >= 5) {
                            dataBiodataGlobal.push(cells);
                        }
                    });
                    console.log("🟢 [Portal] Berhasil memuat " + dataBiodataGlobal.length + " data biodata.");
                } catch(errBio) { 
                    console.warn('[Portal] Gagal memproses baris biodata:', errBio); 
                }
            }),
            // 🌟 PLOTTING GURU: Muat hak akses mengajar per guru dari sheet Sistem_Plotting
            downloadCloudSheet("Sistem_Plotting", function(rows) {
                try {
                    cloudPlottingCache = [];
                    if (!rows || rows.length === 0) return;
                    rows.forEach(function(row) {
                        if (!row || !row.c) return;
                        let cells = row.c.map(function(cell) { return cell ? String(cell.v || "").trim() : ""; });
                        // Kolom: [0]Username [1]Kelas [2]Mapel
                        if (cells[0] && cells[0].toLowerCase() !== "username" && cells[0].toLowerCase() !== "Username") {
                            cloudPlottingCache.push({ username: cells[0], kelas: cells[1], mapel: cells[2] });
                        }
                    });
                    console.log("🟢 [Portal] Berhasil memuat " + cloudPlottingCache.length + " data plotting guru.");
                } catch(errPlot) {
                    console.warn('[Portal] Gagal memproses plotting:', errPlot);
                }
            })
        ]); 
        } catch (errPromise) {
            console.error("[Portal] Gagal memuat database inti:", errPromise);
        }
finally {
        // PENGAMAN UTAMA: Pastikan array tidak bernilai null agar tidak memicu error (.length)
        if (!cloudUsersCache) { cloudUsersCache = []; }
        if (!dataSiswaGlobal) { dataSiswaGlobal = []; }

        // Pastikan flag diset true agar sistem login tidak terkunci dalam status loading terus-menerus
        cloudDataLoaded = true;

        // Simpan ke localStorage sebagai cache offline (jika data berhasil dimuat dari cloud)
        if (cloudUsersCache.length > 0) {
            try { localStorage.setItem("offline_users_sman1", JSON.stringify(cloudUsersCache)); } catch(e) {}
        }
        if (dataSiswaGlobal.length > 0) {
            try { localStorage.setItem("offline_siswa_sman1", JSON.stringify(dataSiswaGlobal)); } catch(e) {}
        }

        // Jalankan mekanisme Fallback ke Cache Offline jika cloud kosong/gagal
        if (cloudUsersCache.length === 0) {
            try {
                const localCacheUsers = localStorage.getItem("offline_users_sman1");
                if (localCacheUsers) {
                    cloudUsersCache = JSON.parse(localCacheUsers);
                    console.log('[Portal] Fallback: Menggunakan data user dari cache lokal:', cloudUsersCache.length);
                }
            } catch(e) { console.warn('[Portal] Gagal memuat local cache users:', e); }
        }

        if (dataSiswaGlobal.length === 0) {
            try {
                const localCacheSiswa = localStorage.getItem("offline_siswa_sman1");
                if (localCacheSiswa) {
                    dataSiswaGlobal = JSON.parse(localCacheSiswa);
                    console.log('[Portal] Fallback: Menggunakan data siswa dari cache lokal:', dataSiswaGlobal.length);
                }
            } catch(e) { console.warn('[Portal] Gagal memuat local cache siswa:', e); }
        }

        // Update status indicator di UI Login berdasarkan hasil akhir data
        if (st) {
            if (cloudUsersCache.length > 0) {
                // Periksa apakah ini hasil muatan baru (cloud) atau fallback lama (offline)
                const isOfflineMode = !navigator.onLine || (st.textContent && st.textContent.includes('Gagal'));
                if (isOfflineMode || st.textContent.includes('Mode offline')) {
                    st.textContent = '📦 Mode offline — ' + cloudUsersCache.length + ' akun dari cache lokal';
                    st.style.color = '#f59e0b'; // Oranye
                } else {
                    st.textContent = '✅ Data siap — ' + cloudUsersCache.length + ' akun dimuat dari cloud';
                    st.style.color = '#22c55e'; // Hijau
                }
            } else {
                // Jika benar-benar kosong dan tidak ada internet sama sekali
                st.textContent = '⚠️ Tidak ada data akun. Gunakan kredensial darurat (admin/admin123).';
                st.style.color = '#ef4444'; // Merah
            }
        }

        // PERBAIKAN: Auto-login jika ada sesi tersimpan dan data cloud sudah siap
        // Kasus: user refresh halaman saat sudah login, tapi cache lokal kosong (kunjungan pertama)
        if (sessionUserAktif && typeof bukaHalamanDashboard === 'function') {
            const loginScr = document.getElementById('loginScreen');
            if (loginScr && loginScr.style.display !== 'none') {
                bukaHalamanDashboard();
            }
        }
    }
}

    // Alias untuk kompatibilitas kode lain yang memanggil nama lama
    function pastikanDataMasterTerunduh() {
        return muatDataCloud();
    }

    // ============================================================
    // FILTER & DROPDOWN HELPERS
    // ============================================================
    function toggleFilterSemester() {
        document.getElementById('selectSemester').style.display =
            (document.getElementById('selectModeTampilan').value === 'semester') ? 'inline-block' : 'none';
    }

    function kunciDropdownKelasWali() {
        if (sessionUserAktif.role === 'WaliSMAN1') {
            let myWaliPlot = cloudPlottingCache.find(p => p.username === sessionUserAktif.username && p.mapel === 'WALI');
            if (myWaliPlot) {
                document.getElementById('selectKelas').value    = myWaliPlot.kelas;
                document.getElementById('selectKelas').disabled = true;
            }
        } else {
            document.getElementById('selectKelas').disabled = false;
        }
    }

    function renderDropdownEraporKunci() {
        const selectM   = document.getElementById('epSelectMapel');
        const selectK   = document.getElementById('epSelectKelas');
        if (!selectM || !selectK) return;
        selectM.innerHTML = '<option value="">-- Pilih Mata Pelajaran --</option>';
        selectK.innerHTML = '<option value="">-- Pilih Kelas --</option>';

        let listKelasSemua = [...new Set(dataSiswaGlobal.map(row => row[3]))].filter(k => k !== "").sort();
        let isAdmin = (sessionUserAktif && sessionUserAktif.role === 'AdminSMAN1');

        if (!isAdmin) {
            // Guru: tampilkan HANYA mapel & kelas yang sudah diplotting
            let myPlots = (cloudPlottingCache||[]).filter(p => p.username === sessionUserAktif.username && p.mapel !== 'WALI');
            // Hapus pesan peringatan plotting lama jika ada
            document.getElementById('epPlottingWarning')?.remove();
            if (myPlots.length > 0) {
                [...new Set(myPlots.map(p => p.kelas))].sort().forEach(k => { selectK.innerHTML += `<option value="${k}">${k}</option>`; });
                [...new Set(myPlots.map(p => p.mapel))].forEach(m => {
                    let inf = daftarMapel.find(dm => dm.kode === m);
                    if (inf) selectM.innerHTML += `<option value="${m}">${inf.namaLengkap}</option>`;
                });
            } else {
                // TIDAK ada fallback — tampilkan peringatan, blokir akses
                let warnEl = document.createElement('div');
                warnEl.id = 'epPlottingWarning';
                warnEl.style.cssText = 'background:#fef3c7;border:1.5px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:20px;font-size:13px;color:#92400e;display:flex;align-items:flex-start;gap:12px;';
                warnEl.innerHTML = '<i class="ri-lock-2-line" style="font-size:22px;flex-shrink:0;margin-top:1px;"></i>'
                    + '<div><strong style="font-size:14px;">Belum ada plotting mengajar untuk akun Anda.</strong><br>'
                    + '<span style="font-size:12px;">Hubungi Admin agar hak akses mata pelajaran Anda segera dikonfigurasi di Panel Manajemen Akun &amp; Plotting.</span></div>';
                document.getElementById('epSection_inputNilai')?.prepend(warnEl);
            }
        } else {
            // Admin: see all kelas and mapel
            daftarMapel.forEach(m => { selectM.innerHTML += `<option value="${m.kode}">${m.namaLengkap}</option>`; });
            listKelasSemua.forEach(k => { selectK.innerHTML += `<option value="${k}">${k}</option>`; });
        }

        updateTabVisibilityErapor();
    }

    // ============================================================
    // RIWAYAT KOREKSI
