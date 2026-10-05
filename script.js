/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");

    const isOpen = navMenu.classList.contains("active");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  /* Close menu when a link is clicked */

  navMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      navMenu.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      menuToggle.textContent = "☰";
    }
  });
}


/* =========================
   DARK / LIGHT MODE
========================= */

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {

  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
  } else {
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }

  });
}


/* =========================
   TODO ELEMENTS
========================= */

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter-btn");


/* =========================
   TODO STATE
========================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


/* =========================
   DISPLAY TASKS
========================= */

function renderTasks() {

  todoList.innerHTML = "";

  let filteredTasks = tasks;

  /* Apply filter */

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(function (task) {
      return !task.completed;
    });
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(function (task) {
      return task.completed;
    });
  }


  /* Create task elements */

  filteredTasks.forEach(function (task) {

    const li = document.createElement("li");

    li.className = "todo-item";

    li.dataset.id = task.id;

    if (task.completed) {
      li.classList.add("completed");
    }


    li.innerHTML = `
      <input
        type="checkbox"
        class="todo-checkbox"
        ${task.completed ? "checked" : ""}
        aria-label="Mark task as completed"
      >

      <span class="todo-text">${escapeHTML(task.text)}</span>

      <div class="todo-actions">

        <button
          type="button"
          class="edit-btn"
          data-action="edit"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-btn"
          data-action="delete"
        >
          Delete
        </button>

      </div>
    `;

    todoList.appendChild(li);

  });


  updateTaskCount();

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================
   ADD TASK
========================= */

todoForm.addEventListener("submit", function (event) {

  event.preventDefault();

  const taskText = todoInput.value.trim();

  if (taskText === "") {
    return;
  }


  const newTask = {

    id: Date.now(),

    text: taskText,

    completed: false

  };


  tasks.push(newTask);

  saveTasks();

  renderTasks();

  todoInput.value = "";

  todoInput.focus();

});


/* =========================
   EVENT DELEGATION
========================= */

todoList.addEventListener("click", function (event) {

  const taskItem = event.target.closest(".todo-item");

  if (!taskItem) {
    return;
  }


  const taskId = Number(taskItem.dataset.id);

  const clickedButton = event.target.closest("button");


  /* EDIT */

  if (
    clickedButton &&
    clickedButton.dataset.action === "edit"
  ) {

    editTask(taskId);

  }


  /* DELETE */

  if (
    clickedButton &&
    clickedButton.dataset.action === "delete"
  ) {

    deleteTask(taskId);

  }

});


/* =========================
   COMPLETE TASK
========================= */

todoList.addEventListener("change", function (event) {

  if (!event.target.classList.contains("todo-checkbox")) {
    return;
  }


  const taskItem = event.target.closest(".todo-item");

  const taskId = Number(taskItem.dataset.id);


  tasks = tasks.map(function (task) {

    if (task.id === taskId) {

      return {
        ...task,
        completed: event.target.checked
      };

    }

    return task;

  });


  saveTasks();

  renderTasks();

});


/* =========================
   EDIT TASK
========================= */

function editTask(taskId) {

  const task = tasks.find(function (task) {
    return task.id === taskId;
  });


  if (!task) {
    return;
  }


  const updatedText = prompt(
    "Edit your task:",
    task.text
  );


  if (updatedText === null) {
    return;
  }


  const trimmedText = updatedText.trim();


  if (trimmedText === "") {
    return;
  }


  task.text = trimmedText;

  saveTasks();

  renderTasks();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(taskId) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this task?"
  );


  if (!confirmDelete) {
    return;
  }


  tasks = tasks.filter(function (task) {

    return task.id !== taskId;

  });


  saveTasks();

  renderTasks();

}


/* =========================
   FILTER TASKS
========================= */

filterButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    currentFilter = button.dataset.filter;


    /* Update active button */

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");


    renderTasks();

  });

});


/* =========================
   TASK COUNT
========================= */

function updateTaskCount() {

  const activeTasks = tasks.filter(function (task) {

    return !task.completed;

  }).length;


  if (activeTasks === 1) {

    taskCount.textContent = "1 task remaining";

  } else {

    taskCount.textContent =
      `${activeTasks} tasks remaining`;

  }

}


/* =========================
   INITIAL RENDER
========================= */

renderTasks();


/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

  contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    alert("Thank you! Your message has been received.");

    contactForm.reset();

  });

}