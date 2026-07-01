    function toggleSidebar() {
        const sidebar     = document.getElementById('appSidebar');
        const mainContent = document.querySelector('.main-content');
        const overlay     = document.getElementById('sidebarOverlay');
        const toggleIcon  = document.getElementById('toggleIcon');

        if (window.innerWidth > 768) {
            if (sidebar)      sidebar.classList.remove('show-mobile');
            if (sidebar)      sidebar.classList.toggle('hide-desktop');
            if (mainContent)  mainContent.classList.toggle('full-width-desktop');
            if (toggleIcon)   toggleIcon.className = sidebar.classList.contains('hide-desktop') ? "ri-menu-unfold-line" : "ri-menu-fold-line";
        } else {
            if (sidebar)      sidebar.classList.remove('hide-desktop');
            if (sidebar)      sidebar.classList.toggle('show-mobile');
            if (mainContent)  mainContent.classList.remove('full-width-desktop');
            if (overlay)      overlay.style.display = sidebar.classList.contains('show-mobile') ? 'block' : 'none';
        }
    }

    function switchSidebarMenu(viewId) {
    menuAktifSebelumnya = viewId;

    // 1. Sembunyikan semua halaman content view terlebih dahulu
    document.querySelectorAll('.tab-content-view').forEach(el => el.style.display = 'none');
    if (document.getElementById('votingRapatSection')) {
        document.getElementById('votingRapatSection').style.display = 'none';
    }
    
    // 2. Reset status aktif semua tombol menu di sidebar
    document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));

    // 3. Tampilkan halaman target yang sedang diklik
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.style.display = 'block';

    // 4. Pemetaan ID Tombol Sidebar Menu (Termasuk biodataTab Baru)
    const navMap = {
        personalTab:          'btnNavPersonal',
        biodataTab:           'btnNavBiodata',
        kehadiranSiswaTab:    'btnNavKehadiranSiswa',
        kehadiranGuruTab:     'btnNavKehadiranGuru',
        absenGuruTab:         'btnNavAbsenGuru',
        kelasTab:             'btnNavKelas',
        angkatanTab:          'btnNavAngkatan',
        eraporTab:            'btnNavErapor',
        koreksiTab:           'btnNavKoreksi',
        evaluasiTab:          'btnNavEvaluasi',
        votingRapatSection:   'btnNavVoting',
        aiHubTab:             'btnNavAIHub',
        adminPanelSection:    'btnNavAdmin',
        adminValidasiSection: 'btnNavValidasi'
    };

    // 5. Nyalakan warna aktif (biru/highlight) pada tombol menu yang diklik
    const btnId = navMap[viewId];
    if (btnId && document.getElementById(btnId)) {
        document.getElementById(btnId).classList.add('active');
    }

    // =========================================================================
    // 🌟 KUNCI UTAMA: KEMBALIKAN SEMUA FUNGSI RENDER BAWAAN ASLI APLIKASI ANDA
    // =========================================================================
    try { if (viewId === 'kelasTab')             kunciDropdownKelasWali(); }          catch(e){ console.error('[kelasTab]',e); }
    try { if (viewId === 'eraporTab')            { renderDropdownEraporKunci(); updateTabVisibilityErapor(); } } catch(e){ console.error('[eraporTab]',e); }
    try { if (viewId === 'koreksiTab')           renderRiwayatKoreksiSistem(); }    catch(e){ console.error('[koreksiTab]',e); }
    try { if (viewId === 'adminPanelSection')    renderTabelUserAdmin(); }           catch(e){ console.error('[adminPanel]',e); }
    try { if (viewId === 'adminValidasiSection') renderAdminValidasiSistem(); }      catch(e){ console.error('[adminValidasi]',e); }
    try { if (viewId === 'evaluasiTab')          SinkronDropdownEvaluasiKelas(); }   catch(e){ console.error('[evaluasiTab]',e); }

    if (viewId === 'angkatanTab') {
        const selectJenjang = document.getElementById('selectAngkatanJenjang');
        if (selectJenjang && selectJenjang.value === "") selectJenjang.value = "X";
        if (dataSiswaGlobal && dataSiswaGlobal.length > 0) tampilkanLegerSatuAngkatan();
    }

    if (viewId === 'votingRapatSection') {
        if (typeof muatDaftarSiswaBermasalah === "function") muatDaftarSiswaBermasalah();
    }

    // Otomatis muat data kehadiran & isi dropdown kelas saat tab dibuka
    if (viewId === 'kehadiranSiswaTab') {
        // Set tanggal hari ini
        let tgl = document.getElementById('inputTanggalSiswa');
        if (tgl && !tgl.value) tgl.value = new Date().toISOString().slice(0,10);
        // Isi dropdown kelas input dari dataSiswaGlobal
        let selKelasInput = document.getElementById('inputKelasKehadiranSiswa');
        if (selKelasInput && selKelasInput.options.length <= 1 && dataSiswaGlobal.length > 0) {
            let listK = [...new Set(dataSiswaGlobal.map(r => (r[3]||"").toString().trim()))].filter(k => k && k.toLowerCase() !== "kelas").sort();
            listK.forEach(k => selKelasInput.add(new Option(k, k)));
        }
        muatDataKehadiranSiswa(null);
    }
    if (viewId === 'kehadiranGuruTab') {
        let tgl = document.getElementById('inputTanggalGuru');
        if (tgl && !tgl.value) tgl.value = new Date().toISOString().slice(0,10);
        muatDataKehadiranGuru(null);
    }
    if (viewId === 'absenGuruTab') {
        muatDataKehadiranGuru(null);
    }

    // 🌟 LOGIKA BARU: Otomatis isi daftar dropdown kelas saat menu biodata dibuka
    if (viewId === 'biodataTab') {
        let selectB = document.getElementById('selectKelasBiodata');
        if (selectB && selectB.options.length <= 1 && typeof dataSiswaGlobal !== "undefined") {
            let listK = [...new Set(dataSiswaGlobal.map(row => row[3]))].filter(k => k && k !== "Kelas").sort();
            listK.forEach(k => { 
                selectB.innerHTML += `<option value="${k}">${k}</option>`; 
            });
        }
    }

    // 6. Penyesuaian tampilan responsif jika dibuka via HP (Mobile Sidebar Overlay)
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('appSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.remove('show-mobile');
        if (overlay) overlay.style.display = 'none';
    }
}


