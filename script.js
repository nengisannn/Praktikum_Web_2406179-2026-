document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. MENGAMBIL ELEMEN HTML
    // ==========================================

    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const inputTugas = document.querySelector("#inputTugas");
    const todoList = document.querySelector("#todoList");
    const taskCounter = document.querySelector("#taskCounter");
    const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

    const MAX_TASKS = 5;
    const STORAGE_KEY = "todo_tasks";


    // ==========================================
    // 2. MEMBACA DATA DARI LOCALSTORAGE
    // ==========================================

    const getTasks = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);

            if (!data) {
                return [];
            }

            const tasks = JSON.parse(data);

            if (!Array.isArray(tasks)) {
                return [];
            }

            // Memastikan data tugas memiliki format yang benar
            return tasks.filter(task =>
                task &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
            );

        } catch (error) {
            console.error("Gagal membaca tugas:", error);
            return [];
        }
    };


    // ==========================================
    // 3. MENYIMPAN DATA KE LOCALSTORAGE
    // ==========================================

    const saveTasks = (tasks) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            return true;

        } catch (error) {
            console.error("Gagal menyimpan tugas:", error);

            alert(
                "Tugas gagal disimpan. Periksa pengaturan penyimpanan browser Anda."
            );

            return false;
        }
    };


    // ==========================================
    // 4. MENAMPILKAN PESAN ERROR
    // ==========================================

    const hideErrors = () => {
        taskInput.classList.remove("error");
        inputError.style.display = "none";
        inputTugas.style.display = "none";
    };


    // ==========================================
    // 5. FITUR 1: TASK COUNTER
    // ==========================================

    const updateTaskCounter = (tasks) => {

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
            task => task.completed === true
        ).length;

        const unfinishedTasks = totalTasks - completedTasks;

        taskCounter.textContent =
            `Total: ${totalTasks} Tugas | ` +
            `Selesai: ${completedTasks} | ` +
            `Belum Selesai: ${unfinishedTasks}`;
    };


    // ==========================================
    // 6. MENAMPILKAN DAFTAR TUGAS
    // ==========================================

    const renderTasks = () => {

        const tasks = getTasks();

        // Kosongkan daftar sebelum menampilkan ulang
        todoList.innerHTML = "";

        // Jika tidak ada tugas
        if (tasks.length === 0) {

            const emptyMessage = document.createElement("li");

            emptyMessage.className = "empty-message";
            emptyMessage.textContent = "Belum ada tugas tersimpan.";

            todoList.appendChild(emptyMessage);
        }

        // Tampilkan setiap tugas
        tasks.forEach((task, index) => {

            const li = document.createElement("li");

            li.className = "todo-item";

            if (task.completed) {
                li.classList.add("completed");
            }

            // Teks tugas
            const taskText = document.createElement("span");

            taskText.className = "todo-text";
            taskText.textContent = task.text;

            // Kontainer tombol
            const actions = document.createElement("div");

            actions.className = "todo-actions";

            // Tombol selesai
            const completeBtn = document.createElement("button");

            completeBtn.type = "button";
            completeBtn.className = "action-btn complete-btn";
            completeBtn.dataset.index = index;

            completeBtn.textContent = task.completed
                ? "Batal"
                : "Selesai";

            // Tombol hapus
            const deleteBtn = document.createElement("button");

            deleteBtn.type = "button";
            deleteBtn.className = "action-btn delete-btn";
            deleteBtn.dataset.index = index;
            deleteBtn.textContent = "Hapus";

            // Gabungkan elemen
            actions.appendChild(completeBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(actions);

            todoList.appendChild(li);
        });

        // Perbarui penghitung tugas
        updateTaskCounter(tasks);

        // Aktifkan tombol bersihkan jika ada tugas selesai
        const hasCompletedTasks = tasks.some(
            task => task.completed === true
        );

        clearCompletedBtn.disabled = !hasCompletedTasks;
    };


    // ==========================================
    // 7. MENAMBAHKAN TUGAS BARU
    // ==========================================

    todoForm.addEventListener("submit", (event) => {

        // Mencegah halaman dimuat ulang saat form dikirim
        event.preventDefault();

        const taskText = taskInput.value.trim();

        // Hapus pesan error sebelumnya
        hideErrors();

        // Validasi minimal 3 karakter
        if (taskText.length < 3) {

            taskInput.classList.add("error");
            inputError.style.display = "block";

            taskInput.focus();

            return;
        }

        // Ambil data terbaru
        const tasks = getTasks();

        // Validasi maksimal 5 tugas
        if (tasks.length >= MAX_TASKS) {

            taskInput.classList.add("error");
            inputTugas.style.display = "block";

            taskInput.focus();

            return;
        }

        // Buat objek tugas baru
        const newTask = {
            text: taskText,
            completed: false
        };

        // Tambahkan ke daftar
        tasks.push(newTask);

        // Simpan terlebih dahulu
        const saved = saveTasks(tasks);

        // Jika penyimpanan gagal, batalkan pembaruan
        if (!saved) {
            return;
        }

        // Kosongkan input
        taskInput.value = "";

        // Perbarui daftar dan penghitung
        renderTasks();

        // Fokus kembali ke input
        taskInput.focus();
    });


    // ==========================================
    // 8. MENGHILANGKAN ERROR SAAT MENGETIK
    // ==========================================

    taskInput.addEventListener("input", () => {
        hideErrors();
    });


    // ==========================================
    // 9. MENANGANI TOMBOL SELESAI DAN HAPUS
    // ==========================================

    todoList.addEventListener("click", (event) => {

        const button = event.target.closest("button[data-index]");

        // Pastikan yang diklik adalah tombol aksi
        if (!button || !todoList.contains(button)) {
            return;
        }

        const index = Number(button.dataset.index);

        const tasks = getTasks();

        // Validasi indeks
        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= tasks.length
        ) {
            return;
        }

        // ------------------------------------------
        // TOMBOL SELESAI / BATAL
        // ------------------------------------------

        if (button.classList.contains("complete-btn")) {

            tasks[index].completed = !tasks[index].completed;

        }

        // ------------------------------------------
        // FITUR 3: KONFIRMASI SEBELUM MENGHAPUS
        // ------------------------------------------

        else if (button.classList.contains("delete-btn")) {

            const yakin = confirm(
                "Apakah Anda yakin ingin menghapus tugas ini?"
            );

            // Jika pengguna memilih Cancel
            if (!yakin) {
                return;
            }

            // Jika pengguna memilih OK
            tasks.splice(index, 1);

        } else {
            return;
        }

        // Simpan perubahan
        const saved = saveTasks(tasks);

        if (!saved) {
            return;
        }

        // Perbarui tampilan dan penghitung
        renderTasks();
    });


    // ==========================================
    // 10. FITUR 2: BERSIHKAN TUGAS SELESAI
    // ==========================================

    clearCompletedBtn.addEventListener("click", () => {

        const tasks = getTasks();

        // Pertahankan hanya tugas yang belum selesai
        const remainingTasks = tasks.filter(
            task => task.completed !== true
        );

        // Jika tidak ada tugas selesai
        if (remainingTasks.length === tasks.length) {
            return;
        }

        // Simpan hanya tugas yang belum selesai
        const saved = saveTasks(remainingTasks);

        if (!saved) {
            return;
        }

        // Perbarui daftar dan penghitung
        renderTasks();
    });


    // ==========================================
    // 11. TAMPILKAN TUGAS SAAT HALAMAN DIBUKA
    // ==========================================

    renderTasks();

});