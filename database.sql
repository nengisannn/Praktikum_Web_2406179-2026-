-- Jalankan file ini melalui phpMyAdmin / HeidiSQL Laragon.
CREATE DATABASE IF NOT EXISTS db_kampus_2
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_kampus_2;

CREATE TABLE IF NOT EXISTS mahasiswa (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    nim VARCHAR(30) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_nim (nim)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contoh data (opsional). Hapus tanda komentar jika ingin mengisi data awal.
-- INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES
-- ('240101001', 'Alya Putri', 'Teknik Informatika', 'alya@kampus.ac.id'),
-- ('240101002', 'Bima Pratama', 'Sistem Informasi', 'bima@kampus.ac.id');
