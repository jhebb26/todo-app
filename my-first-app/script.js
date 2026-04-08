let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    // create a span for the task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // mark complete toggle
    if (task.completed) {
      span.style.textDecoration = "line-through";
      span.style.opacity = "0.6";
    }

    span.onclick = function () {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
    };

    // delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.style.marginLeft = "10px";
    delBtn.onclick = function (event) {
      event.stopPropagation(); // prevent toggling complete
      tasks.splice(index, 1);
      saveTasks();
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

function addTask() {
  const input = document.getElementById("taskInput");
  const taskText = input.value.trim();

  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  input.value = "";
  saveTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Enter key listener
document.getElementById("taskInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask();
});

// load tasks on start
renderTasks();