/* ========================================
   ALAMAT REST API
   digunakan untuk mengambil data outfit
   dari server.
======================================== */

const alamatApi =
    "https://nadira-api-new.vercel.app/gallery.json";


/* ========================================
   VARIABEL DATA
   Menyimpan dat outfit dan kategori
   yang sedang dipilih.
======================================== */

let dataOutfit = [];

let kategoriDipilih = "Semua";


/* Mengecek apakah halaman saat ini
   adalah halaman Favorit. */

const halamanFavorit =
    window.location.pathname.includes("favorit.html");


/* ========================================
   AMBIL ELEMENT HTML
======================================== */

const galeri =
    document.getElementById("wadah-galeri");
const kategoriMenu =
    document.getElementById("menu-kategori");
const cari =
    document.getElementById("input-pencarian");
const pesan =
    document.getElementById("notifikasi");
const jumlahFavorit =
    document.getElementById("jumlah-favorit");


/* ========================================
   ELEMENT ZOOM FOTO
======================================== */

const zoom =
    document.getElementById("zoom-foto");
const fotoZoom =
    document.getElementById("gambar-zoom");
const tutupZoom =
    document.getElementById("tutup-zoom");

/* ========================================
   ELEMENT TOMBOL KEMBALI KE ATAS
======================================== */

const tombolAtas =
    document.getElementById("kembali-atas");


/* ========================================
   ELEMENT LOGIN DAN SIGN UP
======================================== */

const login =
    document.getElementById("login");
const daftar =
    document.getElementById("daftar");
const tombolLogin =
    document.getElementById("tombol-login-nav");
const tutupLogin =
    document.getElementById("tutup-login");
const tutupDaftar =
    document.getElementById("tutup-daftar");
const bukaDaftar =
    document.getElementById("buka-daftar");
const kembaliLogin =
    document.getElementById("kembali-login");
const formLogin =
    document.getElementById("form-login");
const formDaftar =
    document.getElementById("form-daftar");


/* ========================================
   ELEMENT PASSWORD
======================================== */

const passwordLogin =
    document.getElementById("sandi-login");
const lihatLogin =
    document.getElementById("lihat-password-login");
const passwordDaftar =
    document.getElementById("sandi-daftar");
const lihatDaftar =
    document.getElementById("lihat-password-daftar");
const passwordUlang =
    document.getElementById("ulangi-sandi");
const lihatUlang =
    document.getElementById("lihat-password-ulangi");

/* ========================================
   FUNGSI LIHAT PASSWORD
   Mengubah input password menjadi text
   atau kembali menjadi password.
======================================== */

function lihatPassword(input, tombol) {

    if (input.type === "password") {

        input.type = "text";
        tombol.textContent = "🙈";

    } else {

        input.type = "password";
        tombol.textContent = "👁";
    }
}


/* ========================================
   EVENT TOMBOL PASSWORD
======================================== */

if (lihatLogin) {

    lihatLogin.addEventListener(
        "click",
        function () {

            lihatPassword(
                passwordLogin,
                lihatLogin
            );
        }
    );
}

if (lihatDaftar) {

    lihatDaftar.addEventListener(
        "click",
        function () {

            lihatPassword(
                passwordDaftar,
                lihatDaftar
            );
        }
    );
}

if (lihatUlang) {

    lihatUlang.addEventListener(
        "click",
        function () {

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

function ambilData() {

    /* Jika halaman tidak memiliki galeri,
       fungsi tidak dijalankan. */

    if (!galeri) {
        return;
    }

    galeri.textContent =
        "⏳ Memuat outfit...";

    galeri.classList.add("memuat");


    fetch(alamatApi)

        /* Mengecek hasil dari server. */

        .then(function (respon) {

            if (!respon.ok) {
                throw new Error();
            }

            return respon.json();
        })


        /* Menyimpan data setelah berhasil
           diambil dari API. */

        .then(function (data) {

            dataOutfit = data;

            galeri.classList.remove("memuat");

            buatKategori();

            tampilkanOutfit();

            hitungFavorit();
        })


        /* Menampilkan pesan jika API gagal. */

        .catch(function () {

            galeri.classList.remove("memuat");

            galeri.textContent =
                "⚠️ Gagal mengambil data outfit.";
        });
}


/* ========================================
   MEMBUAT MENU KATEGORI
   Kategori diambil dari data API kemudian
   dibuat menggunakan createElement().
======================================== */

function buatKategori() {

    if (!kategoriMenu) {
        return;
    }

    kategoriMenu.textContent = "";

    const semuaKategori = [];


    /* Mengambil kategori dari setiap outfit. */

    dataOutfit.forEach(function (outfit) {

        if (
            outfit.style &&
            outfit.style.toLowerCase() !== "beige" &&
            !semuaKategori.includes(outfit.style)
        ) {

            semuaKategori.push(outfit.style);
        }
    });

    semuaKategori.sort();

    semuaKategori.unshift("Semua");


    /* Membuat tombol kategori. */
    semuaKategori.forEach(function (nama) {

        const tombol =
            document.createElement("button");

        tombol.textContent = nama;

        tombol.className =
            "tombol-kategori";

        tombol.type = "button";

        /* Menentukan kategori yang aktif. */

        if (nama === kategoriDipilih) {

            tombol.classList.add("aktif");
        }


        /* Event ketika kategori diklik. */

        tombol.addEventListener(
            "click",
            function () {

                kategoriDipilih = nama;


                /* Menghapus class aktif
                   dari semua tombol. */

                const tombolLain =
                    kategoriMenu.querySelectorAll(
                        ".tombol-kategori"
                    );

                tombolLain.forEach(
                    function (tombolLain) {

                        tombolLain.classList.remove(
                            "aktif"
                        );
                    }
                );


                /* Mengaktifkan tombol yang
                   sedang dipilih. */

                tombol.classList.add("aktif");


                /* Menampilkan outfit sesuai
                   kategori. */

                tampilkanOutfit();
            }
        );


        /* Memasukkan tombol ke menu. */

        kategoriMenu.appendChild(tombol);
    });
}


/* ========================================
   MENAMPILKAN OUTFIT
   Data difilter berdasarkan halaman,
   kategori, dan pencarian.
======================================== */

function tampilkanOutfit() {

    if (!galeri) {
        return;
    }

    let hasil = dataOutfit;


    /* ====================================
       FILTER HALAMAN FAVORIT
    ==================================== */

    if (halamanFavorit) {

        const favorit =
            ambilFavorit();

        hasil =
            dataOutfit.filter(
                function (outfit) {

                    const idOutfit =
                        outfit.id || outfit.gambar;

                    return favorit.includes(idOutfit);
                }
            );
    }


    /* ====================================
       FILTER KATEGORI
    ==================================== */

    if (
        !halamanFavorit &&
        kategoriDipilih !== "Semua"
    ) {

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

    if (cari) {

        const kata =
            cari.value.toLowerCase().trim();

        if (kata !== "") {

            hasil =
                hasil.filter(
                    function (outfit) {

                        const judul =
                            (outfit.judul || "")
                                .toLowerCase();

                        const deskripsi =
                            (outfit.deskripsi || "")
                                .toLowerCase();

                        const style =
                            (outfit.style || "")
                                .toLowerCase();


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

    tampilkanData(hasil);
}


/* ========================================
   MENAMPILKAN DATA OUTFIT
   Membuat kartu untuk setiap data outfit.
======================================== */

function tampilkanData(data) {

    if (!galeri) {
        return;
    }

    galeri.textContent = "";


    /* Menampilkan pesan jika data kosong. */

    if (data.length === 0) {

        const kosong =
            document.createElement("p");

        kosong.textContent =
            "Outfit tidak ditemukan.";

        kosong.className =
            "data-kosong";

        galeri.appendChild(kosong);

        return;
    }


    /* Perulangan untuk membuat kartu. */

    data.forEach(function (outfit) {

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

function buatKartu(outfit) {

    /* Membuat elemen article sebagai kartu. */

    const kartu =
        document.createElement("article");

    kartu.className =
        "kartu";


    /* ====================================
       MEMBUAT BAGIAN FOTO
    ==================================== */

    const kotakFoto =
        document.createElement("div");

    kotakFoto.className =
        "kotak-gambar";


    /* Membuat elemen gambar. */

    const foto =
        document.createElement("img");

    foto.src =
        outfit.gambar;

    foto.alt =
        outfit.judul || "Outfit";


    /* Membuka foto dalam ukuran besar
       ketika gambar diklik. */

    foto.addEventListener(
        "click",
        function () {

            bukaFoto(
                outfit.gambar,
                outfit.judul
            );
        }
    );


    kotakFoto.appendChild(foto);


    /* ====================================
       MEMBUAT ISI KARTU
    ==================================== */

    const isi =
        document.createElement("div");

    isi.className =
        "isi-kartu";


    /* Membuat judul outfit. */

    const judul =
        document.createElement("h2");

    judul.textContent =
        outfit.judul ||
        "Outfit Style";


    /* Membuat deskripsi outfit. */

    const deskripsi =
        document.createElement("p");

    deskripsi.textContent =
        outfit.deskripsi ||
        "Tidak ada deskripsi.";


    /* Membuat informasi style. */

    const style =
        document.createElement("p");

    style.className =
        "teks-style";

    style.textContent =
        "Style: " +
        (outfit.style || "-");


    /* ====================================
       MEMBUAT TOMBOL FAVORIT
    ==================================== */

    const tombolFavorit =
        document.createElement("button");

    tombolFavorit.className =
        "tombol-favorit";

    tombolFavorit.type =
        "button";


    /* Mengambil ID outfit.
       Jika tidak ada ID, gunakan gambar. */

    const idOutfit =
        outfit.id || outfit.gambar;


    /* Menentukan tampilan tombol. */

    ubahTampilanFavorit(
        tombolFavorit,
        idOutfit
    );


    /* Event tombol favorit. */

    tombolFavorit.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            /* Pengguna harus login terlebih dahulu. */

            if (!sudahLogin()) {

                bukaLoginModal();

                return;
            }


            /* Mengubah status favorit. */

            ubahFavorit(
                idOutfit,
                tombolFavorit
            );
        }
    );


    /* ====================================
       MEMASUKKAN SEMUA ELEMEN KE KARTU
    ==================================== */

    isi.appendChild(judul);
    isi.appendChild(deskripsi);
    isi.appendChild(style);
    isi.appendChild(tombolFavorit);
    kartu.appendChild(kotakFoto);
    kartu.appendChild(isi);

    return kartu;
}


/* ========================================
   FAVORIT
   Mengambil data favorit dari localStorage.
======================================== */

function ambilFavorit() {

    const data =
        localStorage.getItem(
            "galleryFavorit"
        );


    if (data) {

        return JSON.parse(data);
    }


    return [];
}


/* ========================================
   CEK LOGIN
   Mengecek status login pengguna.
======================================== */

function sudahLogin() {

    return localStorage.getItem(
        "naddyLogin"
    ) === "true";
}


/* ========================================
   TAMPILAN TOMBOL FAVORIT
======================================== */

function ubahTampilanFavorit(
    tombol,
    idOutfit
) {

    const favorit =
        ambilFavorit();


    if (favorit.includes(idOutfit)) {

        tombol.textContent =
            "♥ Favorit";

        tombol.classList.add(
            "sudah-favorit"
        );

    } else {

        tombol.textContent =
            "♡ Favorit";

        tombol.classList.remove(
            "sudah-favorit"
        );
    }
}


/* ========================================
   MENAMBAH ATAU MENGHAPUS FAVORIT
======================================== */

function ubahFavorit(
    idOutfit,
    tombol
) {

    const favorit =
        ambilFavorit();

    const posisi =
        favorit.indexOf(idOutfit);


    /* Jika outfit belum menjadi favorit. */

    if (posisi === -1) {

        favorit.push(idOutfit);

        tampilkanPesan(
            "Ditambahkan ke Favorit"
        );

    } else {

        /* Jika sudah menjadi favorit,
           hapus dari array. */

        favorit.splice(posisi, 1);

        tampilkanPesan(
            "Dihapus dari Favorit"
        );
    }


    /* Menyimpan data favorit. */

    localStorage.setItem(
        "galleryFavorit",
        JSON.stringify(favorit)
    );


    /* Memperbarui tombol favorit. */

    ubahTampilanFavorit(
        tombol,
        idOutfit
    );


    /* Memperbarui jumlah favorit. */

    hitungFavorit();


    /* Jika berada di halaman Favorit,
       tampilkan ulang data. */

    if (halamanFavorit) {

        tampilkanOutfit();
    }
}


/* ========================================
   MENGHITUNG JUMLAH FAVORIT
======================================== */

function hitungFavorit() {

    if (!jumlahFavorit) {
        return;
    }

    const favorit =
        ambilFavorit();

    jumlahFavorit.textContent =
        favorit.length +
        " outfit favorit";
}


/* ========================================
   MEMPERBARUI TOMBOL AKUN
   Menampilkan Sign In jika belum login
   atau nama pengguna jika sudah login.
======================================== */

function perbaruiAkun() {

    if (!tombolLogin) {
        return;
    }


    if (sudahLogin()) {

        const nama =
            localStorage.getItem(
                "naddyUsername"
            );

        tombolLogin.textContent =
            "Hi, " + nama;

    } else {

        tombolLogin.textContent =
            "Sign In";
    }
}


/* ========================================
   MEMBUKA LOGIN
======================================== */

function bukaLoginModal() {

    if (!login) {
        return;
    }

    login.classList.add("tampil");

    document.body.classList.add(
        "modal-terbuka"
    );
}


/* ========================================
   MENUTUP LOGIN
======================================== */

function tutupLoginModal() {

    if (!login) {
        return;
    }

    login.classList.remove("tampil");

    document.body.classList.remove(
        "modal-terbuka"
    );
}


/* ========================================
   MEMBUKA SIGN UP
======================================== */

function bukaDaftarModal() {

    tutupLoginModal();

    if (!daftar) {
        return;
    }

    daftar.classList.add("tampil");

    document.body.classList.add(
        "modal-terbuka"
    );
}


/* ========================================
   MENUTUP SIGN UP
======================================== */

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

if (tombolLogin) {

    tombolLogin.addEventListener(
        "click",
        function () {

            if (sudahLogin()) {

                localStorage.removeItem(
                    "naddyLogin"
                );

                localStorage.removeItem(
                    "naddyUsername"
                );

                perbaruiAkun();

                tampilkanPesan(
                    "Berhasil Sign Out."
                );

            } else {

                bukaLoginModal();
            }
        }
    );
}


/* ========================================
   TOMBOL TUTUP LOGIN
======================================== */

if (tutupLogin) {

    tutupLogin.addEventListener(
        "click",
        tutupLoginModal
    );
}


/* ========================================
   TOMBOL TUTUP SIGN UP
======================================== */

if (tutupDaftar) {

    tutupDaftar.addEventListener(
        "click",
        tutupDaftarModal
    );
}


/* ========================================
   TOMBOL BUKA SIGN UP
======================================== */

if (bukaDaftar) {

    bukaDaftar.addEventListener(
        "click",
        bukaDaftarModal
    );
}


/* ========================================
   KEMBALI KE LOGIN
======================================== */

if (kembaliLogin) {

    kembaliLogin.addEventListener(
        "click",
        function () {

            tutupDaftarModal();

            bukaLoginModal();
        }
    );
}


/* ========================================
   FORM LOGIN
   Memvalidasi username dan password.
======================================== */

if (formLogin) {

    formLogin.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nama =
                document.getElementById(
                    "nama-login"
                ).value.trim();

            const password =
                document.getElementById(
                    "sandi-login"
                ).value;


            if (
                nama === "" ||
                password === ""
            ) {

                tampilkanPesan(
                    "Username dan password wajib diisi."
                );

                return;
            }


            if (
                nama.length < 3 ||
                nama.length > 20
            ) {

                tampilkanPesan(
                    "Username harus 3-20 karakter."
                );

                return;
            }


            if (
                password.length < 6 ||
                password.length > 20
            ) {

                tampilkanPesan(
                    "Password harus 6-20 karakter."
                );

                return;
            }

            const dataAkun =
                localStorage.getItem(
                    "naddyAccount"
                );


            if (!dataAkun) {

                tampilkanPesan(
                    "Belum ada akun. Silakan Sign Up."
                );

                return;
            }


            /* Mengubah data menjadi object. */

            const akun =
                JSON.parse(dataAkun);

            if (
                nama === akun.username &&
                password === akun.password
            ) {

                localStorage.setItem(
                    "naddyLogin",
                    "true"
                );

                localStorage.setItem(
                    "naddyUsername",
                    nama
                );

                perbaruiAkun();

                tutupLoginModal();

                tampilkanPesan(
                    "Sign In berhasil!"
                );

            } else {

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

if (formDaftar) {

    formDaftar.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const nama =
                document.getElementById(
                    "nama-daftar"
                ).value.trim();

            const password =
                document.getElementById(
                    "sandi-daftar"
                ).value;

            const ulangPassword =
                document.getElementById(
                    "ulangi-sandi"
                ).value;


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


            if (
                nama.length < 3 ||
                nama.length > 20
            ) {

                tampilkanPesan(
                    "Username harus 3-20 karakter."
                );

                return;
            }


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

            let adaAngka = false;


            /* Mengecek setiap karakter password. */

            for (
                let i = 0;
                i < password.length;
                i++
            ) {

                if (
                    password[i] >= "0" &&
                    password[i] <= "9"
                ) {

                    adaAngka = true;

                    break;
                }
            }


            if (!adaAngka) {

                tampilkanPesan(
                    "Password harus memiliki angka."
                );

                return;
            }

            if (
                password !== ulangPassword
            ) {

                tampilkanPesan(
                    "Password tidak sama."
                );

                return;
            }


            const akun = {
                username: nama,
                password: password
            };


            localStorage.setItem(
                "naddyAccount",
                JSON.stringify(akun)
            );


            document.getElementById(
                "nama-login"
            ).value = nama;


            document.getElementById(
                "sandi-login"
            ).value = "";


            tutupDaftarModal();
            bukaLoginModal();


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

function bukaFoto(
    gambar,
    judul
) {

    if (!zoom || !fotoZoom) {
        return;
    }

    fotoZoom.src =
        gambar;

    fotoZoom.alt =
        judul || "Foto Outfit";


    zoom.classList.add(
        "tampil"
    );

    document.body.classList.add(
        "modal-terbuka"
    );
}


/* ========================================
   MENUTUP ZOOM FOTO
======================================== */

function tutupFoto() {

    if (!zoom || !fotoZoom) {
        return;
    }

    zoom.classList.remove(
        "tampil"
    );

    document.body.classList.remove(
        "modal-terbuka"
    );

    fotoZoom.src = "";
}


/* ========================================
   TOMBOL TUTUP ZOOM
======================================== */

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

if (zoom) {

    zoom.addEventListener(
        "click",
        function (event) {

            if (event.target === zoom) {

                tutupFoto();
            }
        }
    );
}


/* ========================================
   NOTIFIKASI
   Menampilkan pesan sementara.
======================================== */

function tampilkanPesan(teks) {

    if (!pesan) {
        return;
    }

    pesan.textContent =
        teks;

    pesan.classList.add(
        "tampil"
    );


    setTimeout(
        function () {

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

if (cari) {

    cari.addEventListener(
        "input",
        function () {

            tampilkanOutfit();
        }
    );
}


/* ========================================
   TOMBOL KEMBALI KE ATAS
   Tombol muncul ketika halaman discroll
   lebih dari 400 pixel.
======================================== */

if (tombolAtas) {

    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 400) {

                tombolAtas.classList.add(
                    "tampil"
                );

            } else {

                tombolAtas.classList.remove(
                    "tampil"
                );
            }
        }
    );

    tombolAtas.addEventListener(
        "click",
        function () {

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

perbaruiAkun();

if (galeri) {
    ambilData();
}