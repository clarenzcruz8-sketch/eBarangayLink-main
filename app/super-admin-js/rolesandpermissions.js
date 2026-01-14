document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/admin/roles")
    .then(res => res.json())
    .then(users => {
      renderRoles(users);
    })
    .catch(err => console.error(err));
});

function renderRoles(users) {
  const tbody = document.querySelector(".roles_table tbody");
  tbody.innerHTML = "";

  users.forEach(u => {
    const role =
      u.account_id === 2 ? "Admin" :
      u.account_id === 3 ? "Super Admin" :
      "User";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.email}</td>
      <td>${role}</td>
      <td>
        <button class="enable-btn" data-id="${u.id}">Enable</button>
        <button class="disable-btn" data-id="${u.id}">Disable</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  attachRoleEvents();
}

function attachRoleEvents() {
  document.querySelectorAll(".enable-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      updateRole(btn.dataset.id, 2); // Admin
    });
  });

  document.querySelectorAll(".disable-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      updateRole(btn.dataset.id, 1); // User
    });
  });
}

function updateRole(userId, accountId) {
  if (!confirm("Are you sure you want to change this role?")) return;

  fetch(`http://localhost:3000/api/admin/roles/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_id: accountId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        alert("✅ Role updated successfully");
        location.reload();
      } else {
        alert("❌ Failed to update role");
      }
    });
}