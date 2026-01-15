// 🔒 AUTH GUARD – OPTIONAL
/* if (!localStorage.getItem("userId")) {
  window.location.href = "/Sign-up.html";
} */

const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================
     DASHBOARD SUMMARY CARDS ✅ FIXED
  ============================ */
  fetch(`${API_BASE}/api/user/dashboard/summary`)
    .then(res => res.json())
    .then(data => {
      const cards = document.querySelectorAll('.card-value');

      if (cards.length >= 4) {
        cards[0].textContent = data.total_requests || 0;
        cards[1].textContent = data.pending_requests || 0;
        cards[2].textContent = data.approved_requests || 0;
        cards[3].textContent = `₱${data.pending_payment || 0}`;
      }
    })
    .catch(err => console.error('Summary error:', err));


  /* ============================
     DOCUMENT REQUESTS TABLE
  ============================ */
  fetch(`${API_BASE}/api/user/dashboard/requests`)
    .then(res => res.json())
    .then(rows => {
      const tbody = document.getElementById('requestsTableBody');
      if (!tbody) return;

      tbody.innerHTML = '';

      if (!rows.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;">No requests found</td>
          </tr>`;
        return;
      }

      rows.forEach(r => {
        const statusClass =
          r.status === 'approved' ? 'status-approved' :
          r.status === 'pending' ? 'status-pending' :
          'status-rejected';

        tbody.innerHTML += `
          <tr>
            <td>${r.document_type}</td>
            <td>${new Date(r.created_at).toLocaleDateString()}</td>
            <td><span class="status ${statusClass}">${r.status}</span></td>
            <td>-</td>
            <td>
              <button class="btn-view" data-id="${r.id}">View</button>
            </td>
          </tr>`;
      });
    })
    .catch(err => console.error('Requests error:', err));


  /* ============================
     PENDING PAYMENTS
  ============================ */
  fetch(`${API_BASE}/api/user/dashboard/payments`)
    .then(res => res.json())
    .then(rows => {
      const list = document.getElementById('pendingPaymentsList');
      if (!list) return;

      list.innerHTML = '';

      if (!rows.length) {
        list.innerHTML = `<li>No pending payments</li>`;
        return;
      }

      rows.forEach(p => {
        list.innerHTML += `
          <li>
            ${p.document_type}
            <strong>₱${p.amount}</strong>
          </li>`;
      });
    })
    .catch(err => console.error('Payments error:', err));


  /* ============================
     RECENT TRANSACTIONS
  ============================ */
  fetch(`${API_BASE}/api/user/dashboard/transactions`)
    .then(res => res.json())
    .then(rows => {
      const list = document.getElementById('transactionsList');
      if (!list) return;

      list.innerHTML = '';

      if (!rows.length) {
        list.innerHTML = `<li>No recent transactions</li>`;
        return;
      }

      rows.forEach(t => {
        list.innerHTML += `
          <li>
            ${t.document_type} – ₱${t.amount}
            <br>
            <small>${new Date(t.created_at).toLocaleString()}</small>
          </li>`;
      });
    })
    .catch(err => console.error('Transactions error:', err));

});

/* ============================
   UI / NAVIGATION (UNCHANGED)
============================ */
const logoutBtn = document.getElementById('logoutBtn');
const userRequestsBtn = document.getElementById('userRequestBtn');
const payNowBtn = document.getElementById('payNowBtn');
const showUserInfo = document.getElementById('showUserInfo');
const profileIcon = document.getElementById('profileIcon');
const showNotifBtn = document.getElementById('showNotifBtn');
const notifIcon = document.getElementById('notifIcon');
const notifCloseBtn = document.getElementById('notifCloseBtn');
const userCloseBtn = document.getElementById('userCloseBtn');

if (logoutBtn) logoutBtn.onclick = () => location.href = 'Sign-up.html';
if (userRequestsBtn) userRequestsBtn.onclick = () => location.href = 'apply-documents.html';
if (payNowBtn) payNowBtn.onclick = () => location.href = 'payment.html';

if (profileIcon && showUserInfo && notifIcon && showNotifBtn) {
  profileIcon.onclick = () => {
    showNotifBtn.style.display = 'none';
    showUserInfo.style.display =
      showUserInfo.style.display === 'block' ? 'none' : 'block';
  };

  notifIcon.onclick = () => {
    showUserInfo.style.display = 'none';
    showNotifBtn.style.display =
      showNotifBtn.style.display === 'block' ? 'none' : 'block';
  };
}

if (notifCloseBtn) notifCloseBtn.onclick = () => showNotifBtn.style.display = 'none';
if (userCloseBtn) userCloseBtn.onclick = () => showUserInfo.style.display = 'none';

/* ============================
   CLOCK (UNCHANGED)
============================ */
function updateClock(){
  const now = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const week = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  let hou = now.getHours();
  let pe = hou >= 12 ? "PM" : "AM";
  if (hou === 0) hou = 12;
  if (hou > 12) hou -= 12;

  const values = [
    week[now.getDay()],
    months[now.getMonth()],
    now.getDate(),
    now.getFullYear(),
    hou,
    now.getMinutes(),
    now.getSeconds(),
    pe
  ];

  const ids = ["dayname","month","daynum","year","hour","minutes","seconds","period"];
  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = values[i];
  });
}

function initClock(){
  updateClock();
  setInterval(updateClock, 1000);
}