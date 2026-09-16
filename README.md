# THE NADDY GALLERY

Website galeri inspirasi outfit yang menampilkan berbagai gaya fashion secara modern dan interaktif.

## Daftar Isi

1. [Tentang Project](#tentang-project)
2. [Tujuan Project](#tujuan-project)
3. [Fitur](#fitur)
4. [Kategori Outfit](#kategori-outfit)
5. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
6. [Struktur Folder](#struktur-folder)
7. [Halaman Website](#halaman-website)
8. [REST API](#rest-api)
9. [Penyimpanan Data](#penyimpanan-data)
10. [Cara Menjalankan Project](#cara-menjalankan-project)
11. [Pengembang](#pengembang)

## Tentang Project

**The Naddy Gallery** adalah website galeri inspirasi outfit yang dibuat untuk menampilkan berbagai style fashion dalam bentuk galeri. Website ini memiliki tampilan modern dengan nuansa warna cokelat gelap dan gold.

Project ini dibuat menggunakan HTML, CSS, dan JavaScript serta menggunakan REST API untuk mengambil data outfit.

## Tujuan Project

Project ini dibuat sebagai media untuk menampilkan inspirasi outfit sekaligus menerapkan materi pembelajaran mengenai HTML, CSS, JavaScript, DOM, event, REST API, dan LocalStorage.

## Fitur

* Menampilkan koleksi outfit.
* Pencarian outfit.
* Filter berdasarkan kategori.
* Menambahkan outfit ke favorit.
* Login dan register.
* Penyimpanan favorit menggunakan LocalStorage.
* Zoom foto outfit.
* Navigasi antar halaman.
* Tombol kembali ke atas.
* Pengambilan data menggunakan REST API.

## Kategori Outfit

Website menampilkan berbagai kategori style outfit yang tersedia dari data API.

Kategori dapat ditampilkan melalui tombol filter sehingga pengguna dapat melihat outfit berdasarkan style yang dipilih.

## Teknologi yang Digunakan

* HTML5
* CSS3
* JavaScript
* REST API
* LocalStorage

## Struktur Folder

```text
galery-HTML/
│
├── aset/
│   └── logo.jpg
│
├── css/
│   └── style.css
│
├── html/
│   ├── about.html
│   └── favorit.html
│
├── js/
│   └── isi.js
│
└── index.html
```

## Halaman Website

### Beranda

Halaman utama yang digunakan untuk menampilkan koleksi outfit, pencarian, kategori, dan fitur favorit.

### Favorit

Halaman yang digunakan untuk melihat outfit yang telah ditambahkan ke daftar favorit.

### About

Halaman yang berisi informasi mengenai The Naddy Gallery dan konsep style fashion yang digunakan.

## REST API

Project menggunakan REST API untuk mengambil data outfit.

Data yang digunakan meliputi beberapa informasi seperti:

* ID outfit
* Style
* Judul
* Deskripsi
* Gambar

Data tersebut kemudian ditampilkan secara dinamis pada halaman galeri menggunakan JavaScript.

## Penyimpanan Data

Fitur favorit menggunakan **LocalStorage** pada browser untuk menyimpan data outfit yang dipilih oleh pengguna.

Informasi login juga disimpan menggunakan LocalStorage sehingga status login dapat digunakan pada halaman website.

## Cara Menjalankan Project

1. Download atau clone repository.
2. Buka folder project.
3. Buka file `index.html` menggunakan browser.
4. Website dapat digunakan untuk melihat koleksi outfit.

## Pengembang

**Nadira Hasan Harahap**

Project ini dibuat sebagai project pembelajaran web development.

