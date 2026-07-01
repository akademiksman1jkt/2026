    // ============================================================
    // VARIABEL GLOBAL
    // ============================================================
    let dataSiswaGlobal      = [];
    let dataBiodataGlobal = []; // Wadah baru khusus untuk menampung isi Sheet_Biodata
    let dbEraporCloudCache   = {};
    let cloudUsersCache      = [];
    let cloudPlottingCache   = [];
    let bioBioColMap = { no:-1, nama:1, kelas:2, nisn:3, nis:-1, alamat:4, status:5, anakKe:6, asal:7, diterima:8, ayah:9, ibu:10, alamatOrtu:11, telpOrtu:12, wali:13, alamatWali:14, telpWali:15 };
    let sessionUserAktif     = null;
    let cloudDataLoaded      = false;   // true setelah cloud data selesai dimuat
    let menuAktifSebelumnya  = "personalTab";

    const URL_GOOGLE_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwA8zc2QKDxrvtKldR8v-MXVq1LX6Xl1t57eRoSEqTXYF_4nqaOwWvGjtD9h5YiudFSDQ/exec";

    const daftarMapel = [
        { kode: 'AGM',    namaLengkap: 'Pendidikan Agama & Budi Pekerti' },
        { kode: 'PCSL',   namaLengkap: 'Pendidikan Pancasila' },
        { kode: 'BIN',    namaLengkap: 'Bahasa Indonesia' },
        { kode: 'MATUM',  namaLengkap: 'Matematika Utama' },
        { kode: 'BING',   namaLengkap: 'Bahasa Inggris Wajib' },
        { kode: 'PJOK',   namaLengkap: 'Pendidikan Jasmani Olahraga & Kesehatan' },
        { kode: 'SEJ',    namaLengkap: 'Sejarah Indonesia' },
        { kode: 'SB',     namaLengkap: 'Seni Budaya' },
        { kode: 'IPA',    namaLengkap: 'Ilmu Pengetahuan Alam' },
        { kode: 'IPS',    namaLengkap: 'Ilmu Pengetahuan Sosial' },
        { kode: 'BIO',    namaLengkap: 'Biologi Peminatan' },
        { kode: 'KIM',    namaLengkap: 'Kimia Peminatan' },
        { kode: 'FIS',    namaLengkap: 'Fisika Peminatan' },
        { kode: 'MTL',    namaLengkap: 'Matematika Peminatan' },
        { kode: 'BJP',    namaLengkap: 'Bahasa Jepang' },
        { kode: 'PKWU',   namaLengkap: 'Prakarya & Kewirausahaan' },
        { kode: 'SEJMNT', namaLengkap: 'Sejarah Peminatan' },
        { kode: 'SOS',    namaLengkap: 'Sosiologi' },
        { kode: 'EKO',    namaLengkap: 'Ekonomi' },
        { kode: 'GEO',    namaLengkap: 'Geografi' },
        { kode: 'INF',    namaLengkap: 'Informatika' },
        { kode: 'ARAB',   namaLengkap: 'Bahasa Arab' },
        { kode: 'MUH',    namaLengkap: 'Muatan Lokal Keagamaan' },
        { kode: 'MULOK',  namaLengkap: 'Muatan Lokal Daerah' }
    ];

    // ============================================================
    // NAVIGASI & SIDEBAR
    // ============================================================
