// Backend CRUD Mahasiswa - Node.js, Express, MySQL
const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "db_kampus_2",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const asyncHandler = (handler) => (req, res, next) =>
    Promise.resolve(handler(req, res, next)).catch(next);

app.get("/api/mahasiswa", asyncHandler(async (req, res) => {
    const [rows] = await db.query(
        "SELECT id, nim, nama, jurusan, email FROM mahasiswa ORDER BY id DESC"
    );
    res.json(rows);
}));

app.post("/api/mahasiswa", asyncHandler(async (req, res) => {
    const { nim, nama, jurusan, email } = req.body;
    if (![nim, nama, jurusan, email].every(value => String(value ?? "").trim())) {
        return res.status(400).json({ success: false, message: "Semua kolom wajib diisi." });
    }

    const [existing] = await db.execute(
        "SELECT id FROM mahasiswa WHERE nim = ? LIMIT 1", [nim.trim()]
    );
    if (existing.length) {
        return res.status(409).json({ success: false, message: "NIM sudah terdaftar!" });
    }

    const [result] = await db.execute(
        "INSERT INTO mahasiswa (nim, nama, jurusan, email) VALUES (?, ?, ?, ?)",
        [nim.trim(), nama.trim(), jurusan.trim(), email.trim()]
    );
    res.status(201).json({
        success: true,
        message: "Data mahasiswa berhasil ditambahkan!",
        id: result.insertId
    });
}));

app.put("/api/mahasiswa/:id", asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const { nim, nama, jurusan, email } = req.body;

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ success: false, message: "ID mahasiswa tidak valid." });
    }
    if (![nim, nama, jurusan, email].every(value => String(value ?? "").trim())) {
        return res.status(400).json({ success: false, message: "Semua kolom wajib diisi." });
    }

    const [existing] = await db.execute(
        "SELECT id FROM mahasiswa WHERE nim = ? AND id <> ? LIMIT 1",
        [nim.trim(), id]
    );
    if (existing.length) {
        return res.status(409).json({ success: false, message: "NIM sudah digunakan mahasiswa lain." });
    }

    const [result] = await db.execute(
        "UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ?, email = ? WHERE id = ?",
        [nim.trim(), nama.trim(), jurusan.trim(), email.trim(), id]
    );
    if (!result.affectedRows) {
        return res.status(404).json({ success: false, message: "Data mahasiswa tidak ditemukan." });
    }
    res.json({ success: true, message: "Data mahasiswa berhasil diperbarui!" });
}));

app.delete("/api/mahasiswa/:id", asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ success: false, message: "ID mahasiswa tidak valid." });
    }

    const [result] = await db.execute("DELETE FROM mahasiswa WHERE id = ?", [id]);
    if (!result.affectedRows) {
        return res.status(404).json({ success: false, message: "Data mahasiswa tidak ditemukan." });
    }
    res.json({ success: true, message: "Data mahasiswa berhasil dihapus!" });
}));

app.get("/api/health", asyncHandler(async (req, res) => {
    await db.query("SELECT 1");
    res.json({ success: true, message: "Server dan database terhubung." });
}));

app.use((err, req, res, next) => {
    console.error("API error:", err.message);
    res.status(500).json({
        success: false,
        message: "Terjadi kesalahan pada server. Periksa koneksi database dan struktur tabel."
    });
});

async function startServer() {
    try {
        await db.query("SELECT 1");
        console.log("Berhasil terhubung ke database MySQL.");
    } catch (error) {
        console.error("Koneksi database belum berhasil:", error.message);
        console.error("Pastikan MySQL Laragon aktif dan database db_kampus_2 sudah dibuat.");
    }
    app.listen(PORT, () => {
        console.log(`Aplikasi berjalan di http://localhost:${PORT}`);
    });
}

startServer();
