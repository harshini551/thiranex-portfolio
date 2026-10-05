
// ================================
// MOBILE MENU
// ================================

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {

  menuToggle.addEventListener("click", function () {

    navMenu.classList.toggle("active");

    if (navMenu.classList.contains("active")) {
      menuToggle.textContent = "✕";
      menuToggle.setAttribute("aria-expanded", "true");
    } else {
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
    }

  });

}


// ================================
// DARK / LIGHT MODE
// ================================

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {

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


// ================================
// LOAD SAVED THEME
// ================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

  document.body.classList.add("dark-mode");

  if (themeToggle) {
    themeToggle.textContent = "☀️";
  }

} else {

  document.body.classList.remove("dark-mode");

  if (themeToggle) {
    themeToggle.textContent = "🌙";
  }

}


// ================================
// CONTACT FORM
// ================================

const contactForm = document.querySelector("form");

if (contactForm) {

  contactForm.addEventListener("submit", function (event) {

    event.preventDefault();

    alert("Thank you! Your message has been submitted successfully.");

    contactForm.reset();

  });

}
