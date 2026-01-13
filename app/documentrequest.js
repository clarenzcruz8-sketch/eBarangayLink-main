console.log("🔥 documentrequest.js loaded");
// 🔒 Block access if not logged in
const userId = localStorage.getItem("userId");

if (!userId) {
  window.location.href = "/login.html";
}

// ✅ Match the REAL form ID from HTML
document
  .getElementById("documentForm")
  
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const documentType = document.getElementById("documentType").value;
    const purpose = document.getElementById("purpose").value;

    if (!documentType || !purpose) {
      alert("Please fill out all fields");
      return;
    }

    try {
      // ✅ Match the REAL backend route
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,              
          document_type: documentType,  
          purpose: purpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Request failed");
        return;
      }

      alert("✅ Document request submitted successfully!");
      document.getElementById("documentForm").reset();
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      alert("Server error");
    }
  
  });

