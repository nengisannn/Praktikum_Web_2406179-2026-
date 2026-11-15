
/* 
   File: public/script.js
   Modul 7: Pengembangan Fitur CRUD dengan JavaScript & Laragon
   Logika Client-Side JavaScript CRUD
*/

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. TANGKAP ELEMEN DOM
    // ==========================================

    const mhsForm = document.querySelector("#mhsForm");
    const mhsIdInput = document.querySelector("#mhsId");
    const nimInput = document.querySelector("#nim");
    const namaInput = document.querySelector("#nama");
    const jurusanInput = document.querySelector("#jurusan");
    const emailInput = document.querySelector("#email");

    const btnSubmit = document.querySelector("#btnSubmit");
    const btnCancel = document.querySelector("#btnCancel");

    const formTitle = document.querySelector("#formTitle");
    const mhsTableBody = document.querySelector("#mhsTableBody");
    const alertMessage = document.querySelector("#alertMessage");

    let listMahasiswa = [];

    // Pastikan semua elemen HTML tersedia
    if (
        !mhsForm || !mhsIdInput || !nimInput ||
        !namaInput || !jurusanInput || !emailInput ||
        !btnSubmit || !btnCancel || !formTitle ||
        !mhsTableBody || !alertMessage
    ) {
        console.error("Elemen HTML tidak ditemukan. Periksa ID pada index.html.");
        return;
    }


    // ==========================================
    // 2. FUNGSI NOTIFIKASI ALERT
    // ==========================================

    const showAlert = (text, type = "success") => {

        alertMessage.textContent = text;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.style.display = "block";

        setTimeout(() => {
            alertMessage.style.display = "none";
        }, 3000);

    };


    // ==========================================
    // 3. READ: AMBIL DATA MAHASISWA DARI API
    // ==========================================

    const loadMahasiswa = async () => {

        try {

            const res = await fetch("/api/mahasiswa");

            if (!res.ok) {
                throw new Error("Gagal mengambil data mahasiswa");
            }

            listMahasiswa = await res.json();

            renderTable(listMahasiswa);

        } catch (err) {

            console.error("Error READ:", err);

            showAlert(
                "Gagal memuat data dari server backend",
                "error"
            );

        }

    };


    // ==========================================
    // 4. TAMPILKAN DATA KE DALAM TABEL
    // ==========================================

    const renderTable = (data) => {

        mhsTableBody.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {

            mhsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center; color:#64748b;">
                        Belum ada data mahasiswa tersimpan.
                    </td>
                </tr>
            `;

            return;

        }

        data.forEach((mhs, idx) => {

            const tr = document.createElement("tr");

            // Membuat kolom tabel
            const values = [
                idx + 1,
                mhs.nim,
                mhs.nama,
                mhs.jurusan,
                mhs.email
            ];

            values.forEach(value => {

                const td = document.createElement("td");

                // Menghindari HTML yang dimasukkan dari data mahasiswa
                td.textContent = value ?? "";

                tr.appendChild(td);

            });

            // Membuat kolom tombol aksi
            const actionTd = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.className = "btn-action btn-edit";
            editButton.dataset.id = mhs.id;
            editButton.textContent = "Edit";

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn-action btn-delete";
            deleteButton.dataset.id = mhs.id;
            deleteButton.textContent = "Hapus";

            actionTd.appendChild(editButton);
            actionTd.appendChild(deleteButton);

            tr.appendChild(actionTd);

            mhsTableBody.appendChild(tr);

        });

    };


    // ==========================================
    // 5. CREATE & UPDATE: SUBMIT FORMULIR
    // ==========================================

    mhsForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const payload = {

            nim: nimInput.value.trim(),
            nama: namaInput.value.trim(),
            jurusan: jurusanInput.value,
            email: emailInput.value.trim()

        };

        const id = mhsIdInput.value;

        const isEdit = Boolean(id);

        const url = isEdit
            ? `/api/mahasiswa/${encodeURIComponent(id)}`
            : "/api/mahasiswa";

        const method = isEdit ? "PUT" : "POST";

        try {

            const res = await fetch(url, {

                method: method,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)

            });

            const result = await res.json();

            if (!res.ok || !result.success) {

                throw new Error(
                    result.message || "Gagal menyimpan data mahasiswa"
                );

            }

            showAlert(
                result.message || "Data mahasiswa berhasil disimpan"
            );

            resetForm();

            await loadMahasiswa();

        } catch (err) {

            console.error("Error CREATE/UPDATE:", err);

            showAlert(
                "Terjadi kesalahan: " + err.message,
                "error"
            );

        }

    });


    // ==========================================
    // 6. DELETE & EDIT: EVENT DELEGATION
    // ==========================================

    mhsTableBody.addEventListener("click", async (e) => {

        const target = e.target;

        const id = Number(target.dataset.id);

        if (!id) return;


        // --------------------------------------
        // MODE EDIT
        // --------------------------------------

        if (target.classList.contains("btn-edit")) {

            const targetMhs = listMahasiswa.find(
                m => Number(m.id) === id
            );

            if (targetMhs) {

                // Mengisi form dengan data mahasiswa
                mhsIdInput.value = targetMhs.id;
                nimInput.value = targetMhs.nim;
                namaInput.value = targetMhs.nama;
                jurusanInput.value = targetMhs.jurusan;
                emailInput.value = targetMhs.email;

                // Mengubah tampilan form menjadi mode edit
                formTitle.textContent = "Edit Data Mahasiswa";

                btnSubmit.textContent = "Perbarui Mahasiswa";

                btnCancel.style.display = "inline-block";

                // Scroll otomatis ke bagian atas halaman
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }


        // --------------------------------------
        // MODE DELETE
        // --------------------------------------

        else if (target.classList.contains("btn-delete")) {

            const konfirmasi = confirm(
                "Apakah Anda yakin ingin menghapus data mahasiswa ini?"
            );

            if (konfirmasi) {

                try {

                    const res = await fetch(
                        `/api/mahasiswa/${encodeURIComponent(id)}`,
                        {
                            method: "DELETE"
                        }
                    );

                    const result = await res.json();

                    if (!res.ok || !result.success) {

                        throw new Error(
                            result.message || "Gagal menghapus data mahasiswa"
                        );

                    }

                    showAlert(
                        result.message || "Data mahasiswa berhasil dihapus"
                    );

                    await loadMahasiswa();

                } catch (err) {

                    console.error("Error DELETE:", err);

                    showAlert(
                        "Gagal menghapus data: " + err.message,
                        "error"
                    );

                }

            }

        }

    });


    // ==========================================
    // 7. RESET FORM KE MODE TAMBAH
    // ==========================================

    const resetForm = () => {

        mhsForm.reset();

        mhsIdInput.value = "";

        formTitle.textContent = "Tambah Mahasiswa Baru";

        btnSubmit.textContent = "Simpan Mahasiswa";

        btnCancel.style.display = "none";

    };


    // Tombol Batal Edit
    btnCancel.addEventListener("click", resetForm);


    // ==========================================
    // 8. AMBIL DATA PERTAMA KALI
    // ==========================================

    loadMahasiswa();

});
