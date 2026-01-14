// payments.js (Dynamic backend-driven version)

const tableBody = document.querySelector("#payments-table tbody");
let payments = [];
let currentPaymentId = null;

fetch("http://localhost:3000/api/admin/payments")
  .then(res => res.json())
  .then(data => {
    console.log("RAW PAYMENTS RESPONSE:", data);

    if (!Array.isArray(data)) {
      console.error("❌ Expected array but got:", data);
      return;
    }

    renderPayments(data);
  })
  .catch(err => console.error("❌ Payments fetch error:", err));

function renderPayments(payments) {
  const tbody = document.querySelector("#payments-table tbody");
  tbody.innerHTML = "";

  payments.forEach(p => {
    const tr = document.createElement("tr");
    tr.dataset.status = p.status;

    tr.innerHTML = `
      <td>PAY-${p.id}</td>
      <td>${p.user_name}</td>
      <td>₱${Number(p.amount).toFixed(2)}</td>
      <td>${new Date(p.created_at).toLocaleDateString()}</td>
      <td><span class="status ${p.status}">${p.status}</span></td>
      <td>
        ${p.receipt_file 
          ? `<button class="proof-btn" data-id="${p.id}">View Proof</button>`
          : "No receipt"}
      </td>
    `;

    tbody.appendChild(tr);
  });

  attachProofHandlers();
  calculateTotal();
}

function attachProofHandlers() {
  document.querySelectorAll(".proof-btn").forEach(btn => {
    btn.onclick = () => {
      currentPaymentId = btn.dataset.id;
      const p = payments.find(x => x.id == currentPaymentId);

      document.getElementById("proof-img").src = p.receipt_url;
      document.getElementById("proof-caption").textContent =
        `${p.user_name} • ₱${p.amount} • ${new Date(p.created_at).toLocaleDateString()}`;

      document.getElementById("proof-modal").style.display = "flex";
    };
  });
}

// Modal controls
const modal = document.getElementById("proof-modal");
modal.querySelector(".close-btn").onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// Search & filter
document.getElementById("search-pay").addEventListener("input", filter);
document.getElementById("pay-status").addEventListener("change", filter);

function filter() {
  const search = document.getElementById("search-pay").value.toLowerCase();
  const status = document.getElementById("pay-status").value;

  document.querySelectorAll("#payments-table tbody tr").forEach(row => {
    const text = row.textContent.toLowerCase();
    const rowStatus = row.dataset.status;
    row.style.display =
      text.includes(search) &&
      (status === "all" || rowStatus === status)
        ? ""
        : "none";
  });
}

// Calculate total payments
function calculateTotal() {
  const total = payments
    .filter(p => p.status === "completed")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  let totalDiv = document.getElementById("total-payments");
  if (!totalDiv) {
    totalDiv = document.createElement("div");
    totalDiv.id = "total-payments";
    totalDiv.style.textAlign = "right";
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.marginTop = "1rem";
    document.querySelector(".requests-table").appendChild(totalDiv);
  }

  totalDiv.textContent = `Total Completed Payments: ₱${total.toFixed(2)}`;
}

// Helpers
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}