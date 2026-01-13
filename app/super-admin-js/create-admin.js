const createAdminBtn = document.getElementById('createAdminBtn')
const createAdminForm = document.querySelector(".create-admin-form")
/*
if (localStorage.getItem("accountId") !== "3") {
  alert("Super Admin only");
  window.location.href = "/Sign-up.html";
}
*/
createAdminBtn.addEventListener('click', () => {
    createAdminForm.style.display = 'block';
});