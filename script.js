let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let currentEditIndex = null;

// 🎨 PRIORITY COLORS
function getPriorityColor(priority) {
  if (priority === "high") return "#ff4d8d";
  if (priority === "medium") return "#f4a261";
  return "#7b2cbf";
}

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

// ================= TASKS =================
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.style.backgroundColor = getPriorityColor(task.priority);

    const left = document.createElement("div");
    left.className = "task-left";

    let text = task.text;
    if (task.dueDate) text += ` (${task.dueDate})`;
    if (task.notes) text += ` - ${task.notes}`;

    const span = document.createElement("span");
    span.textContent = text;

    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.7";
    }

    left.appendChild(span);

    const right = document.createElement("div");
    right.className = "task-right";

    const badge = document.createElement("span");
    badge.className = "priority-badge";
    badge.textContent = task.priority.toUpperCase();

    // ✅ COMPLETE
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.onclick = (e) => {
      e.stopPropagation();

      tasks[index].completed = !tasks[index].completed;

      if (tasks[index].completed) {
        history.push({
          ...tasks[index],
          status: "completed",
          uid: crypto.randomUUID()
        });
      }

      saveTasks();
    };

    // ✅ EDIT
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

    // ✅ DELETE (FIXED)
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = (e) => {
      e.stopPropagation();

      const taskToDelete = tasks[index];

      // push to history FIRST
      history.push({
        text: taskToDelete.text,
        notes: taskToDelete.notes,
        dueDate: taskToDelete.dueDate,
        priority: taskToDelete.priority,
        status: "deleted",
        uid: crypto.randomUUID()
      });

      // remove from tasks
      tasks.splice(index, 1);

      saveTasks();
    };

    right.appendChild(badge);
    right.appendChild(completeBtn);
    right.appendChild(editBtn);
    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
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

      div.innerHTML = `
        <div class="history-title">
          <span>${item.text}</span>
          <span>${item.status}</span>
        </div>

        <div class="history-details">
          <div>Notes: ${item.notes || "None"}</div>
          <div>Due: ${item.dueDate || "None"}</div>
          <div>Priority: ${item.priority || "None"}</div>
        </div>
      `;

      div.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;

        const details = div.querySelector(".history-details");
        details.style.display =
          details.style.display === "block" ? "none" : "block";
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";

      deleteBtn.onclick = (e) => {
        e.stopPropagation();

        history = history.filter(h => h.uid !== item.uid);
        localStorage.setItem("history", JSON.stringify(history));
        renderHistory();
      };

      div.appendChild(deleteBtn);
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
    completed: false
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

// ================= BUTTONS =================
document.getElementById("clearBtn").addEventListener("click", () => {
  tasks.forEach(t => history.push({
    ...t,
    status: "deleted",
    uid: crypto.randomUUID()
  }));

  tasks = [];
  saveTasks();
});

document.getElementById("clearHistoryBtn").addEventListener("click", () => {
  history = [];
  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
});

// ================= EASTER EGG =================
document.addEventListener("DOMContentLoaded", () => {
  const heart = document.getElementById("loveHeart");
  const overlay = document.getElementById("loveOverlay");

  if (!heart || !overlay) return;

  heart.addEventListener("dblclick", () => {
    overlay.classList.add("show");

    for (let i = 0; i < 25; i++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = "💖";
      h.style.left = Math.random() * 100 + "vw";

      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2500);
    }

    setTimeout(() => overlay.classList.remove("show"), 3000);
  });
});

renderTasks();