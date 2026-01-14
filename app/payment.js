const displayBox = document.getElementById('uploadBox');
const inPersonDisplay = document.getElementById('inPersonDisplay');
const gCashBtn = document.getElementById('gCashBtn');
const inPersonBtn = document.getElementById('inPerson');

document.addEventListener("DOMContentLoaded", async () => {
  const userId = localStorage.getItem("userId");

  const res = await fetch(
    `http://localhost:3000/api/payments/user/${userId}`
  );
  const payments = await res.json();

  const tbody = document.querySelector(".fee-summary tbody");
  tbody.innerHTML = "";

  if (!Array.isArray(payments)) {
  console.error("Expected array but got:", payments);
  return;
  }
  payments.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.document_type}</td>
      <td>${p.purpose}</td>
      <td>₱${p.amount}</td>
      <td>${p.reference_no}</td>
      <td>${p.status === "paid" ? "🟢Paid" : "🟡Pending"}</td>
    `;

    tr.onclick = () => selectPayment(p.id);
    tbody.appendChild(tr);
  });
});

let selectedPaymentId = null;

function selectPayment(paymentId) {
  selectedPaymentId = paymentId;
}

document
  .getElementById("submitPaymentBtn")
  .addEventListener("click", async () => {

    if (!selectedPaymentId) {
      alert("Select a document to pay");
      return;
    }

    const fileInput = document.querySelector(".upload-box input");
    if (!fileInput.files.length) {
      alert("Upload receipt first");
      return;
    }

    const formData = new FormData();
    formData.append("payment_id", selectedPaymentId);
    formData.append("receipt_file", fileInput.files[0]);

    const res = await fetch(
      "http://localhost:3000/api/payments/upload-receipt",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();
    alert(data.message);
  });

displayBox.style.display = 'flex';
if (gCashBtn) {
gCashBtn.addEventListener('click', () => {
    const isGCashVisible = displayBox.style.display === 'flex';

    // Hide both first
    displayBox.style.display = 'none';
    inPersonDisplay.style.display = 'none';

    // If GCash was hidden, show it
    if (!isGCashVisible) {
        displayBox.style.display = 'flex';
        displayBox.style.transition = '5s ease';

    }
});
}
// In-Person Button
if (inPersonBtn) {
inPersonBtn.addEventListener('click', () => {
    const isInPersonVisible = inPersonDisplay.style.display === 'flex';

    // Hide both first
    displayBox.style.display = 'none';
    inPersonDisplay.style.display = 'none';

    // If In-Person was hidden, show it
    if (!isInPersonVisible) {
        inPersonDisplay.style.display = 'flex';
    }
});
}
// gCashBtn.addEventListener('click', () => {
//     if (displayBox.style.display === 'none' || displayBox.style.display === '') {
//         displayBox.style.display = 'flex';
//         displayBox.style.transition = 'all 5s ease';
//     } else {
//         displayBox.style.display = 'none';
//         inPersonDisplay.style.display = 'none';
//     }    
// });
// inPersonBtn.addEventListener('click', () => {
//     if (inPersonDisplay.style.display === 'none' || inPersonDisplay.style.display === '') {
//         inPersonDisplay.style.display = 'flex';
//         inPersonDisplay.style.transition = 'all 5s ease';
//     } else {
//         inPersonDisplay.style.display = 'none';
//     }   
// });

// if(gCashBtn == 'clicked'){
//     inPersonDisplay.style.display = 'none';
// }

// submit payment 

const submitPaymentBtn = document.getElementById('submitPaymentBtn');
const verifyModal = document.getElementById('verifyModal');
const verificationModal = document.querySelector('.verificationModal');
const modalYesBtn = document.getElementById('modalYes');
const modalNoBtn = document.getElementById('modalNo');
const paymentWrapper = document.getElementById('paymentWrapper');
if (submitPaymentBtn) {
submitPaymentBtn.addEventListener('click', () => {
    verifyModal.style.display = 'flex';

    if(document.querySelector('verificastionModal').style.display === 'none' || document.querySelector('verificationModal').style.display === ''){
        document.querySelector('verificationModal').style.display = 'flex';
    }


});
}
// modalYesBtn.addEventListener('click', () => {
   

//     verifyModal.style.display = 'none';
//     displayBox.style.display = 'none';
//     paymentWrapper.style.background = 'limegreen';
  

// });


// date time
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

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
logoutBtn.addEventListener('click', () => {
    window.location.href = 'Sign-up.html';
});
}