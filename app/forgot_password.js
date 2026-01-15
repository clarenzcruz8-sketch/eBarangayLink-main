const verifyBtn = document.getElementById("verifyBtn")

document.getElementById("verifyBtn").addEventListener("click", async () => {
  const email = document.querySelector("input[type='text']").value;
  const pass = document.querySelectorAll("input[type='password']")[0].value;
  const confirm = document.querySelectorAll("input[type='password']")[1].value;

  localStorage.setItem("reset_email", email);

  if (pass !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const res = await fetch("http://localhost:3000/api/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: pass })
  });

  const data = await res.json();

  if (data.ok) {
    localStorage.setItem("reset_email", email);
    window.location.href = "verification.html";
  } else {
    alert(data.error);
  }
});

verifyBtn.addEventListener("click", function(){
    window.location.href = "forgot-password-verification.html";
})