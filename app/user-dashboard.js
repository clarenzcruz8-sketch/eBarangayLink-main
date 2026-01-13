    // 🔒 AUTH GUARD – MUST BE AT THE TOP
    /*  if (!localStorage.getItem("userId")) {
          window.location.href = "/Sign-up.html";
   }*/
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
