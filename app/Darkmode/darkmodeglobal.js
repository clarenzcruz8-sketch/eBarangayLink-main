/**
 * Bootstrap 5.3+ Persistent Theme Switcher
 * Include this script in ALL pages, preferably in <head> with 'defer' or before </body>
 */

(function () {
  "use strict";

  const STORAGE_KEY = "bs-theme";
  const DARK = "dark";
  const LIGHT = "light";

  // Get stored theme or default to light
  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  // Save theme to localStorage
  function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Apply theme to <html> element
  function setTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);
    setStoredTheme(theme);
    updateToggleButtons(theme);
  }

  // Update all toggle buttons/icons on the page
  function updateToggleButtons(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
      const iconLight = toggle.querySelector(".icon-light");
      const iconDark = toggle.querySelector(".icon-dark");

      if (iconLight && iconDark) {
        iconLight.classList.toggle("d-none", theme === LIGHT);
        iconDark.classList.toggle("d-none", theme === DARK);
      }

      // Update aria-label for accessibility
      toggle.setAttribute(
        "aria-label",
        theme === DARK ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  }

  // Toggle between light and dark
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-bs-theme");
    const newTheme = currentTheme === DARK ? LIGHT : DARK;
    setTheme(newTheme);
  }

  // Initialize theme IMMEDIATELY to prevent flash
  (function initTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      document.documentElement.setAttribute("data-bs-theme", storedTheme);
    }
  })();

  // Setup event listeners after DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    const storedTheme = getStoredTheme() || LIGHT;
    setTheme(storedTheme);

    // Attach click handlers to all toggle buttons
    document.querySelectorAll("[data-theme-toggle]").forEach(function (toggle) {
      toggle.addEventListener("click", toggleTheme);
    });
  });

  // Expose globally if needed
  window.ThemeSwitcher = {
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    getTheme: function () {
      return document.documentElement.getAttribute("data-bs-theme");
    },
  };
})();
