// ISI FILE: tabs.js
// Bagian 1: Menampung Akses Menu, Biodata, Kehadiran Siswa, Kehadiran Guru, dan Absen Guru
const KONTEN_TABS_BAGIAN_1 = `
<div id="panelKelolaAksesSection" class="tab-content-view" style="display:none; padding: 0 10px;">
            <div class="content-header" style="margin-bottom: 24px;">
                <h1>⚙️ Manajemen Akses Menu</h1>
                <p>Berikan atau batasi hak akses menu navigasi tertentu secara dinamis untuk akun siswa, guru, atau wali.</p>
            </div>

            <div class="search-card" style="max-width: 750px; margin-bottom: 30px; background: white; padding: 24px; border-radius: 12px; border: 1px solid #cbd5e1;">
                <div style="margin-bottom: 18px;">
                    <label style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 6px;">1. Pilih Status Akun (Role)</label>
                    <div class="search-box">
                        <select id="aksesFilterRole" onchange="filterUserBerdasarkanRole()" style="width: 100%; padding: 10px; border: 1px solid var(--slate-200); border-radius: 8px; font-family: inherit;">
                            <option value="">-- Pilih Status Akun --</option>
                            <option value="siswaSMAN1">Siswa</option>
                            <option value="GuruSMAN1">Guru</option>
                            <option value="WaliSMAN1">Wali Kelas / Wali</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 18px;">
                    <label style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 6px;">2. Pilih Akun / User Target</label>
                    <div class="search-box">
                        <select id="aksesTargetUser" onchange="muatUlangChecklistMenuUser()" style="width: 100%; padding: 10px; border: 1px solid var(--slate-200); border-radius: 8px; font-family: inherit;" disabled>
                            <option value="">-- Pilih Status Akun Terlebih Dahulu --</option>
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 24px;">
                    <label style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase; display: block; margin-bottom: 10px;">3. Tentukan Menu Sidebar yang Diizinkan</label>
                    <div style="background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #cbd5e1; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;">
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavPersonal"> 📊 Cari Nilai Personal</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavBiodata"> 📋 Biodata Lengkap Siswa</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavKehadiranSiswa"> ⏱️ Kehadiran Siswa</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavKehadiranGuru"> 👨‍🏫 Kehadiran Guru</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavAbsenGuru"> ❌ Ketidakhadiran Guru</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavKoreksi"> 📝 Koreksi &amp; Revisi Nilai</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavKelas"> 👥 Kolektif Leger Kelas</label>
                        <label style="display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 600; color: #334155; cursor: pointer;"><input type="checkbox" class="cb-akses-menu" value="btnNavAIHub"> 🤖 Asisten AI Guru</label>
                    </div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                    <button onclick="simpanAksesMenuDinamis()" class="btn-primary" style="height: 44px; padding: 0 24px; background-color: #0f172a; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">💾 Simpan Hak Akses Akun</button>
                </div>
            </div>
        </div>

        <div id="biodataTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Manajemen Profil &amp; Biodata Lengkap Siswa</h1>
                <p>Informasi Identitas Riwayat Siswa, Data Orang Tua/Wali, dan Alamat Rumah</p>
            </div>

            <div style="background:#eff6ff; border:1.5px solid #93c5fd; border-radius:10px; padding:16px 20px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                <div>
                    <div style="font-size:13px; font-weight:800; color:#1d4ed8; margin-bottom:4px;"><i class="ri-database-2-line"></i> Input &amp; Pengelolaan Data Biodata</div>
                    <div style="font-size:12px; color:#3b82f6;">Data biodata siswa dikelola langsung di Google Sheets. Klik tombol untuk membuka sheet <strong>Biodata</strong> dan melakukan penambahan atau pengeditan data.</div>
                </div>
                <a href="https://docs.google.com/spreadsheets/d/1AXfHu142bWpeOHb2aJpEmZI-AT_doa62fIVJVvJCrlY/edit" target="_blank"
                   style="padding:10px 22px; background:#2563eb; color:white; border-radius:8px; font-weight:700; font-size:13px; text-decoration:none; display:inline-flex; align-items:center; gap:8px; white-space:nowrap; flex-shrink:0;">
                    <i class="ri-external-link-line"></i> Buka Sheet Biodata
                </a>
            </div>

            <div class="search-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
                <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 280px; border-right: 1px solid #cbd5e1; padding-right: 20px;">
                        <h3 style="font-size: 14px; margin-bottom: 12px; color: #1e293b; font-weight: 800;">🔍 CARI BIODATA INDIVIDU</h3>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="searchKeyBiodata" placeholder="Ketik NISN atau Nama Siswa..." style="flex:1; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                            <button class="btn-primary" onclick="cariBiodataSiswaIndividu()" style="height: 40px; padding: 0 16px; background-color: #2563eb; color:white; border:none; border-radius:8px; cursor:pointer;"><i class="ri-search-line"></i> Cari</button>
                        </div>
                    </div>
                    <div style="flex: 1; min-width: 280px; padding-left: 10px;">
                        <h3 style="font-size: 14px; margin-bottom: 12px; color: #1e293b; font-weight: 800;">📂 EKSPOR BIODATA PER KELAS</h3>
                        <div style="display: flex; gap: 8px;">
                            <select id="selectKelasBiodata" style="flex: 1; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                                <option value="">-- Pilih Kelas --</option>
                            </select>
                            <button class="excel-btn" onclick="eksporBiodataKolektifExcel()" style="height: 40px; padding: 0 16px; background-color: #16a34a; color:white; border:none; border-radius:8px; cursor:pointer;"><i class="ri-file-excel-2-line"></i> Ekspor Kelas (.xlsx)</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="resultBiodataIndividu" style="display: none; margin-top: 20px;">
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button onclick="eksporBiodataIndividuExcel()" style="padding: 10px 16px; background-color: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"><i class="ri-file-excel-line"></i> Unduh Excel</button>
                    <button onclick="window.print()" style="padding: 10px 16px; background-color: #64748b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;"><i class="ri-printer-line"></i> Cetak / PDF</button>
                </div>

                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 12px; padding: 24px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 20px;">
                        <h2 style="font-size: 18px; font-weight: 800; margin:0;">BIODATA RESMI PESERTA DIDIK LENGKAP</h2>
                        <span id="bioBadgeKelas" style="background: #0f172a; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 13px;">-</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                        <div>
                            <h3 style="font-size: 14px; border-bottom: 1.5px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 12px; color: #2563eb; font-weight: 700; margin-top:0;">A. IDENTITAS PRIBADI SISWA</h3>
                            <table style="width: 100%; font-size: 13px;" cellspacing="0" cellpadding="6">
                                <tr><td style="width: 140px; font-weight: 600;">Nama Lengkap</td><td>: <span id="bioNama">-</span></td></tr>
                                <tr><td style="font-weight: 600;">NISN</td><td>: <span id="bioNisn">-</span></td></tr>
                                <tr><td style="font-weight: 600;">NIS / Nomor Induk</td><td>: <span id="bioNis">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Alamat Rumah Siswa</td><td>: <span id="bioAlamat">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Status dlm Keluarga</td><td>: <span id="bioStatusKeluarga">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Anak Ke-</td><td>: <span id="bioAnakKe">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Asal Sekolah (SMP)</td><td>: <span id="bioAsalSekolah">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Diterima di Kelas</td><td>: <span id="bioDiterimaKelas">-</span></td></tr>
                            </table>
                        </div>

                        <div>
                            <h3 style="font-size: 14px; border-bottom: 1.5px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 12px; color: #2563eb; font-weight: 700; margin-top:0;">B. DATA ORANG TUA KANDUNG</h3>
                            <table style="width: 100%; font-size: 13px;" cellspacing="0" cellpadding="6">
                                <tr><td style="width: 140px; font-weight: 600;">Nama Ayah</td><td>: <span id="bioAyah">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Nama Ibu</td><td>: <span id="bioIbu">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Alamat Orang Tua</td><td>: <span id="bioAlamatOrtu">-</span></td></tr>
                                <tr><td style="font-weight: 600;">No. Telepon Ortu</td><td>: <span id="bioTelpOrtu">-</span></td></tr>
                            </table>

                            <h3 style="font-size: 14px; border-bottom: 1.5px dashed #cbd5e1; padding-bottom: 4px; margin-bottom: 12px; color: #0284c7; font-weight: 700; margin-top:20px;">C. DATA WALI SISWA (PILIHAN)</h3>
                            <table style="width: 100%; font-size: 13px;" cellspacing="0" cellpadding="6">
                                <tr><td style="width: 140px; font-weight: 600;">Nama Wali</td><td>: <span id="bioKerjaWali">-</span></td></tr>
                                <tr><td style="font-weight: 600;">Alamat Rumah Wali</td><td>: <span id="bioAlamatWali">-</span></td></tr>
                                <tr><td style="font-weight: 600;">No. Telepon Wali</td><td>: <span id="bioTelpWali">-</span></td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="kehadiranSiswaTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Kehadiran Siswa</h1>
                <p>Input &amp; Rekap Kehadiran Harian Peserta Didik</p>
            </div>

            <div style="background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <h3 style="margin:0 0 14px 0; font-size:15px; color:#1d4ed8; font-weight:800;"><i class="ri-edit-2-line"></i> INPUT KEHADIRAN SISWA HARIAN</h3>
                <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-bottom:14px;">
                    <div style="flex:1; min-width:160px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Tanggal</label>
                        <input type="date" id="inputTanggalSiswa" style="width:100%; padding:9px; border:1.5px solid #93c5fd; border-radius:8px; font-size:13px; box-sizing:border-box;">
                    </div>
                    <div style="flex:1; min-width:160px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Kelas</label>
                        <select id="inputKelasKehadiranSiswa" style="width:100%; padding:9px; border:1.5px solid #93c5fd; border-radius:8px; font-size:13px;">
                            <option value="">-- Pilih Kelas --</option>
                        </select>
                    </div>
                    <button onclick="muatDaftarSiswaUntukInput()" style="height:40px; padding:0 18px; background:#2563eb; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer; white-space:nowrap;"><i class="ri-user-2-line"></i> Muat Daftar Siswa</button>
                </div>

                <div id="wrapperInputKehadiranSiswa" style="display:none;">
                    <div style="display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap; align-items:center;">
                        <span style="font-size:13px; font-weight:700; color:#1e293b;">Tandai Semua:</span>
                        <button onclick="tandaiSemuaSiswa('H')" style="padding:5px 14px; background:#16a34a; color:white; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:12px;">✓ Hadir Semua</button>
                        <button onclick="tandaiSemuaSiswa('S')" style="padding:5px 14px; background:#ea580c; color:white; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:12px;">S Sakit Semua</button>
                        <button onclick="tandaiSemuaSiswa('I')" style="padding:5px 14px; background:#2563eb; color:white; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:12px;">I Izin Semua</button>
                        <button onclick="tandaiSemuaSiswa('A')" style="padding:5px 14px; background:#dc2626; color:white; border:none; border-radius:6px; font-weight:700; cursor:pointer; font-size:12px;">A Alpha Semua</button>
                    </div>
                    <div style="overflow-x:auto; border-radius:10px; border:1px solid #bfdbfe;">
                        <table style="width:100%; border-collapse:collapse; font-size:13px; background:white;">
                            <thead>
                                <tr style="background:#1d4ed8; color:white;">
                                    <th style="padding:10px 8px; text-align:left; width:40px;">No</th>
                                    <th style="padding:10px 8px; text-align:left;">NISN</th>
                                    <th style="padding:10px 8px; text-align:left;">Nama Siswa</th>
                                    <th style="padding:10px 8px; text-align:center; width:200px;">Status Kehadiran</th>
                                    <th style="padding:10px 8px; text-align:left;">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody id="bodyInputKehadiranSiswa"></tbody>
                        </table>
                    </div>
                    <div style="margin-top:14px; display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                        <button onclick="simpanKehadiranSiswa()" id="btnSimpanKehadiranSiswa" style="padding:10px 24px; background:#0f172a; color:white; border:none; border-radius:8px; font-weight:800; cursor:pointer; font-size:14px;"><i class="ri-save-3-line"></i> Simpan Kehadiran</button>
                        <span id="infoSimpanKehadiranSiswa" style="font-size:13px; color:#64748b;"></span>
                    </div>
                </div>
            </div>

            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin-bottom:12px;">
                <h3 style="margin:0 0 14px 0; font-size:14px; color:#0f172a; font-weight:800;"><i class="ri-bar-chart-box-line"></i> REKAP KEHADIRAN SISWA</h3>
                <div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-end;">
                    <div style="flex: 1; min-width: 150px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Filter Kelas</label>
                        <select id="filterKelasKehadiranSiswa" style="width:100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                            <option value="">-- Semua Kelas --</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Filter Bulan</label>
                        <select id="filterBulanKehadiranSiswa" style="width:100%; padding: 9px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                            <option value="">-- Semua Bulan --</option>
                            <option value="01">Januari</option><option value="02">Februari</option>
                            <option value="03">Maret</option><option value="04">April</option>
                            <option value="05">Mei</option><option value="06">Juni</option>
                            <option value="07">Juli</option><option value="08">Agustus</option>
                            <option value="09">September</option><option value="10">Oktober</option>
                            <option value="11">November</option><option value="12">Desember</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 150px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Cari Nama / NISN</label>
                        <input type="text" id="cariSiswaKehadiran" placeholder="Ketik nama atau NISN..." style="width:100%; padding:9px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                    </div>
                    <button onclick="tampilkanKehadiranSiswa()" style="height:40px; padding:0 18px; background:#2563eb; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;"><i class="ri-filter-3-line"></i> Tampilkan</button>
                    <button onclick="eksporKehadiranSiswaExcel()" style="height:40px; padding:0 14px; background:#16a34a; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;"><i class="ri-file-excel-2-line"></i> Ekspor</button>
                </div>
            </div>

            <div id="summaryKehadiranSiswa" style="display:none; margin-bottom: 16px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
                    <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#16a34a;" id="sumHadir">0</div><div style="font-size:11px; font-weight:600; color:#166534;">HADIR</div></div>
                    <div style="background:#fff7ed; border:1.5px solid #fdba74; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#ea580c;" id="sumSakit">0</div><div style="font-size:11px; font-weight:600; color:#9a3412;">SAKIT (S)</div></div>
                    <div style="background:#eff6ff; border:1.5px solid #93c5fd; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#2563eb;" id="sumIzin">0</div><div style="font-size:11px; font-weight:600; color:#1d4ed8;">IZIN (I)</div></div>
                    <div style="background:#fef2f2; border:1.5px solid #fca5a5; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#dc2626;" id="sumAlpa">0</div><div style="font-size:11px; font-weight:600; color:#991b1b;">ALPHA (A)</div></div>
                    <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#475569;" id="sumTotalSiswa">0</div><div style="font-size:11px; font-weight:600; color:#334155;">TOTAL</div></div>
                </div>
            </div>

            <div id="statusMuatKehadiranSiswa" style="text-align:center; padding:30px; color:#64748b; font-size:14px;">
                <i class="ri-information-line" style="font-size:28px; display:block; margin-bottom:8px; color:#93c5fd;"></i>
                Pilih filter lalu klik <strong>Tampilkan</strong> untuk melihat rekap.<br>
                <small>Data dibaca dari sheet <strong>Kehadiran_Siswa</strong> di Google Sheets.</small>
            </div>
            <div id="tabelWrapperKehadiranSiswa" style="display:none; background:white; border-radius:12px; border:1px solid #cbd5e1; overflow:hidden;">
                <div style="overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead><tr style="background:#0f172a; color:white;">
                            <th style="padding:10px 8px; text-align:left;">No</th>
                            <th style="padding:10px 8px; text-align:left;">Tanggal</th>
                            <th style="padding:10px 8px; text-align:left;">Kelas</th>
                            <th style="padding:10px 8px; text-align:left;">NISN</th>
                            <th style="padding:10px 8px; text-align:left;">Nama Siswa</th>
                            <th style="padding:10px 8px; text-align:center;">Status</th>
                            <th style="padding:10px 8px; text-align:left;">Keterangan</th>
                        </tr></thead>
                        <tbody id="bodyKehadiranSiswa"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="kehadiranGuruTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Kehadiran Guru di Kelas</h1>
                <p>Input &amp; Rekap Kehadiran Guru Mengajar Harian</p>
            </div>

            <div style="background:#f0fdf4; border:2px solid #16a34a; border-radius:12px; padding:20px; margin-bottom:20px;">
                <h3 style="margin:0 0 14px 0; font-size:15px; color:#15803d; font-weight:800;"><i class="ri-edit-2-line"></i> INPUT KEHADIRAN GURU DI KELAS</h3>
                <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end; margin-bottom:14px;">
                    <div style="flex:1; min-width:160px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Tanggal</label>
                        <input type="date" id="inputTanggalGuru" style="width:100%; padding:9px; border:1.5px solid #86efac; border-radius:8px; font-size:13px; box-sizing:border-box;">
                    </div>
                    <button onclick="tambahBarisGuruInput()" style="height:40px; padding:0 18px; background:#15803d; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer; white-space:nowrap;"><i class="ri-add-line"></i> Tambah Baris Guru</button>
                    <button onclick="simpanKehadiranGuru()" id="btnSimpanKehadiranGuru" style="height:40px; padding:0 18px; background:#0f172a; color:white; border:none; border-radius:8px; font-weight:800; cursor:pointer; white-space:nowrap; display:none;"><i class="ri-save-3-line"></i> Simpan Kehadiran Guru</button>
                    <span id="infoSimpanKehadiranGuru" style="font-size:13px; color:#64748b;"></span>
                </div>
                <div id="wrapperInputKehadiranGuru" style="display:none; overflow-x:auto; border-radius:10px; border:1px solid #86efac;">
                    <table style="width:100%; border-collapse:collapse; font-size:13px; background:white; min-width:820px;">
                        <thead>
                            <tr style="background:#15803d; color:white;">
                                <th style="padding:10px 8px; width:36px;">No</th>
                                <th style="padding:10px 8px; width:100px;">Kelas</th>
                                <th style="padding:10px 8px; min-width:160px;">Nama Guru</th>
                                <th style="padding:10px 8px; min-width:140px;">Mata Pelajaran</th>
                                <th style="padding:10px 8px; width:70px; text-align:center;">Jam Ke</th>
                                <th style="padding:10px 8px; width:200px; text-align:center;">Status</th>
                                <th style="padding:10px 8px; min-width:140px;">Keterangan</th>
                                <th style="padding:10px 8px; width:40px;"></th>
                            </tr>
                        </thead>
                        <tbody id="bodyInputKehadiranGuru"></tbody>
                    </table>
                </div>
                <div id="emptyGuruInput" style="text-align:center; padding:16px; color:#64748b; font-size:13px;">
                    Klik <strong>Tambah Baris Guru</strong> untuk memulai input kehadiran guru.
                </div>
            </div>

            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:20px; margin-bottom:12px;">
                <h3 style="margin:0 0 14px 0; font-size:14px; color:#0f172a; font-weight:800;"><i class="ri-bar-chart-box-line"></i> REKAP KEHADIRAN GURU</h3>
                <div style="display:flex; gap:14px; flex-wrap:wrap; align-items:flex-end;">
                    <div style="flex:1; min-width:150px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Filter Kelas</label>
                        <select id="filterKelasKehadiranGuru" style="width:100%; padding:9px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13px;">
                            <option value="">-- Semua Kelas --</option>
                        </select>
                    </div>
                    <div style="flex:1; min-width:150px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Filter Bulan</label>
                        <select id="filterBulanKehadiranGuru" style="width:100%; padding:9px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13px;">
                            <option value="">-- Semua Bulan --</option>
                            <option value="01">Januari</option><option value="02">Februari</option>
                            <option value="03">Maret</option><option value="04">April</option>
                            <option value="05">Mei</option><option value="06">Juni</option>
                            <option value="07">Juli</option><option value="08">Agustus</option>
                            <option value="09">September</option><option value="10">Oktober</option>
                            <option value="11">November</option><option value="12">Desember</option>
                        </select>
                    </div>
                    <div style="flex:1; min-width:150px;">
                        <label style="font-size:12px; font-weight:700; color:#1e293b; display:block; margin-bottom:5px;">Cari Nama Guru / Mapel</label>
                        <input type="text" id="cariGuruKehadiran" placeholder="Nama guru atau mapel..." style="width:100%; padding:9px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                    </div>
                    <button onclick="tampilkanKehadiranGuru()" style="height:40px; padding:0 18px; background:#2563eb; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;"><i class="ri-filter-3-line"></i> Tampilkan</button>
                    <button onclick="eksporKehadiranGuruExcel()" style="height:40px; padding:0 14px; background:#16a34a; color:white; border:none; border-radius:8px; font-weight:700; cursor:pointer;"><i class="ri-file-excel-2-line"></i> Ekspor</button>
                </div>
            </div>

            <div id="summaryKehadiranGuru" style="display:none; margin-bottom:16px;">
                <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:10px;">
                    <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#16a34a;" id="sumHadirGuru">0</div><div style="font-size:11px; font-weight:600; color:#166534;">HADIR</div></div>
                    <div style="background:#fff7ed; border:1.5px solid #fdba74; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#ea580c;" id="sumSakitGuru">0</div><div style="font-size:11px; font-weight:600; color:#9a3412;">SAKIT (S)</div></div>
                    <div style="background:#eff6ff; border:1.5px solid #93c5fd; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#2563eb;" id="sumIzinGuru">0</div><div style="font-size:11px; font-weight:600; color:#1d4ed8;">IZIN (I)</div></div>
                    <div style="background:#fef2f2; border:1.5px solid #fca5a5; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#dc2626;" id="sumAlpaGuru">0</div><div style="font-size:11px; font-weight:600; color:#991b1b;">ALPHA (A)</div></div>
                    <div style="background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:14px; text-align:center;"><div style="font-size:26px; font-weight:800; color:#475569;" id="sumTotalGuru">0</div><div style="font-size:11px; font-weight:600; color:#334155;">TOTAL</div></div>
                </div>
            </div>

            <div id="statusMuatKehadiranGuru" style="text-align:center; padding:30px; color:#64748b; font-size:14px;">
                <i class="ri-information-line" style="font-size:28px; display:block; margin-bottom:8px; color:#93c5fd;"></i>
                Pilih filter lalu klik <strong>Tampilkan</strong> untuk melihat rekap kehadiran guru.<br>
                <small>Data dibaca dari sheet <strong>Kehadiran_Guru</strong> di Google Sheets.</small>
            </div>
            <div id="tabelWrapperKehadiranGuru" style="display:none; background:white; border-radius:12px; border:1px solid #cbd5e1; overflow:hidden;">
                <div style="overflow-x:auto;">
                    <table style="width:100%; border-collapse:collapse; font-size:13px;">
                        <thead><tr style="background:#0f172a; color:white;">
                            <th style="padding:10px 8px;">No</th>
                            <th style="padding:10px 8px; text-align:left;">Tanggal</th>
                            <th style="padding:10px 8px; text-align:left;">Kelas</th>
                            <th style="padding:10px 8px; text-align:left;">Nama Guru</th>
                            <th style="padding:10px 8px; text-align:left;">Mata Pelajaran</th>
                            <th style="padding:10px 8px; text-align:center;">Jam Ke-</th>
                            <th style="padding:10px 8px; text-align:center;">Status</th>
                            <th style="padding:10px 8px; text-align:left;">Keterangan</th>
                        </tr></thead>
                        <tbody id="bodyKehadiranGuru"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="absenGuruTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Ketidakhadiran Guru di Kelas</h1>
                <p>Rekap Guru Tidak Hadir (Sakit / Izin / Alpha) berdasarkan Data Google Sheets</p>
            </div>

            <div class="search-card" style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #cbd5e1; margin-bottom: 20px;">
                <div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;">
                    <div style="flex: 1; min-width: 180px;">
                        <label style="font-size: 13px; font-weight: 700; color: #1e293b; display:block; margin-bottom: 6px;">Filter Kelas</label>
                        <select id="filterKelasAbsenGuru" style="width:100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                            <option value="">-- Semua Kelas --</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 180px;">
                        <label style="font-size: 13px; font-weight: 700; color: #1e293b; display:block; margin-bottom: 6px;">Filter Bulan</label>
                        <select id="filterBulanAbsenGuru" style="width:100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                            <option value="">-- Semua Bulan --</option>
                            <option value="01">Januari</option><option value="02">Februari</option>
                            <option value="03">Maret</option><option value="04">April</option>
                            <option value="05">Mei</option><option value="06">Juni</option>
                            <option value="07">Juli</option><option value="08">Agustus</option>
                            <option value="09">September</option><option value="10">Oktober</option>
                            <option value="11">November</option><option value="12">Desember</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 180px;">
                        <label style="font-size: 13px; font-weight: 700; color: #1e293b; display:block; margin-bottom: 6px;">Filter Jenis Ketidakhadiran</label>
                        <select id="filterStatusAbsenGuru" style="width:100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                            <option value="">-- Semua --</option>
                            <option value="S">Sakit (S)</option>
                            <option value="I">Izin (I)</option>
                            <option value="A">Alpha (A)</option>
                        </select>
                    </div>
                    <div style="flex: 1; min-width: 180px;">
                        <label style="font-size: 13px; font-weight: 700; color: #1e293b; display:block; margin-bottom: 6px;">Cari Nama Guru</label>
                        <input type="text" id="cariNamaAbsenGuru" placeholder="Ketik nama guru..." style="width:100%; padding: 10px; border: 1.5px solid #cbd5e1; border-radius: 8px; font-size: 13px; box-sizing:border-box;">
                    </div>
                    <button onclick="tampilkanAbsenGuru()" style="height: 42px; padding: 0 20px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; white-space:nowrap;"><i class="ri-filter-3-line"></i> Tampilkan</button>
                    <button onclick="eksporAbsenGuruExcel()" style="height: 42px; padding: 0 16px; background: #16a34a; color: white; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; white-space:nowrap;"><i class="ri-file-excel-2-line"></i> Ekspor Excel</button>
                </div>
            </div>

            <div id="rankAbsenGuru" style="display:none; margin-bottom: 20px; background: white; border-radius: 12px; border: 1px solid #fca5a5; padding: 20px;">
                <h3 style="font-size: 14px; font-weight: 800; color: #dc2626; margin: 0 0 12px 0;"><i class="ri-bar-chart-2-line"></i> Rekap Ketidakhadiran per Guru</h3>
                <div id="bodyRankAbsenGuru" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
            </div>

            <div id="statusMuatAbsenGuru" style="text-align:center; padding:40px; color:#64748b; font-size:14px;">
                <i class="ri-information-line" style="font-size:32px; display:block; margin-bottom:10px; color:#fca5a5;"></i>
                Pilih filter lalu klik <strong>Tampilkan</strong> untuk melihat rekap ketidakhadiran guru.<br>
                <small>Data diambil dari sheet <strong>Kehadiran_Guru</strong>, hanya baris berstatus S, I, atau A.</small>
            </div>

            <div id="tabelWrapperAbsenGuru" style="display:none; background: white; border-radius: 12px; border: 1px solid #cbd5e1; overflow: hidden;">
                <div style="overflow-x: auto;">
                    <table style="width:100%; border-collapse: collapse; font-size: 13px;">
                        <thead>
                            <tr style="background: #7f1d1d; color: white;">
                                <th style="padding: 12px 10px; text-align:left;">No</th>
                                <th style="padding: 12px 10px; text-align:left;">Tanggal</th>
                                <th style="padding: 12px 10px; text-align:left;">Kelas</th>
                                <th style="padding: 12px 10px; text-align:left;">Nama Guru</th>
                                <th style="padding: 12px 10px; text-align:left;">Mata Pelajaran</th>
                                <th style="padding: 12px 10px; text-align:left;">Jam Ke-</th>
                                <th style="padding: 12px 10px; text-align:center;">Status</th>
                                <th style="padding: 12px 10px; text-align:left;">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody id="bodyAbsenGuru"></tbody>
                    </table>
                </div>
            </div>
        </div>
`;

// Bagian 2: Menampung Cari Nilai Personal, Leger Kelas, Leger Angkatan, e-Rapor, Koreksi Nilai, Evaluasi, AI Hub, Voting, Panel Admin, Validasi Admin
const KONTEN_TABS_BAGIAN_2 = `
        <div id="personalTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Cari Nilai Personal Siswa</h1>
                <p>Transkrip Resmi Berkala Rekapitulasi Nilai Semester 1-6</p>
            </div>

            <div class="search-card" id="boxPencarianSiswaIndividu">
                <div class="search-box">
                    <input type="text" id="searchKey" placeholder="Ketik nama siswa atau nomor NISN/NIS..." oninput="handleSearchAutocomplete(this)">
                    <button class="btn-primary" onclick="cariNilaiSiswa()"><i class="ri-search-line"></i> CARI DATA</button>
                    <div id="searchSuggestions" class="autocomplete-suggestions"></div>
                </div>
            </div>

            <div id="resultSiswaSection" class="result-section">
                <div class="print-btn-container" id="containerExportSiswa">
                    <button class="excel-btn" onclick="eksporExcelSiswa()"><i class="ri-file-excel-2-line"></i> Unduh Format Excel</button>
                    <button class="excel-btn" style="background-color:var(--primary);" onclick="window.print()"><i class="ri-printer-line"></i> Cetak Rapor / PDF</button>
                </div>

                <div class="student-info-container">
                    <div class="info-card">
                        <p><strong>Nama Lengkap:</strong> <span id="resNama">-</span></p>
                        <p><strong>Kelas:</strong>        <span id="resKelas">-</span></p>
                        <p><strong>Identitas:</strong>    <span id="resNisnNis">-</span></p>
                    </div>
                    <div class="rank-card">
                        <div class="stat-item">
                            <div class="stat-label">Jumlah (SUM)</div>
                            <div id="resSumNilai" class="big-number" style="color:var(--primary);">-</div>
                            <div id="resCountNilai" class="sub-number-label">0 Data</div>
                        </div>
                        <div style="border-left:1px solid var(--slate-200); height:60px;"></div>
                        <div class="stat-item">
                            <div class="stat-label">Rata-Rata</div>
                            <div id="resRataRata" class="big-number">-</div>
                        </div>
                        <div style="border-left:1px solid var(--slate-200); height:60px;"></div>
                        <div class="stat-item">
                            <div class="stat-label">Rank Kelas</div>
                            <div id="resPeringkatKelas" class="big-number" style="color:var(--success);">-</div>
                        </div>
                        <div style="border-left:1px solid var(--slate-200); height:60px;"></div>
                        <div class="stat-item">
                            <div class="stat-label">Rank Angkatan</div>
                            <div id="resPeringkat" class="big-number">-</div>
                        </div>
                        <div style="border-left:1px solid var(--slate-200); height:60px;"></div>
                        <div class="stat-item">
                            <div class="stat-label">&lt; 75 (KKM)</div>
                            <div id="resMapelMerahPersonal" class="big-number" style="color:var(--danger);">0</div>
                            <div id="resDetailMapelMerah" class="badge-danger-list" style="display:none;"></div>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Mata Pelajaran</th>
                                <th>Sem 1</th><th>Sem 2</th><th>Sem 3</th>
                                <th>Sem 4</th><th>Sem 5</th><th>Sem 6</th>
                            </tr>
                        </thead>
                        <tbody id="nilaiTableBody"></tbody>
                    </table>
                </div>

                <div id="boxRekapEvaluasiPersonal" class="info-card" style="margin-top:25px; background:var(--primary-light); border-left:5px solid var(--primary);">
                    <h3 style="font-size:15px; color:var(--slate-900);"><i class="ri-cpu-line"></i> Hasil Rekapan Evaluasi Karir &amp; Rekomendasi Karir/Studi</h3>
                    <div id="kontenRekapEvaluasiPersonal" style="font-size:14px; margin-top:10px; line-height:1.6; color:var(--slate-800);"></div>
                </div>
            </div>
        </div>

        <div id="kelasTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Kolektif Leger Kelas</h1>
                <p>Rekapitulasi data nilai berkala berdasarkan rombel</p>
            </div>

            <div class="search-card">
                <div class="search-box">
                    <select id="selectKelas"><option value="">-- Tentukan Kelas --</option></select>
                    <select id="selectModeTampilan" onchange="toggleFilterSemester()">
                        <option value="summary">Ringkasan Utama</option>
                        <option value="semester">Rincian Per Semester</option>
                        <option value="rekap_total">Master Leger Lengkap (Smt 1-6)</option>
                    </select>
                    <select id="selectSemester" style="display:none;">
                        <option value="1">Semester 1</option><option value="2">Semester 2</option>
                        <option value="3">Semester 3</option><option value="4">Semester 4</option>
                        <option value="5">Semester 5</option><option value="6">Semester 6</option>
                    </select>
                    <select id="selectSortMode">
                        <option value="rank_kelas">Urutkan: Peringkat Kelas</option>
                        <option value="nama_asc">Urutkan: Nama (A-Z)</option>
                    </select>
                    <button class="btn-primary" onclick="tampilkanLegerKelas()"><i class="ri-folder-open-line"></i> BUKA LEGER</button>
                </div>
            </div>

            <div id="resultKelasSection" class="result-section">
                <div class="print-btn-container">
                    <button class="excel-btn" onclick="eksporExcelKelas()"><i class="ri-file-excel-2-line"></i> Unduh Leger (.xlsx)</button>
                </div>
                <div class="table-responsive">
                    <table id="mainLegerTable">
                        <thead id="legerTableHeader"></thead>
                        <tbody id="legerTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="angkatanTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Leger Komparatif Satu Angkatan</h1>
                <p>Rekapitulasi peringkat paralel master dan nilai akumulasi seluruh siswa satu jenjang angkatan</p>
            </div>

            <div class="search-card">
                <div class="search-box">
                    <select id="selectAngkatanJenjang">
                        <option value="">-- Pilih Jenjang Angkatan --</option>
                        <option value="X">ANGKATAN JENJANG KELAS X</option>
                        <option value="XI">ANGKATAN JENJANG KELAS XI</option>
                        <option value="XII">ANGKATAN JENJANG KELAS XII</option>
                    </select>
                    <select id="selectSortModeAngkatan">
                        <option value="rank_paralel">Urutkan: Peringkat Paralel Angkatan</option>
                        <option value="nama_asc">Urutkan: Nama Siswa (A-Z)</option>
                        <option value="kelas_asc">Urutkan: Berdasarkan Rombel Kelas</option>
                    </select>
                    <button class="btn-primary" onclick="tampilkanLegerSatuAngkatan()"><i class="ri-shield-user-line"></i> PROSES REKAP PARALEL</button>
                </div>
            </div>

            <div id="resultAngkatanSection" class="result-section">
                <div class="print-btn-container">
                    <button class="excel-btn" onclick="eksporExcelAngkatan()"><i class="ri-file-excel-fill"></i> Ekspor Master Angkatan (.xlsx)</button>
                </div>
                <div class="table-responsive">
                    <table id="angkatanLegerTable">
                        <thead id="angkatanLegerTableHeader"></thead>
                        <tbody id="angkatanLegerTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="eraporTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Modul Penilaian e-Rapor Cloud Guru</h1>
                <p id="epHeaderDesc">Input nilai mata pelajaran Anda, unduh template, dan simpan ke cloud. Admin dapat mengelola kolom, import massal, dan generate rapor/leger.</p>
            </div>

            <div style="display:flex; gap:0; border-bottom:2px solid var(--slate-200); margin-bottom:20px; overflow-x:auto;">
                <button onclick="switchTabErapor('inputNilai')" id="epTabBtn_inputNilai"
                    style="padding:10px 20px; border:none; background:#1e293b; color:white; font-size:13px; font-weight:700; cursor:pointer; border-radius:8px 8px 0 0; margin-right:4px;">
                    <i class="ri-table-line"></i> Input Nilai
                </button>
                <button onclick="switchTabErapor('kelolaKolom')" id="epTabBtn_kelolaKolom" class="ep-tab-admin-only"
                    style="padding:10px 20px; border:none; background:var(--slate-100); color:var(--slate-600); font-size:13px; font-weight:600; cursor:pointer; border-radius:8px 8px 0 0; margin-right:4px;">
                    <i class="ri-layout-column-line"></i> <span class="ep-tab-label">Kelola Kolom</span>
                </button>
                <button onclick="switchTabErapor('importExcel')" id="epTabBtn_importExcel" class="ep-tab-admin-only"
                    style="padding:10px 20px; border:none; background:var(--slate-100); color:var(--slate-600); font-size:13px; font-weight:600; cursor:pointer; border-radius:8px 8px 0 0; margin-right:4px;">
                    <i class="ri-file-excel-line" style="color:#107c41;"></i> <span class="ep-tab-label">Import Excel</span>
                </button>
                <button onclick="switchTabErapor('raporLeger')" id="epTabBtn_raporLeger"
                    style="padding:10px 20px; border:none; background:var(--slate-100); color:var(--slate-600); font-size:13px; font-weight:600; cursor:pointer; border-radius:8px 8px 0 0;">
                    <i class="ri-file-text-line" style="color:var(--primary);"></i> <span id="epTabLabelRaporLeger">Rapor &amp; Leger</span>
                </button>
            </div>

            <div id="epSection_inputNilai">
                <div class="search-card">
                    <div class="search-box">
                        <select id="epSelectKelas"><option value="">-- Pilih Kelas --</option></select>
                        <select id="epSelectMapel"><option value="">-- Pilih Mata Pelajaran --</option></select>
                        <select id="epSelectSemester">
                            <option value="1">Semester 1</option><option value="2">Semester 2</option>
                            <option value="3">Semester 3</option><option value="4">Semester 4</option>
                            <option value="5">Semester 5</option><option value="6">Semester 6</option>
                        </select>
                        <button class="btn-primary" onclick="muatLembarKerjaErapor()"><i class="ri-table-line"></i> BUKA INPUT DATA</button>
                    </div>
                </div>
                <div id="sectionLembarKerjaErapor" class="result-section">
                    <div class="label-bobot-info" id="labelMetodeHitung">✨ <strong>Metode Perhitungan:</strong> Rata-Rata Murni Terbuka. Data tersimpan di Cloud Server Google Sheets.</div>
                    <div class="table-responsive">
                        <table>
                            <thead><tr id="headerEraporKolom">
                                <th style="width:60px; text-align:center;">No</th>
                                <th>Identitas</th>
                                <th>Nama Lengkap</th>
                                <th>Nilai Harian</th>
                                <th>Nilai Tugas</th>
                                <th>Nilai UTS</th>
                                <th>Nilai UAS</th>
                                <th style="background-color:var(--primary-light); color:var(--primary);">Akhir Rapor</th>
                            </tr></thead>
                            <tbody id="tableBodyErapor"></tbody>
                        </table>
                    </div>
                    <div style="margin-top:25px; display:flex; justify-content:flex-end; gap:12px; flex-wrap:wrap;">
                        <button class="excel-btn" onclick="eksporTemplateErapor()">
                            <i class="ri-download-line"></i> Unduh Template Excel
                        </button>
                        <button class="btn-primary" style="background-color:var(--success);" onclick="simpanKomponenNilaiCloud()">
                            <i class="ri-cloud-upload-line"></i> SIMPAN PERMANEN KE CLOUD DATA
                        </button>
                    </div>
                </div>
            </div>

            <div id="epSection_kelolaKolom" style="display:none;">
                <div class="search-card">
                    <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-layout-column-line"></i> Konfigurasi Kolom Komponen Nilai</h3>
                    <p style="font-size:13px; color:var(--slate-600); margin-bottom:20px;">
                        Tambah, hapus, atau atur ulang kolom komponen nilai yang akan muncul di lembar input guru.
                        Kolom <strong>Akhir Rapor</strong> selalu ada dan dihitung otomatis sebagai rata-rata berbobot semua komponen.
                    </p>
                    <div id="daftarKolomErapor" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;"></div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                        <input type="text" id="inputNamaKolomBaru" placeholder="Nama kolom baru (misal: Nilai Praktik)..." style="flex:1; min-width:200px; padding:8px 12px; border:1px solid var(--slate-300); border-radius:6px; font-size:13px;">
                        <input type="number" id="inputBobotKolomBaru" placeholder="Bobot %" min="1" max="100" style="width:120px; padding:8px 12px; border:1px solid var(--slate-300); border-radius:6px; font-size:13px;">
                        <button class="btn-primary" style="height:38px;" onclick="tambahKolomNilai()">
                            <i class="ri-add-circle-line"></i> Tambah Kolom
                        </button>
                    </div>
                    <div style="margin-top:20px; padding-top:15px; border-top:1px dashed var(--slate-200); display:flex; gap:10px; flex-wrap:wrap;">
                        <button onclick="resetKolomKeDefault()" style="background:var(--slate-100); color:var(--slate-700); border:1px solid var(--slate-300); padding:8px 16px; border-radius:6px; font-size:13px; cursor:pointer; font-weight:600;">
                            <i class="ri-refresh-line"></i> Reset ke Default
                        </button>
                        <button onclick="simpanKonfigurasiKolom()" class="btn-primary" style="background:var(--primary);">
                            <i class="ri-save-line"></i> Simpan &amp; Terapkan
                        </button>
                    </div>
                </div>
            </div>

            <div id="epSection_importExcel" style="display:none;">
                <div class="search-card">
                    <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-file-excel-line" style="color:#107c41;"></i> Import Nilai Massal dari Excel</h3>
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:14px; margin-bottom:20px;">
                        <p style="margin:0; font-size:13px; color:#166534; font-weight:600;"><i class="ri-information-line"></i> Petunjuk Format Import:</p>
                        <ul style="margin:8px 0 0 20px; font-size:12px; color:#166534; line-height:1.8;">
                            <li>Kolom A: <strong>NISN</strong> (wajib, sesuai data master)</li>
                            <li>Kolom B: <strong>Nama Lengkap</strong> (opsional, untuk verifikasi)</li>
                            <li>Kolom C dst: <strong>Nilai komponen</strong> sesuai urutan kolom yang dikonfigurasi</li>
                            <li>Baris pertama adalah header, data mulai baris ke-2</li>
                            <li>Gunakan tombol <strong>"Template"</strong> untuk mengunduh format yang sudah siap diisi</li>
                        </ul>
                    </div>
                    <div class="search-box" style="flex-wrap:wrap; margin-bottom:20px;">
                        <select id="epImportSelectKelas" style="height:44px;"><option value="">-- Pilih Kelas Target --</option></select>
                        <select id="epImportSelectMapel" style="height:44px;"><option value="">-- Pilih Mata Pelajaran --</option></select>
                        <select id="epImportSelectSemester" style="height:44px;">
                            <option value="1">Semester 1</option><option value="2">Semester 2</option>
                            <option value="3">Semester 3</option><option value="4">Semester 4</option>
                            <option value="5">Semester 5</option><option value="6">Semester 6</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                        <input type="file" id="importFileErapor" accept=".xlsx,.xls" style="padding:10px; border:1.5px solid var(--slate-200); border-radius:8px; flex-grow:1;">
                        <button class="excel-btn" onclick="prosesImportNilaiExcel()"><i class="ri-upload-cloud-2-line"></i> PROSES IMPORT</button>
                        <button class="excel-btn" style="background:#0284c7;" onclick="unduhTemplateImportErapor()"><i class="ri-download-line"></i> Template</button>
                    </div>
                    <div id="hasilImportErapor" style="margin-top:20px; display:none;">
                        <div class="label-bobot-info" id="labelHasilImport">Hasil import akan muncul di sini.</div>
                        <div class="table-responsive" style="margin-top:15px; max-height:400px; overflow-y:auto;">
                            <table><thead><tr id="headerPreviewImport"></tr></thead><tbody id="bodyPreviewImport"></tbody></table>
                        </div>
                        <div style="margin-top:15px; display:flex; justify-content:flex-end; gap:10px;">
                            <button class="btn-primary" style="background:var(--success);" onclick="konfirmasiImportNilai()">
                                <i class="ri-cloud-upload-line"></i> KONFIRMASI &amp; SIMPAN KE CLOUD
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="epSection_raporLeger" style="display:none;">
                <div id="rlAdminSection" class="search-card" style="display:none;">
                    <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-file-text-line" style="color:var(--primary);"></i> Generate Rapor &amp; Leger Per Kelas</h3>
                    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px;">
                        <select id="rlSelectKelas" style="height:44px; padding:0 10px; border-radius:8px; border:1px solid var(--slate-300); flex:1; min-width:160px;">
                            <option value="">-- Pilih Kelas --</option>
                        </select>
                        <select id="rlSelectSemester" style="height:44px; padding:0 10px; border-radius:8px; border:1px solid var(--slate-300);">
                            <option value="1">Semester 1</option><option value="2">Semester 2</option>
                            <option value="3">Semester 3</option><option value="4">Semester 4</option>
                            <option value="5">Semester 5</option><option value="6">Semester 6</option>
                        </select>
                        <button class="btn-primary" onclick="generateRaporLeger()"><i class="ri-eye-line"></i> TAMPILKAN PRATINJAU</button>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:15px;">
                        <button class="excel-btn" onclick="eksporLegerExcel()" id="btnEksporLeger" style="display:none;">
                            <i class="ri-file-excel-2-line"></i> Ekspor Leger (.xlsx)
                        </button>
                        <button class="excel-btn" style="background:var(--primary); display:none;" id="btnCetakRapor" onclick="window.print()">
                            <i class="ri-printer-line"></i> Cetak Leger
                        </button>
                        <button class="excel-btn" style="background:#0f766e; display:none;" id="btnCetakRaporIndividu" onclick="bukaDialogCetakRapor()">
                            <i class="ri-file-user-line"></i> Cetak Rapor Individu
                        </button>
                    </div>
                    <div id="hasilRaporLeger"></div>
                    <div id="panelSettingMapelKurikulum" style="margin-top: 20px; padding: 20px; background: #ffffff; border: 1px solid var(--slate-200); border-radius: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; border-bottom: 1.5px solid var(--slate-100); padding-bottom: 8px;">
                            <i class="ri-settings-4-line" style="color: var(--primary); font-size: 18px;"></i>
                            <h4 style="margin: 0; font-size: 14px; color: #1e293b; font-weight: 800;">PENGATURAN STRUKTUR MATA PELAJARAN NYALA DI RAPOR</h4>
                        </div>
                        <p style="margin: 0 0 14px 0; font-size: 11px; color: #64748b; line-height: 1.4;">
                            Silakan pilih kelas pada dropdown cetak rapor di atas terlebih dahulu, lalu centang mata pelajaran apa saja yang wajib muncul pada lembar cetak rapor kelas tersebut.
                        </p>
                        <div id="containerCheckboxMapel" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; margin-bottom: 16px;">
                            <div style="font-size: 12px; color: #94a3b8; font-style: italic;">Silakan pilih kelas pada dropdown cetak rapor di atas...</div>
                        </div>
                        <button onclick="prosesSimpanCeklisMapelAdmin()" class="btn-primary" style="height: 38px; font-size: 12px;">
                            <i class="ri-save-line"></i> Simpan Konfigurasi Mapel Kelas
                        </button>
                    </div>
                    <div style="margin-top:24px; padding-top:20px; border-top:2px dashed var(--slate-200);">
                        <h4 style="font-size:13px; font-weight:800; color:#1e293b; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
                            <i class="ri-share-circle-line" style="color:#0284c7;"></i> Release Leger ke Guru
                        </h4>
                        <p style="font-size:11px; color:#64748b; margin-bottom:14px;">Aktifkan agar guru bisa melihat leger kelas yang dipilih di atas (sesuai kelas &amp; semester yang dipilih).</p>
                        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                            <button id="btnReleaseLeger" onclick="releaseAtauKunciLeger()" style="background:#0284c7; color:white; border:none; padding:10px 20px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:8px;">
                                <i class="ri-share-line"></i> <span id="lblReleaseLeger">Release Leger ke Guru</span>
                            </button>
                            <div id="statusReleaseLeger" style="font-size:12px; color:#64748b;"></div>
                        </div>
                        <div id="daftarReleaseAktif" style="margin-top:14px; display:flex; flex-wrap:wrap; gap:8px;"></div>
                    </div>
                </div>

                <div id="rlGuruSection" class="search-card" style="display:none;">
                    <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-file-text-line" style="color:var(--primary);"></i> Lihat Leger Nilai Kelas</h3>
                    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:20px;">
                        <select id="rlGuruSelectKelas" style="height:44px; padding:0 10px; border-radius:8px; border:1px solid var(--slate-300); flex:1; min-width:160px;">
                            <option value="">-- Pilih Kelas --</option>
                        </select>
                        <select id="rlGuruSelectSemester" style="height:44px; padding:0 10px; border-radius:8px; border:1px solid var(--slate-300);">
                            <option value="1">Semester 1</option><option value="2">Semester 2</option>
                            <option value="3">Semester 3</option><option value="4">Semester 4</option>
                            <option value="5">Semester 5</option><option value="6">Semester 6</option>
                        </select>
                        <button class="btn-primary" onclick="lihatLegerGuru()"><i class="ri-eye-line"></i> LIHAT LEGER</button>
                    </div>
                    <div id="rlGuruStatusPanel"></div>
                    <div id="hasilLegerGuru"></div>
                </div>
            </div>
        </div>

        <div id="koreksiTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Koreksi &amp; Pengajuan Revisi Nilai</h1>
                <p>Formulir pelaporan perbaikan data nilai transkrip dan upload bukti fisik ke cloud.</p>
            </div>

            <div class="search-card">
                <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-add-box-line"></i> Buat Formulir Pengajuan Perbaikan Nilai</h3>
                <div class="admin-grid">
                    <div class="form-group">
                        <label>Identitas (NISN / NIS)</label>
                        <input type="text" id="revIdentitas" placeholder="Masukkan NISN atau NIS siswa...">
                    </div>
                    <div class="form-group">
                        <label>Pilih Mata Pelajaran</label>
                        <select id="revMapel"><option value="">-- Pilih Mapel --</option></select>
                    </div>
                    <div class="form-group">
                        <label>Pilih Semester</label>
                        <select id="revSemester">
                            <option value="1">Semester 1</option><option value="2">Semester 2</option>
                            <option value="3">Semester 3</option><option value="4">Semester 4</option>
                            <option value="5">Semester 5</option><option value="6">Semester 6</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Nilai Baru yang Benar</label>
                        <input type="number" id="revNilaiBaru" placeholder="Contoh: 88.5" min="0" max="100" step="0.1">
                    </div>
                    <div class="form-group" style="grid-column:span 2;">
                        <label>Unggah Bukti Rapor Fisik <span style="color:#64748b; font-weight:normal;">(Opsional)</span></label>
                        <input type="file" id="revFotoBukti" accept="image/*" style="padding:8px 12px;">
                    </div>
                </div>
                <button class="btn-primary" onclick="ajukanKoreksiNilai()"><i class="ri-send-plane-line"></i> KIRIM REVISI KE CLOUD</button>
            </div>

            <h3 style="font-size:15px; font-weight:700; margin-bottom:12px; color:var(--slate-800);"><i class="ri-history-line"></i> Lembar Pantauan Status Hasil Pengajuan Anda</h3>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Waktu Pengajuan</th><th>NISN/NIS</th><th>Nama Siswa</th>
                            <th>Mata Pelajaran</th><th>Smt</th>
                            <th style="text-align:center;">Nilai Baru</th>
                            <th style="text-align:center;">Bukti</th>
                            <th style="text-align:center;">Status Kelulusan Revisi</th>
                        </tr>
                    </thead>
                    <tbody id="tableRiwayatKoreksiBody"></tbody>
                </table>
            </div>
        </div>

        <div id="evaluasiTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Modul Evaluasi &amp; Analisis Otomatis</h1>
                <p>Analisis cerdas penentuan peminatan, pemetaan risiko kenaikan kelas, dan rekomendasi studi lanjut.</p>
            </div>

            <div class="search-card">
                <div class="search-box">
                    <select id="evalSelectKelas" onchange="GantiKombinasiFormEvaluasi()">
                        <option value="">-- Pilih Angkatan / Kelas --</option>
                    </select>
                    <div id="formKolektifKelasX" style="display:none; flex-wrap:wrap; gap:12px; width:100%; margin-top:15px; padding-top:15px; border-top:1px dashed var(--slate-200);">
                        <div style="width:100%; background:linear-gradient(135deg,#eff6ff,#e0f2fe); border:1px solid #bfdbfe; border-radius:10px; padding:16px;">
                            <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
                                <div style="background:#1d4ed8; color:white; border-radius:8px; padding:8px; font-size:16px; line-height:1;"><i class="ri-lightbulb-flash-line"></i></div>
                                <div>
                                    <div style="font-size:13px; font-weight:800; color:#1e3a8a;">Panel Bakat &amp; Rencana Studi — Kelas X</div>
                                    <div style="font-size:11px; color:#3b82f6; margin-top:2px;">Isi kolom Bakat &amp; Rencana Studi per siswa di tabel bawah; rekomendasi &amp; rumpun otomatis diperbarui</div>
                                </div>
                            </div>
                            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;">
                                <div style="background:white; border-radius:8px; padding:12px; border:1px solid #bfdbfe; text-align:center;">
                                    <div style="font-size:22px; font-weight:900; color:#1d4ed8;" id="evalCountSains">—</div>
                                    <div style="font-size:11px; color:#64748b; font-weight:600; margin-top:2px;">Condong MIPA</div>
                                </div>
                                <div style="background:white; border-radius:8px; padding:12px; border:1px solid #fde68a; text-align:center;">
                                    <div style="font-size:22px; font-weight:900; color:#b45309;" id="evalCountSoshum">—</div>
                                    <div style="font-size:11px; color:#64748b; font-weight:600; margin-top:2px;">Condong IPS</div>
                                </div>
                                <div style="background:white; border-radius:8px; padding:12px; border:1px solid #bbf7d0; text-align:center;">
                                    <div style="font-size:22px; font-weight:900; color:#059669;" id="evalCountSelaras">—</div>
                                    <div style="font-size:11px; color:#64748b; font-weight:600; margin-top:2px;">Bakat Selaras</div>
                                </div>
                            </div>
                            <div style="margin-top:10px; font-size:11px; color:#64748b; line-height:1.7;">
                                💡 <strong>Cara pakai:</strong> Setelah tabel dimuat, isi dropdown <em>Bakat</em> dan <em>Rencana Studi</em> per siswa.
                                Kolom <em>Rekomendasi Rumpun</em> akan otomatis memperhitungkan input tersebut.
                            </div>
                        </div>
                    </div>
                    <button class="btn-primary" style="margin-top:10px; width:100%; justify-content:center;" onclick="ProsesAnalisisEvaluasiSistem()">
                        <i class="ri-cpu-line"></i> JALANKAN MESIN ANALISIS OTOMATIS
                    </button>
                </div>
            </div>

            <div id="sectionHasilEvaluasi" class="result-section">
                <div class="print-btn-container">
                    <button class="excel-btn" onclick="eksporExcelEvaluasi()"><i class="ri-file-excel-2-line"></i> Unduh Laporan (.xlsx)</button>
                    <button class="excel-btn" style="background-color:var(--primary);" onclick="window.print()"><i class="ri-printer-line"></i> Cetak Laporan / PDF</button>
                </div>
                <div id="boxWidgetStatistikEvaluasi" class="student-info-container" style="grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); margin-bottom:20px;"></div>
                <div class="table-responsive">
                    <table>
                        <thead id="headerEvaluasiSistem"></thead>
                        <tbody id="bodyEvaluasiSistem"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="aiHubTab" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Asisten Kreatif AI Hub Guru &amp; Wali Kelas</h1>
                <p>Generator instan berbasis AI untuk membantu tugas administrasi narasi rapor, soal HOTS, dan media promosi.</p>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
                <div class="search-card" style="margin-bottom:0;">
                    <h3 style="font-size:15px; margin-bottom:12px;"><i class="ri-magic-line" style="color:var(--primary)"></i> Input Perintah / Prompt AI</h3>
                    <textarea id="txtAiPrompt" class="ai-prompt-box" placeholder="Contoh: Buatkan draf catatan Wali Kelas untuk peringkat 1..."></textarea>
                    <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:var(--slate-700);">Gunakan Template Preset Instan:</label>
                    <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
                        <button class="plotting-tag" style="cursor:pointer;" onclick="setAiPresetPrompt(1)">📝 Catatan Wali Kelas (Rapor)</button>
                        <button class="plotting-tag" style="cursor:pointer;" onclick="setAiPresetPrompt(2)">🎯 Bank Soal HOTS Pancasila</button>
                        <button class="plotting-tag" style="cursor:pointer;" onclick="setAiPresetPrompt(3)">🎵 Jingle Promosi Produk Sekolah</button>
                    </div>
                    <button class="btn-primary" style="width:100%; justify-content:center;" onclick="generateAiContentKlien()">
                        <i class="ri-sparkling-line"></i> GENERATE OUTPUT SEKARANG
                    </button>
                </div>

                <div class="search-card" style="margin-bottom:0; background:var(--primary-light); border-color:rgba(157,126,86,0.2);">
                    <h3 style="font-size:15px; margin-bottom:12px;"><i class="ri-terminal-box-line"></i> Hasil Generator AI</h3>
                    <div id="boxAiOutputResult" style="font-size:13px; line-height:1.6; color:var(--slate-800); white-space:pre-wrap; background:#ffffff; border:1px solid var(--slate-200); padding:16px; border-radius:8px; min-height:180px;">
                        Hasil teks cerdas AI akan muncul di sini...
                    </div>
                </div>
            </div>
        </div>

        <div id="votingRapatSection" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Sidang Pleno &amp; Voting Kenaikan Kelas</h1>
                <p>Mekanisme pengambilan keputusan dewan guru untuk siswa dengan kerawanan akademis (&lt; KKM) atau kasus khusus non-akademik.</p>
            </div>

            <div id="votingAdminPanel" class="search-card" style="display:none;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; padding-bottom:16px; border-bottom:1px solid var(--slate-200); margin-bottom:16px;">
                    <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
                        <div>
                            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Status Sesi</div>
                            <span id="statusAksesVoteBadge" class="badge-vote-tutup">⬛ SESI DITUTUP</span>
                        </div>
                        <div>
                            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">Angkatan Sidang</div>
                            <select id="voteSelectAngkatan" onchange="muatDaftarSiswaBermasalah()" style="height:36px; padding:0 10px; border-radius:8px; border:1px solid var(--slate-300); font-size:13px; font-weight:600;">
                                <option value="">-- Pilih Angkatan --</option>
                                <option value="X">Kelas X</option>
                                <option value="XI">Kelas XI</option>
                                <option value="XII">Kelas XII</option>
                            </select>
                        </div>
                        <div style="padding-top:18px;">
                            <button onclick="muatDaftarSiswaBermasalah()" class="btn-primary" style="height:36px; padding:0 14px; font-size:13px;">
                                <i class="ri-refresh-line"></i> Refresh
                            </button>
                        </div>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap; padding-top:4px;">
                        <button onclick="toggleAksesVotingSidang()" id="btnToggleAksesVote" class="btn-vote-action" style="background:#0284c7; padding:9px 18px; font-size:13px;">
                            <i class="ri-lock-unlock-line"></i> Buka Sesi Voting
                        </button>
                        <button onclick="resetSemuaSuaraVoting()" style="background:#dc2626; color:white; border:none; padding:9px 14px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                            <i class="ri-restart-line"></i> Reset Suara
                        </button>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr auto; gap:20px; align-items:start; margin-bottom:16px;">
                    <div>
                        <div style="font-size:12px; font-weight:700; color:#1e293b; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                            <i class="ri-broadcast-line" style="color:#059669;"></i> SISWA AKTIF DISIDANGKAN
                            <span style="font-size:10px; color:#64748b; font-weight:600;">(ditayangkan ke layar guru)</span>
                        </div>
                        <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                            <select id="selectSiswaAktifSidang" style="flex:1; min-width:260px; height:42px; padding:0 12px; border-radius:8px; border:2px solid #059669; font-size:13px; font-weight:600; color:#1e293b;">
                                <option value="">-- Pilih siswa yang sedang dibahas --</option>
                            </select>
                            <button onclick="tetapkanSiswaAktif()" style="height:42px; padding:0 18px; background:#059669; color:white; border:none; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
                                <i class="ri-broadcast-line"></i> Tayangkan
                            </button>
                            <button onclick="clearSiswaAktif()" style="height:42px; padding:0 14px; background:#f1f5f9; color:#475569; border:1px solid var(--slate-300); border-radius:8px; font-size:13px; cursor:pointer; font-weight:600;">
                                <i class="ri-stop-circle-line"></i> Stop
                            </button>
                        </div>
                        <div id="boxSiswaAktifInfo" style="display:none; margin-top:8px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:8px 14px; font-size:12px; color:#166534; font-weight:600;"></div>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; min-width:260px;">
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:9px; color:#64748b; font-weight:700; text-transform:uppercase;">Total Sidang</div>
                            <div id="vsTotal" style="font-size:22px; font-weight:900; color:#1e293b; line-height:1.2;">0</div>
                        </div>
                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:9px; color:#059669; font-weight:700; text-transform:uppercase;">Suara Masuk</div>
                            <div id="vsSuara" style="font-size:22px; font-weight:900; color:#059669; line-height:1.2;">0</div>
                        </div>
                        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:10px; text-align:center;">
                            <div style="font-size:9px; color:#1d4ed8; font-weight:700; text-transform:uppercase;">Selesai</div>
                            <div id="vsSelesai" style="font-size:22px; font-weight:900; color:#1d4ed8; line-height:1.2;">0</div>
                        </div>
                    </div>
                </div>

                <div style="padding-top:14px; border-top:1px dashed var(--slate-200);">
                    <h4 style="font-size:12px; margin:0 0 8px 0; color:#64748b; font-weight:700; display:flex; align-items:center; gap:6px;">
                        <i class="ri-user-add-line"></i> Tambah Siswa Kasus Khusus (Non-Akademik)
                    </h4>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <input type="text" id="inputNisnMauVoted" placeholder="Masukkan NISN siswa..." style="width:220px; padding:8px 12px; border:1px solid var(--slate-300); border-radius:6px; font-size:13px;">
                        <button onclick="tambahSiswaManualKeSidang()" class="btn-primary" style="height:36px; padding:0 14px; background:#059669; font-size:13px;">
                            <i class="ri-add-circle-line"></i> Masukkan ke Daftar
                        </button>
                    </div>
                </div>
            </div>

            <div id="votingGuruPanel" style="display:none;">
                <div id="guruVotingClosed" style="background:linear-gradient(135deg,#1e293b,#334155); border-radius:16px; padding:36px; text-align:center; margin-bottom:20px; display:none;">
                    <div style="font-size:52px; margin-bottom:14px;">🔒</div>
                    <div style="font-size:18px; font-weight:900; color:white; margin-bottom:8px;">Sesi Voting Belum Dibuka</div>
                    <div style="font-size:13px; color:#94a3b8; line-height:1.7;">Pimpinan Sidang (Admin) belum membuka sesi voting.<br>Layar ini akan otomatis memperbarui ketika sesi dibuka.</div>
                    <div style="margin-top:16px; display:flex; align-items:center; justify-content:center; gap:8px; color:#64748b; font-size:12px;">
                        <span class="pulse-indicator" style="background:#64748b;"></span> Memantau status sesi setiap 4 detik...
                    </div>
                </div>
                <div id="guruVotingWaiting" style="background:linear-gradient(135deg,#eff6ff,#dbeafe); border:2px solid #93c5fd; border-radius:16px; padding:24px; text-align:center; margin-bottom:20px; display:none;">
                    <div style="font-size:42px; margin-bottom:10px;">⏳</div>
                    <div style="font-size:16px; font-weight:800; color:#1e3a8a; margin-bottom:6px;">Sesi Terbuka — Menunggu Siswa Berikutnya</div>
                    <div style="font-size:13px; color:#3b82f6;">Pimpinan sidang sedang menentukan siswa yang akan dibahas selanjutnya...</div>
                    <div style="margin-top:12px; display:flex; align-items:center; justify-content:center; gap:8px; color:#3b82f6; font-size:12px;">
                        <span class="pulse-indicator" style="background:#3b82f6;"></span> Sesi sidang aktif
                    </div>
                </div>
            </div>

            <div class="voting-layout" style="display:grid; grid-template-columns:1.6fr 1fr; gap:25px; align-items:start; margin-top:20px;">
                <div class="voting-layout-left" id="resultVotingSection" style="display:block; margin-top:0;">
                    <div id="guruVotingCard"></div>
                    <div id="adminVotingTableWrapper" class="table-responsive" style="display:none;">
                        <table id="tblVotingAdmin">
                            <thead>
                                <tr>
                                    <th style="width:40px; text-align:center;">No</th>
                                    <th>Identitas Siswa</th>
                                    <th style="text-align:center; width:80px;">Kelas</th>
                                    <th style="text-align:center; width:72px;">Rerata</th>
                                    <th style="text-align:center; width:72px; color:var(--danger); font-size:11px;">&lt; KKM</th>
                                    <th style="text-align:center; width:88px;">Tayangkan</th>
                                    <th style="text-align:center; width:64px; color:#059669;">Naik</th>
                                    <th style="text-align:center; width:64px; color:#dc2626;">Tinggal</th>
                                    <th style="text-align:center; width:110px;">Keputusan</th>
                                    <th style="text-align:center; width:68px;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="tableVotingRapatBody">
                                <tr><td colspan="10" style="text-align:center; color:#64748b; font-style:italic; padding:24px;">Pilih angkatan untuk memetakan siswa sidang.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="live-chart-wrapper voting-layout-right" id="liveProyektorWrapper">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:14px;">
                        <span style="font-size:12px; font-weight:800; color:#38bdf8; display:inline-flex; align-items:center; gap:6px;">
                            <span class="pulse-indicator"></span> MONITOR LIVE SUARA
                        </span>
                        <span style="font-size:11px; color:#94a3b8;" id="liveTotalHakSuara">0 Suara</span>
                    </div>
                    <div id="liveProyektorChartBar">
                        <div style="text-align:center; color:#64748b; padding:40px 0; font-size:13px; font-style:italic;">Pilih angkatan untuk visualisasi...</div>
                    </div>
                    <div style="border-top:1px solid #334155; padding-top:10px; margin-top:14px;">
                        <div style="font-size:10px; color:#64748b; margin-bottom:6px; font-weight:700; text-transform:uppercase;">Legenda</div>
                        <div style="display:flex; gap:12px; font-size:11px;">
                            <span style="display:flex; align-items:center; gap:4px; color:#22c55e;"><span style="width:12px;height:8px;background:#22c55e;border-radius:2px;display:inline-block;"></span> Naik</span>
                            <span style="display:flex; align-items:center; gap:4px; color:#ef4444;"><span style="width:12px;height:8px;background:#ef4444;border-radius:2px;display:inline-block;"></span> Tinggal</span>
                            <span style="display:flex; align-items:center; gap:4px; color:#94a3b8;"><span style="width:12px;height:8px;background:#475569;border-radius:2px;display:inline-block;"></span> Belum</span>
                        </div>
                    </div>
                </div>
            </div>

            <div id="modalDetailSiswaPleno" style="display:none; position:fixed; z-index:9999; left:0; top:0; width:100%; height:100%; background-color:rgba(15,23,42,0.65); backdrop-filter:blur(4px); align-items:center; justify-content:center;">
                <div style="background:white; width:100%; max-width:620px; border-radius:14px; box-shadow:0 20px 40px rgba(0,0,0,0.2); overflow:hidden; animation:modalBukaAnim 0.2s ease-out; margin:20px;">
                    <div style="background:#1e293b; color:white; padding:16px 20px; display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; font-size:14px; font-weight:700; display:flex; align-items:center; gap:8px;">
                            <i class="ri-user-search-line" style="color:#9d7e56;"></i> Berkas Detail Evaluasi Sidang Pleno
                        </h3>
                        <button onclick="tutupPopupDetailSiswa()" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; font-size:22px; line-height:1;"><i class="ri-close-line"></i></button>
                    </div>
                    <div style="padding:20px; max-height:80vh; overflow-y:auto;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; background:#f8fafc; padding:14px; border-radius:8px; border:1px solid #e2e8f0; margin-bottom:16px;">
                            <div><small style="color:#64748b; display:block; font-size:11px;">Nama Lengkap Siswa</small><strong id="popNama" style="color:#1e293b; font-size:13px;">-</strong></div>
                            <div><small style="color:#64748b; display:block; font-size:11px;">Nomor Induk (NISN)</small><strong id="popNisn" style="color:#1e293b; font-size:13px; font-family:monospace;">-</strong></div>
                            <div><small style="color:#64748b; display:block; font-size:11px;">Rombongan Belajar</small><strong id="popRombel" style="color:#1e293b; font-size:13px;">-</strong></div>
                            <div><small style="color:#64748b; display:block; font-size:11px;">Rata-Rata Gabungan</small><strong id="popRerata" style="color:#9d7e56; font-size:15px; font-weight:900;">-</strong></div>
                        </div>
                        <h4 style="margin:0 0 8px 0; font-size:12px; color:#b91c1c; display:flex; align-items:center; gap:6px;">
                            <i class="ri-error-warning-line"></i> Rincian Nilai Di Bawah KKM (&lt; 75)
                        </h4>
                        <div id="popListNilaiMerah" style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px; max-height:200px; overflow-y:auto; padding-right:4px;"></div>
                        <h4 style="margin:0 0 8px 0; font-size:12px; color:#1e293b; display:flex; align-items:center; gap:6px;">
                            <i class="ri-pie-chart-line"></i> Akumulasi Suara Sidang
                        </h4>
                        <div id="popHighlightVoting" style="margin-bottom:16px; display:grid; grid-template-columns:1fr 1fr; gap:10px;"></div>
                        <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:14px; border-radius:8px;">
                            <h4 style="margin:0 0 6px 0; font-size:12px; color:#166534; display:flex; align-items:center; gap:6px;">
                                <i class="ri-lightbulb-flash-line"></i> Rekomendasi Sistem
                            </h4>
                            <p id="popRekomendasiTeks" style="margin:0; font-size:12px; color:#1e6b37; line-height:1.6; font-weight:500;"></p>
                        </div>
                    </div>
                    <div style="background:#f1f5f9; padding:12px 20px; border-top:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center;">
                        <div id="popQuickVote" style="display:flex; gap:8px;"></div>
                        <button onclick="tutupPopupDetailSiswa()" style="background:#334155; color:white; border:none; padding:8px 18px; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">Tutup</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="adminPanelSection" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Panel Manajemen Akun &amp; Plotting Mengajar</h1>
                <p>Konfigurasi data user dan hak mengajar langsung ke database cloud server pusat.</p>
            </div>

            <div style="background:#ffffff; border:1px solid var(--slate-200); padding:30px; border-radius:12px; margin-bottom:30px;">
                <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-user-add-line"></i> Registrasi Akun Pengguna Baru</h3>
                <div class="admin-grid">
                    <div class="form-group"><label>Username</label><input type="text" id="newUsername"></div>
                    <div class="form-group"><label>Password</label><input type="password" id="newPassword"></div>
                    <div class="form-group">
                        <label>Role Pengguna</label>
                        <select id="newRole">
                            <option value="AdminSMAN1">Admin Utama</option>
                            <option value="GuruSMAN1">Guru Mata Pelajaran</option>
                            <option value="WaliSMAN1">Wali Kelas</option>
                            <option value="SiswaSMAN1">Siswa</option>
                        </select>
                    </div>
                </div>
                <button class="btn-primary" onclick="tambahUserBaruCloud()">SIMPAN AKUN</button>

                <div style="margin-top:25px; padding-top:20px; border-top:2px dashed var(--slate-200);">
                    <h4 style="font-size:14px; margin-bottom:8px; color:var(--slate-800);">
                        <i class="ri-file-excel-line" style="color:var(--success);"></i> Atau Import Akun Massal (.xlsx)
                    </h4>
                    <div style="display:flex; gap:12px; align-items:center;">
                        <input type="file" id="importFileExcel" accept=".xlsx, .xls" style="padding:10px; border:1.5px solid var(--slate-200); border-radius:8px; flex-grow:1;">
                        <button class="excel-btn" onclick="prosesImportAkunMassal()"><i class="ri-upload-cloud-2-line"></i> PROSES IMPORT</button>
                    </div>
                </div>
            </div>

            <div style="background:#ffffff; border:1px solid var(--slate-200); padding:30px; border-radius:12px; margin-bottom:30px;">
                <h3 style="font-size:15px; margin-bottom:15px;"><i class="ri-git-repository-private-line"></i> Pengaturan Hak Akses Instan</h3>
                <div class="admin-grid" style="grid-template-columns:1fr 1fr 1fr;">
                    <div class="form-group"><label>Pilih Guru / Wali</label><select id="plotSelectGuru"><option value="">-- Pilih --</option></select></div>
                    <div class="form-group"><label>Pilih Kelas</label><select id="plotSelectKelas" multiple style="height:120px; padding:8px;"></select></div>
                    <div class="form-group">
                        <label>Pilih Mata Pelajaran</label>
                        <select id="plotSelectMapel" multiple style="height:120px; padding:8px;">
                            <option value="WALI">TUGAS UTAMA: WALI KELAS</option>
                        </select>
                    </div>
                </div>
                <button class="btn-primary" style="background-color:var(--primary); margin-top:15px;" onclick="simpanPlottingGuruInstanCloud()">
                    <i class="ri-flashlight-line"></i> SINKRONKAN PLOTTING MULTI-DATA
                </button>
            </div>

            <div style="background:#ffffff; border:1px solid var(--slate-200); padding:30px; border-radius:12px;">
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th><th>Password</th><th>Role</th>
                                <th>Hak Akses Mengajar</th>
                                <th style="text-align:center;">Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="adminUserTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="adminValidasiSection" class="tab-content-view" style="display:none;">
            <div class="content-header">
                <h1>Lembar Validasi &amp; Verifikasi Nilai</h1>
                <p>Persetujuan dokumen perbaikan berkas nilai transkrip dari guru mapel</p>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Pengaju / Waktu</th><th>Identitas Siswa</th><th>Mata Pelajaran</th>
                            <th>Smt</th>
                            <th style="text-align:center;">Nilai Baru</th>
                            <th style="text-align:center;">Foto Rapor Bukti</th>
                            <th style="text-align:center;">Keputusan Tindakan</th>
                        </tr>
                    </thead>
                    <tbody id="adminValidasiTableBody"></tbody>
                </table>
            </div>
        </div>
`;

// Fungsi injeksi dinamis untuk menggabungkan kedua bagian konten secara utuh ke index.html
document.addEventListener("DOMContentLoaded", function() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        // Suntikkan bagian 1 lalu sambung langsung dengan bagian 2
        mainContent.insertAdjacentHTML('beforeend', KONTEN_TABS_BAGIAN_1);
        mainContent.insertAdjacentHTML('beforeend', KONTEN_TABS_BAGIAN_2);
    }
});
