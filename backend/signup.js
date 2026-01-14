document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    firstName: firstName.value,
    middleName: middleName.value,
    lastName: lastName.value,
    email: email.value,
    mobile: mobile.value,
    street: street.value,
    house: house.value,
    username: username.value,
    password: password.value
  };

  try {
    const res = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      // ✅ SAVE USER SESSION
      localStorage.setItem("user_id", result.userId);
      localStorage.setItem("username", result.username);

      // OPTIONAL: redirect to dashboard
      window.location.href = "/user-dashboard.html";
    } else {
      alert(result.message || "Signup failed");
    }

  } catch (err) {
    console.error("Signup error:", err);
    alert("Server error. Please try again.");
  }
});