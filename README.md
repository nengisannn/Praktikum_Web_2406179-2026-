# EduData — CRUD Mahasiswa

Aplikasi manajemen data mahasiswa menggunakan Node.js, Express, JavaScript Fetch API, dan MySQL (Laragon).

## Fitur
- Create, Read, Update, Delete data mahasiswa.
- Pencarian real-time berdasarkan NIM, nama, program studi, dan email.
- Validasi NIM duplikat di frontend menggunakan `.some()` sebelum `fetch()`, serta validasi ulang di backend.
- Counter total mahasiswa yang diperbarui setelah data berhasil dimuat, ditambah, atau dihapus.
- Dashboard responsif, notifikasi, konfirmasi hapus, dan form tambah/edit.

## Persiapan database
1. Jalankan Laragon, lalu aktifkan Apache dan MySQL.
2. Buka phpMyAdmin atau HeidiSQL.
3. Import file `database.sql`. File tersebut membuat database `db_kampus_2` dan tabel `mahasiswa`.
4. Konfigurasi default MySQL adalah `localhost`, user `root`, password kosong. Sesuaikan environment variable jika konfigurasi Laragon berbeda.

## Menjalankan aplikasi
Buka terminal di folder proyek, lalu jalankan:

```bash
npm install
npm start
```

Buka browser pada `http://localhost:3000`.

## Konfigurasi database opsional
PowerShell:

```powershell
$env:DB_HOST="localhost"
$env:DB_USER="root"
$env:DB_PASSWORD=""
$env:DB_NAME="db_kampus_2"
npm start
```

## Struktur folder

```text
crud-mhs/
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── database.sql
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Catatan validasi
Frontend mengecualikan data yang sedang diedit saat memeriksa NIM, sehingga NIM milik mahasiswa yang sama tetap dapat dipertahankan. Backend juga memeriksa duplikasi dan database menggunakan unique key agar data tetap konsisten.
