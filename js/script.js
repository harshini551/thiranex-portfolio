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
   TODO LIST
========================= */

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


function renderTasks() {

  todoList.innerHTML = "";

  let filteredTasks = tasks;

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

      <span class="todo-text">
        ${escapeHTML(task.text)}
      </span>

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


if (todoForm) {

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

}


if (todoList) {

  todoList.addEventListener("click", function (event) {

    const taskItem = event.target.closest(".todo-item");

    if (!taskItem) {
      return;
    }

    const taskId = Number(taskItem.dataset.id);

    const clickedButton = event.target.closest("button");


    if (
      clickedButton &&
      clickedButton.dataset.action === "edit"
    ) {

      editTask(taskId);

    }


    if (
      clickedButton &&
      clickedButton.dataset.action === "delete"
    ) {

      deleteTask(taskId);

    }

  });


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

}


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


filterButtons.forEach(function (button) {

  button.addEventListener("click", function () {

    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    renderTasks();

  });

});


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
   WEATHER DASHBOARD
========================= */

const weatherForm = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");

const weatherLoading =
  document.getElementById("weather-loading");

const weatherError =
  document.getElementById("weather-error");

const weatherResult =
  document.getElementById("weather-result");

const weatherCity =
  document.getElementById("weather-city");

const weatherDescription =
  document.getElementById("weather-description");

const weatherTemperature =
  document.getElementById("weather-temperature");

const weatherHumidity =
  document.getElementById("weather-humidity");

const weatherWind =
  document.getElementById("weather-wind");

const weatherTempDetail =
  document.getElementById("weather-temp-detail");


/* =========================
   WEATHER CODE
========================= */

function getWeatherDescription(code) {

  const weatherCodes = {

    0: "Clear sky",

    1: "Mainly clear",

    2: "Partly cloudy",

    3: "Overcast",

    45: "Fog",

    48: "Depositing rime fog",

    51: "Light drizzle",

    53: "Moderate drizzle",

    55: "Dense drizzle",

    61: "Slight rain",

    63: "Moderate rain",

    65: "Heavy rain",

    71: "Slight snow",

    73: "Moderate snow",

    75: "Heavy snow",

    80: "Slight rain showers",

    81: "Moderate rain showers",

    82: "Violent rain showers",

    95: "Thunderstorm",

    96: "Thunderstorm with slight hail",

    99: "Thunderstorm with heavy hail"

  };

  return weatherCodes[code] || "Unknown weather";

}


/* =========================
   SHOW / HIDE HELPERS
========================= */

function showLoading() {

  weatherLoading.hidden = false;

  weatherError.hidden = true;

  weatherResult.hidden = true;

}


function hideLoading() {

  weatherLoading.hidden = true;

}


function showError(message) {

  weatherLoading.hidden = true;

  weatherResult.hidden = true;

  weatherError.textContent = message;

  weatherError.hidden = false;

}


/* =========================
   FETCH WEATHER
========================= */

async function getWeather(city) {

  try {

    showLoading();


    /* STEP 1:
       Convert city name into coordinates
    */

    const geoURL =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);


    if (!geoResponse.ok) {
      throw new Error("Unable to find the city.");
    }


    const geoData = await geoResponse.json();


    if (
      !geoData.results ||
      geoData.results.length === 0
    ) {

      throw new Error(
        "City not found. Please enter a valid city name."
      );

    }


    const location = geoData.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;


    /* STEP 2:
       Fetch current weather
    */

    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&temperature_unit=celsius&wind_speed_unit=kmh`;

    const weatherResponse = await fetch(weatherURL);


    if (!weatherResponse.ok) {
      throw new Error(
        "Unable to fetch weather data."
      );
    }


    /* STEP 3:
       Convert response to JSON
    */

    const weatherData = await weatherResponse.json();


    /* STEP 4:
       Extract nested JSON data
    */

    const currentWeather = weatherData.current;


    const temperature =
      currentWeather.temperature_2m;

    const humidity =
      currentWeather.relative_humidity_2m;

    const windSpeed =
      currentWeather.wind_speed_10m;

    const weatherCode =
      currentWeather.weather_code;


    /* STEP 5:
       Display data
    */

    weatherCity.textContent =
      `${location.name}, ${location.country}`;

    weatherDescription.textContent =
      getWeatherDescription(weatherCode);

    weatherTemperature.textContent =
      `${temperature}°C`;

    weatherTempDetail.textContent =
      `${temperature}°C`;

    weatherHumidity.textContent =
      `${humidity}%`;

    weatherWind.textContent =
      `${windSpeed} km/h`;


    /* Show result */

    hideLoading();

    weatherError.hidden = true;

    weatherResult.hidden = false;


  } catch (error) {

    console.error(
      "Weather API Error:",
      error
    );

    showError(
      error.message ||
      "Something went wrong. Please try again."
    );

  }

}


/* =========================
   WEATHER SEARCH
========================= */

if (weatherForm) {

  weatherForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      const city =
        cityInput.value.trim();


      if (city === "") {

        showError(
          "Please enter a city name."
        );

        return;

      }


      await getWeather(city);

    }
  );

}


/* =========================
   INITIAL TODO RENDER
========================= */

renderTasks();


/* =========================
   CONTACT FORM
========================= */

const contactForm =
  document.getElementById("contact-form");

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      alert(
        "Thank you! Your message has been received."
      );

      contactForm.reset();

    }
  );

}