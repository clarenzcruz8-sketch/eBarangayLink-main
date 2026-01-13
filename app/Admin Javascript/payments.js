// payment.js (Enhanced with zoom on image, total amount calculation, and export CSV)
const proofs = {
  "proof1.jpg": { user: "John Doe", amount: "₱250.00", date: "Nov 03, 2025" },
  "proof2.jpg": { user: "Jane Smith", amount: "₱180.00", date: "Nov 04, 2025" },
  "proof3.jpg": { user: "Maria Santos", amount: "₱300.00", date: "Nov 05, 2025" }
};

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("proof-modal");
  const img = document.getElementById("proof-img");
  const caption = document.getElementById("proof-caption");
  const close = modal.querySelector(".close-btn");

  document.querySelectorAll(".proof-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.img;
      const p = proofs[key];
      img.src = `https://via.placeholder.com/600x800/4CAF50/white?text=GCash+Proof%0A${p.user}%0A${p.amount}%0A${p.date}`;
      caption.textContent = `${p.user} • ${p.amount} • ${p.date}`;
      modal.style.display = "flex";
    });
  });

  // Enhanced: Zoom on Image
  img.addEventListener("click", () => {
    img.classList.toggle("zoomed");
    if (img.classList.contains("zoomed")) img.style.transform = "scale(1.5)";
    else img.style.transform = "scale(1)";
  });

  close.onclick = () => modal.style.display = "none";
  window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  // Search & Filter
  document.getElementById("search-pay").addEventListener("input", filter);
  document.getElementById("pay-status").addEventListener("change", filter);

  function filter() {
    const search = document.getElementById("search-pay").value.toLowerCase();
    const filter = document.getElementById("pay-status").value;
    document.querySelectorAll("#payments-table tbody tr").forEach(row => {
      const text = row.textContent.toLowerCase();
      const status = row.dataset.status;
      row.style.display = (text.includes(search) && (filter === "all" || status === filter)) ? "" : "none";
    });
  }

  // Enhanced: Calculate Total Amount
  const amounts = Array.from(document.querySelectorAll("#payments-table td:nth-child(3)")).map(td => parseFloat(td.textContent.replace('₱', '').replace(',', '')));
  const total = amounts.reduce((sum, a) => sum + a, 0);
  const totalDiv = document.createElement("div");
  totalDiv.textContent = `Total Payments: ₱${total.toFixed(2)}`;
  totalDiv.style.textAlign = "right";
  totalDiv.style.fontWeight = "bold";
  totalDiv.style.marginTop = "1rem";
  document.querySelector(".requests-table").appendChild(totalDiv);

  // Enhanced: Export to CSV
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export to CSV";
  exportBtn.style.marginTop = "1rem";
  exportBtn.style.padding = "0.5rem 1rem";
  exportBtn.style.background = "#1976d2";
  exportBtn.style.color = "white";
  exportBtn.style.border = "none";
  exportBtn.style.borderRadius = "8px";
  exportBtn.style.cursor = "pointer";
  exportBtn.addEventListener("click", () => {
    let csv = "ID,User,Amount,Date Paid,Status\n";
    document.querySelectorAll("#payments-table tbody tr").forEach(row => {
      csv += Array.from(row.querySelectorAll("td")).map(td => td.textContent.trim()).join(",") + "\n";
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
  });
  totalDiv.after(exportBtn);
});