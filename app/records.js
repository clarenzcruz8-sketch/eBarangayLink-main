// ================= USER ID =================
const userId = localStorage.getItem("user_id");

if (!userId) {
  console.error("❌ No user_id found in localStorage");
} else {
  loadRecords(userId);
}

// ================= FETCH RECORDS =================
function loadRecords(userId) {
  fetch(`http://localhost:3000/api/records/user/${userId}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error("Expected array but got object");
      }
      renderRecords(data);
    })
    .catch(err => {
      console.error("❌ Records fetch failed:", err.message);
    });
}

// ================= RENDER TABLE =================
function renderRecords(records) {
  const tbody = document.querySelector("tbody");

  if (!tbody) {
    console.error("❌ <tbody> not found in DOM");
    return;
  }

  tbody.innerHTML = "";

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">No records found</td>
      </tr>
    `;
    return;
  }

  records.forEach(r => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>DOC-${new Date(r.created_at).getFullYear()}-${r.document_id}</td>
      <td>${formatDocType(r.form_type)}</td>
      <td>${formatDate(r.created_at)}</td>
      <td>
        <span class="status ${r.payment_status || "pending"}">
          ${r.payment_status || "pending"}
        </span>
      </td>
      <td>
        <span class="status ${r.approval_status}">
          ${r.approval_status}
        </span>
      </td>
      <td>
        ${
          r.approval_status === "approved"
            ? `<button class="download" onclick="downloadDoc(${r.document_id})">Download</button>`
            : `<button disabled>Not Ready</button>`
        }
      </td>
    `;

    tbody.appendChild(tr);
  });
}

// ================= HELPERS =================
function formatDocType(type) {
  if (!type) return "UNKNOWN";
  return type.replace(/_/g, " ").toUpperCase();
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString();
}

// ================= DOWNLOAD =================
function downloadDoc(id) {
  window.location.href = `http://localhost:3000/api/records/download/${id}`;
}