// Load tasks from localStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to render tasks
function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Completed styling
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    // Toggle complete on click
    span.onclick = function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
    };

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = function (event) {
      event.stopPropagation();
      tasks.splice(index, 1);
      saveTasks();
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  // Update task counter
  document.getElementById("taskCount").textContent =
    `Tasks remaining: ${tasks.filter(t => !t.completed).length}`;
}

// Function to add a new task
function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  input.value = "";
  saveTasks();
}

// Save tasks to localStorage and re-render
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Enter key adds task
document.getElementById("taskInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask();
});

// Clear all tasks
document.getElementById("clearBtn").addEventListener("click", function () {
  tasks = [];
  saveTasks();
});

// Initial render
renderTasks();