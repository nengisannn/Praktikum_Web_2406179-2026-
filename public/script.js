/*
 * EduData - Modul 7
 * CRUD, pencarian real-time, validasi NIM duplikat, dan counter mahasiswa.
 */
document.addEventListener("DOMContentLoaded", () => {
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
    const searchInput = document.querySelector("#searchInput");
    const totalLabel = document.querySelector("#totalLabel");
    const totalMahasiswa = document.querySelector("#totalMahasiswa");
    const totalJurusan = document.querySelector("#totalJurusan");
    const resultInfo = document.querySelector("#resultInfo");
    const systemStatus = document.querySelector("#systemStatus");

    let listMahasiswa = [];
    let alertTimer;

    const showAlert = (message, type = "success") => {
        clearTimeout(alertTimer);
        alertMessage.textContent = message;
        alertMessage.className = `alert alert-${type}`;
        alertMessage.hidden = false;
        alertTimer = setTimeout(() => { alertMessage.hidden = true; }, 3500);
    };

    // Counter selalu dihitung dari data asli, bukan hasil pencarian.
    const updateCounters = () => {
        totalLabel.textContent = listMahasiswa.length;
        totalMahasiswa.textContent = listMahasiswa.length;
        totalJurusan.textContent = new Set(listMahasiswa.map(m => m.jurusan)).size;
    };

    // Render tabel menggunakan textContent agar data tidak dianggap sebagai HTML.
    const renderTable = (data) => {
        mhsTableBody.replaceChildren();

        if (!data.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 6;
            cell.className = "empty-cell";
            cell.textContent = searchInput.value.trim()
                ? "Data yang kamu cari tidak ditemukan."
                : "Belum ada data mahasiswa. Silakan tambahkan data baru.";
            row.appendChild(cell);
            mhsTableBody.appendChild(row);
        } else {
            data.forEach((mhs, index) => {
                const row = document.createElement("tr");
                const values = [index + 1, mhs.nim, mhs.nama, mhs.jurusan, mhs.email];
                values.forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value ?? "-";
                    row.appendChild(cell);
                });

                const actionCell = document.createElement("td");
                actionCell.className = "action-cell";

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "btn-action btn-edit";
                editButton.dataset.action = "edit";
                editButton.dataset.id = mhs.id;
                editButton.textContent = "Edit";
                editButton.setAttribute("aria-label", `Edit ${mhs.nama}`);

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.className = "btn-action btn-delete";
                deleteButton.dataset.action = "delete";
                deleteButton.dataset.id = mhs.id;
                deleteButton.textContent = "Hapus";
                deleteButton.setAttribute("aria-label", `Hapus ${mhs.nama}`);

                actionCell.append(editButton, deleteButton);
                row.appendChild(actionCell);
                mhsTableBody.appendChild(row);
            });
        }

        resultInfo.textContent = `Menampilkan ${data.length} dari ${listMahasiswa.length} data`;
        updateCounters();
    };

    // Fitur 1: pencarian instan dengan listMahasiswa.filter().
    const filterMahasiswa = () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const hasilFilter = listMahasiswa.filter(mhs =>
            [mhs.nim, mhs.nama, mhs.jurusan, mhs.email]
                .some(value => String(value ?? "").toLowerCase().includes(keyword))
        );
        renderTable(hasilFilter);
    };

    const loadMahasiswa = async () => {
        try {
            const response = await fetch("/api/mahasiswa");
            if (!response.ok) throw new Error("Gagal mengambil data dari server.");
            listMahasiswa = await response.json();
            systemStatus.textContent = "Online";
            filterMahasiswa();
        } catch (error) {
            console.error("READ:", error);
            systemStatus.textContent = "Offline";
            mhsTableBody.innerHTML = '<tr><td colspan="6" class="empty-cell">Tidak dapat terhubung ke server. Pastikan Node.js dan MySQL aktif.</td></tr>';
            showAlert("Gagal memuat data. Periksa server dan koneksi database.", "error");
        }
    };

    const resetForm = () => {
        mhsForm.reset();
        mhsIdInput.value = "";
        formTitle.textContent = "Tambah Mahasiswa Baru";
        btnSubmit.innerHTML = "<span>＋</span> Simpan Mahasiswa";
        btnCancel.hidden = true;
        nimInput.focus();
    };

    mhsForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            nim: nimInput.value.trim(),
            nama: namaInput.value.trim(),
            jurusan: jurusanInput.value,
            email: emailInput.value.trim()
        };
        const id = mhsIdInput.value;
        const isEdit = Boolean(id);

        // Fitur 2: .some() mencegah NIM ganda sebelum fetch().
        const nimSudahAda = listMahasiswa.some(mhs =>
            String(mhs.nim).trim().toLowerCase() === payload.nim.toLowerCase() &&
            (!isEdit || String(mhs.id) !== String(id))
        );

        if (nimSudahAda) {
            alert("NIM sudah terdaftar!");
            nimInput.focus();
            return;
        }

        const url = isEdit
            ? `/api/mahasiswa/${encodeURIComponent(id)}`
            : "/api/mahasiswa";

        btnSubmit.disabled = true;
        btnSubmit.textContent = "Menyimpan...";

        try {
            const response = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                if (response.status === 409 && !isEdit) alert("NIM sudah terdaftar!");
                throw new Error(result.message || "Gagal menyimpan data.");
            }

            showAlert(result.message || "Data berhasil disimpan!");
            resetForm();
            await loadMahasiswa();
        } catch (error) {
            console.error("CREATE/UPDATE:", error);
            showAlert(error.message, "error");
        } finally {
            btnSubmit.disabled = false;
            if (!mhsIdInput.value) btnSubmit.innerHTML = "<span>＋</span> Simpan Mahasiswa";
            else btnSubmit.textContent = "Perbarui Mahasiswa";
        }
    });

    // Fitur 1: event input membuat tabel berubah setiap kali pengguna mengetik.
    searchInput.addEventListener("input", filterMahasiswa);

    mhsTableBody.addEventListener("click", async (event) => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;

        const id = button.dataset.id;
        const mahasiswa = listMahasiswa.find(mhs => String(mhs.id) === String(id));
        if (!mahasiswa) return;

        if (button.dataset.action === "edit") {
            mhsIdInput.value = mahasiswa.id;
            nimInput.value = mahasiswa.nim;
            namaInput.value = mahasiswa.nama;
            jurusanInput.value = mahasiswa.jurusan;
            emailInput.value = mahasiswa.email;
            formTitle.textContent = "Edit Data Mahasiswa";
            btnSubmit.textContent = "Perbarui Mahasiswa";
            btnCancel.hidden = false;
            document.querySelector("#form-section").scrollIntoView({ behavior: "smooth" });
            nimInput.focus();
            return;
        }

        if (button.dataset.action === "delete") {
            if (!confirm(`Yakin ingin menghapus data ${mahasiswa.nama}?`)) return;
            button.disabled = true;
            try {
                const response = await fetch(`/api/mahasiswa/${encodeURIComponent(id)}`, {
                    method: "DELETE"
                });
                const result = await response.json();
                if (!response.ok || !result.success) throw new Error(result.message || "Gagal menghapus data.");
                showAlert(result.message || "Data berhasil dihapus!");
                if (String(mhsIdInput.value) === String(id)) resetForm();
                await loadMahasiswa(); // counter ikut diperbarui setelah penghapusan.
            } catch (error) {
                console.error("DELETE:", error);
                showAlert(error.message, "error");
                button.disabled = false;
            }
        }
    });

    btnCancel.addEventListener("click", resetForm);
    loadMahasiswa();
});
