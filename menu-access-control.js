/**
 * SISTEM MANAJEMEN AKSES MENU PER USER
 * File: menu-access-control.js
 * 
 * Fitur:
 * - Menyimpan preferensi menu untuk setiap user role
 * - Memuat menu sesuai akses yang telah diatur
 * - Persistensi data menggunakan localStorage + JSON
 */

class MenuAccessControl {
    constructor() {
        this.storageKey = 'akademik_menu_access';
        this.defaultMenus = {
            admin: [
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true },
                { id: 'kelola_user', label: 'Kelola User', icon: 'ri-user-settings-line', visible: true },
                { id: 'kelola_kelas', label: 'Kelola Kelas', icon: 'ri-building-line', visible: true },
                { id: 'kelola_nilai', label: 'Kelola Nilai', icon: 'ri-file-list-line', visible: true },
                { id: 'kelola_rapor', label: 'Kelola Rapor', icon: 'ri-file-text-line', visible: true },
                { id: 'voting_pleno', label: 'Voting Pleno', icon: 'ri-checkbox-multiple-line', visible: true },
                { id: 'laporan', label: 'Laporan', icon: 'ri-bar-chart-line', visible: true },
                { id: 'pengaturan', label: 'Pengaturan', icon: 'ri-settings-3-line', visible: true }
            ],
            guru: [
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true },
                { id: 'input_nilai', label: 'Input Nilai', icon: 'ri-file-list-line', visible: true },
                { id: 'lihat_rapor', label: 'Lihat Rapor', icon: 'ri-file-text-line', visible: true },
                { id: 'voting', label: 'Voting', icon: 'ri-checkbox-multiple-line', visible: true }
            ],
            siswa: [
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true },
                { id: 'lihat_nilai', label: 'Lihat Nilai', icon: 'ri-file-list-line', visible: true },
                { id: 'lihat_rapor', label: 'Lihat Rapor', icon: 'ri-file-text-line', visible: true }
            ],
            orang_tua: [
                { id: 'dashboard', label: 'Dashboard', icon: 'ri-dashboard-line', visible: true },
                { id: 'lihat_rapor_anak', label: 'Lihat Rapor', icon: 'ri-file-text-line', visible: true }
            ]
        };
        this.init();
    }

    /**
     * Inisialisasi system - load data dari storage atau gunakan default
     */
    init() {
        const stored = this.loadFromStorage();
        if (!stored) {
            this.saveToStorage(this.defaultMenus);
        }
    }

    /**
     * Simpan data akses menu ke localStorage
     */
    saveToStorage(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            console.log('✅ Menu access config saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving menu config:', error);
            return false;
        }
    }

    /**
     * Load data akses menu dari localStorage
     */
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Error loading menu config:', error);
            return null;
        }
    }

    /**
     * Dapatkan menu untuk role tertentu
     */
    getMenuByRole(role) {
        const allMenus = this.loadFromStorage();
        if (!allMenus || !allMenus[role]) {
            return this.defaultMenus[role] || [];
        }
        return allMenus[role];
    }

    /**
     * Dapatkan menu yang visible (filtered)
     */
    getVisibleMenus(role) {
        const menus = this.getMenuByRole(role);
        return menus.filter(menu => menu.visible === true);
    }

    /**
     * Update visibility satu menu
     */
    updateMenuVisibility(role, menuId, visible) {
        const allMenus = this.loadFromStorage();
        
        if (!allMenus[role]) {
            return false;
        }

        const menu = allMenus[role].find(m => m.id === menuId);
        if (menu) {
            menu.visible = visible;
            this.saveToStorage(allMenus);
            return true;
        }
        return false;
    }

    /**
     * Update multiple menu visibility sekaligus
     */
    updateMultipleMenus(role, updates) {
        const allMenus = this.loadFromStorage();
        
        if (!allMenus[role]) {
            return false;
        }

        updates.forEach(update => {
            const menu = allMenus[role].find(m => m.id === update.id);
            if (menu) {
                menu.visible = update.visible;
            }
        });

        this.saveToStorage(allMenus);
        return true;
    }

    /**
     * Render sidebar menu sesuai akses user
     */
    renderSidebarMenu(role, containerId = '.sidebar-menu') {
        const container = document.querySelector(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        const visibleMenus = this.getVisibleMenus(role);
        const html = visibleMenus.map(menu => {
            return `
                <div class="menu-item" data-menu-id="${menu.id}" onclick="handleMenuClick('${menu.id}')">
                    <i class="${menu.icon}"></i>
                    <span>${menu.label}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
        console.log(`✅ Sidebar menu rendered for role: ${role}`);
    }

    /**
     * Render admin panel untuk kelola akses menu
     */
    renderAccessControlPanel(role = 'admin', containerId = '#menu-access-panel') {
        const container = document.querySelector(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }

        const allMenus = this.loadFromStorage();
        
        let html = `
            <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 24px; color: #0f172a;">
                    <i class="ri-menu-unfold-line"></i> Kelola Akses Menu
                </h2>
        `;

        // Tab untuk setiap role
        html += `
            <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">
        `;

        Object.keys(allMenus).forEach(r => {
            const isActive = r === role ? 'active' : '';
            html += `
                <button onclick="window.menuAccess.switchAccessRole('${r}')" 
                    style="padding: 8px 16px; border: none; background: ${r === role ? '#9d7e56' : '#e2e8f0'}; 
                    color: ${r === role ? 'white' : '#0f172a'}; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">
                    ${r.toUpperCase()}
                </button>
            `;
        });

        html += `</div>`;

        // Menu list dengan toggle
        html += `
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
                    <small style="color: #64748b; font-weight: 600;">Centang menu yang ingin ditampilkan untuk role ${role.toUpperCase()}</small>
                </div>
        `;

        allMenus[role].forEach(menu => {
            const checked = menu.visible ? 'checked' : '';
            html += `
                <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: #f1f5f9; border-radius: 8px; border-left: 4px solid #9d7e56;">
                    <input type="checkbox" id="menu_${menu.id}" ${checked} 
                        onchange="window.menuAccess.handleMenuToggle('${role}', '${menu.id}', this.checked)"
                        style="width: 18px; height: 18px; cursor: pointer;">
                    <label for="menu_${menu.id}" style="flex: 1; cursor: pointer; font-weight: 500; color: #0f172a;">
                        <i class="${menu.icon}"></i> ${menu.label}
                    </label>
                    <span style="font-size: 12px; color: #64748b; padding: 4px 8px; background: white; border-radius: 4px;">
                        ${menu.visible ? '✓ Visible' : '✕ Hidden'}
                    </span>
                </div>
            `;
        });

        html += `</div>`;

        // Action buttons
        html += `
            <div style="display: flex; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <button onclick="window.menuAccess.saveAccessConfig()" 
                    style="padding: 12px 24px; background: #107c41; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="ri-save-line"></i> Simpan Perubahan
                </button>
                <button onclick="window.menuAccess.resetToDefault()" 
                    style="padding: 12px 24px; background: #e2e8f0; color: #0f172a; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="ri-refresh-line"></i> Reset Default
                </button>
                <button onclick="window.menuAccess.exportConfig()" 
                    style="padding: 12px 24px; background: #334155; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    <i class="ri-download-line"></i> Export Config
                </button>
            </div>
        `;

        html += `</div>`;

        container.innerHTML = html;
        this.currentRole = role;
        console.log(`✅ Access control panel rendered for role: ${role}`);
    }

    /**
     * Handle toggle menu checkbox
     */
    handleMenuToggle(role, menuId, checked) {
        this.updateMenuVisibility(role, menuId, checked);
        console.log(`Menu ${menuId} untuk ${role}: ${checked ? 'visible' : 'hidden'}`);
    }

    /**
     * Switch antar role di access panel
     */
    switchAccessRole(role) {
        this.renderAccessControlPanel(role);
    }

    /**
     * Simpan konfigurasi dan refresh preview
     */
    saveAccessConfig() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #107c41;
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = '✅ Konfigurasi menu berhasil disimpan!';
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);

        // Refresh semua sidebar yang menggunakan config ini
        this.refreshAllMenus();
    }

    /**
     * Reset ke default configuration
     */
    resetToDefault() {
        if (confirm('Anda yakin ingin mereset ke konfigurasi default? Perubahan akan hilang.')) {
            this.saveToStorage(this.defaultMenus);
            this.renderAccessControlPanel(this.currentRole || 'admin');
            this.saveAccessConfig();
        }
    }

    /**
     * Export konfigurasi sebagai JSON
     */
    exportConfig() {
        const config = this.loadFromStorage();
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `menu-access-config-${new Date().getTime()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Refresh semua menu yang ditampilkan
     */
    refreshAllMenus() {
        // Refresh sidebar menu
        const userRole = document.body.dataset.userRole || 'siswa';
        this.renderSidebarMenu(userRole);
    }
}

// Inisialisasi global
const menuAccess = new MenuAccessControl();

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuAccessControl;
}
