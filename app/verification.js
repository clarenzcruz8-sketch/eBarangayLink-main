document.querySelector(".verify_Code_Btn").addEventListener("click", async () => {
  const inputs = document.querySelectorAll(".verification_codes input");
  const code = [...inputs].map(i => i.value).join("");
  const email = localStorage.getItem("reset_email");

document.querySelector(".verify_Code_Btn").addEventListener("click", async () => {
  const inputs = document.querySelectorAll(".verification_codes input");

  const code = Array.from(inputs)
    .map(i => i.value.trim())
    .join("");

  const email = localStorage.getItem("reset_email");

  if (code.length !== 4) {
    alert("Enter the 4-digit code");
    return;
  }

  const res = await fetch("http://localhost:3000/api/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });

  const data = await res.json();

  if (data.ok) {
    alert("Password reset successful!");
    window.location.href = "login.html";
  } else {
    alert(data.error || "Invalid code");
  }
});

  const res = await fetch("http://localhost:3000/api/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });

  const data = await res.json();

  if (data.ok) {
    alert("✅ Password reset successful");
    localStorage.removeItem("reset_email");
    window.location.href = "Sign-up.html";
  } else {
    alert(data.error);
  }
});