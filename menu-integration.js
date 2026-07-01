/**
 * INTEGRASI MENU ACCESS CONTROL KE INDEX.HTML
 * File: menu-integration.js
 * 
 * Fitur:
 * - Render sidebar menu berdasarkan akses yang diatur admin
 * - Menyesuaikan menu saat user login
 * - Refresh menu dinamis
 */

class MenuIntegration {
    constructor() {
        this.menuAccess = window.menuAccess || null;
        this.currentUserRole = 'siswa'; // default role
        this.init();
    }

    /**
     * Initialize integration
     */
    init() {
        // Tunggu hingga menuAccess loaded
        if (!this.menuAccess) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        // Load user role dari sessionStorage atau localStorage
        this.loadUserRole();
        
        // Render menu saat halaman load
        this.renderMenuAfterLogin();
        
        console.log('✅ Menu integration initialized for role:', this.currentUserRole);
    }

    /**
     * Load user role dari storage
     */
    loadUserRole() {
        // Cek dari sessionStorage (priority 1)
        let role = sessionStorage.getItem('userRole');
        
        // Cek dari localStorage jika tidak ada di session
        if (!role) {
            role = localStorage.getItem('userRole');
        }
        
        // Cek dari data attribute di body
        if (!role) {
            role = document.body.dataset.userRole;
        }
        
        this.currentUserRole = role || 'siswa';
    }

    /**
     * Set user role (dipanggil setelah login)
     */
    setUserRole(role) {
        this.currentUserRole = role;
        sessionStorage.setItem('userRole', role);
        localStorage.setItem('userRole', role);
        document.body.dataset.userRole = role;
        this.renderMenuAfterLogin();
    }

    /**
     * Render menu di sidebar setelah login
     */
    renderMenuAfterLogin() {
        const container = document.querySelector('.sidebar-menu');
        if (!container) {
            console.warn('Sidebar menu container not found');
            return;
        }

        const visibleMenus = this.menuAccess.getVisibleMenus(this.currentUserRole);
        
        let html = '';
        
        // Group menus by category if needed
        visibleMenus.forEach(menu => {
            html += `
                <div class="menu-item" data-menu-id="${menu.id}" onclick="handleMenuClick('${menu.id}', event)">
                    <i class="${menu.icon}"></i>
                    <span>${menu.label}</span>
                </div>
            `;
        });

        container.innerHTML = html;
        console.log(`✅ Menu rendered for ${this.currentUserRole}: ${visibleMenus.length} items`);
    }

    /**
     * Refresh menu (dipanggil ketika admin mengubah config)
     */
    refreshMenu() {
        this.renderMenuAfterLogin();
    }

    /**
     * Get current user role
     */
    getUserRole() {
        return this.currentUserRole;
    }

    /**
     * Check if user has access to specific menu
     */
    hasMenuAccess(menuId) {
        const menus = this.menuAccess.getVisibleMenus(this.currentUserRole);
        return menus.some(m => m.id === menuId);
    }

    /**
     * Get menu by ID
     */
    getMenuById(menuId) {
        const menus = this.menuAccess.getVisibleMenus(this.currentUserRole);
        return menus.find(m => m.id === menuId);
    }
}

// Global instance
const menuIntegration = new MenuIntegration();

/**
 * Handle menu item click
 */
function handleMenuClick(menuId, event) {
    event.preventDefault();
    
    // Cek akses
    if (!menuIntegration.hasMenuAccess(menuId)) {
        showMenuError('Anda tidak memiliki akses ke menu ini');
        return;
    }

    // Get menu config
    const menu = menuIntegration.getMenuById(menuId);
    if (!menu) return;

    // Handle menu navigation berdasarkan ID
    navigateToMenu(menuId);
}

/**
 * Navigate to menu section
 */
function navigateToMenu(menuId) {
    const menuRoutes = {
        'dashboard': () => showDashboard(),
        'kelola_user': () => showKelolUser(),
        'kelola_kelas': () => showKelolaKelas(),
        'kelola_nilai': () => showKelolaNilai(),
        'kelola_rapor': () => showKelolRapor(),
        'input_nilai': () => showInputNilai(),
        'lihat_nilai': () => showLihatNilai(),
        'lihat_rapor': () => showLihatRapor(),
        'lihat_rapor_anak': () => showLihatRaporAnak(),
        'voting': () => showVoting(),
        'voting_pleno': () => showVotingPleno(),
        'laporan': () => showLaporan(),
        'pengaturan': () => showPengaturan()
    };

    const handler = menuRoutes[menuId];
    if (handler) {
        handler();
        updateActiveMenu(menuId);
    } else {
        console.warn(`No handler found for menu: ${menuId}`);
    }
}

/**
 * Update active menu indicator
 */
function updateActiveMenu(menuId) {
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current menu item
    const activeMenu = document.querySelector(`[data-menu-id="${menuId}"]`);
    if (activeMenu) {
        activeMenu.classList.add('active');
    }
}

/**
 * Show menu error notification
 */
function showMenuError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `<i class="ri-error-warning-line"></i> ${message}`;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

/**
 * PLACEHOLDER FUNCTIONS - Ganti dengan logic actual Anda
 */
function showDashboard() { console.log('Navigate to Dashboard'); }
function showKelolUser() { console.log('Navigate to Kelola User'); }
function showKelolaKelas() { console.log('Navigate to Kelola Kelas'); }
function showKelolaNilai() { console.log('Navigate to Kelola Nilai'); }
function showKelolRapor() { console.log('Navigate to Kelola Rapor'); }
function showInputNilai() { console.log('Navigate to Input Nilai'); }
function showLihatNilai() { console.log('Navigate to Lihat Nilai'); }
function showLihatRapor() { console.log('Navigate to Lihat Rapor'); }
function showLihatRaporAnak() { console.log('Navigate to Lihat Rapor Anak'); }
function showVoting() { console.log('Navigate to Voting'); }
function showVotingPleno() { console.log('Navigate to Voting Pleno'); }
function showLaporan() { console.log('Navigate to Laporan'); }
function showPengaturan() { console.log('Navigate to Pengaturan'); }

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuIntegration;
}
