console.log("🔥 main.js loaded");
function $(id) {
  return document.getElementById(id);
}

function exists(el) {
  return el !== null && el !== undefined;
}

if (document) {
document.addEventListener("DOMContentLoaded", () => {
// this if for hiding the forms and displaying it when selected
const select = document.getElementById("documentType");
const form = document.querySelectorAll(".fill-up-form");
const directions = document.getElementById("direction");
const logoutBtn = document.getElementById("logoutBtn");
// const clearanceForm = document.querySelector(".fill-up-form");

// hide initially
form.forEach(f => f.style.display = "none");
if (select) {
select.addEventListener("change", function(){
    

    form.forEach(f => f.style.display = "none");

    const selectedForm = document.querySelector(`.form-${select.value}`);
  if (selectedForm) {
    selectedForm.style.display = "block";
    // directions.style.display = "none";
  }else{
    directions.style.display = "block";
  }
});
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.location.href = "Sign-up.html";
    });
  }

// Patterns (define ONCE in main.js)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const specialCharPattern = /[^a-zA-Z\s]/;
const telephonePattern = /^\d{4}-\d{3}-\d{3}$/;

console.log("✅ main.js loaded");

// BARANGAY CLEARANCE FORM
const BC_form = document.getElementById("BC_form");

if (BC_form) {
  BC_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Barangay Clearance submit triggered");

    const formData = new FormData(BC_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG: LOG FORMDATA (THIS IS WHAT YOU WERE MISSING)
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL FILE CHECK (NO COMPLEX VALIDATION)
    if (!formData.get("valid_id_file")) {
      alert("Valid ID is required");
      return;
    }

    if (!formData.get("signature_file")) {
      alert("Signature is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Submitted successfully");
      BC_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}
// BARANGAY RESIDENCY FORM
const CR_form = document.getElementById("CR_form");

if (CR_form) {
  CR_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Barangay Residency submit triggered");

    const formData = new FormData(CR_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG: LOG FORMDATA
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL FILE CHECK (SAME STYLE AS CLEARANCE)
    if (!formData.get("valid_id_file")) {
      alert("Valid ID is required");
      return;
    }

    if (!formData.get("signature_file")) {
      alert("Signature is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Submitted successfully");
      CR_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}
// BARANGAY INDIGENCY FORM
const CI_form = document.getElementById("CI_form");

if (CI_form) {
  CI_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Barangay Indigency submit triggered");

    const formData = new FormData(CI_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL VALIDATION (SAME AS CLEARANCE)
    if (!formData.get("valid_id_file")) {
      alert("Valid ID is required");
      return;
    }

    if (!formData.get("signature_file")) {
      alert("Signature is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Submitted successfully");
      CI_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}
// HOUSE OWNERSHIP FORM
const HO_form = document.getElementById("HO_form");

if (HO_form) {
  HO_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 House Ownership submit triggered");

    const formData = new FormData(HO_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL VALIDATION (same pattern)
    if (!formData.get("attachments_file")) {
      alert("Attachments file is required");
      return;
    }

    if (!formData.get("tax_declaration_file")) {
      alert("Tax declaration / lease / deed is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Submitted successfully");
      HO_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}
// ================= BUSINESS PERMIT FORM =================
const BP_form = document.getElementById("BP_form");

if (BP_form) {
  BP_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Business Permit submit triggered");

    const formData = new FormData(BP_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL FILE CHECK
    if (!formData.get("business_docs_file")) {
      alert("Business documents are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Business Permit submitted successfully");
      BP_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}

// ================= GOOD MORAL FORM =================
const GM_form = document.getElementById("GM_form");

if (GM_form) {
  GM_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Good Moral submit triggered");

    const formData = new FormData(GM_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL VALIDATION (OPTIONAL FILES, SO ONLY STREET)
    if (!formData.get("street")) {
      alert("Street is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Good Moral request submitted");
      GM_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}
// ================= HEALTH FORM =================
const CH_form = document.getElementById("CH_form");

if (CH_form) {
  CH_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Health form submit triggered");

    const formData = new FormData(CH_form);

    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (!formData.get("attachments_file")) {
      alert("Attachments are required");
      return;
    }

    if (!formData.get("valid_id_file")) {
      alert("Valid ID is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Submitted successfully");
      CH_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}

// SCHOLARSHIP FORM
const CS_form = document.getElementById("CS_form");

if (CS_form) {
  CS_form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📨 Scholarship submit triggered");

    const formData = new FormData(CS_form);

    // attach logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("user_id", userId);
    }

    // 🔍 DEBUG: LOG FORMDATA
    console.log("📦 FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // MINIMAL FILE CHECK (SAME STYLE AS OTHERS)
    if (!formData.get("attachments_file")) {
      alert("Required attachments are required");
      return;
    }

    if (!formData.get("school_id_file")) {
      alert("School ID is required");
      return;
    }

    if (!formData.get("residency_certificate_file")) {
      alert("Certificate of Residency is required");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/documents", {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      console.log("✅ Server response:", data);

      alert(data.message || "Submitted successfully");
      CS_form.reset();

    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Submission failed");
    }
  });
}

}); 
}