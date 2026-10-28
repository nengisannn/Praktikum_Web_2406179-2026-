
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen DOM
    const todoForm = document.querySelector("#todoForm");
    const taskInput = document.querySelector("#taskInput");
    const inputError = document.querySelector("#inputError");
    const todoList = document.querySelector("#todoList");
    const inputTugas = document.querySelector("#inputTugas");

    // 2. Fungsi untuk membaca dan menyimpan data ke LocalStorage
    const getTasks = () => {
        return JSON.parse(localStorage.getItem("todo_tasks")) || [];
    };

    const saveTasks = (tasks) => {
        localStorage.setItem("todo_tasks", JSON.stringify(tasks));
    };

    // 3. Fungsi untuk menampilkan daftar tugas
    const renderTasks = () => {
        const tasks = getTasks();

        todoList.innerHTML = "";

        // Tampilkan pesan jika belum ada tugas
        if (tasks.length === 0) {
            todoList.innerHTML = `
                <p style="
                    text-align: center;
                    color: #64748b;
                    font-size: 13px;
                    padding: 10px;
                ">
                    Belum ada tugas tersimpan.
                </p>
            `;
            return;
        }

        // Tampilkan setiap tugas
        tasks.forEach((task, index) => {
            const li = document.createElement("li");

            li.className = `todo-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <span class="todo-text"></span>

                <div class="todo-actions">
                    <button
                        type="button"
                        class="action-btn complete-btn"
                        data-index="${index}"
                    >
                        ${task.completed ? "Batal" : "Selesai"}
                    </button>

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        data-index="${index}"
                    >
                        Hapus
                    </button>
                </div>
            `;

            // Masukkan teks tugas dengan aman
            li.querySelector(".todo-text").textContent = task.text;

            todoList.appendChild(li);
        });
    };

    // 4. Tambahkan tugas saat formulir dikirim
    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();
        const tasks1 = getTasks();

        //Validasi input: Maksimal 5 Tugas 
        if (tasks1.length >=5) {
            taskInput.classList.add("error");
            inputTugas.style.display = "block";
            return;
        }


        // Validasi input: minimal 3 karakter
        if (taskText.length < 3) {
            taskInput.classList.add("error");
            inputError.style.display = "block";
            return;
        }
         const tasks = getTasks();
        // Hilangkan pesan error jika input valid
        taskInput.classList.remove("error");
        inputError.style.display = "none";

        // Simpan tugas baru
        

        tasks.push({
            text: taskText,
            completed: false
        });

        saveTasks(tasks);

        // Kosongkan input dan perbarui daftar
        taskInput.value = "";
        renderTasks();
    });

    // 5. Tangani tombol Selesai dan Hapus
    // Menggunakan event delegation pada todoList
    todoList.addEventListener("click", (e) => {
        const button = e.target.closest("button[data-index]");

        if (!button || !todoList.contains(button)) {
            return;
        }

        const index = Number(button.dataset.index);
        const tasks = getTasks();

        // Pastikan indeks tugas valid
        if (!Number.isInteger(index) || index < 0 || index >= tasks.length) {
            return;
        }

        // Tandai tugas selesai atau batalkan status selesai
        if (button.classList.contains("complete-btn")) {
            tasks[index].completed = !tasks[index].completed;
        }

        // Hapus tugas dari daftar
        else if (button.classList.contains("delete-btn")) {
            tasks.splice(index, 1);
        } else {
            return;
        }

        // Simpan perubahan dan tampilkan ulang daftar
        saveTasks(tasks);
        renderTasks();
    });

    // 6. Tampilkan daftar tugas saat halaman dimuat
    renderTasks();
});
