    function pilihSiswaAutocomplete(nisn, nama) {
        // 🔒 LOCKDOWN MUTLAK SISWA: Jika siswa mencoba memicu fungsi ini lewat konsol browser, paksa ke datanya sendiri
        if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.role === 'siswaSMAN1') {
            document.getElementById('searchKey').value = sessionUserAktif.username;
            document.getElementById('searchSuggestions').style.display = 'none';
            cariNilaiSiswa();
            return;
        }

        // Jalur normal untuk Admin / Guru
        document.getElementById('searchKey').value = nisn;
        document.getElementById('searchSuggestions').style.display = 'none';
        cariNilaiSiswa();
    }

    // ============================================================
    // LOGIN & LOGOUT
    // ============================================================
    // Timer untuk polling status data cloud (dibersihkan saat login berhasil)
    let _loginWaitTimer = null;

    function _cobaLoginDenganData(uInp, pInp) {
        const errLbl = document.getElementById('loginError');
        const btnMsk = document.getElementById('btnMasuk');

        // Cek cloudUsersCache
        let targetUser = cloudUsersCache.find(function(u) { return u.username === uInp && u.pass === pInp; });

        // Fallback: localStorage cache
        if (!targetUser) {
            try {
                let lc = JSON.parse(localStorage.getItem("offline_users_sman1") || "[]");
                let t  = lc.find(function(u) { return u.username === uInp && u.pass === pInp; });
                if (t) { if (!cloudUsersCache.length) { cloudUsersCache = lc; cloudDataLoaded = true; } targetUser = t; }
            } catch(e) {}
        }

        if (targetUser) {
            if (_loginWaitTimer) { clearInterval(_loginWaitTimer); _loginWaitTimer = null; }
            if (btnMsk) btnMsk.disabled = false;
            sessionUserAktif = { username: targetUser.username, role: targetUser.role };
            localStorage.setItem("session_user_sman1", JSON.stringify(sessionUserAktif));
            bukaHalamanDashboard();
            return true;
        }
        return false;
    }

    function prosesLogin() {
        const uInp   = document.getElementById('username').value.trim();
        const pInp   = document.getElementById('password').value;
        const errLbl = document.getElementById('loginError');
        const btnMsk = document.getElementById('btnMasuk');

        errLbl.style.display = 'none';
        if (_loginWaitTimer) { clearInterval(_loginWaitTimer); _loginWaitTimer = null; }

        if (!uInp) { errLbl.innerHTML = 'Masukkan username.'; errLbl.style.display='block'; return; }

        // Admin hardcode — selalu bisa masuk tanpa cloud
        if (uInp === "admin" && pInp === "admin123") {
            sessionUserAktif = { username: "admin", role: "AdminSMAN1" };
            localStorage.setItem("session_user_sman1", JSON.stringify(sessionUserAktif));
            bukaHalamanDashboard();
            return;
        }

        // Coba login sekarang (mungkin data sudah ada)
        if (_cobaLoginDenganData(uInp, pInp)) return;

        // Data belum siap — tunggu dengan polling setiap 500ms (max 12 detik)
        if (btnMsk) btnMsk.disabled = true;
        let elapsed = 0;
        errLbl.innerHTML = '⏳ Menghubungkan ke server akun...';
        errLbl.style.display = 'block';

        _loginWaitTimer = setInterval(function() {
            elapsed += 500;
            // Update pesan setiap 2 detik
            if (elapsed % 2000 === 0) {
                errLbl.innerHTML = '⏳ Memuat data... (' + (elapsed/1000) + 's)';
            }
            // Coba login
            if (_cobaLoginDenganData(uInp, pInp)) return;

            // Timeout 12 detik
            if (elapsed >= 12000) {
                clearInterval(_loginWaitTimer); _loginWaitTimer = null;
                if (btnMsk) btnMsk.disabled = false;
                if (cloudUsersCache.length > 0) {
                    errLbl.innerHTML = '❌ Username atau password salah.';
                } else {
                    errLbl.innerHTML = '⚠️ Tidak dapat terhubung ke server.<br>Gunakan akun <b>admin / admin123</b> atau cek koneksi internet.';
                }
                errLbl.style.display = 'block';
            }
        }, 500);
    }

    function bukaHalamanDashboard() {
        sessionStorage.setItem("status_lockscreen_terbuka", "true");
        document.getElementById('loginScreen').style.display   = 'none';
        document.getElementById('mainDashboard').style.display = 'flex';
        document.getElementById('mobileHeader').style.display  = 'flex';
        document.getElementById('lblUserAktif').innerText      = sessionUserAktif.username;
        document.getElementById('lblRoleAktif').innerText      = sessionUserAktif.role;
        tegakkanHakAksesSistem();
        populateMapelDropdownKoreksi();
        switchSidebarMenu(menuAktifSebelumnya);
    }

    function tegakkanHakAksesSistem() {
        if (!Array.isArray(cloudUsersCache))   cloudUsersCache   = [];
        if (!Array.isArray(cloudPlottingCache)) cloudPlottingCache = [];
        if (typeof cloudUserMenuMapping === 'undefined') cloudUserMenuMapping = {};

        const role = sessionUserAktif.role;
        const usernameAktif = sessionUserAktif.username;
        
        // 1. DAFTAR MASTER SEMUA ID ELEMEN MENU SIDEBAR (Sesuai dengan HTML Anda)
        const masterMenu = [
            'btnNavPersonal', 'btnNavBiodata', 'btnNavKehadiranSiswa', 
            'btnNavKehadiranGuru', 'btnNavAbsenGuru', 'btnNavKelas', 
            'btnNavAngkatan', 'btnNavErapor', 'btnNavKoreksi', 
            'btnNavEvaluasi', 'btnNavVoting', 'btnNavAIHub', 
            'sidebarAdminGroup', 'btnNavKelolaAkses'
        ];

        // Sembunyikan semua menu terlebih dahulu secara total
        masterMenu.forEach(id => { 
            const el = document.getElementById(id);
            if (el) el.style.display = 'none'; 
        });

        // ============================================================
        // ⭐ JALUR UTAMA: JIKA USER INI PUNYA HAK AKSES KUSTOM DARI ADMIN
        // ============================================================
        if (cloudUserMenuMapping[usernameAktif] && Array.isArray(cloudUserMenuMapping[usernameAktif])) {
            
            // Hidupkan hanya menu-menu tertentu yang dicentang oleh Admin
            cloudUserMenuMapping[usernameAktif].forEach(id => {
                // Konversi jika data lama checkbox masih mengirimkan teks ID 'btnNavKetidakhadiranGuru'
                let realId = id;
                if (id === 'btnNavKetidakhadiranGuru') realId = 'btnNavAbsenGuru';
                
                const el = document.getElementById(realId);
                if (el) el.style.display = 'flex';
            });

            // Pengondisian otomatis jika yang login adalah akun siswa
            if (role === 'SiswaSMAN1' || role === 'siswaSMAN1') {
                if (cloudUserMenuMapping[usernameAktif].includes('btnNavPersonal')) {
                    if (typeof cariNilaiSiswa === 'function') cariNilaiSiswa();
                }
            }
            
            // Jaga agar Admin tetap bisa mengelola akses walau hak menunya dikustomisasi
            if (role === 'AdminSMAN1') {
                const elAdminGroup = document.getElementById('sidebarAdminGroup');
                if (elAdminGroup) elAdminGroup.style.display = 'block';
                const elKelola = document.getElementById('btnNavKelolaAkses');
                if (elKelola) elKelola.style.display = 'flex';
            }
            
            return; // 🛑 Keluar dari fungsi, abaikan aturan default role di bawah!
        }

        // ============================================================
        // ─── JALUR CADANGAN: ATURAN DEFAULT ROLE (JIKA BELUM DIKUSTOM) ───
        // ============================================================
        
        // Hak Akses Default Admin dan Wali
        if (role === 'AdminSMAN1' || role === 'WaliSMAN1') {
            ['btnNavPersonal','btnNavBiodata','btnNavKehadiranSiswa','btnNavKehadiranGuru','btnNavAbsenGuru','btnNavKelas','btnNavAngkatan','btnNavErapor','btnNavKoreksi','btnNavEvaluasi','btnNavVoting','btnNavAIHub'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'flex';
            });
            if (role === 'AdminSMAN1') {
                const elAdmin = document.getElementById('sidebarAdminGroup');
                if (elAdmin) elAdmin.style.display = 'block';
                const elKelola = document.getElementById('btnNavKelolaAkses');
                if (elKelola) elKelola.style.display = 'flex';
            }
            
        // Hak Akses Default Guru
        } else if (role === 'GuruSMAN1') {
            ['btnNavErapor','btnNavVoting','btnNavKelas','btnNavAngkatan','btnNavEvaluasi','btnNavPersonal','btnNavBiodata','btnNavKehadiranSiswa','btnNavKehadiranGuru','btnNavAbsenGuru'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'flex';
            });
            
        // Hak Akses Default Siswa
        } else if (role === 'SiswaSMAN1' || role === 'siswaSMAN1') {
            ['btnNavPersonal', 'btnNavKoreksi'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.display = 'flex';
            });

            // 🔒 Sembunyikan paksa menu-menu sensitif berikut dari pandangan siswa default
            ['btnNavBiodata', 'btnNavKehadiranSiswa', 'btnNavKehadiranGuru', 'btnNavAbsenGuru'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.setProperty('display', 'none', 'important');
            });

            // Jalankan operasi pembersihan kotak input cari nilai mandiri siswa
            const boxCariSiswa = document.getElementById('boxPencarianSiswaIndividu');
            if (boxCariSiswa) boxCariSiswa.style.setProperty('display', 'none', 'important');

            const inputKey = document.getElementById('searchKey');
            if (inputKey) {
                inputKey.style.setProperty('display', 'none', 'important');
                const areaPencarian = inputKey.closest('.search-box') || inputKey.closest('.search-container') || inputKey.parentElement;
                if (areaPencarian) areaPencarian.style.setProperty('display', 'none', 'important');
            }

            const suggestionsEl = document.getElementById('searchSuggestions');
            if (suggestionsEl) {
                suggestionsEl.innerHTML = '';
                suggestionsEl.style.setProperty('display', 'none', 'important');
            }

            if (typeof cariNilaiSiswa === 'function') cariNilaiSiswa();
        }
    }

    function prosesLogout() {
        sessionUserAktif = null;
        localStorage.removeItem("session_user_sman1");
        sessionStorage.removeItem("status_lockscreen_terbuka");
        // Catatan: offline_users_sman1 & offline_siswa_sman1 sengaja TIDAK dihapus
        // agar pengguna tetap bisa login offline setelah pernah login online sebelumnya
        location.reload();
    }

    function bukaLockscreen() {
        const pwInput = document.getElementById('inputPasswordLockscreen');
        const errMsg  = document.getElementById('pesanErrorLockscreen');
        const tirai   = document.getElementById('tiraiLockscreenMurni');

        if (!tirai) return;

        // Jika tidak ada sesi aktif: tutup layar kunci dan tampilkan form login biasa
        if (!sessionUserAktif) {
            tirai.style.display = 'none';
            sessionStorage.setItem("status_lockscreen_terbuka", "true");
            return;
        }

        const pw = pwInput ? pwInput.value : '';

        // Admin: password hardcode
        if (sessionUserAktif.username === 'admin' && pw === 'admin123') {
            tirai.style.display = 'none';
            sessionStorage.setItem("status_lockscreen_terbuka", "true");
            bukaHalamanDashboard();
            return;
        }

        // Cari password user di cache cloud
        const userRecord = (cloudUsersCache || []).find(function(u) {
            return u.username === sessionUserAktif.username && u.pass === pw;
        });

        if (userRecord) {
            tirai.style.display = 'none';
            sessionStorage.setItem("status_lockscreen_terbuka", "true");
            bukaHalamanDashboard();
        } else {
            if (errMsg) {
                errMsg.textContent = 'Password salah. Coba lagi.';
                errMsg.style.display = 'block';
            }
            if (pwInput) pwInput.value = '';
        }
    }

