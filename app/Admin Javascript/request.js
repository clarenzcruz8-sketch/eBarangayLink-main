// request.js (Enhanced with confirmation dialog, pagination, and table sorting)
const tableBody = document.querySelector("#requests-table tbody");

fetch("http://localhost:3000/api/admin/requests")
  .then(res => res.json())
  .then(data => renderTable(data))
  .catch(err => console.error(err));

function renderTable(requests) {
  tableBody.innerHTML = "";

  requests.forEach(r => {
    const tr = document.createElement("tr");
    tr.dataset.status = r.status;

    tr.innerHTML = `
      <td>REQ-${r.id}</td>
      <td>${r.first_name} ${r.last_name}</td>
      <td>${formatDocType(r.form_type)}</td>
      <td>${formatDate(r.created_at)}</td>
      <td><span class="status ${r.status}">${capitalize(r.status)}</span></td>
      <td>
        <button class="view-btn" onclick="openModal(${r.id})">View</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

function formatDocType(type) {
  return type.replace(/_/g, " ").toUpperCase();
}

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

let currentId = "";

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("request-modal");
  const closeBtn = document.querySelector(".close-btn");
  const modalBody = document.getElementById("modal-body");

  // View Button
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      currentId = btn.dataset.id;
      const r = requests[currentId];
      modalBody.innerHTML = `
        <p><strong>ID:</strong> ${r.id}</p>
        <p><strong>User:</strong> ${r.user}</p>
        <p><strong>Document:</strong> ${r.doc}</p>
        <p><strong>Date Applied:</strong> ${r.date}</p>
        <p><strong>Status:</strong> <span class="status ${r.status.toLowerCase()}">${r.status}</span></p>
        <p><strong>Uploaded File:</strong> <a href="#" target="_blank">${r.file}</a></p>
      `;
      const approveBtn = document.getElementById("approve-btn");
      const rejectBtn = document.getElementById("reject-btn");
      approveBtn.style.display = r.status === "Pending" ? "inline-block" : "none";
      rejectBtn.style.display = r.status === "Pending" ? "inline-block" : "none";
      modal.style.display = "flex";
    });
  });

  // Close Modal
  closeBtn.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  // Approve / Reject with Confirmation
  document.getElementById("approve-btn").onclick = () => {
    if (confirm("Approve this request?")) updateStatus("Approved");
  };
  document.getElementById("reject-btn").onclick = () => {
    if (confirm("Reject this request?")) updateStatus("Rejected");
  };

  function updateStatus(status) {
    requests[currentId].status = status;
    const row = document.querySelector(`button[data-id="${currentId}"]`).closest("tr");
    row.dataset.status = status.toLowerCase();
    row.querySelector(".status").textContent = status;
    row.querySelector(".status").className = `status ${status.toLowerCase()}`;
    modal.style.display = "none";
    alert(`Request ${currentId} ${status}!`);
  }

  // Search & Filter
  document.getElementById("search").addEventListener("input", filterTable);
  document.getElementById("status-filter").addEventListener("change", filterTable);

  function filterTable() {
    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("status-filter").value;
    document.querySelectorAll("#requests-table tbody tr").forEach(row => {
      const text = row.textContent.toLowerCase();
      const status = row.dataset.status;
      row.style.display = (text.includes(search) && (filter === "all" || status === filter)) ? "" : "none";
    });
  }

  // Enhanced: Table Sorting (click headers to sort)
  const table = document.getElementById("requests-table");
  const headers = table.querySelectorAll("th");
  headers.forEach((header, index) => {
    header.addEventListener("click", () => sortTable(index));
  });

  function sortTable(n) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    rows.sort((a, b) => {
      const aText = a.querySelectorAll("td")[n].textContent.trim();
      const bText = b.querySelectorAll("td")[n].textContent.trim();
      return aText.localeCompare(bText, undefined, { numeric: true });
    });
    rows.forEach(row => table.querySelector("tbody").appendChild(row));
  }

  // Enhanced: Pagination (simple, for demo)
  const rowsPerPage = 10;
  const tbody = table.querySelector("tbody");
  const totalRows = tbody.rows.length;
  if (totalRows > rowsPerPage) {
    for (let i = rowsPerPage; i < totalRows; i++) tbody.rows[i].style.display = "none";
    const pagination = document.createElement("div");
    pagination.textContent = "Load More";
    pagination.style.textAlign = "center";
    pagination.style.cursor = "pointer";
    pagination.addEventListener("click", () => {
      for (let i = 0; i < totalRows; i++) tbody.rows[i].style.display = "";
      pagination.remove();
    });
    table.after(pagination);
  }
});