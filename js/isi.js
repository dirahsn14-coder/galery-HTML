/* ========================================
   ALAMAT REST API
   digunakan untuk mengambil data outfit
   dari server.
======================================== */

// Menyimpan URL API dalam sebuah variabel konstan.
// Tidak menghasilkan output visual, hanya disimpan di memori
// untuk dipakai nanti oleh fetch() di fungsi ambilData().
const alamatApi =
    "https://nadira-api-new.vercel.app/gallery.json";


/* ========================================
   VARIABEL DATA
   Menyimpan dat outfit dan kategori
   yang sedang dipilih.
======================================== */

// Array kosong sebagai "wadah" data outfit hasil fetch API.
// Akan diisi ulang setiap kali data berhasil diambil dari server.
// Tidak tampil di layar, tapi jadi sumber data untuk semua tampilan galeri.
let dataOutfit = [];

// Menyimpan nama kategori yang sedang aktif/dipilih pengguna.
// Default "Semua" artinya semua outfit ditampilkan tanpa filter kategori.
// Nilainya berubah ketika tombol kategori diklik (lihat buatKategori()).
let kategoriDipilih = "Semua";


/* Mengecek apakah halaman saat ini
   adalah halaman Favorit. */

// window.location.pathname = alamat path halaman saat ini di browser.
// includes("favorit.html") mengecek apakah nama file "favorit.html" ada di path.
// Hasilnya true/false, dipakai untuk menentukan logika filter di tampilkanOutfit().
// Tidak tampil di layar, hanya nilai logika internal.
const halamanFavorit =
    window.location.pathname.includes("favorit.html");


/* ========================================
   AMBIL ELEMENT HTML
======================================== */

// Mengambil elemen <div id="wadah-galeri"> dari HTML.
// Elemen inilah tempat semua kartu outfit nanti dimasukkan (lihat tampilkanData()).
// Jika halaman tidak punya elemen ini, nilainya null.
const galeri =
    document.getElementById("wadah-galeri");

// Mengambil elemen <div id="menu-kategori"> dari HTML.
// Tempat tombol-tombol kategori outfit (Semua, Casual, dll) akan dirender.
const kategoriMenu =
    document.getElementById("menu-kategori");

// Mengambil elemen <input id="input-pencarian"> (kotak pencarian di navbar).
// Nilainya (value) dipakai untuk menyaring outfit berdasarkan kata kunci.
const cari =
    document.getElementById("input-pencarian");

// Mengambil elemen <div id="notifikasi">.
// Tempat pesan sementara (misal "Ditambahkan ke Favorit") muncul di atas layar.
const pesan =
    document.getElementById("notifikasi");

// Mengambil elemen <p/span id="jumlah-favorit"> (jika ada di halaman).
// Menampilkan teks jumlah outfit yang sudah difavoritkan.
const jumlahFavorit =
    document.getElementById("jumlah-favorit");


/* ========================================
   ELEMENT ZOOM FOTO
======================================== */

// Mengambil elemen <div id="zoom-foto"> — kotak overlay/modal untuk foto besar.
const zoom =
    document.getElementById("zoom-foto");

// Mengambil elemen <img id="gambar-zoom"> — tag <img> di dalam modal zoom,
// src-nya akan diganti sesuai foto yang diklik pengguna.
const fotoZoom =
    document.getElementById("gambar-zoom");

// Mengambil tombol <button id="tutup-zoom"> (tombol × di pojok modal zoom).
const tutupZoom =
    document.getElementById("tutup-zoom");

/* ========================================
   ELEMENT TOMBOL KEMBALI KE ATAS
======================================== */

// Mengambil tombol <button id="kembali-atas"> (tombol ↑ yang muncul saat scroll).
const tombolAtas =
    document.getElementById("kembali-atas");


/* ========================================
   ELEMENT LOGIN DAN SIGN UP
======================================== */

// Mengambil elemen <div id="login"> — modal/kotak Sign In secara keseluruhan.
const login =
    document.getElementById("login");

// Mengambil elemen <div id="daftar"> — modal/kotak Sign Up secara keseluruhan.
const daftar =
    document.getElementById("daftar");

// Mengambil tombol <button id="tombol-login-nav"> di navbar (teks "Login"/"Hi, nama").
const tombolLogin =
    document.getElementById("tombol-login-nav");

// Tombol × untuk menutup modal Sign In.
const tutupLogin =
    document.getElementById("tutup-login");

// Tombol × untuk menutup modal Sign Up.
const tutupDaftar =
    document.getElementById("tutup-daftar");

// Tombol "Sign Up" di dalam modal login, untuk berpindah ke modal daftar.
const bukaDaftar =
    document.getElementById("buka-daftar");

// Tombol "Sign In" di dalam modal daftar, untuk kembali ke modal login.
const kembaliLogin =
    document.getElementById("kembali-login");

// Elemen <form id="form-login"> — form Sign In, dipakai untuk event "submit".
const formLogin =
    document.getElementById("form-login");

// Elemen <form id="form-daftar"> — form Sign Up, dipakai untuk event "submit".
const formDaftar =
    document.getElementById("form-daftar");


/* ========================================
   ELEMENT PASSWORD
======================================== */

// Input password di form login (<input id="sandi-login">).
const passwordLogin =
    document.getElementById("sandi-login");

// Tombol mata (👁) untuk menampilkan/menyembunyikan password login.
const lihatLogin =
    document.getElementById("lihat-password-login");

// Input password di form daftar (<input id="sandi-daftar">).
const passwordDaftar =
    document.getElementById("sandi-daftar");

// Tombol mata untuk password daftar.
const lihatDaftar =
    document.getElementById("lihat-password-daftar");

// Input "ulangi password" di form daftar (<input id="ulangi-sandi">).
const passwordUlang =
    document.getElementById("ulangi-sandi");

// Tombol mata untuk input ulangi password.
const lihatUlang =
    document.getElementById("lihat-password-ulangi");

/* ========================================
   FUNGSI LIHAT PASSWORD
   Mengubah input password menjadi text
   atau kembali menjadi password.
======================================== */

// Fungsi ini menerima 2 parameter:
// - input  : elemen <input> password yang ingin diubah tipenya
// - tombol : elemen <button> mata yang ikonnya juga diubah
function lihatPassword(input, tombol) {

    // Jika tipe input saat ini "password" (karakter disembunyikan)...
    if (input.type === "password") {

        // ...ubah jadi "text" sehingga karakter password terlihat jelas
        // Output: teks password yang tadinya titik-titik kini terbaca di layar.
        input.type = "text";

        // Ganti ikon tombol jadi 🙈 (mata tertutup) sebagai penanda "sedang terlihat".
        // Output: ikon tombol di sebelah input berubah.
        tombol.textContent = "🙈";

    } else {

        // Jika sebelumnya sudah "text", kembalikan ke "password" (disembunyikan lagi).
        input.type = "password";

        // Kembalikan ikon ke 👁 (mata terbuka) sebagai penanda "sedang disembunyikan".
        tombol.textContent = "👁";
    }
}


/* ========================================
   EVENT TOMBOL PASSWORD
======================================== */

// Cek dulu elemen tombolnya ada (mencegah error jika halaman tidak punya elemen ini).
if (lihatLogin) {

    // Pasang event listener: setiap kali tombol mata login diklik...
    lihatLogin.addEventListener(
        "click",
        function () {

            // ...panggil fungsi lihatPassword untuk toggle tampilan password login.
            // Output: terjadi di kotak password Sign In.
            lihatPassword(
                passwordLogin,
                lihatLogin
            );
        }
    );
}

// Sama seperti di atas, tapi untuk input password di form Sign Up.
if (lihatDaftar) {

    lihatDaftar.addEventListener(
        "click",
        function () {

            // Output: terjadi di kotak "Buat password" pada modal Sign Up.
            lihatPassword(
                passwordDaftar,
                lihatDaftar
            );
        }
    );
}

// Sama seperti di atas, tapi untuk input "Ulangi password" di form Sign Up.
if (lihatUlang) {

    lihatUlang.addEventListener(
        "click",
        function () {

            // Output: terjadi di kotak "Ulangi password" pada modal Sign Up.
            lihatPassword(
                passwordUlang,
                lihatUlang
            );
        }
    );
}


/* ========================================
   AMBIL DATA DARI REST API
   Menggunakan fetch() untuk mengambil
   data outfit dari server.
======================================== */

// Fungsi utama untuk mengambil data outfit dari API.
function ambilData() {

    /* Jika halaman tidak memiliki galeri,
       fungsi tidak dijalankan. */

    // Jika elemen #wadah-galeri tidak ada di halaman (misal di halaman about.html),
    // hentikan fungsi supaya tidak error saat mengakses galeri.textContent dll.
    if (!galeri) {
        return;
    }

    // Menampilkan teks sementara "⏳ Memuat outfit..." di dalam #wadah-galeri
    // Output: muncul di tengah area galeri saat data belum selesai diambil.
    galeri.textContent =
        "⏳ Memuat outfit...";

    // Menambahkan class CSS "memuat" ke elemen galeri.
    // Class ini (di style.css) memberi tampilan flex + tinggi minimum saat loading.
    // Output: area galeri terlihat seperti kotak loading di tengah layar.
    galeri.classList.add("memuat");


    // Melakukan permintaan HTTP GET ke alamatApi menggunakan fetch().
    // fetch() bersifat asynchronous, mengembalikan sebuah Promise.
    fetch(alamatApi)

        /* Mengecek hasil dari server. */

        // .then pertama menerima objek "respon" (Response) dari fetch.
        .then(function (respon) {

            // respon.ok bernilai false jika status HTTP bukan 200-299 (misal 404/500).
            if (!respon.ok) {

                // Melempar error supaya ditangkap oleh .catch() di bawah.
                throw new Error();
            }

            // Mengubah body respon menjadi objek JavaScript (JSON.parse otomatis).
            // return di sini mengirim hasil parsing ke .then() berikutnya.
            return respon.json();
        })


        /* Menyimpan data setelah berhasil
           diambil dari API. */

          // array
        .then(function (data) {

            // menyimpan data api.
            // Tidak ada output visual langsung, tapi jadi sumber untuk fungsi lain.
            dataOutfit = data;

            // Menghapus class "memuat" karena data sudah selesai diambil.
            // Output: tampilan loading di galeri hilang.
            galeri.classList.remove("memuat");

            // Memanggil fungsi untuk membuat tombol-tombol kategori.
            // Output: tombol kategori muncul di dalam #menu-kategori.
            buatKategori();

            // Memanggil fungsi untuk menampilkan kartu-kartu outfit sesuai filter aktif.
            // Output: kartu-kartu outfit muncul di dalam #wadah-galeri.
            tampilkanOutfit();

            // Memanggil fungsi untuk menghitung & menampilkan jumlah favorit.
            // Output: teks jumlah favorit di elemen #jumlah-favorit (jika ada).
            hitungFavorit();
        })


        /* pensan jika gagal. */

        // .catch menangkap error dari .then manapun di atasnya (network error, throw, dll).
        .catch(function () {

            // Menghapus class loading karena proses sudah berhenti (walau gagal).
            galeri.classList.remove("memuat");

            // Menampilkan pesan error di dalam #wadah-galeri.
            // Output: tulisan "⚠️ Gagal mengambil data outfit." muncul di area galeri.
            galeri.textContent =
                "⚠️ Gagal mengambil data outfit.";
        });
}


/* ========================================
   MEMBUAT MENU KATEGORI
   Kategori diambil dari data API kemudian
   dibuat menggunakan createElement().
======================================== */

// Fungsi untuk membangun daftar tombol kategori berdasarkan data outfit yang ada.
function buatKategori() {

    // Jika halaman tidak punya elemen #menu-kategori, hentikan fungsi.
    if (!kategoriMenu) {
        return;
    }

    // Mengosongkan isi #menu-kategori sebelum diisi ulang.
    // Output: tombol-tombol kategori lama (jika ada) hilang sesaat sebelum dibuat ulang.
    kategoriMenu.textContent = "";

    // Array kosong untuk menampung nama-nama kategori unik.
    const semuaKategori = [];


    /* ambil kategori. */

    // Melakukan perulangan pada setiap item di dataOutfit.
    dataOutfit.forEach(function (outfit) {

        if (
            // Pastikan outfit punya properti "style" (nama kategori).
            outfit.style &&
            // Mengabaikan kategori "beige" (tidak dimasukkan ke daftar tombol).
            outfit.style.toLowerCase() !== "beige" &&
            // Hanya tambahkan kalau kategori ini belum ada di array (menghindari duplikat).
            !semuaKategori.includes(outfit.style)
        ) {

            // Menambahkan nama kategori baru ke dalam array semuaKategori.
            semuaKategori.push(outfit.style);
        }
    });

    // Mengurutkan nama kategori secara alfabet (A-Z).
    semuaKategori.sort();

    // Menambahkan "Semua" di posisi paling depan array (sebagai tombol filter default).
    semuaKategori.unshift("Semua");


    /* Membuat tombol kategori. */
    // Perulangan untuk membuat elemen <button> untuk setiap nama kategori.
    semuaKategori.forEach(function (nama) {

        // Membuat elemen <button> baru di memori (belum tampil di layar).
        const tombol =
            document.createElement("button");

        // Mengisi teks tombol dengan nama kategori.
        // Output nanti: teks pada tombol kategori, misal "Casual", "Formal", dll.
        tombol.textContent = nama;

        // Memberi class CSS "tombol-kategori" agar sesuai gaya di style.css.
        tombol.className =
            "tombol-kategori";

        // Menetapkan type="button" supaya tidak memicu submit form jika ada di dalam form.
        tombol.type = "button";

        /* Menentukan kategori yang aktif. */

        // Jika nama kategori ini sama dengan kategori yang sedang dipilih...
        if (nama === kategoriDipilih) {

            // ...tambahkan class "aktif" supaya tombol ini terlihat menyala/berbeda warna.
            // Output: tombol kategori yang sedang aktif tampil dengan warna berbeda.
            tombol.classList.add("aktif");
        }


        /* Event ketika kategori diklik. */

        // Memasang event listener klik pada tombol kategori ini.
        tombol.addEventListener(
            "click",
            function () {

                // Mengubah variabel global kategoriDipilih sesuai tombol yang diklik.
                kategoriDipilih = nama;


                /* Menghapus class aktif
                   dari semua tombol. */

                // Mengambil semua tombol kategori yang ada di dalam #menu-kategori.
                const tombolLain =
                    kategoriMenu.querySelectorAll(
                        ".tombol-kategori"
                    );

                // Melakukan perulangan pada semua tombol tersebut.
                tombolLain.forEach(
                    function (tombolLain) {

                        // Menghapus class "aktif" dari setiap tombol.
                        // Output: semua tombol kategori kembali ke warna normal dulu.
                        tombolLain.classList.remove(
                            "aktif"
                        );
                    }
                );


                /* Mengaktifkan tombol yang
                   sedang dipilih. */

                // Menambahkan kembali class "aktif" hanya ke tombol yang baru diklik.
                // Output: tombol kategori yang baru diklik jadi tersorot/berwarna beda.
                tombol.classList.add("aktif");


                /* Menampilkan outfit sesuai
                   kategori. */

                // Memanggil ulang fungsi tampilkanOutfit() supaya galeri
                // difilter ulang berdasarkan kategori yang baru dipilih.
                // Output: kartu-kartu outfit di #wadah-galeri berubah sesuai kategori.
                tampilkanOutfit();
            }
        );


        /* Memasukkan tombol ke menu. */

        // Menempelkan (memasukkan) elemen tombol ke dalam #menu-kategori.
        // Output: tombol kategori benar-benar muncul di layar setelah baris ini.
        kategoriMenu.appendChild(tombol);
    });
}


/* ========================================
   MENAMPILKAN OUTFIT
   Data difilter berdasarkan halaman,
   kategori, dan pencarian.
======================================== */

// Fungsi ini menentukan outfit mana saja yang akan ditampilkan,
// berdasarkan kombinasi filter halaman/kategori/pencarian.
function tampilkanOutfit() {

    // Jika elemen galeri tidak ada di halaman ini, hentikan fungsi.
    if (!galeri) {
        return;
    }

    // Variabel sementara "hasil" diawali dengan semua data outfit (belum difilter).
    let hasil = dataOutfit;


    /* ====================================
       FILTER HALAMAN FAVORIT
    ==================================== */

    // Jika halaman saat ini adalah favorit.html...
    if (halamanFavorit) {

        // Mengambil daftar ID outfit yang sudah difavoritkan (dari localStorage).
        const favorit =
            ambilFavorit();

        // Menyaring dataOutfit, hanya menyisakan outfit yang ID/gambarnya
        // ada di dalam daftar favorit.
        hasil =
            dataOutfit.filter(
                function (outfit) {

                    // Menentukan ID unik outfit: pakai outfit.id, jika tidak ada pakai gambar.
                    const idOutfit =
                        outfit.id || outfit.gambar;

                    // true jika ID outfit ini termasuk dalam daftar favorit.
                    return favorit.includes(idOutfit);
                } 
            );
    }


    /* ====================================
       FILTER KATEGORI
    ==================================== */

    // Filter kategori hanya berlaku di halaman BUKAN favorit,
    // dan hanya jika kategori yang dipilih bukan "Semua".
    if (
        !halamanFavorit &&
        kategoriDipilih !== "Semua"
    ) {

        // Menyaring "hasil" agar hanya menyisakan outfit dengan style
        // yang sama dengan kategoriDipilih.
        hasil =
            hasil.filter(
                function (outfit) {

                    return outfit.style ===
                        kategoriDipilih;
                }
            );
    }


    /* ====================================
       FILTER PENCARIAN
    ==================================== */

    // Cek dulu apakah kotak pencarian ada di halaman ini.
    if (cari) {

        // Mengambil teks yang diketik user, diubah huruf kecil semua,
        // dan dihapus spasi di awal/akhir (trim).
        const kata =
            cari.value.toLowerCase().trim();

        // Filter pencarian hanya dijalankan jika ada kata yang diketik.
        if (kata !== "") {

            // Menyaring "hasil" agar hanya menyisakan outfit yang judul,
            // deskripsi, atau style-nya mengandung kata pencarian.
            hasil =
                hasil.filter(
                    function (outfit) {

                        // Mengambil judul outfit (atau string kosong jika tidak ada),
                        // diubah ke huruf kecil supaya pencarian tidak case-sensitive.
                        const judul =
                            (outfit.judul || "")
                                .toLowerCase();

                        // Sama seperti di atas tapi untuk deskripsi.
                        const deskripsi =
                            (outfit.deskripsi || "")
                                .toLowerCase();

                        // Sama seperti di atas tapi untuk nama style/kategori.
                        const style =
                            (outfit.style || "")
                                .toLowerCase();


                        // true jika kata pencarian ditemukan di salah satu dari
                        // judul, deskripsi, atau style.
                        return (
                            judul.includes(kata) ||
                            deskripsi.includes(kata) ||
                            style.includes(kata)
                        );
                    }
                );
        }
    }


    /* Menampilkan hasil filter. */

    // Mengirim array "hasil" (yang sudah difilter) ke fungsi tampilkanData
    // untuk benar-benar dirender jadi kartu-kartu di layar.
    tampilkanData(hasil);
}


/* ========================================
   MENAMPILKAN DATA OUTFIT
   Membuat kartu untuk setiap data outfit.
======================================== */

// Fungsi ini menerima array data outfit yang sudah difilter,
// lalu merender kartu-kartunya ke dalam elemen galeri.
function tampilkanData(data) {

    // Jika elemen galeri tidak ada, hentikan fungsi.
    if (!galeri) {
        return;
    }

    // Mengosongkan isi galeri sebelum diisi ulang dengan kartu-kartu baru.
    // Output: kartu-kartu lama hilang sesaat sebelum kartu baru muncul.
    galeri.textContent = "";


    /* Menampilkan pesan jika data kosong. */

    // Jika array data yang diterima kosong (tidak ada outfit yang cocok filter)...
    if (data.length === 0) {

        // Membuat elemen <p> baru di memori.
        const kosong =
            document.createElement("p");

        // Mengisi teks pesan "Outfit tidak ditemukan."
        kosong.textContent =
            "Outfit tidak ditemukan.";

        // Memberi class CSS untuk styling pesan kosong (padding, warna, dsb).
        kosong.className =
            "data-kosong";

        // Menempelkan elemen <p> ke dalam galeri.
        // Output: teks "Outfit tidak ditemukan." tampil di tengah area galeri.
        galeri.appendChild(kosong);

        // Menghentikan fungsi karena tidak perlu membuat kartu apa pun lagi.
        return;
    }


    /* Perulangan untuk membuat kartu. */

    // Untuk setiap item outfit dalam data, buat satu kartu dan
    // tempelkan ke dalam elemen galeri.
    data.forEach(function (outfit) {

        // buatKartu(outfit) mengembalikan elemen <article> lengkap.
        // Output: setiap kartu outfit muncul berjajar di dalam #wadah-galeri
        // mengikuti tata letak grid dari CSS (.wadah-galeri).
        galeri.appendChild(
            buatKartu(outfit)
        );
    });
}


/* ========================================
   MEMBUAT KARTU OUTFIT
   Semua elemen dibuat menggunakan
   createElement() dan appendChild().
======================================== */

// Fungsi ini menerima satu objek "outfit" dan mengembalikan
// satu elemen <article class="kartu"> lengkap dengan foto, teks, dan tombol.
function buatKartu(outfit) {

    /* Membuat elemen article sebagai kartu. */

    // Membuat elemen <article> sebagai bungkus utama satu kartu outfit.
    const kartu =
        document.createElement("article");

    // Memberi class "kartu" agar mengikuti gaya kotak/border di style.css.
    kartu.className =
        "kartu";


    /* ====================================
       MEMBUAT BAGIAN FOTO
    ==================================== */

    // Membuat elemen <div> pembungkus foto.
    const kotakFoto =
        document.createElement("div");

    // Class "kotak-gambar" mengatur ukuran & cursor pointer pada foto.
    kotakFoto.className =
        "kotak-gambar";


    /* Membuat elemen gambar. */

    // Membuat elemen <img>.
    const foto =
        document.createElement("img");

    // Mengisi atribut src dengan URL foto dari data outfit.
    // Output: gambar outfit tampil di dalam kartu.
    foto.src =
        outfit.gambar;

    // Mengisi atribut alt (teks alternatif untuk aksesibilitas/SEO).
    // Jika judul tidak ada, gunakan teks default "Outfit".
    foto.alt =
        outfit.judul || "Outfit";


    /* Membuka foto dalam ukuran besar
       ketika gambar diklik. */

    // Memasang event listener klik pada gambar.
    foto.addEventListener(
        "click",
        function () {

            // Memanggil fungsi bukaFoto untuk menampilkan modal zoom.
            // Output: foto besar muncul di overlay #zoom-foto.
            bukaFoto(
                outfit.gambar,
                outfit.judul
            );
        }
    );


    // Menempelkan <img> ke dalam <div class="kotak-gambar">.
    kotakFoto.appendChild(foto);


    /* ====================================
       MEMBUAT ISI KARTU
    ==================================== */

    // Membuat <div> pembungkus konten teks kartu (judul, deskripsi, style, tombol).
    const isi =
        document.createElement("div");

    // Class "isi-kartu" mengatur padding dan susunan flex-column.
    isi.className =
        "isi-kartu";


    /* Membuat judul outfit. */

    // Membuat elemen <h2> untuk judul outfit.
    const judul =
        document.createElement("h2");

    // Mengisi teks judul. Jika tidak ada judul di data, pakai "Outfit Style".
    // Output: judul outfit tampil tebal di bagian atas isi kartu.
    judul.textContent =
        outfit.judul ||
        "Outfit Style";


    /* Membuat deskripsi outfit. */

    // Membuat elemen <p> untuk deskripsi.
    const deskripsi =
        document.createElement("p");

    // Mengisi teks deskripsi, atau teks default jika kosong.
    // Output: paragraf deskripsi tampil di bawah judul.
    deskripsi.textContent =
        outfit.deskripsi ||
        "Tidak ada deskripsi.";


    /* Membuat informasi style. */

    // Membuat elemen <p> untuk menampilkan nama kategori/style.
    const style =
        document.createElement("p");

    // Class khusus "teks-style" (dibuat bold di CSS).
    style.className =
        "teks-style";

    // Menggabungkan teks "Style: " dengan nama style outfit (atau "-" jika kosong).
    // Output: baris teks "Style: Casual" (misalnya) di dalam kartu.
    style.textContent =
        "Style: " +
        (outfit.style || "-");


    /* ====================================
       MEMBUAT TOMBOL FAVORIT
    ==================================== */

    // Membuat elemen <button> untuk aksi favorit.
    const tombolFavorit =
        document.createElement("button");

    // Class untuk styling tombol favorit (warna, ukuran, dll).
    tombolFavorit.className =
        "tombol-favorit";

    // type="button" mencegah tombol ini submit form (jika kartu ada di dalam form).
    tombolFavorit.type =
        "button";


    /* Mengambil ID outfit.
       Jika tidak ada ID, gunakan gambar. */

    // Menentukan ID unik untuk outfit ini: pakai outfit.id jika ada,
    // jika tidak, gunakan URL gambar sebagai identitas.
    const idOutfit =
        outfit.id || outfit.gambar;


    /* Menentukan tampilan tombol. */

    // Memanggil fungsi untuk mengatur teks & warna awal tombol favorit
    // sesuai apakah outfit ini sudah difavoritkan sebelumnya atau belum.
    // Output: tombol menampilkan "♥ Favorit" (merah) atau "♡ Favorit" (biasa).
    ubahTampilanFavorit(
        tombolFavorit,
        idOutfit
    );


    /* Event tombol favorit. */

    // Memasang event listener klik pada tombol favorit.
    tombolFavorit.addEventListener(
        "click",
        function (event) {

            // Mencegah klik ini "menembus" ke elemen di belakangnya
            // (misalnya mencegah trigger klik pada foto/kartu di baliknya).
            event.stopPropagation();


            /* Pengguna harus login terlebih dahulu. */

            // Mengecek status login lewat localStorage.
            if (!sudahLogin()) {

                // Jika belum login, buka modal Sign In sebagai gantinya.
                // Output: modal login (#login) muncul di tengah layar.
                bukaLoginModal();

                // Menghentikan fungsi supaya status favorit tidak berubah
                // sebelum pengguna login.
                return;
            }


            /* Mengubah status favorit. */

            // Jika sudah login, baru proses tambah/hapus favorit dijalankan.
            // Output: status tombol berubah, notifikasi muncul, dan
            // jumlah favorit di #jumlah-favorit ikut diperbarui.
            ubahFavorit(
                idOutfit,
                tombolFavorit
            );
        }
    );


    /* ====================================
       MEMASUKKAN SEMUA ELEMEN KE KARTU
    ==================================== */

    // Menyusun urutan elemen di dalam <div class="isi-kartu">:
    // judul -> deskripsi -> style -> tombol favorit.
    isi.appendChild(judul);
    isi.appendChild(deskripsi);
    isi.appendChild(style);
    isi.appendChild(tombolFavorit);

    // Menempelkan <div class="kotak-gambar"> (berisi foto) ke dalam kartu.
    kartu.appendChild(kotakFoto);

    // Menempelkan <div class="isi-kartu"> (berisi teks & tombol) ke dalam kartu.
    kartu.appendChild(isi);

    // Mengembalikan elemen kartu yang sudah lengkap ke pemanggil fungsi
    // (dipakai oleh tampilkanData() untuk ditempel ke #wadah-galeri).
    return kartu;
}


/* ========================================
   FAVORIT
   Mengambil data favorit dari localStorage.
======================================== */

// Fungsi untuk mengambil daftar ID favorit yang tersimpan di browser (localStorage).
function ambilFavorit() {

    // Mengambil string JSON dari localStorage dengan key "galleryFavorit".
    // Tidak ada output visual, hanya membaca data yang tersimpan permanen di browser.
    const data =
        localStorage.getItem(
            "galleryFavorit"
        );


    // Jika data ditemukan (bukan null)...
    if (data) {

        // ...ubah string JSON tersebut kembali menjadi array JavaScript.
        return JSON.parse(data);
    }


    // Jika belum ada data favorit tersimpan, kembalikan array kosong.
    return [];
}


/* ========================================
   CEK LOGIN
   Mengecek status login pengguna.
======================================== */

// Fungsi untuk mengecek apakah pengguna sedang login.
function sudahLogin() {

    // Membandingkan nilai localStorage "naddyLogin" dengan string "true".
    // Mengembalikan true/false. Tidak ada output visual langsung.
    return localStorage.getItem(
        "naddyLogin"
    ) === "true";
}


/* ========================================
   TAMPILAN TOMBOL FAVORIT
======================================== */

// Fungsi untuk mengatur teks dan class tombol favorit sesuai statusnya.
function ubahTampilanFavorit(
    tombol,
    idOutfit
) {

    // Mengambil daftar favorit terbaru dari localStorage.
    const favorit =
        ambilFavorit();


    // Jika ID outfit ini sudah ada di daftar favorit...
    if (favorit.includes(idOutfit)) {

        // Ubah teks tombol menjadi hati terisi "♥ Favorit".
        tombol.textContent =
            "♥ Favorit";

        // Tambahkan class "sudah-favorit" agar warnanya berubah (merah) di CSS.
        // Output: tombol tampil dengan gaya "sudah difavoritkan".
        tombol.classList.add(
            "sudah-favorit"
        );

    } else {

        // Jika belum favorit, tampilkan hati kosong "♡ Favorit".
        tombol.textContent =
            "♡ Favorit";

        // Pastikan class "sudah-favorit" tidak ada (tampilan normal).
        tombol.classList.remove(
            "sudah-favorit"
        );
    }
}


/* ========================================
   MENAMBAH ATAU MENGHAPUS FAVORIT
======================================== */

// Fungsi untuk toggle status favorit sebuah outfit (tambah jika belum,
// hapus jika sudah ada).
function ubahFavorit(
    idOutfit,
    tombol
) {

    // Ambil daftar favorit saat ini dari localStorage.
    const favorit =
        ambilFavorit();

    // Mencari posisi (index) idOutfit di dalam array favorit.
    // -1 berarti belum ada / tidak ditemukan.
    const posisi =
        favorit.indexOf(idOutfit);


    /* Jika outfit belum menjadi favorit. */

    if (posisi === -1) {

        // Menambahkan idOutfit ke akhir array favorit.
        favorit.push(idOutfit);

        // Menampilkan notifikasi sementara di layar.
        // Output: kotak notifikasi di atas layar (#notifikasi) muncul
        // dengan teks "Ditambahkan ke Favorit".
        tampilkanPesan(
            "Ditambahkan ke Favorit"
        );

    } else {

        /* Jika sudah menjadi favorit,
           hapus dari array. */

        // Menghapus 1 elemen di posisi tersebut dari array favorit.
        favorit.splice(posisi, 1);

        // Menampilkan notifikasi "Dihapus dari Favorit".
        tampilkanPesan(
            "Dihapus dari Favorit"
        );
    }


    /* Menyimpan data favorit. */

    // Menyimpan kembali array favorit (yang sudah diubah) ke localStorage,
    // dalam bentuk string JSON agar bisa disimpan (localStorage hanya terima string).
    // Ini membuat data favorit tetap ada meski halaman di-refresh.
    localStorage.setItem(
        "galleryFavorit",
        JSON.stringify(favorit)
    );


    /* Memperbarui tombol favorit. */

    // Memanggil ulang fungsi tampilan tombol supaya teks & warnanya
    // sesuai dengan status favorit yang baru.
    // Output: tombol pada kartu ini langsung berubah tanpa reload halaman.
    ubahTampilanFavorit(
        tombol,
        idOutfit
    );


    /* Memperbarui jumlah favorit. */

    // Memperbarui angka jumlah favorit yang ditampilkan (jika elemennya ada).
    hitungFavorit();


    /* Jika berada di halaman Favorit,
       tampilkan ulang data. */

    // Jika pengguna sedang di halaman favorit.html dan menghapus favorit,
    // kartu tersebut harus langsung hilang dari daftar yang tampil.
    if (halamanFavorit) {

        // Output: galeri di halaman favorit dirender ulang tanpa outfit
        // yang baru saja dihapus dari favorit.
        tampilkanOutfit();
    }
}


/* ========================================
   MENGHITUNG JUMLAH FAVORIT
======================================== */

// Fungsi untuk menampilkan berapa banyak outfit yang sudah difavoritkan.
function hitungFavorit() {

    // Jika elemen #jumlah-favorit tidak ada di halaman ini, hentikan fungsi.
    if (!jumlahFavorit) {
        return;
    }

    // Mengambil daftar favorit terbaru.
    const favorit =
        ambilFavorit();

    // Menggabungkan jumlah favorit dengan teks " outfit favorit".
    // Output: teks seperti "3 outfit favorit" muncul di elemen #jumlah-favorit.
    jumlahFavorit.textContent =
        favorit.length +
        " outfit favorit";
}


/* ========================================
   MEMPERBARUI TOMBOL AKUN
   Menampilkan Sign In jika belum login
   atau nama pengguna jika sudah login.
======================================== */

// Fungsi untuk memperbarui teks tombol akun di navbar sesuai status login.
function perbaruiAkun() {

    // Jika tombol login di navbar tidak ada di halaman ini, hentikan fungsi.
    if (!tombolLogin) {
        return;
    }


    // Jika pengguna sedang login...
    if (sudahLogin()) {

        // Ambil nama pengguna yang tersimpan di localStorage.
        const nama =
            localStorage.getItem(
                "naddyUsername"
            );

        // Ubah teks tombol menjadi "Hi, <nama>".
        // Output: tombol di navbar menampilkan sapaan personal, misal "Hi, Naddy".
        tombolLogin.textContent =
            "Hi, " + nama;

    } else {

        // Jika belum login, tombol menampilkan teks default "Sign In".
        tombolLogin.textContent =
            "Sign In";
    }
}


/* ========================================
   MEMBUKA LOGIN
======================================== */

// Fungsi untuk menampilkan modal Sign In.
function bukaLoginModal() {

    // Jika elemen modal login tidak ada di halaman ini, hentikan fungsi.
    if (!login) {
        return;
    }

    // Menambahkan class "tampil" ke modal login.
    // Output: modal login (di CSS: .kotak-modal.tampil { display:flex })
    // muncul di tengah layar dengan latar gelap transparan.
    login.classList.add("tampil");

    // Menambahkan class "modal-terbuka" ke <body>.
    // Output: scroll halaman utama terkunci selama modal terbuka (overflow:hidden).
    document.body.classList.add(
        "modal-terbuka"
    );
}


/* ========================================
   MENUTUP LOGIN
======================================== */

// Fungsi untuk menyembunyikan modal Sign In.
function tutupLoginModal() {

    if (!login) {
        return;
    }

    // Menghapus class "tampil" sehingga modal kembali disembunyikan (display:none).
    login.classList.remove("tampil");

    // Mengaktifkan kembali scroll halaman (menghapus class penahan scroll).
    document.body.classList.remove(
        "modal-terbuka"
    );
}


/* ========================================
   MEMBUKA SIGN UP
======================================== */

// Fungsi untuk berpindah dari modal login ke modal daftar.
function bukaDaftarModal() {

    // Menutup modal login terlebih dahulu.
    tutupLoginModal();

    if (!daftar) {
        return;
    }

    // Menampilkan modal daftar (Sign Up).
    // Output: modal Sign Up muncul menggantikan modal Sign In.
    daftar.classList.add("tampil");

    document.body.classList.add(
        "modal-terbuka"
    );
}


/* ========================================
   MENUTUP SIGN UP
======================================== */

// Fungsi untuk menyembunyikan modal Sign Up.
function tutupDaftarModal() {

    if (!daftar) {
        return;
    }

    daftar.classList.remove("tampil");

    document.body.classList.remove(
        "modal-terbuka"
    );
}


/* ========================================
   TOMBOL AKUN
   Jika belum login membuka login.
   Jika sudah login melakukan Sign Out.
======================================== */

// Cek dulu tombol akun ada di halaman.
if (tombolLogin) {

    // Pasang event klik pada tombol akun di navbar.
    tombolLogin.addEventListener(
        "click",
        function () {

            // Jika pengguna sedang login, klik tombol ini berarti Sign Out.
            if (sudahLogin()) {

                // Menghapus data login dari localStorage.
                localStorage.removeItem(
                    "naddyLogin"
                );

                // Menghapus nama pengguna yang tersimpan.
                localStorage.removeItem(
                    "naddyUsername"
                );

                // Memperbarui tampilan tombol akun (kembali jadi "Sign In").
                // Output: teks tombol navbar berubah dari "Hi, nama" menjadi "Sign In".
                perbaruiAkun();

                // Menampilkan notifikasi sign out berhasil.
                tampilkanPesan(
                    "Berhasil Sign Out."
                );

            } else {

                // Jika belum login, klik tombol ini membuka modal Sign In.
                bukaLoginModal();
            }
        }
    );
}


/* ========================================
   TOMBOL TUTUP LOGIN
======================================== */

// Pasang event klik pada tombol × modal login, langsung memanggil tutupLoginModal.
if (tutupLogin) {

    tutupLogin.addEventListener(
        "click",
        tutupLoginModal
    );
}


/* ========================================
   TOMBOL TUTUP SIGN UP
======================================== */

// Pasang event klik pada tombol × modal daftar.
if (tutupDaftar) {

    tutupDaftar.addEventListener(
        "click",
        tutupDaftarModal
    );
}


/* ========================================
   TOMBOL BUKA SIGN UP
======================================== */

// Pasang event klik pada tombol "Sign Up" di dalam modal login.
if (bukaDaftar) {

    bukaDaftar.addEventListener(
        "click",
        bukaDaftarModal
    );
}


/* ========================================
   KEMBALI KE LOGIN
======================================== */

// Pasang event klik pada tombol "Sign In" di dalam modal daftar.
if (kembaliLogin) {

    kembaliLogin.addEventListener(
        "click",
        function () {

            // Tutup dulu modal daftar...
            tutupDaftarModal();

            // ...lalu buka modal login.
            // Output: modal Sign In muncul menggantikan modal Sign Up.
            bukaLoginModal();
        }
    );
}


/* ========================================
   FORM LOGIN
   Memvalidasi username dan password.
======================================== */

// Cek dulu form login ada di halaman.
if (formLogin) {

    // Pasang event "submit" — dijalankan saat tombol "Sign In" di form diklik/Enter.
    formLogin.addEventListener(
        "submit",
        function (event) {

            // Mencegah form melakukan reload halaman (perilaku default HTML form).
            event.preventDefault();


            // Mengambil nilai input username, dibersihkan dari spasi di awal/akhir.
            const nama =
                document.getElementById(
                    "nama-login"
                ).value.trim();

            // Mengambil nilai input password (tanpa trim, karena spasi bisa jadi bagian password).
            const password =
                document.getElementById(
                    "sandi-login"
                ).value;


            // Validasi: username dan password tidak boleh kosong.
            if (
                nama === "" ||
                password === ""
            ) {

                // Output: notifikasi peringatan muncul di atas layar.
                tampilkanPesan(
                    "Username dan password wajib diisi."
                );

                // Menghentikan proses submit lebih lanjut.
                return;
            }


            // Validasi panjang username harus 3-20 karakter.
            if (
                nama.length < 3 ||
                nama.length > 20
            ) {

                tampilkanPesan(
                    "Username harus 3-20 karakter."
                );

                return;
            }


            // Validasi panjang password harus 6-20 karakter.
            if (
                password.length < 6 ||
                password.length > 20
            ) {

                tampilkanPesan(
                    "Password harus 6-20 karakter."
                );

                return;
            }

            // Mengambil data akun tersimpan (dari proses Sign Up sebelumnya).
            const dataAkun =
                localStorage.getItem(
                    "naddyAccount"
                );


            // Jika belum pernah ada akun yang didaftarkan sama sekali.
            if (!dataAkun) {

                tampilkanPesan(
                    "Belum ada akun. Silakan Sign Up."
                );

                return;
            }


            /* Mengubah data menjadi object. */

            // Mengubah string JSON akun tersimpan menjadi objek JavaScript.
            const akun =
                JSON.parse(dataAkun);

            // Membandingkan input dengan data akun tersimpan.
            if (
                nama === akun.username &&
                password === akun.password
            ) {

                // Jika cocok, simpan status login = "true" di localStorage.
                localStorage.setItem(
                    "naddyLogin",
                    "true"
                );

                // Simpan juga nama pengguna yang sedang login.
                localStorage.setItem(
                    "naddyUsername",
                    nama
                );

                // Perbarui tampilan tombol akun di navbar (jadi "Hi, nama").
                perbaruiAkun();

                // Tutup modal login karena proses berhasil.
                // Output: modal Sign In menghilang dari layar.
                tutupLoginModal();

                // Tampilkan notifikasi sukses.
                tampilkanPesan(
                    "Sign In berhasil!"
                );

            } else {

                // Jika username/password tidak cocok, tampilkan pesan kesalahan.
                tampilkanPesan(
                    "Username atau password salah."
                );
            }
        }
    );
}


/* ========================================
   FORM SIGN UP
   Membuat akun baru dan melakukan
   validasi data pengguna.
======================================== */

// Cek dulu form daftar ada di halaman.
if (formDaftar) {

    // Pasang event submit pada form Sign Up.
    formDaftar.addEventListener(
        "submit",
        function (event) {

            // Mencegah reload halaman default.
            event.preventDefault();


            // Ambil nilai username baru (dibersihkan spasi).
            const nama =
                document.getElementById(
                    "nama-daftar"
                ).value.trim();

            // Ambil nilai password baru.
            const password =
                document.getElementById(
                    "sandi-daftar"
                ).value;

            // Ambil nilai konfirmasi/ulangi password.
            const ulangPassword =
                document.getElementById(
                    "ulangi-sandi"
                ).value;


            // Validasi: semua field wajib diisi.
            if (
                nama === "" ||
                password === "" ||
                ulangPassword === ""
            ) {

                tampilkanPesan(
                    "Semua data harus diisi."
                );

                return;
            }


            // Validasi panjang username.
            if (
                nama.length < 3 ||
                nama.length > 20
            ) {

                tampilkanPesan(
                    "Username harus 3-20 karakter."
                );

                return;
            }


            // Validasi panjang password.
            if (
                password.length < 6 ||
                password.length > 20
            ) {

                tampilkanPesan(
                    "Password harus 6-20 karakter."
                );

                return;
            }


            /* ====================================
               PASSWORD HARUS MEMILIKI ANGKA
            ==================================== */

            // Variabel penanda apakah password mengandung minimal 1 angka.
            let adaAngka = false;


            /* Mengecek setiap karakter password. */

            // Perulangan manual mengecek satu per satu karakter password.
            for (
                let i = 0;
                i < password.length;
                i++
            ) {

                // Membandingkan karakter secara string: jika karakter berada
                // di antara "0" dan "9" (secara urutan kode karakter), berarti angka.
                if (
                    password[i] >= "0" &&
                    password[i] <= "9"
                ) {

                    // Tandai ditemukan angka.
                    adaAngka = true;

                    // Hentikan perulangan lebih awal karena sudah cukup 1 angka.
                    break;
                }
            }


            // Jika tidak ditemukan angka sama sekali, tolak pendaftaran.
            if (!adaAngka) {

                tampilkanPesan(
                    "Password harus memiliki angka."
                );

                return;
            }

            // Validasi: password dan ulangi password harus sama persis.
            if (
                password !== ulangPassword
            ) {

                tampilkanPesan(
                    "Password tidak sama."
                );

                return;
            }


            // Membuat objek akun baru berisi username dan password.
            const akun = {
                username: nama,
                password: password
            };


            // Menyimpan objek akun (dalam bentuk string JSON) ke localStorage.
            // Ini membuat akun tetap ada meski browser ditutup/dibuka lagi.
            localStorage.setItem(
                "naddyAccount",
                JSON.stringify(akun)
            );


            // Mengisi otomatis input username di form login dengan username baru.
            // Output: kotak "Username" pada modal Sign In langsung terisi.
            document.getElementById(
                "nama-login"
            ).value = nama;


            // Mengosongkan kotak password di form login (demi keamanan,
            // password baru tidak diisi otomatis).
            document.getElementById(
                "sandi-login"
            ).value = "";


            // Menutup modal Sign Up...
            tutupDaftarModal();

            // ...lalu langsung membuka modal Sign In agar user bisa login.
            // Output: modal berganti dari Sign Up ke Sign In.
            bukaLoginModal();


            // Menampilkan notifikasi bahwa akun berhasil dibuat.
            tampilkanPesan(
                "Akun berhasil dibuat. Silakan Sign In."
            );
        }
    );
}


/* ========================================
   ZOOM FOTO
   Menampilkan foto dalam ukuran besar.
======================================== */

// Fungsi untuk menampilkan modal zoom berisi foto besar.
function bukaFoto(
    gambar,
    judul
) {

    // Jika elemen modal zoom atau gambar zoom tidak ada, hentikan fungsi.
    if (!zoom || !fotoZoom) {
        return;
    }

    // Mengganti src gambar di dalam modal zoom sesuai foto yang diklik.
    // Output: gambar besar muncul di dalam #zoom-foto.
    fotoZoom.src =
        gambar;

    // Mengganti alt text gambar zoom.
    fotoZoom.alt =
        judul || "Foto Outfit";


    // Menampilkan overlay modal zoom (class "tampil" -> display:flex di CSS).
    // Output: layar menjadi gelap dengan foto besar di tengah.
    zoom.classList.add(
        "tampil"
    );

    // Mengunci scroll halaman utama selama modal zoom terbuka.
    document.body.classList.add(
        "modal-terbuka"
    );
}


/* ========================================
   MENUTUP ZOOM FOTO
======================================== */

// Fungsi untuk menutup modal zoom foto.
function tutupFoto() {

    if (!zoom || !fotoZoom) {
        return;
    }

    // Menyembunyikan overlay zoom (display:none kembali di CSS).
    zoom.classList.remove(
        "tampil"
    );

    // Mengaktifkan kembali scroll halaman utama.
    document.body.classList.remove(
        "modal-terbuka"
    );

    // Mengosongkan src gambar supaya browser berhenti memuat/menampilkan gambar lama.
    fotoZoom.src = "";
}


/* ========================================
   TOMBOL TUTUP ZOOM
======================================== */

// Pasang event klik pada tombol × modal zoom, langsung memanggil tutupFoto.
if (tutupZoom) {

    tutupZoom.addEventListener(
        "click",
        tutupFoto
    );
}


/* ========================================
   MENUTUP ZOOM KETIKA AREA LUAR FOTO
   DIKLIK.
======================================== */

// Pasang event klik pada seluruh area overlay zoom (bukan hanya tombol ×).
if (zoom) {

    zoom.addEventListener(
        "click",
        function (event) {

            // event.target adalah elemen yang benar-benar diklik.
            // Jika yang diklik adalah overlay itu sendiri (bukan gambar di dalamnya),
            // berarti user mengklik area gelap di luar foto.
            if (event.target === zoom) {

                // Output: modal zoom tertutup, sama seperti klik tombol ×.
                tutupFoto();
            }
        }
    );
}


/* ========================================
   NOTIFIKASI
   Menampilkan pesan sementara.
======================================== */

// Fungsi untuk menampilkan notifikasi singkat di layar.
function tampilkanPesan(teks) {

    // Jika elemen #notifikasi tidak ada di halaman, hentikan fungsi.
    if (!pesan) {
        return;
    }

    // Mengisi teks notifikasi sesuai parameter yang dikirim.
    pesan.textContent =
        teks;

    // Menambahkan class "tampil" agar notifikasi muncul (display:block di CSS).
    // Output: kotak notifikasi muncul di bagian atas-tengah layar.
    pesan.classList.add(
        "tampil"
    );


    // Menjadwalkan penghapusan notifikasi setelah 2500 milidetik (2.5 detik).
    setTimeout(
        function () {

            // Menghapus class "tampil" sehingga notifikasi hilang lagi.
            // Output: kotak notifikasi menghilang otomatis setelah 2.5 detik.
            pesan.classList.remove(
                "tampil"
            );

        },
        2500
    );
}


/* ========================================
   PENCARIAN
   Filter dijalankan ketika pengguna
   mengetik di kotak pencarian.
======================================== */

// Cek dulu kotak pencarian ada di halaman.
if (cari) {

    // Event "input" terpicu setiap kali nilai kotak pencarian berubah
    // (setiap kali mengetik/menghapus huruf).
    cari.addEventListener(
        "input",
        function () {

            // Menjalankan ulang filter & render galeri.
            // Output: kartu-kartu outfit di galeri berubah secara real-time
            // mengikuti kata yang diketik user.
            tampilkanOutfit();
        }
    );
}


/* ========================================
   TOMBOL KEMBALI KE ATAS
   Tombol muncul ketika halaman discroll
   lebih dari 400 pixel.
======================================== */

// Cek dulu tombol kembali ke atas ada di halaman.
if (tombolAtas) {

    // Event "scroll" pada window, terpicu setiap kali halaman digulir.
    window.addEventListener(
        "scroll",
        function () {

            // Jika posisi scroll vertikal lebih dari 400px dari atas...
            if (window.scrollY > 400) {

                // Tambahkan class "tampil" agar tombol muncul.
                // Output: tombol ↑ muncul di pojok kanan bawah layar.
                tombolAtas.classList.add(
                    "tampil"
                );

            } else {

                // Jika masih di bagian atas halaman, sembunyikan tombol lagi.
                tombolAtas.classList.remove(
                    "tampil"
                );
            }
        }
    );

    // Pasang event klik pada tombol kembali ke atas.
    tombolAtas.addEventListener(
        "click",
        function () {

            // Menggulir halaman kembali ke posisi paling atas (top:0)
            // dengan animasi halus (behavior:"smooth").
            // Output: halaman otomatis scroll ke atas secara animasi.
            window.scrollTo({

                top: 0,
                behavior: "smooth"
            });
        }
    );
}


/* ========================================
   MENJALANKAN WEBSITE
   Memperbarui tampilan akun dan mengambil
   data API ketika JavaScript dijalankan.
======================================== */

// Baris ini dijalankan pertama kali saat file JS dimuat browser.
// Output: tombol akun di navbar langsung menampilkan status login yang benar
// (baik "Sign In" atau "Hi, nama") sejak halaman pertama kali dibuka.
perbaruiAkun();

// Hanya mengambil data API jika halaman ini memang punya elemen galeri.
// Mencegah pemanggilan fetch yang sia-sia di halaman seperti about.html.
if (galeri) {

    // Output: proses fetch dimulai, dan pada akhirnya galeri (#wadah-galeri)
    // terisi kartu-kartu outfit hasil dari API.
    ambilData();
}