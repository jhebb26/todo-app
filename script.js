let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let currentEditIndex = null;

// 🌙 THEME
const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function updateThemeButton() {
  toggleBtn.textContent = document.body.classList.contains("dark")
    ? "Light Mode ☀️"
    : "Dark Mode 🌙";
}

updateThemeButton();

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );

  updateThemeButton();
});

// ================= TASK RENDER =================
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.priority === "high") li.style.borderLeft = "5px solid red";
    else if (task.priority === "medium") li.style.borderLeft = "5px solid orange";
    else li.style.borderLeft = "5px solid green";

    const span = document.createElement("span");

    span.textContent = task.text;

    if (task.dueDate) span.textContent += ` (Due: ${task.dueDate})`;
    if (task.notes) span.textContent += ` - ${task.notes}`;

    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    // COMPLETE
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Complete";
    completeBtn.onclick = (e) => {
      e.stopPropagation();

      tasks[index].completed = !tasks[index].completed;

      if (tasks[index].completed) {
        history.push({ ...tasks[index], status: "completed" });
      }

      saveTasks();
    };

    // EDIT
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = (e) => {
      e.stopPropagation();

      currentEditIndex = index;

      document.getElementById("editTaskInput").value = task.text;
      document.getElementById("editDueDate").value = task.dueDate || "";
      document.getElementById("editPriority").value = task.priority;

      document.getElementById("editModal").style.display = "block";
    };

    // DELETE
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = (e) => {
      e.stopPropagation();

      history.push({ ...tasks[index], status: "deleted" });
      tasks.splice(index, 1);
      saveTasks();
    };

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(delBtn);

    list.appendChild(li);
  });

  document.getElementById("taskCount").textContent =
    `Tasks remaining: ${tasks.filter(t => !t.completed).length}`;

  renderHistory();
}

// ================= HISTORY =================
function renderHistory() {
  const container = document.getElementById("historyList");
  container.innerHTML = "";

  const completed = history.filter(h => h.status === "completed");
  const deleted = history.filter(h => h.status === "deleted");

  function makeColumn(title, items) {
    const col = document.createElement("div");
    col.className = "history-column";

    const header = document.createElement("h4");
    header.textContent = title;
    col.appendChild(header);

    items.slice().reverse().forEach(item => {
      const div = document.createElement("div");
      div.className = "history-item";

      const date = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : "Unknown";

      const day = item.createdAt
        ? new Date(item.createdAt).toLocaleDateString(undefined, { weekday: "long" })
        : "";

      div.innerHTML = `
        <div class="history-title">
          <span>${item.text}</span>
          <span>${item.status}</span>
        </div>

        <div class="history-details">
          <div>Notes: ${item.notes || "None"}</div>
          <div>Due: ${item.dueDate || "None"}</div>
          <div>Priority: ${item.priority || "None"}</div>
          <div>Created: ${day} ${date}</div>
        </div>
      `;

      div.addEventListener("click", () => {
        const details = div.querySelector(".history-details");
        details.style.display =
          details.style.display === "block" ? "none" : "block";
      });

      col.appendChild(div);
    });

    return col;
  }

  container.appendChild(makeColumn("Completed", completed));
  container.appendChild(makeColumn("Deleted", deleted));
}

// ================= ADD =================
function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  const notes = document.getElementById("noteInput").value.trim();
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  if (!text) return;

  tasks.push({
    text,
    notes,
    dueDate,
    priority,
    completed: false,
    createdAt: new Date().toISOString()
  });

  saveTasks();
}

// ================= SAVE =================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("history", JSON.stringify(history));
  renderTasks();
}

// ================= EDIT =================
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
  tasks[currentEditIndex].text =
    document.getElementById("editTaskInput").value;

  tasks[currentEditIndex].dueDate =
    document.getElementById("editDueDate").value;

  tasks[currentEditIndex].priority =
    document.getElementById("editPriority").value;

  saveTasks();
  closeModal();
}

// ================= EVENTS =================
document.getElementById("clearBtn").addEventListener("click", () => {
  tasks.forEach(t => history.push({ ...t, status: "deleted" }));
  tasks = [];
  saveTasks();
});

// 🗑️ CLEAR HISTORY (NEW BUTTON)
document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  history = [];
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
});

renderTasks();