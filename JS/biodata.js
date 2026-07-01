
// ====================================================================
// A. KONFIGURASI URL SCRIPT INDEPENDEN & PEMUATAN DATA VIA JSONP
// ====================================================================
const URL_SCRIPT_BIODATA = "https://script.google.com/macros/s/AKfycbya8CMoUzqZho_mmUGlpbtlhOJF1pDomU8C5U4t2Rsybft3HW0cK9bmsIh4_tLDVJw/exec";

// Pemuatan data otomatis saat halaman selesai di-render (Anti CORS Block)
window.addEventListener('DOMContentLoaded', (event) => {
    // Membuat elemen script dinamis untuk menembus proteksi CORS browser
    let scriptTag = document.createElement("script");
    scriptTag.src = URL_SCRIPT_BIODATA + "?callback=tangkapDataBiodataBaru";
    
    scriptTag.onerror = function() {
        console.error("❌ Kritis: Gagal memuat database biodata baru dari Google Apps Script.");
    };
    document.body.appendChild(scriptTag);
});

// Fungsi Callback Penerima Paket Data Cloud dari Spreadsheet Baru
function tangkapDataBiodataBaru(response) {
    dataBiodataGlobal = response.biodata || [];
    console.log("🚀 Database Biodata Baru Berhasil Sinkron! Total Record:", dataBiodataGlobal.length);
}

// ====================================================================
// B. GERBANG UTAMA: JEMBATAN PEMETAAN PROFIL SISWA HURUF KECIL
// ====================================================================
function dapatkanMockBiodataLengkap(siswaRow) {
    if (!siswaRow) return null;

    let kataKunciNisn = Array.isArray(siswaRow) ? (siswaRow[0] || "") : siswaRow.toString();
    let nisnNum = Number(kataKunciNisn.toString().replace(/\D/g, ''));
    let namaUtama = Array.isArray(siswaRow) && siswaRow[2] ? siswaRow[2].toString().trim().toLowerCase() : "";

    // Cari data di dalam variabel global database baru menggunakan pencocokan NISN
    let bioRow = dataBiodataGlobal.find(function(row) {
        if (!row) return false;
        let bNisn = row.nisn || "";
        return Number(bNisn.toString().replace(/\D/g, '')) === nisnNum && nisnNum > 0;
    });

    // Jalur Cadangan jika nomor NISN luput, cocokkan berdasarkan properti nama huruf kecil
    if (!bioRow && namaUtama) {
        bioRow = dataBiodataGlobal.find(function(row) {
            if (!row) return false;
            let bNama = row.nama || "";
            return bNama.toString().trim().toLowerCase() === namaUtama;
        });
    }

    // Helper pembaca properti objek aman anti-undefined
    function ambil(row, key) {
        return (row && row[key] !== undefined && row[key] !== null && row[key].toString().trim() !== '') 
            ? row[key].toString().trim() : "-";
    }

    // Proteksi Mutlak: Jika siswa tidak terdaftar di spreadsheet, otomatis kembalikan strip (-)
    if (!bioRow) {
        return {
            nisn: "-", nis: "-", nama: "-", kelas: "-",
            alamatSiswa: "-", statusKeluarga: "-", anakKe: "-", asalSekolah: "-",
            diterimaDiKelas: "-", kerjaAyah: "-", kerjaIbu: "-", alamatOrtu: "-",
            telpOrtu: "-", kerjaWali: "-", alamatWali: "-", telpWali: "-"
        };
    }

    // Ekstraktor variabel murni dari kolom huruf kecil spreadsheet baru Anda (Gambar Rekomendasi)
    return {
        nisn:            ambil(bioRow, "nisn"),
        nis:             Array.isArray(siswaRow) ? (siswaRow[1] || "-") : "-", 
        nama:            ambil(bioRow, "nama"),
        kelas:           ambil(bioRow, "kelas"),
        alamatSiswa:     ambil(bioRow, "alamat"),
        statusKeluarga:  ambil(bioRow, "status"),
        anakKe:          ambil(bioRow, "anakke"),
        asalSekolah:     ambil(bioRow, "asal"),
        diterimaDiKelas: ambil(bioRow, "diterima"),
        kerjaAyah:       ambil(bioRow, "ayah"),
        kerjaIbu:        ambil(bioRow, "ibu"),
        alamatOrtu:      ambil(bioRow, "alamatortu"),
        telpOrtu:        ambil(bioRow, "telepon"),
        kerjaWali:       ambil(bioRow, "wali"),
        alamatWali:      ambil(bioRow, "alamatwali"),
        telpWali:        ambil(bioRow, "teleponwali")
    };
}

// ====================================================================
// C. FUNGSI EKSEKUSI TOMBOL CARI BIODATA PADA HALAMAN WEB
// ====================================================================
function cariBiodataSiswaIndividu() {
    let key = document.getElementById('searchKeyBiodata').value.trim().toLowerCase();
    if (!key) return;
    
    // Scan pencarian awal berdasarkan kata kunci ke memori database baru
    let targetBioRow = dataBiodataGlobal.find(row => {
        if (!row) return false;
        let bNama = row.nama ? row.nama.toString().toLowerCase() : "";
        let bNisn = row.nisn ? row.nisn.toString().toLowerCase() : "";
        return bNama.includes(key) || bNisn.includes(key);
    });

    // Umpankan hasil temuan ke fungsi pembentuk objek profil
    let b = dapatkanMockBiodataLengkap(targetBioRow ? [targetBioRow.nisn, "-", targetBioRow.nama, targetBioRow.kelas] : null);

    // CETAK IDENTITAS PANEL UTAMA (Sesuai Layout Tabel Asli agar Sejajar, Font Sama, dan Rapi)
    if (b && b.nama !== "-") {
        // 1. Kembalikan Nama Lengkap murni di barisnya sendiri
        document.getElementById('bioNama').innerText = b.nama.toUpperCase();
        
        // 2. Tembak elemen kelas bawaan tabel Anda agar font dan letaknya sejajar persis seperti NISN
        if (document.getElementById('bioBadgeKelas')) {
            document.getElementById('bioBadgeKelas').innerText = b.kelas.toUpperCase();
            // Reset style jika sebelumnya sempat diubah-ubah
            document.getElementById('bioBadgeKelas').style.display = ""; 
            document.getElementById('bioBadgeKelas').style.fontSize = "";
            document.getElementById('bioBadgeKelas').style.color = "";
            document.getElementById('bioBadgeKelas').style.fontWeight = "";
        }

        if (document.getElementById('bioNisn')) document.getElementById('bioNisn').innerText = b.nisn;
        if (document.getElementById('bioNis'))  document.getElementById('bioNis').innerText  = b.nis; 
    } else {
        document.getElementById('bioNama').innerText = "-";
        if (document.getElementById('bioBadgeKelas')) document.getElementById('bioBadgeKelas').innerText = "-";
        if (document.getElementById('bioNisn'))       document.getElementById('bioNisn').innerText       = "-";
        if (document.getElementById('bioNis'))        document.getElementById('bioNis').innerText        = "-";
    }

    // CETAK SEKTOR PANEL DETAIL BAWAH WEBSITE
    if (document.getElementById('bioAlamat'))         document.getElementById('bioAlamat').innerText         = b.alamatSiswa;
    if (document.getElementById('bioStatusKeluarga')) document.getElementById('bioStatusKeluarga').innerText = b.statusKeluarga;
    if (document.getElementById('bioAnakKe'))         document.getElementById('bioAnakKe').innerText         = b.anakKe;
    if (document.getElementById('bioAsalSekolah'))    document.getElementById('bioAsalSekolah').innerText    = b.asalSekolah;
    if (document.getElementById('bioDiterimaKelas'))  document.getElementById('bioDiterimaKelas').innerText  = b.diterimaDiKelas;
    if (document.getElementById('bioAyah'))           document.getElementById('bioAyah').innerText           = b.kerjaAyah;
    if (document.getElementById('bioIbu'))            document.getElementById('bioIbu').innerText            = b.kerjaIbu;
    if (document.getElementById('bioAlamatOrtu'))     document.getElementById('bioAlamatOrtu').innerText     = b.alamatOrtu;
    if (document.getElementById('bioTelpOrtu'))       document.getElementById('bioTelpOrtu').innerText       = b.telpOrtu;
    if (document.getElementById('bioKerjaWali'))      document.getElementById('bioKerjaWali').innerText      = b.kerjaWali;
    if (document.getElementById('bioAlamatWali'))     document.getElementById('bioAlamatWali').innerText     = b.alamatWali;
    if (document.getElementById('bioTelpWali'))       document.getElementById('bioTelpWali').innerText       = b.telpWali;

    document.getElementById('resultBiodataIndividu').style.display = 'block';
}

// ====================================================================
// SOLUSI TOTAL: FUNGSI EKSPOR EXCEL DENGAN SISTEM DETEKSI ERROR NYATA
// ====================================================================
function eksporBiodataExcel() {
    console.log("=== MEMULAI PROSES EKSPOR EXCEL ===");
    
    // 1. Ambil nilai kelas dari dropdown filter di halaman web Anda
    let selectKelas = document.getElementById('selectKelasBiodata');
    if (!selectKelas) {
        alert("Sistem Error: Elemen dropdown dengan ID 'selectKelasBiodata' tidak ditemukan di HTML!");
        return;
    }
    
    let kelasPilihan = selectKelas.value;
    if (!kelasPilihan) {
        alert("Silakan pilih kelas terlebih dahulu di menu dropdown sebelum mengeklik Ekspor!");
        return;
    }

    // 2. Ambil list biodata murni dari memori global
    let listBiodata = [];
    if (Array.isArray(dataBiodataGlobal)) {
        listBiodata = dataBiodataGlobal;
    } else if (dataBiodataGlobal && Array.isArray(dataBiodataGlobal.biodata)) {
        listBiodata = dataBiodataGlobal.biodata;
    }

    console.log("Isi mentah database global saat ini:", dataBiodataGlobal);
    console.log("Total baris data yang siap di-filter:", listBiodata.length);

    if (!listBiodata || listBiodata.length === 0) {
        alert("Gagal Ekspor: Database biodata masih kosong []. Website belum selesai mengunduh data dari Google Sheets. Silakan tunggu 3 detik lalu coba lagi.");
        return;
    }

    // 3. Proses Penyaringan Siswa Berdasarkan Kelas (Anti-Error Spasi)
    let filterSiswa = listBiodata.filter(row => {
        if (!row) return false;
        // Membaca property 'kelas' dari baris spreadsheet baru Anda
        let kelasSiswa = row.kelas || row.KELAS || "";
        return kelasSiswa.toString().trim().toUpperCase() === kelasPilihan.toString().trim().toUpperCase();
    });

    console.log(`Jumlah siswa yang cocok dengan kelas "${kelasPilihan}":`, filterSiswa.length);

    if (filterSiswa.length === 0) {
        // Tampilkan contoh data kelas yang ada di spreadsheet biar Anda tahu format yang benar
        let contohKelasDiSheet = listBiodata[0] ? (listBiodata[0].kelas || "Kosong") : "Kosong";
        alert(`Gagal Ekspor: Tidak ada satu pun siswa yang cocok dengan kelas "${kelasPilihan}" di Spreadsheet.\n\nPeriksa tulisan di Google Sheets Anda!\nContoh tulisan kelas di spreadsheet Anda saat ini adalah: "${contohKelasDiSheet}"`);
        return;
    }

    // 4. Susun Struktur Matriks Excel
    let header = [
        "NO", "NAMA SISWA", "KELAS", "NISN", "ALAMAT SISWA", "STATUS DLM KELUARGA", 
        "ANAK KE", "ASAL SEKOLAH", "DITERIMA DI KELAS", "PEKERJAAN AYAH", "PEKERJAAN IBU", 
        "ALAMAT ORANG TUA", "TELEPON ORANG TUA", "PEKERJAAN WALI", "ALAMAT WALI", "TELEPON WALI"
    ];
    
    let matrixData = [
        [`MASTER REKAPITULASI BIODATA SISWA`],
        [`ROMBONGAN BELAJAR: KELAS ${kelasPilihan.toUpperCase()}`],
        [`Total: ${filterSiswa.length} Siswa Ditemukan`],
        [],
        header
    ];

    // 5. Pemetaan Variabel Berdasarkan Judul Kolom Huruf Kecil Spreadsheet Baru Anda
    filterSiswa.forEach((siswa, index) => {
        matrixData.push([
            (index + 1), 
            (siswa.nama || "-").toString().toUpperCase(), 
            (siswa.kelas || "-").toString().toUpperCase(), 
            siswa.nisn ? String(siswa.nisn).replace("'", "") : "-", // Paksa teks agar 0 depan tidak lenyap
            siswa.alamat || "-", 
            siswa.status || "-",
            siswa.anakke || "-", 
            siswa.asal || "-", 
            siswa.diterima || "-", 
            siswa.ayah || "-", 
            siswa.ibu || "-", 
            siswa.alamatortu || "-", 
            siswa.telepon || "-", 
            siswa.wali || "-", 
            siswa.alamatwali || "-", 
            siswa.teleponwali || "-"
        ]);
    });

    // 6. Pembuatan & Pengunduhan File File Excel via Library XLSX
    try {
        let ws = XLSX.utils.aoa_to_sheet(matrixData);
        let wb = XLSX.utils.book_new();
        
        // Atur lebar kolom otomatis biar rapi
        ws['!cols'] = [
            {wch: 5},  {wch: 30}, {wch: 15}, {wch: 15}, {wch: 35}, {wch: 20},
            {wch: 10}, {wch: 25}, {wch: 15}, {wch: 20}, {wch: 20}, {wch: 35},
            {wch: 20}, {wch: 20}, {wch: 35}, {wch: 20}
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Rekap_Biodata_Siswa");
        
        let namaFile = `BIODATA_SISWA_KELAS_${kelasPilihan.toUpperCase().replace(/\s+/g, '_')}.xlsx`;
        XLSX.writeFile(wb, namaFile);
        console.log("=== EXCEL BERHASIL DI-GENERATE ===");
    } catch (err) {
        console.error("Crash saat membuat Excel:", err);
        alert("Library XLSX Error: Gagal membuat file Excel. Pesan Error: " + err.message);
    }
}

// ====================================================================
// ALIAS: eksporBiodataKolektifExcel -> memanggil eksporBiodataExcel
// ====================================================================
function eksporBiodataKolektifExcel() {
    eksporBiodataExcel();
}

// ====================================================================
// FUNGSI EKSPOR EXCEL BIODATA INDIVIDU (dari hasil pencarian)
// ====================================================================
function eksporBiodataIndividuExcel() {
    let nama       = (document.getElementById('bioNama')           || {}).innerText || "-";
    let nisn       = (document.getElementById('bioNisn')           || {}).innerText || "-";
    let nis        = (document.getElementById('bioNis')            || {}).innerText || "-";
    let kelas      = (document.getElementById('bioBadgeKelas')     || {}).innerText || "-";
    let alamat     = (document.getElementById('bioAlamat')         || {}).innerText || "-";
    let status     = (document.getElementById('bioStatusKeluarga') || {}).innerText || "-";
    let anakke     = (document.getElementById('bioAnakKe')         || {}).innerText || "-";
    let asal       = (document.getElementById('bioAsalSekolah')    || {}).innerText || "-";
    let diterima   = (document.getElementById('bioDiterimaKelas')  || {}).innerText || "-";
    let ayah       = (document.getElementById('bioAyah')           || {}).innerText || "-";
    let ibu        = (document.getElementById('bioIbu')            || {}).innerText || "-";
    let alamatortu = (document.getElementById('bioAlamatOrtu')     || {}).innerText || "-";
    let telepon    = (document.getElementById('bioTelpOrtu')       || {}).innerText || "-";
    let wali       = (document.getElementById('bioKerjaWali')      || {}).innerText || "-";
    let alamatwali = (document.getElementById('bioAlamatWali')     || {}).innerText || "-";
    let teleponwali= (document.getElementById('bioTelpWali')       || {}).innerText || "-";

    if (!nama || nama.trim() === "-" || nama.trim() === "") {
        alert("Tidak ada data biodata yang ditampilkan. Silakan cari siswa terlebih dahulu.");
        return;
    }

    let matrixData = [
        ["BIODATA RESMI PESERTA DIDIK"],
        [],
        ["NAMA LENGKAP",         nama],
        ["NISN",                 nisn],
        ["NIS / Nomor Induk",    nis],
        ["KELAS",                kelas],
        [],
        ["A. IDENTITAS PRIBADI"],
        ["Alamat Rumah Siswa",   alamat],
        ["Status dlm Keluarga",  status],
        ["Anak ke-",             anakke],
        ["Asal Sekolah",         asal],
        ["Diterima di Kelas",    diterima],
        [],
        ["B. DATA ORANG TUA"],
        ["Pekerjaan Ayah",       ayah],
        ["Pekerjaan Ibu",        ibu],
        ["Alamat Orang Tua",     alamatortu],
        ["Telepon Orang Tua",    telepon],
        [],
        ["C. DATA WALI"],
        ["Pekerjaan Wali",       wali],
        ["Alamat Wali",          alamatwali],
        ["Telepon Wali",         teleponwali]
    ];

    try {
        let ws = XLSX.utils.aoa_to_sheet(matrixData);
        ws['!cols'] = [{wch: 25}, {wch: 45}];
        let wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Biodata_Individu");
        let namaFile = "BIODATA_" + nama.toUpperCase().replace(/\s+/g, '_') + ".xlsx";
        XLSX.writeFile(wb, namaFile);
    } catch (err) {
        alert("Gagal membuat file Excel. Error: " + err.message);
    }
}

// ====================================================================
// FUNGSI VALIDASI REVISI — SETUJUI / TOLAK PENGAJUAN KOREKSI NILAI
// ====================================================================
function eksekusiKeputusanValidasi(idKoreksi, keputusan) {
    const konfirmasi = keputusan === 'DISETUJUI'
        ? 'Setujui pengajuan revisi ini? Nilai akan diperbarui di sistem.'
        : 'Tolak pengajuan revisi ini? Pengaju akan mendapat notifikasi penolakan.';
    if (!confirm(konfirmasi)) return;

    let listKoreksi = JSON.parse(localStorage.getItem("db_koreksi_sman1")) || [];
    let targetIdx   = listKoreksi.findIndex(k => k.id == idKoreksi);
    if (targetIdx === -1) {
        alert('Data revisi tidak ditemukan di sistem!');
        return;
    }

    listKoreksi[targetIdx].status = keputusan;
    listKoreksi[targetIdx].diproses_oleh = sessionUserAktif ? sessionUserAktif.username : 'Admin';
    listKoreksi[targetIdx].waktu_keputusan = new Date().toLocaleString('id-ID');

    // Jika disetujui, update nilai di dataSiswaGlobal
    if (keputusan === 'DISETUJUI') {
        const k = listKoreksi[targetIdx];
        // Sinkronkan ke cloud
        fetch(URL_GOOGLE_APPS_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({
                aksi: 'updateNilai',
                nisnNis: k.nisnNis,
                mapel: k.mapel,
                semester: k.semester,
                nilaiBaru: k.nilaiBaru
            })
        }).catch(() => {});
    }

    localStorage.setItem("db_koreksi_sman1", JSON.stringify(listKoreksi));

    // Update badge notifikasi
    const menunggu = listKoreksi.filter(k => k.status === 'MENUNGGU PERSETUJUAN').length;
    const badge    = document.getElementById('badgeValidasiAdmin');
    if (badge) {
        badge.innerText  = menunggu;
        badge.style.display = menunggu > 0 ? 'inline-block' : 'none';
    }

    alert('✅ Keputusan berhasil disimpan: ' + keputusan);
    renderAdminValidasiSistem();
}

// Taruh di bagian paling bawah skrip halaman agar berjalan otomatis saat login berhasil
if (typeof sessionUserAktif !== 'undefined' && sessionUserAktif && sessionUserAktif.role === 'siswaSMAN1') {
    setTimeout(cariNilaiSiswa, 500); 
}
