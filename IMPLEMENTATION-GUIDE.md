# 📖 TUTORIAL IMPLEMENTASI SISTEM KELOLA AKSES MENU

## 🎯 Ringkasan Masalah & Solusi

### Masalah Awal
```
❌ Admin tidak bisa mengatur menu apa saja yang tampil di masing-masing user
❌ Meskipun sudah dipilih dan disimpan, menu tidak berubah
❌ Tidak ada sistem persistensi data menu per role
```

### Solusi yang Disediakan
```
✅ Sistem manajemen menu berbasis localStorage dengan data persistence
✅ Admin panel intuitif untuk manage menu per role
✅ Automatic rendering menu sesuai role yang login
✅ Real-time preview & statistics
✅ Export/Import configuration
✅ Reset to default option
```

---

## 📦 File-File yang Disediakan

| File | Ukuran | Fungsi |
|------|--------|--------|
| `menu-access-control.js` | ~12KB | Core library untuk menu management |
| `admin-kelola-akses-menu.html` | ~20KB | Admin panel UI |
| `menu-integration.js` | ~7KB | Integration dengan main app |
| `README-MENU-SYSTEM.md` | ~7KB | Dokumentasi teknis |
| `IMPLEMENTATION-GUIDE.md` | ~10KB | Panduan implementasi ini |

---

## 🚀 SETUP LANGKAH DEMI LANGKAH

### LANGKAH 1: Copy File ke Project

Copy 3 file berikut ke root folder project Anda:
```
akademiksman1jkt/2026/
├── menu-access-control.js
├── menu-integration.js
└── admin-kelola-akses-menu.html
```

### LANGKAH 2: Tambah Script di index.html

Buka `index.html` dan tambahkan **sebelum closing `</body>` tag**:

```html
<!-- MENU ACCESS CONTROL SYSTEM -->
<script src="menu-access-control.js"></script>
<script src="menu-integration.js"></script>
```

**PENTING**: Urutan loading harus:
1. `menu-access-control.js` (core library)
2. `menu-integration.js` (integration layer)

### LANGKAH 3: Update Login Handler

Cari function yang handle login sukses di `index.html`, biasanya terlihat seperti:

```javascript
// SEBELUM (TIDAK LENGKAP)
function handleLoginSuccess(userData) {
    // ... existing code ...
    showMainApp();
}
```

**Ubah menjadi:**

```javascript
// SESUDAH (DENGAN MENU SYSTEM)
function handleLoginSuccess(userData) {
    // ... existing code ...
    
    // ✅ TAMBAHKAN: Set user role untuk menu system
    if (window.menuIntegration) {
        menuIntegration.setUserRole(userData.role);
    }
    
    // ✅ TAMBAHKAN: Render menu berdasarkan akses
    if (window.menuIntegration) {
        menuIntegration.renderMenuAfterLogin();
    }
    
    showMainApp();
}
```

**Contoh lengkap untuk berbagai framework:**

#### Jika Menggunakan Form HTML Biasa:
```html
<form onsubmit="handleLoginForm(event)">
    <input type="text" id="username" placeholder="Username">
    <input type="password" id="password" placeholder="Password">
    <input type="hidden" id="userRole" value="siswa">
    <button type="submit">Login</button>
</form>

<script>
function handleLoginForm(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('userRole').value; // dari server
    
    // Validate username & password (di server)
    // ...
    
    // Jika sukses:
    const userData = {
        id: 1,
        name: 'John Doe',
        role: role // 'admin', 'guru', 'siswa', 'orang_tua'
    };
    
    handleLoginSuccess(userData);
}

function handleLoginSuccess(userData) {
    // Set user role untuk menu system
    menuIntegration.setUserRole(userData.role);
    menuIntegration.renderMenuAfterLogin();
    
    // Show main app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('wrapper').style.display = 'flex';
}
</script>
```

### LANGKAH 4: Akses Admin Panel

Tambahkan link ke admin panel di sidebar menu (untuk role admin):

```html
<!-- Di dalam .sidebar-menu untuk admin -->
<div class="menu-item" onclick="window.open('admin-kelola-akses-menu.html', '_blank')">
    <i class="ri-menu-unfold-line"></i>
    <span>Kelola Akses Menu</span>
</div>
```

Atau buat button khusus:

```javascript
// Add menu item dinamis untuk admin
function addAdminMenuPanel() {
    if (menuIntegration.getUserRole() === 'admin') {
        const menuContainer = document.querySelector('.sidebar-menu');
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <i class="ri-menu-unfold-line"></i>
            <span>Kelola Akses Menu</span>
        `;
        menuItem.onclick = () => {
            window.open('admin-kelola-akses-menu.html', '_blank');
        };
        menuContainer.appendChild(menuItem);
    }
}

// Call setelah login
addAdminMenuPanel();
```

### LANGKAH 5: Test Implementation

#### A. Test Admin Panel

1. Buka browser → `admin-kelola-akses-menu.html`
2. Akan melihat panel dengan 4 tab: ADMIN, GURU, SISWA, ORANG_TUA
3. Check/uncheck menu untuk enable/disable
4. Klik "Simpan Perubahan"
5. Buka DevTools → Application → localStorage → cek key `akademik_menu_access`

#### B. Test Menu Rendering

1. Login sebagai user berbeda role
2. Sidebar menu akan otomatis menyesuaikan
3. Buka DevTools Console → jalankan:
   ```javascript
   console.log(menuIntegration.getUserRole()); // see current role
   console.log(menuAccess.getVisibleMenus(menuIntegration.getUserRole())); // see visible menus
   ```

#### C. Test Access Control

1. Disable menu tertentu di admin panel
2. Logout & login lagi
3. Menu yang di-disable tidak akan tampil
4. Jika coba akses via console: `handleMenuClick('hidden_menu', {preventDefault:()=>{}})` → error notification

---

## 🎮 WORKFLOW PENGGUNAAN

### Untuk Admin:

```
1. Admin Login
   ↓
2. Sidebar menu tampil (hanya menu yang enable untuk admin)
   ↓
3. Klik "Kelola Akses Menu" 
   ↓
4. Admin Panel terbuka
   ↓
5. Pilih tab role (GURU/SISWA/ORANG_TUA)
   ↓
6. Check/uncheck menu sesuai kebutuhan
   ↓
7. Klik "Simpan Perubahan"
   ↓
8. Config disimpan ke localStorage
   ↓
9. Ketika user dengan role tsb login → menu mereka sudah sesuai config
```

### Untuk User Lain (Guru/Siswa/Orang Tua):

```
1. User Login
   ↓
2. menuIntegration.setUserRole() dipanggil dengan role mereka
   ↓
3. menuIntegration.renderMenuAfterLogin() render menu
   ↓
4. Hanya menu yang di-enable admin yang tampil
   ↓
5. User tidak bisa akses menu hidden (will show error notification)
```

---

## ⚙️ CUSTOMIZATION

### Menambah Menu Baru

Edit `menu-access-control.js`, cari bagian `this.defaultMenus`:

```javascript
this.defaultMenus = {
    admin: [
        { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true },
        // ... existing menus ...
        
        // ✅ TAMBAH MENU BARU
        { 
            id: 'manajemen_kurikulum', 
            label: 'Manajemen Kurikulum', 
            icon: 'ri-book-line', 
            visible: true 
        }
    ]
}
```

### Menambah Role Baru

Misal ingin tambah role `kepala_sekolah`:

```javascript
this.defaultMenus = {
    admin: [...],
    guru: [...],
    siswa: [...],
    orang_tua: [...],
    
    // ✅ TAMBAH ROLE BARU
    kepala_sekolah: [
        { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true },
        { id: 'laporan_akademik', label: 'Laporan Akademik', icon: 'ri-file-chart-line', visible: true },
        { id: 'laporan_keuangan', label: 'Laporan Keuangan', icon: 'ri-money-dollar-circle-line', visible: true },
    ]
}
```

### Mengubah Icons

Gunakan icons dari Remixicon: https://remixicon.com/

Cari icon yang sesuai, misalnya untuk "Manajemen User":
- Awalnya: `icon: 'ri-user-settings-line'`
- Ganti dengan: `icon: 'ri-admin-line'` atau `icon: 'ri-user-add-line'`

---

## 🔍 DEBUGGING

### Problem 1: Menu tidak tampil setelah login

**Diagnostik:**
```javascript
// Buka DevTools Console, ketik:
console.log('menuAccess loaded?', window.menuAccess ? 'YES' : 'NO');
console.log('menuIntegration loaded?', window.menuIntegration ? 'YES' : 'NO');
console.log('Current role:', menuIntegration.getUserRole());
console.log('Visible menus:', menuAccess.getVisibleMenus(menuIntegration.getUserRole()));
```

**Solusi:**
- Pastikan kedua script sudah di-load: check Network tab di DevTools
- Pastikan `menuIntegration.setUserRole()` dipanggil saat login
- Clear localStorage: `localStorage.clear()` lalu refresh

### Problem 2: localStorage tidak tersimpan

**Solusi:**
- Check apakah browser allow localStorage (Privacy/Incognito mode blocks it)
- Check disk space
- Check browser settings: Settings → Privacy & Security → Cookies & site data

### Problem 3: Menu masih bisa diakses padahal sudah di-hide

**Penting untuk security:**
- Frontend-side hiding **bukan** security
- Harus validate di backend/server juga
- User bisa bypass dengan memodifikasi localStorage

**Solusi:**
```javascript
// ✅ Backend validation (PHP/Node.js/etc)
app.get('/api/user/menu', (req, res) => {
    // 1. Verify user authenticated
    if (!req.session.user) return res.status(401).json({error: 'Not authenticated'});
    
    // 2. Get user role
    const role = req.session.user.role;
    
    // 3. Validate role from database
    const userRoleFromDB = await User.findById(req.session.user.id).role;
    if (userRoleFromDB !== role) return res.status(403).json({error: 'Invalid role'});
    
    // 4. Load menu config from database (not from client!)
    const menuConfig = await MenuConfig.findByRole(role);
    
    // 5. Send to client
    res.json(menuConfig);
});
```

---

## 📊 DATA STRUCTURE

### localStorage Format

Key: `akademik_menu_access`

Value (JSON):
```json
{
  "admin": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "icon": "ri-dashboard-line",
      "visible": true
    },
    {
      "id": "kelola_user",
      "label": "Kelola User",
      "icon": "ri-user-settings-line",
      "visible": true
    }
  ],
  "guru": [
    {
      "id": "dashboard",
      "label": "Dashboard",
      "icon": "ri-dashboard-line",
      "visible": true
    },
    {
      "id": "input_nilai",
      "label": "Input Nilai",
      "icon": "ri-file-list-line",
      "visible": true
    }
  ],
  "siswa": [...],
  "orang_tua": [...]
}
```

---

## 📚 API REFERENCE

### MenuAccessControl

```javascript
// Get all menus for role
menuAccess.getMenuByRole('admin');

// Get only visible menus
menuAccess.getVisibleMenus('guru');

// Update single menu
menuAccess.updateMenuVisibility('siswa', 'dashboard', false);

// Update multiple menus
menuAccess.updateMultipleMenus('siswa', [
    { id: 'dashboard', visible: true },
    { id: 'lihat_nilai', visible: false }
]);

// Save to localStorage
menuAccess.saveToStorage(configObject);

// Load from localStorage
const config = menuAccess.loadFromStorage();

// Reset to default
menuAccess.init();
```

### MenuIntegration

```javascript
// Set user role (after login)
menuIntegration.setUserRole('admin');

// Get current role
menuIntegration.getUserRole();

// Render menu in sidebar
menuIntegration.renderMenuAfterLogin();

// Check menu access
menuIntegration.hasMenuAccess('kelola_user');

// Get menu details
menuIntegration.getMenuById('dashboard');

// Refresh menu
menuIntegration.refreshMenu();
```

---

## ✅ IMPLEMENTATION CHECKLIST

- [ ] Copy 3 file ke project folder
- [ ] Add script imports ke index.html
- [ ] Test script loading (DevTools → Network/Console)
- [ ] Update login handler dengan `setUserRole()`
- [ ] Test dengan login berbagai role
- [ ] Verify localStorage content
- [ ] Test admin panel buka/close/edit/save
- [ ] Test export/import config
- [ ] Test reset to default
- [ ] Test access control (hide menu & verify tidak bisa diakses)
- [ ] Test mobile responsiveness
- [ ] Add backend validation untuk security

---

## 🎓 CONTOH IMPLEMENTASI LENGKAP

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Portal Akademik</title>
</head>
<body>
    <!-- Login Screen -->
    <div id="loginScreen">
        <form onsubmit="handleLogin(event)">
            <input type="text" id="username" placeholder="Username">
            <input type="password" id="password" placeholder="Password">
            <select id="roleSelect">
                <option value="admin">Admin</option>
                <option value="guru">Guru</option>
                <option value="siswa">Siswa</option>
                <option value="orang_tua">Orang Tua</option>
            </select>
            <button type="submit">Login</button>
        </form>
    </div>
    
    <!-- Main App -->
    <div id="wrapper" style="display: none;">
        <div class="sidebar">
            <div class="sidebar-menu"></div>
        </div>
        <div class="main-content">
            <!-- Content will be here -->
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="menu-access-control.js"></script>
    <script src="menu-integration.js"></script>
    
    <script>
        function handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('roleSelect').value;
            
            // Validate (in real app, do this in server!)
            if (username && password) {
                const userData = {
                    id: 1,
                    name: 'Test User',
                    role: role
                };
                handleLoginSuccess(userData);
            }
        }
        
        function handleLoginSuccess(userData) {
            // 1. Set user role
            menuIntegration.setUserRole(userData.role);
            
            // 2. Render menu
            menuIntegration.renderMenuAfterLogin();
            
            // 3. Show main app
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('wrapper').style.display = 'flex';
        }
    </script>
</body>
</html>
```

---

## 📞 FAQ

**Q: Apakah frontend localStorage secure untuk menyimpan config menu?**
A: Tidak. Untuk production, simpan config di database server dan validate setiap request.

**Q: Bagaimana jika user edit localStorage?**
A: Sistem ini hanya untuk UX. Backend harus validate menu access sebelum show content.

**Q: Bisa tambah role baru?**
A: Ya, edit `this.defaultMenus` di `menu-access-control.js`.

**Q: Bisa reset config individual?**
A: Ya, gunakan tombol "Reset ke Default" di admin panel.

**Q: Apakah perlu internet untuk bekerja?**
A: Tidak, semua data tersimpan di localStorage browser.

---

**Version**: 1.0  
**Last Updated**: 2024-07-01  
**Created for**: Portal Akademik SMAN 1 Jakarta
