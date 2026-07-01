# Panduan Implementasi Sistem Kelola Akses Menu

## 📋 Ringkasan Perbaikan

Anda mengalami masalah dimana **admin tidak bisa mengatur menu yang tampil di masing-masing user**, meskipun sudah dipilih dan disimpan. Saya telah membuat sistem manajemen akses menu yang robust dengan fitur-fitur berikut:

### ✨ Fitur Utama

1. **Menu Access Control System** (`menu-access-control.js`)
   - Sistem penyimpanan preferensi menu per role user
   - Menggunakan localStorage untuk persistensi data
   - Support 4 role: Admin, Guru, Siswa, Orang Tua
   - CRUD operations untuk menu management

2. **Admin Panel** (`admin-kelola-akses-menu.html`)
   - Interface user-friendly untuk admin
   - Tab navigation untuk setiap role
   - Toggle checkbox untuk show/hide menu
   - Real-time statistics
   - Export/Import configuration
   - Reset to default option

3. **Menu Integration** (`menu-integration.js`)
   - Render sidebar menu sesuai akses user
   - Dynamic menu loading berdasarkan role
   - Role validation sebelum navigasi
   - Session management

## 🚀 Cara Implementasi

### Step 1: Tambahkan Script ke index.html

Di bagian `</head>` atau sebelum `</body>`, tambahkan:

```html
<!-- MENU ACCESS CONTROL SYSTEM -->
<script src="menu-access-control.js"></script>
<script src="menu-integration.js"></script>
```

### Step 2: Perbarui Login Handler

Setelah user login berhasil, set user role:

```javascript
// Di function login yang sudah ada
function handleLoginSuccess(userData) {
    // ... existing login logic ...
    
    // Set user role untuk menu system
    menuIntegration.setUserRole(userData.role); // 'admin', 'guru', 'siswa', 'orang_tua'
    
    // Simpan session
    sessionStorage.setItem('userRole', userData.role);
}
```

### Step 3: Update Menu Rendering

Ganti code yang render sidebar menu dengan:

```javascript
// Di tempat sidebar menu dirender (biasanya setelah login)
menuIntegration.renderMenuAfterLogin();
```

### Step 4: Akses Admin Panel

Buat link atau button ke admin panel di menu admin:

```html
<!-- Di menu admin -->
<a href="admin-kelola-akses-menu.html" class="menu-item">
    <i class="ri-menu-unfold-line"></i>
    <span>Kelola Akses Menu</span>
</a>
```

## 📊 Struktur Data

Data disimpan di localStorage dengan key: `akademik_menu_access`

Format JSON:
```json
{
  "admin": [
    { "id": "dashboard", "label": "Dashboard", "icon": "ri-dashboard-line", "visible": true },
    { "id": "kelola_user", "label": "Kelola User", "icon": "ri-user-settings-line", "visible": true },
    ...
  ],
  "guru": [...],
  "siswa": [...],
  "orang_tua": [...]
}
```

## 🔧 API Reference

### MenuAccessControl Class

```javascript
// Get visible menus untuk role tertentu
const menus = menuAccess.getVisibleMenus('admin');

// Update menu visibility
menuAccess.updateMenuVisibility('admin', 'kelola_user', false);

// Update multiple menus
menuAccess.updateMultipleMenus('admin', [
    { id: 'kelola_user', visible: false },
    { id: 'laporan', visible: true }
]);

// Export config
const config = menuAccess.loadFromStorage();

// Import config
menuAccess.saveToStorage(newConfig);
```

### MenuIntegration Class

```javascript
// Set user role setelah login
menuIntegration.setUserRole('admin');

// Get current user role
const role = menuIntegration.getUserRole();

// Check menu access
if (menuIntegration.hasMenuAccess('kelola_user')) {
    // User punya akses
}

// Refresh menu (dipanggil ketika admin ubah config)
menuIntegration.refreshMenu();
```

## 🎯 Workflow Lengkap

### Untuk Admin:

1. Admin login → Menu system load
2. Admin ke **Kelola Akses Menu**
3. Pilih role (Admin/Guru/Siswa/Orang Tua)
4. Check/uncheck menu yang ingin ditampilkan
5. Klik **Simpan Perubahan**
6. Config disimpan ke localStorage

### Untuk User Lain:

1. User login → Role terdeteksi
2. Menu dirender berdasarkan config yang sudah disimpan admin
3. User hanya bisa akses menu yang di-enable admin
4. Jika coba akses menu yang tidak di-enable → error notification

## ⚙️ Customization

### Menambah Menu Baru

Edit di `menu-access-control.js`:

```javascript
this.defaultMenus = {
    admin: [
        // ... existing menus ...
        { id: 'menu_baru', label: 'Menu Baru', icon: 'ri-icon-line', visible: true }
    ]
}
```

### Menambah Role Baru

```javascript
this.defaultMenus = {
    admin: [...],
    guru: [...],
    siswa: [...],
    orang_tua: [...],
    role_baru: [
        { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true }
    ]
}
```

### Mengubah Icons

Gunakan Remixicon icons: https://remixicon.com/

```javascript
{ id: 'menu_id', label: 'Menu Label', icon: 'ri-new-icon-line', visible: true }
```

## 🐛 Troubleshooting

### Menu tidak tampil setelah login

**Solusi:**
1. Pastikan `menu-access-control.js` dan `menu-integration.js` sudah di-load
2. Check console untuk error messages
3. Pastikan user role sudah di-set dengan `menuIntegration.setUserRole()`

### Config tidak tersimpan

**Solusi:**
1. Check apakah browser allow localStorage
2. Pastikan data config format JSON valid
3. Clear localStorage dan reset ke default

### Menu masih tampil padahal sudah di-hide

**Solusi:**
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check apakah ada cache di server
4. Verify config di localStorage

## 📝 File yang Dibuat

| File | Fungsi |
|------|--------|
| `menu-access-control.js` | Core menu management system |
| `admin-kelola-akses-menu.html` | Admin panel untuk manage menu |
| `menu-integration.js` | Integration dengan UI utama |
| `README.md` | Dokumentasi ini |

## 🔒 Security Notes

⚠️ **PENTING**: Validasi akses menu juga harus dilakukan di **backend/server-side** karena:
- localStorage bisa diedit user via console
- Frontend validation hanya untuk UX, bukan security

Implementasi yang aman:
```php
// Backend (PHP/Node.js/etc)
// Sebelum show content, validate:
// 1. User authenticated
// 2. User role has permission untuk menu ini
// 3. Load config dari database, bukan dari client storage
```

## ✅ Checklist Implementasi

- [ ] Copy `menu-access-control.js` ke project
- [ ] Copy `admin-kelola-akses-menu.html` ke project
- [ ] Copy `menu-integration.js` ke project
- [ ] Tambah script imports ke index.html
- [ ] Update login handler untuk set user role
- [ ] Test dengan berbagai role (admin, guru, siswa, orang_tua)
- [ ] Verify config tersimpan dengan buka DevTools → Application → localStorage
- [ ] Test admin panel: add/remove menu, export/import, reset
- [ ] Test user lihat menu yang sesuai dengan role mereka

## 📞 Support

Jika ada pertanyaan atau issue, cek:
1. Console browser (F12 → Console)
2. localStorage content (F12 → Application → localStorage)
3. Network tab untuk verify script loading
4. Network tab untuk verify no CORS issues

---

**Dibuat untuk Portal Akademik SMAN 1 Jakarta**
