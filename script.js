let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentEditIndex = null;

// 🌙 DARK MODE
const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Update button text
function updateThemeButton() {
  toggleBtn.textContent = document.body.classList.contains("dark")
    ? "Light Mode ☀️"
    : "Dark Mode 🌙";
}

updateThemeButton();

// Toggle theme
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );

  updateThemeButton();
});

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

    if (task.dueDate) {
      span.textContent += ` (Due: ${task.dueDate})`;
    }

    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    span.onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
    };

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

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  document.getElementById("taskCount").textContent =
    `Tasks remaining: ${tasks.filter(t => !t.completed).length}`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;

  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    dueDate,
    priority
  });

  input.value = "";
  document.getElementById("dueDate").value = "";

  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function saveEdit() {
  const newText = document.getElementById("editTaskInput").value.trim();
  const newDate = document.getElementById("editDueDate").value;
  const newPriority = document.getElementById("editPriority").value;

  if (!newText) return;

  tasks[currentEditIndex].text = newText;
  tasks[currentEditIndex].dueDate = newDate;
  tasks[currentEditIndex].priority = newPriority;

  saveTasks();
  closeModal();
}

// Enter key support
document.getElementById("taskInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  tasks = [];
  saveTasks();
});

renderTasks();