/**
 * Main Application Logic
 * File: js/app.js
 */

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('roleSelect').value;

    if (!username || !password || !role) {
        showLoginError('Semua field harus diisi');
        return;
    }

    // Simulasi login (di production, validasi di server)
    const userData = {
        id: 1,
        name: username,
        role: role
    };

    handleLoginSuccess(userData);
}

/**
 * Handle successful login
 * ✅ PENTING: Set user role untuk menu system
 */
function handleLoginSuccess(userData) {
    // Set user role untuk menu access control system
    if (window.menuIntegration) {
        menuIntegration.setUserRole(userData.role);
        console.log('✅ User role set to:', userData.role);
        
        // Render menu berdasarkan akses user
        menuIntegration.renderMenuAfterLogin();
        console.log('✅ Menu rendered for role:', userData.role);
    }

    // Update UI
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userRole').textContent = userData.role.toUpperCase();
    document.body.dataset.userRole = userData.role;

    // Show main app
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('wrapper').style.display = 'flex';

    // Save session
    sessionStorage.setItem('userLoggedIn', 'true');
    sessionStorage.setItem('userData', JSON.stringify(userData));

    console.log('✅ Login successful for user:', userData.name);
}

/**
 * Handle logout
 */
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        sessionStorage.removeItem('userLoggedIn');
        sessionStorage.removeItem('userData');

        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('wrapper').style.display = 'none';

        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('roleSelect').value = '';

        console.log('✅ Logout successful');
    }
}

/**
 * Show login error
 */
function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

/**
 * Toggle sidebar (mobile)
 */
function toggleSidebar(type = 'mobile') {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (type === 'mobile') {
        sidebar.classList.toggle('show-mobile');
        overlay.style.display = sidebar.classList.contains('show-mobile') ? 'block' : 'none';
    } else {
        sidebar.classList.toggle('hide-desktop');
    }
}

/**
 * Check if user already logged in
 */
window.addEventListener('load', () => {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn');
    if (userLoggedIn) {
        const userData = JSON.parse(sessionStorage.getItem('userData'));
        if (userData) {
            handleLoginSuccess(userData);
        }
    }
});
