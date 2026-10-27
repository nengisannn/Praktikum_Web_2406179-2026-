
# MyPortfolio — Integrasi Pertemuan 3 dan Pertemuan 4

## Isi proyek

- `index.html` — beranda portofolio (Pertemuan 3)
- `project.html` — halaman daftar proyek
- `resume.html` — profil dan resume
- `contact.html` — formulir kontak berbasis `mailto:`
- `style.css` — gaya umum seluruh halaman
- `site.js` — navigasi responsif dan formulir kontak
- `dashboard.html` — dashboard pengelolaan proyek (Pertemuan 4)
- `dashboard.css` — gaya khusus dashboard
- `dashboard.js` — tambah, validasi, cari, filter, ubah status,
  hapus, statistik, dan localStorage

## Cara menjalankan di VS Code

1. Ekstrak ZIP ke folder yang mudah ditemukan.
2. Buka Visual Studio Code.
3. Pilih File → Open Folder.
4. Pilih folder proyek.
5. Instal ekstensi Live Server jika belum tersedia.
6. Klik kanan `index.html`.
7. Pilih Open with Live Server.
8. Gunakan navigasi untuk membuka setiap halaman.
9. Buka `dashboard.html` untuk menguji fitur Pertemuan 4.

## Cara menguji dashboard

1. Tambah proyek dengan judul, kategori, dan anggaran lebih dari 0.
2. Coba judul kosong atau anggaran 0 untuk menguji validasi.
3. Cari proyek melalui kolom pencarian.
4. Gunakan filter kategori dan status.
5. Ubah status proyek menjadi selesai atau aktif kembali.
6. Hapus proyek dan konfirmasi tindakan.
7. Periksa statistik total proyek, proyek selesai, proyek berjalan,
   dan total anggaran.
8. Muat ulang halaman untuk memeriksa penyimpanan data.

## Materi JavaScript yang diterapkan

- Array dan object
- `addEventListener()` dan `preventDefault()`
- Validasi form
- `Date.now()` untuk ID
- Spread operator (`...`)
- `filter()`, `map()`, `reduce()`
- `toLowerCase()` dan `includes()`
- Event delegation (`closest()`)
- `localStorage`
- `JSON.stringify()` dan `JSON.parse()`

## Catatan

- Sesuaikan profil resume dengan data diri yang sebenarnya.
- Ganti `ganti-email-anda@example.com` pada `site.js` dengan email tujuan.
- Formulir kontak hanya membuka aplikasi email, bukan mengirim pesan
  langsung ke server.
- Data dashboard disimpan di browser yang sedang digunakan,
  bukan di server.
