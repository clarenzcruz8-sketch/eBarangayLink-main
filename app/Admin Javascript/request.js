// request.js — FINAL WORKING VERSION (Admin Requests)

const tableBody = document.querySelector("#requests-table tbody");
const modal = document.getElementById("request-modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-btn");
const approveBtn = document.getElementById("approve-btn");
const rejectBtn = document.getElementById("reject-btn");

let allRequests = [];
let selectedRequestId = null;

/* ================= LOAD REQUESTS ================= */
async function loadRequests() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/requests");
    const data = await res.json();

    console.log("RAW RESPONSE:", data);

    if (!Array.isArray(data)) {
      throw new Error("Expected array but got object");
    }

    allRequests = data;
    renderTable(allRequests);
  } catch (err) {
    console.error("❌ Failed to load requests:", err);
  }
}

/* ================= RENDER TABLE ================= */
function renderTable(requests) {
  tableBody.innerHTML = "";

  requests.forEach(r => {
    const tr = document.createElement("tr");
    tr.dataset.status = r.status;

    tr.innerHTML = `
      <td>REQ-${r.id}</td>
      <td>${r.user_name || "N/A"}</td>
      <td>${formatDocType(r.document_type)}</td>
      <td>${formatDate(r.created_at)}</td>
      <td><span class="status ${r.status}">${capitalize(r.status)}</span></td>
      <td>
        <button class="view-btn" data-id="${r.id}">View</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  attachViewHandlers();
}

/* ================= VIEW BUTTON ================= */
function attachViewHandlers() {
  document.querySelectorAll(".view-btn").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const request = allRequests.find(r => r.id == id);
      openModal(request);
    };
  });
}

/* ================= MODAL ================= */
function openModal(r) {
  selectedRequestId = r.id;

  modalBody.innerHTML = `
    <p><strong>Request ID:</strong> REQ-${r.id}</p>
    <p><strong>User:</strong> ${r.user_name}</p>
    <p><strong>Document:</strong> ${formatDocType(r.document_type)}</p>
    <p><strong>Date Applied:</strong> ${formatDate(r.created_at)}</p>
    <p><strong>Status:</strong> <span class="status ${r.status}">${capitalize(r.status)}</span></p>
  `;

  approveBtn.style.display = r.status === "pending" ? "inline-block" : "none";
  rejectBtn.style.display = r.status === "pending" ? "inline-block" : "none";

  modal.style.display = "flex";
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

/* ================= APPROVE / REJECT ================= */
approveBtn.onclick = () => confirmAction("approved");
rejectBtn.onclick = () => confirmAction("rejected");

function confirmAction(status) {
  if (!selectedRequestId) return;

  if (!confirm(`Are you sure you want to ${status} this request?`)) return;

  updateStatus(status);
}

async function updateStatus(status) {
  try {
    const res = await fetch(`http://localhost:3000/api/admin/requests/${selectedRequestId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!res.ok) throw new Error("Update failed");

    modal.style.display = "none";
    loadRequests();
  } catch (err) {
    console.error("❌ Status update error:", err);
  }
}

/* ================= SEARCH & FILTER ================= */
document.getElementById("search").addEventListener("input", filterTable);
document.getElementById("status-filter").addEventListener("change", filterTable);

function filterTable() {
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("status-filter").value;

  document.querySelectorAll("#requests-table tbody tr").forEach(row => {
    const text = row.textContent.toLowerCase();
    const status = row.dataset.status;
    row.style.display =
      text.includes(search) && (filter === "all" || status === filter)
        ? ""
        : "none";
  });
}

/* ================= TABLE SORTING ================= */
const headers = document.querySelectorAll("#requests-table th");
headers.forEach((header, index) => {
  header.onclick = () => sortTable(index);
});

function sortTable(colIndex) {
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  rows.sort((a, b) =>
    a.children[colIndex].innerText.localeCompare(
      b.children[colIndex].innerText,
      undefined,
      { numeric: true }
    )
  );
  rows.forEach(r => tableBody.appendChild(r));
}

/* ================= HELPERS ================= */
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function formatDocType(type) {
  return type.replace(/_/g, " ").toUpperCase();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ================= INIT ================= */
loadRequests();