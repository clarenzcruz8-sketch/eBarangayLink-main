    // 🔒 AUTH GUARD – MUST BE AT THE TOP
    /*  if (!localStorage.getItem("userId")) {
          window.location.href = "/Sign-up.html";
   }*/
document.addEventListener('DOMContentLoaded', () => {

  /* ============================
     DASHBOARD SUMMARY CARDS
  ============================ */
  fetch('http://localhost:3000/api/user/dashboard/requests')
    .then(res => res.json())
    .then(data => {
      const cards = document.querySelectorAll('.card-value');

      if (cards.length >= 4) {
        cards[0].textContent = data.total_requests ?? 0;
        cards[1].textContent = data.pending_requests ?? 0;
        cards[2].textContent = data.approved_requests ?? 0;
        cards[3].textContent = `₱${data.pending_payment ?? 0}`;
      }
    })
    .catch(err => console.error('Summary error:', err));


  /* ============================
     DOCUMENT REQUESTS TABLE
  ============================ */
  fetch('http://localhost:3000/api/user/dashboard/requests')
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

        const paymentClass =
          r.payment_status === 'paid' ? 'paid' : 'unpaid';

        tbody.innerHTML += `
          <tr>
            <td>${r.document_type}</td>
            <td>${new Date(r.created_at).toLocaleDateString()}</td>
            <td><span class="status ${statusClass}">${r.status}</span></td>
            <td><span class="payment ${paymentClass}">${r.payment_status}</span></td>
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
  fetch('http://localhost:3000/api/user/dashboard/payments')
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
  fetch('http://localhost:3000/api/user/dashboard/transactions')
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

if (document) {
document.addEventListener("DOMContentLoaded", () => {
  console.log("Dashboard loaded");
    });
}
    const logoutBtn = document.getElementById('logoutBtn');
    const userRequestsBtn = document.getElementById('userRequestBtn');
    const payNowBtn = document.getElementById('payNowBtn');
    const showUserInfo = document.getElementById('showUserInfo');
    const profileIcon = document.getElementById('profileIcon');
    const showNotifBtn = document.getElementById('showNotifBtn');
    const notifIcon = document.getElementById('notifIcon');
    const userProfile = document.getElementById('userProfile');
    const notifCloseBtn = document.getElementById('notifCloseBtn');
    const userCloseBtn = document.getElementById('userCloseBtn');
    
    if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        window.location.href = 'Sign-up.html';
    });
}
    if (userRequestsBtn) {
    userRequestsBtn.addEventListener('click', () => {
        window.location.href = 'apply-documents.html';
    });
}
    if (payNowBtn) {
    payNowBtn.addEventListener('click', () => {
        window.location.href = 'payment.html';
    });
}

  
    if (profileIcon && showUserInfo && notifIcon && showNotifBtn && notifCloseBtn && userCloseBtn) {
    profileIcon.addEventListener('click', () => {
        showNotifBtn.style.display = 'none';
        showUserInfo.style.display = 'none';

        if (showUserInfo.style.display === 'none' || showUserInfo.style.display === '') {
            showUserInfo.style.display = 'block';
        } else {
            showUserInfo.style.display = 'none';
        }
    });

    notifIcon.addEventListener('click', () => {
        showNotifBtn.style.display = 'none';
        showUserInfo.style.display = 'none';
        if (showNotifBtn.style.display === 'none' || showNotifBtn.style.display === '') {
            showNotifBtn.style.display = 'block';
        } else {
            showNotifBtn.style.display = 'none';
        }   
    });


    notifCloseBtn.addEventListener('click', () => {
        showNotifBtn.style.display = 'none';
        showUserInfo.style.display = 'none';
    });

    userCloseBtn.addEventListener('click', () => {
        showUserInfo.style.display = 'none';
        showNotifBtn.style.display = 'none';
    });
}
    // document.addEventListener('click', (e) => {
    //     if (!profileIcon.contains(e.target) && !showUserInfo.contains(e.target)) {
    //         showUserInfo.classList.remove('show');
    //         showUserInfo.classList.add('hidden');
    //     }

    //     if (!notifIcon.contains(e.target) && !showNotifBtn.contains(e.target)) {
    //         showNotifBtn.classList.remove('show');
    //         showNotifBtn.classList.add('hidden');
    //     }
    // });




function updateClock(){
    var now = new Date();
    var dname = now.getDay(),
    mo = now.getMonth(),
    dnum = now.getDate(),
    yr = now.getFullYear(),
    hou = now.getHours(),
    min = now.getMinutes(),
    sec = now.getSeconds(),
    pe = "AM";

    if(hou >= 12){
        pe = "PM";
    }
    if(hou == 0){
        hou = 12;
    } else if(hou > 12){
        hou = hou - 12;
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "seconds", "period"]; 
    var values = [week[dname], months[mo], dnum, yr, hou, min, sec, pe];
    for(var i=0; i<ids.length; i++)
    document.getElementById(ids[i]).firstChild.nodeValue = values[i];
}

function initClock(){
    updateClock();
    window.setInterval("updateClock()", 1);
}
