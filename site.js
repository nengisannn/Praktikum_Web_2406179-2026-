
// Navigasi responsif untuk semua halaman
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Form kontak menggunakan mailto (tidak memerlukan backend).
// Ganti alamat di bawah dengan email tujuan yang benar.
const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama || !email || !pesan) {
      alert("Mohon lengkapi semua kolom.");
      return;
    }

    const tujuanEmail = "ganti-email-anda@example.com";
    const subjek = encodeURIComponent(`Pesan portofolio dari ${nama}`);
    const isi = encodeURIComponent(
      `Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`
    );

    window.location.href =
      `mailto:${tujuanEmail}?subject=${subjek}&body=${isi}`;
  });
}
