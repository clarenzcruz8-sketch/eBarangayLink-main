// Admin.js (Enhanced with localStorage persistence for stats and dark mode toggle)
document.addEventListener("DOMContentLoaded", () => {
  const accountId = localStorage.getItem("accountId");
/*
if (accountId !== "2" && accountId !== "3") {
  alert("Access denied");
  window.location.href = "/Sign-up.html";
}
  */
  // Live Clock
  function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
    document.getElementById('time').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  updateClock();
  setInterval(updateClock, 1000);


  // Enhanced: Persist stats with localStorage
  const numbers = document.querySelectorAll('.number');
  numbers.forEach((num, index) => {
    const key = 'stat-' + index;
    const saved = localStorage.getItem(key);
    if (saved) num.textContent = saved;
    num.addEventListener('click', () => { // Click to edit for demo
      const newVal = prompt('Edit value:', num.textContent);
      if (newVal) {
        num.textContent = newVal;
        localStorage.setItem(key, newVal);
      }
    });
  });
});