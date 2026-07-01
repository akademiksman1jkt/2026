


// ============================================================
// DATABASE / STATE MANAGEMENT UNTUK AKSES MENU DINAMIS
// ============================================================
let cloudUserMenuMapping = {}; // Menyimpan konfigurasi kustom { "username": ["menu1", "menu2"] }

// ============================================================
// 1. FILTER USER BERDASARKAN ROLE (CASE-INSENSITIVE)
// ============================================================
function filterUserBerdasarkanRole() {
    const roleTerpilih = document.getElementById('aksesFilterRole').value;
    const selectUser = document.getElementById('aksesTargetUser');
    
    // Kembalikan ke opsi default awal
    selectUser.innerHTML = '<option value="">-- Pilih Akun / User Target --</option>';
    
    if (!roleTerpilih) {
        selectUser.disabled = true;
        return;
    }
    
    if (!Array.isArray(cloudUsersCache) || cloudUsersCache.length === 0) {
        selectUser.innerHTML = '<option value="">Database akun (cloudUsersCache) kosong</option>';
        selectUser.disabled = true;
        return;
    }
    
    const targetLower = roleTerpilih.toLowerCase().trim();
    
    // Saring database user (Mendukung format Array Spreadsheet maupun Object JSON)
    const userTerfilter = cloudUsersCache.filter(user => {
        if (!user) return false;
        if (typeof user === 'object' && !Array.isArray(user)) {
            const roleUser = (user.role || user.status || "").toLowerCase().trim();
            return roleUser === targetLower || roleUser.includes(targetLower);
        }
        if (Array.isArray(user)) {
            return user.some(kolom => {
                if (typeof kolom === 'string') {
                    const kolomLower = kolom.toLowerCase().trim();
                    return kolomLower === targetLower || (kolomLower === 'siswa' && targetLower.includes('siswa'));
                }
                return false;
            });
        }
        return false;
    });
    
    if (userTerfilter.length === 0) {
        selectUser.innerHTML = '<option value="">Tidak ada nama akun yang cocok</option>';
        selectUser.disabled = true;
        return;
    }
    
    // Masukkan data hasil filter ke Dropdown Nomor 2
    userTerfilter.forEach(user => {
        let username = "";
        let namaLengkap = "";
        
        if (Array.isArray(user)) {
            username = user[0] || "";
            namaLengkap = user[2] || user[0] || "User Tanpa Nama";
        } else {
            username = user.username || user.nisn || user.id || "";
            namaLengkap = user.nama || user.namaLengkap || username || "User Tanpa Nama";
        }
        
        if (username) {
            const option = document.createElement('option');
            option.value = username;
            option.innerText = `${namaLengkap} (${username})`;
            selectUser.appendChild(option);
        }
    });
    
    selectUser.disabled = false;
    clearChecklistAksesMenu();
}

// ============================================================
// 2. MUAT ULANG STATUS CENTANG CHECKBOX SAAT USER DIPILIH
// ============================================================
function muatUlangChecklistMenuUser() {
    clearChecklistAksesMenu();
    const username = document.getElementById('aksesTargetUser').value;
    
    if (username && cloudUserMenuMapping[username]) {
        const menuDiizinkan = cloudUserMenuMapping[username];
        document.querySelectorAll('.cb-akses-menu').forEach(cb => {
            if (menuDiizinkan.includes(cb.value)) {
                cb.checked = true;
            }
        });
    }
}

function clearChecklistAksesMenu() {
    document.querySelectorAll('.cb-akses-menu').forEach(cb => cb.checked = false);
}

// ============================================================
// 3. FUNGSI UTAMA: SIMPAN & HAPUS AKSES MENU SECARA DINAMIS
// ============================================================
function simpanAksesMenuDinamis() {
    const role = document.getElementById('aksesFilterRole').value;
    const username = document.getElementById('aksesTargetUser').value;
    
    if (!role || !username) {
        alert("Silakan pilih Status Akun dan User Target terlebih dahulu!");
        return;
    }
    
    // Kumpulkan menu-menu yang dicentang admin
    let menuDipilih = [];
    document.querySelectorAll('.cb-akses-menu:checked').forEach(cb => {
        menuDipilih.push(cb.value);
    });
    
    // KONDISI HAPUS AKSES: Jika tidak ada menu yang dicentang sama sekali
    if (menuDipilih.length === 0) {
        if (cloudUserMenuMapping && cloudUserMenuMapping[username]) {
            delete cloudUserMenuMapping[username]; // Hapus total data kustom dari memory
        }
        alert(`Sukses! Hak akses khusus untuk user '${username}' telah DIHAPUS.\nAkun ini otomatis kembali ke pengaturan menu standar.`);
    } else {
        // KONDISI SIMPAN/UPDATE AKSES: Jika ada menu yang dicentang
        cloudUserMenuMapping[username] = menuDipilih;
        alert(`Sukses! Hak akses menu samping untuk user '${username}' berhasil disimpan.`);
    }
    
    // Sinkronisasi live update visual jika admin sedang mensimulasikan akun tersebut
    if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.username === username) {
        if (typeof tegakkanHakAksesSistem === 'function') tegakkanHakAksesSistem();
    }
}

