
// =====================================================
// DASHBOARD PROYEK — implementasi konsep Pertemuan 4
// Array objek, validasi form, filter, map, reduce,
// event listener, localStorage, dan render ulang tampilan.
// =====================================================

const STORAGE_KEY = "myportfolio_daftar_proyek_v1";

const dataAwal = [
  {
    id: 1001,
    judul: "Dashboard Portofolio",
    kategori: "Web App",
    anggaran: 5000000,
    selesai: true
  },
  {
    id: 1002,
    judul: "Aplikasi Pengelolaan Data",
    kategori: "Desktop App",
    anggaran: 3500000,
    selesai: false
  },
  {
    id: 1003,
    judul: "Desain Aplikasi Mobile",
    kategori: "UI/UX Design",
    anggaran: 2500000,
    selesai: false
  }
];

// Membaca data dari localStorage.
function bacaData() {
  try {
    const tersimpan = localStorage.getItem(STORAGE_KEY);
    return tersimpan ? JSON.parse(tersimpan) : [...dataAwal];
  } catch (error) {
    console.warn("Data lokal tidak dapat dibaca; memakai data awal.", error);
    return [...dataAwal];
  }
}

let daftarProyek = bacaData();

// Mengambil elemen HTML.
const projectForm = document.getElementById("projectForm");
const inputJudul = document.getElementById("judul");
const inputKategori = document.getElementById("kategori");
const inputAnggaran = document.getElementById("anggaran");
const inputSelesai = document.getElementById("selesai");

const searchInput = document.getElementById("searchInput");
const filterKategori = document.getElementById("filterKategori");
const filterStatus = document.getElementById("filterStatus");
const projectList = document.getElementById("projectList");

const totalProyek = document.getElementById("totalProyek");
const proyekSelesai = document.getElementById("proyekSelesai");
const proyekBerjalan = document.getElementById("proyekBerjalan");
const totalAnggaran = document.getElementById("totalAnggaran");
const resultCount = document.getElementById("resultCount");

// Menyimpan data ke localStorage.
function simpanData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(daftarProyek));
}

// Mengubah angka menjadi format mata uang rupiah.
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

// Menghindari teks input ditafsirkan sebagai markup HTML.
function escapeHTML(teks) {
  return String(teks).replace(/[&<>"']/g, karakter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[karakter]);
}

// Menghitung dan menampilkan statistik.
function renderStatistik() {
  const jumlahSelesai = daftarProyek.filter(
    proyek => proyek.selesai
  ).length;

  const jumlahBerjalan = daftarProyek.filter(
    proyek => !proyek.selesai
  ).length;

  const anggaranKeseluruhan = daftarProyek.reduce(
    (total, proyek) => total + Number(proyek.anggaran),
    0
  );

  totalProyek.textContent = daftarProyek.length;
  proyekSelesai.textContent = jumlahSelesai;
  proyekBerjalan.textContent = jumlahBerjalan;
  totalAnggaran.textContent = formatRupiah(anggaranKeseluruhan);
}

// Menampilkan daftar proyek berdasarkan pencarian dan filter.
function renderProyek() {
  const kataKunci = searchInput.value.trim().toLowerCase();
  const kategoriDipilih = filterKategori.value;
  const statusDipilih = filterStatus.value;

  const proyekTampil = daftarProyek.filter(proyek => {
    const cocokNama = proyek.judul.toLowerCase().includes(kataKunci);

    const cocokKategori =
      !kategoriDipilih || proyek.kategori === kategoriDipilih;

    const cocokStatus =
      !statusDipilih ||
      (statusDipilih === "selesai" ? proyek.selesai : !proyek.selesai);

    return cocokNama && cocokKategori && cocokStatus;
  });

  resultCount.textContent = `${proyekTampil.length} proyek`;

  if (proyekTampil.length === 0) {
    projectList.innerHTML = `
      <div class="empty-state">
        <strong>Belum ada proyek yang cocok</strong>
        <p>Coba ubah kata pencarian atau pilihan filter.</p>
      </div>
    `;
    return;
  }

  projectList.innerHTML = proyekTampil.map(proyek => {
    const statusClass = proyek.selesai ? "done" : "progress";
    const statusText = proyek.selesai
      ? "✓ Selesai"
      : "◷ Dalam Pengerjaan";

    const kategoriIcon = {
      "Web App": "⌘",
      "Mobile App": "▣",
      "Desktop App": "▦",
      "UI/UX Design": "✳"
    }[proyek.kategori] || "◇";

    return `
      <article class="dash-project-card">
        <div class="dash-card-top">
          <span class="dash-project-icon">${kategoriIcon}</span>
          <div>
            <h3 class="dash-project-title">
              ${escapeHTML(proyek.judul)}
            </h3>
            <span class="dash-category">
              ${escapeHTML(proyek.kategori)}
            </span>
          </div>
        </div>

        <div class="dash-budget">
          <span>Estimasi anggaran</span>
          <b>${formatRupiah(Number(proyek.anggaran))}</b>
        </div>

        <span class="dash-status ${statusClass}">${statusText}</span>

        <div class="dash-card-actions">
          <button
            class="toggle-status"
            type="button"
            data-action="toggle"
            data-id="${proyek.id}">
            ${proyek.selesai ? "↻ Aktifkan lagi" : "✓ Tandai selesai"}
          </button>

          <button
            class="delete-project"
            type="button"
            data-action="delete"
            data-id="${proyek.id}">
            Hapus
          </button>
        </div>
      </article>
    `;
  }).join("");
}

// Memperbarui statistik dan daftar proyek.
function renderDashboard() {
  renderStatistik();
  renderProyek();
}

// Menambahkan proyek baru dan memvalidasi input.
projectForm.addEventListener("submit", event => {
  event.preventDefault();

  const judul = inputJudul.value.trim();
  const kategori = inputKategori.value;
  const anggaran = Number(inputAnggaran.value);

  if (!judul) {
    alert("Judul proyek wajib diisi.");
    inputJudul.focus();
    return;
  }

  if (!Number.isFinite(anggaran) || anggaran <= 0) {
    alert("Anggaran harus berupa angka lebih besar dari 0.");
    inputAnggaran.focus();
    return;
  }

  const proyekBaru = {
    id: Date.now(),
    judul,
    kategori,
    anggaran,
    selesai: inputSelesai.checked
  };

  daftarProyek = [...daftarProyek, proyekBaru];

  simpanData();
  projectForm.reset();
  renderDashboard();

  alert("Proyek berhasil ditambahkan.");
});

// Pencarian langsung saat pengguna mengetik.
searchInput.addEventListener("input", renderProyek);

// Filter kategori dan status.
filterKategori.addEventListener("change", renderProyek);
filterStatus.addEventListener("change", renderProyek);

// Event delegation untuk tombol status dan hapus.
projectList.addEventListener("click", event => {
  const tombol = event.target.closest("button[data-action]");
  if (!tombol) return;

  const idProyek = Number(tombol.dataset.id);
  const aksi = tombol.dataset.action;

  // Mengubah status proyek.
  if (aksi === "toggle") {
    daftarProyek = daftarProyek.map(proyek =>
      proyek.id === idProyek
        ? { ...proyek, selesai: !proyek.selesai }
        : proyek
    );

    simpanData();
    renderDashboard();
  }

  // Menghapus proyek.
  if (aksi === "delete") {
    const proyek = daftarProyek.find(
      item => item.id === idProyek
    );

    if (!proyek) return;

    const yakin = confirm(`Hapus proyek "${proyek.judul}"?`);
    if (!yakin) return;

    daftarProyek = daftarProyek.filter(
      item => item.id !== idProyek
    );

    simpanData();
    renderDashboard();
  }
});

// Reset form hanya membersihkan input, bukan menghapus data proyek.
projectForm.addEventListener("reset", () => {
  // Tidak perlu mengubah daftar proyek.
});

// Menampilkan dashboard saat halaman pertama kali dibuka.
renderDashboard();
