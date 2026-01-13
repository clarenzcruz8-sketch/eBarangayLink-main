const express = require("express");
const multer = require("multer")
const path = require("path");
const router = express.Router();
const db = require("./db");

console.log("🔥 documentrequest.js loaded");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

router.post(
  "/documents",
  upload.any(),
  (req, res) => {
    console.log("FORM TYPE:", req.body.formType);
    console.log("📥 DOCUMENT BODY:", req.body);
    console.log("📎 FILES:", req.files);

    const getFile = (name) =>
  req.files?.find(f => f.fieldname === name)?.filename || null;


const validIdFile = req.files.find(f => f.fieldname === "valid_id_file");
const signatureFile = req.files.find(f => f.fieldname === "signature_file");
const attachmentsFileObj = req.files.find(f => f.fieldname === "attachments_file");
const taxDeclarationFileObj = req.files.find(f => f.fieldname === "tax_declaration_file");
const businessDocsFileObj = req.files.find(f => f.fieldname === "business_docs_file");
const schoolIdFileObj = req.files.find(f => f.fieldname === "school_id_file");
const residencyCertificateFileObj = req.files.find(f => f.fieldname === "residency_certificate_file");
const medicalExamFileObj = req.files.find(f => f.fieldname === "medical_exam_file");
const requestLetterFileObj = req.files.find(f => f.fieldname === "request_letter_file");

const validIdBuffer = validIdFile ? validIdFile.buffer : null;
const signatureBuffer = signatureFile ? signatureFile.buffer : null;
const attachmentsBuffer = attachmentsFileObj ? attachmentsFileObj.buffer : null;
const taxDeclarationBuffer = taxDeclarationFileObj ? taxDeclarationFileObj.buffer : null;
const businessDocsBuffer = businessDocsFileObj ? businessDocsFileObj.buffer : null;
const schoolIdBuffer = schoolIdFileObj ? schoolIdFileObj.buffer : null;
const residencyCertificateBuffer = residencyCertificateFileObj ? residencyCertificateFileObj.buffer : null;
const medicalExamBuffer = medicalExamFileObj ? medicalExamFileObj.buffer : null;
const requestLetterBuffer = requestLetterFileObj ? requestLetterFileObj.buffer : null;


  const { formType, user_id } = req.body;

  if (!formType || !user_id) {
    return res.status(400).json({ message: "Missing form type or user" });
  }

  let sql = "";
  let values = [];

  switch (formType) {

    // ---------------- BARANGAY CLEARANCE ----------------
    case "barangay_clearance":
  sql = `
    INSERT INTO barangay_clearance_requests
    (
      user_id,
      full_name,
      date_of_birth,
      years_of_residency,
      occupation,
      mobile_number,
      valid_id_file,
      signature_file,
      purpose,
      barangay,
      house_no,
      street
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,          // from name="full_name"
    req.body.date_of_birth,      // name="date_of_birth"
    req.body.years_of_residency, // name="years_of_residency"
    req.body.occupation,         // name="occupation"
    req.body.mobile_number,      // name="mobile_number"
    validIdBuffer,                 // file input
    signatureBuffer,               // file input
    req.body.purpose,            // textarea name="purpose"
    req.body.barangay,
    req.body.house_no,
    req.body.street
  ];
  break;

    // ---------------- INDIGENCY ----------------
case "indigency":
  sql = `
    INSERT INTO indigency_requests
    (
      user_id,
      full_name,
      date_of_birth,
      monthly_income,
      occupation,
      mobile_number,
      valid_id_file,
      signature_file,
      purpose,
      barangay,
      house_no,
      street
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,
    req.body.date_of_birth,
    req.body.monthly_income,
    req.body.occupation,
    req.body.mobile_number,
    validIdBuffer,
    signatureBuffer,
    req.body.purpose,
    req.body.barangay,
    req.body.house_no,
    req.body.street
  ];
  break;
// ---------------- BARANGAY RESIDENCY ----------------
case "residency":

  sql = `
    INSERT INTO residency_requests
    (
      user_id,
      full_name,
      date_of_birth,
      years_of_residency,
      place_of_birth,
      mobile_number,
      valid_id_file,
      signature_file,
      purpose,
      barangay,
      house_no,
      street
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,
    req.body.date_of_birth,
    req.body.years_of_residency,
    req.body.place_of_birth,
    req.body.mobile_number,
    validIdBuffer,
    signatureBuffer,
    req.body.purpose,
    req.body.barangay,
    req.body.house_no,
    req.body.street
  ];
  break;

    // ---------------- HOUSE OWNERSHIP ----------------
case "house_ownership":
  sql = `
    INSERT INTO house_ownership_requests
    (
      user_id,
      full_name,
      ownership_type,
      years_of_residency,
      contact_number,
      attachments_file,
      tax_declaration_file,
      barangay,
      house_no,
      street
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,
    req.body.ownership_type,
    req.body.years_of_residency,
    req.body.contact_number,
    attachmentsBuffer,        // ✅ BUFFER
    taxDeclarationBuffer,     // ✅ BUFFER
    req.body.barangay,
    req.body.house_no,
    req.body.street
  ];
  break;

   // ---------------- BUSINESS PERMIT ----------------
case "business_permit":
  sql = `
    INSERT INTO business_permit_requests
    (
      user_id,
      business_name,
      owner_name,
      business_address,
      business_type,
      start_date,
      dti_sec_no,
      tin,
      business_docs_file,
      valid_id_file,
      purpose,
      signature_file,
      contact_number,
      email
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.business_name,
    req.body.owner_name,
    req.body.business_address,
    req.body.business_type,
    req.body.start_date,
    req.body.dti_sec_no,
    req.body.tin,
    businessDocsBuffer,   // ✅ BUFFER
    validIdBuffer,        // ✅ BUFFER (optional)
    req.body.purpose,
    signatureBuffer,      // ✅ BUFFER (optional)
    req.body.contact_number,
    req.body.email
  ];
  break;

    // ---------------- GOOD MORAL ----------------
case "good_moral":
  sql = `
    INSERT INTO good_moral_requests
    (
      user_id,
      full_name,
      date_of_birth,
      institution,
      years_of_residency,
      valid_id_file,
      request_letter_file,
      attachments_file,
      barangay,
      house_no,
      street
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,
    req.body.date_of_birth,
    req.body.institution,
    req.body.years_of_residency,
    validIdBuffer,          // BUFFER
    requestLetterBuffer,    // BUFFER
    attachmentsBuffer,      // BUFFER
    req.body.barangay,
    req.body.house_no,
    req.body.street
  ];
  break;
    // ---------------- HEALTH ----------------
    case "health":

  sql = `
    INSERT INTO health_requests
    (
      user_id,
      full_name,
      date_of_birth,
      occupation,
      attachments,
      medical_exam_file,
      valid_id_file,
      purpose
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,
    req.body.date_of_birth,
    req.body.occupation,
    attachmentsBuffer,
    medicalExamBuffer,
    validIdBuffer,
    req.body.purpose
  ];

  break;

    // ---------------- SCHOLARSHIP ----------------
    case "scholarship":

  sql = `
    INSERT INTO scholarship_requests
    (
      user_id,
      full_name,
      school_name,
      year_course,
      attachments_file,
      school_id_file,
      residency_certificate_file,
      barangay,
      house_no,
      street
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  values = [
    user_id,
    req.body.full_name,
    req.body.school_name,
    req.body.year_course,
    attachmentsBuffer,
    schoolIdBuffer,
    residencyCertificateBuffer,
    req.body.barangay,
    req.body.house_no,
    req.body.street
  ];

  break;

    default:
      return res.status(400).json({ message: "Invalid form type" });
  }
console.log("🧪 FINAL VALUES:", values);
  db.query(sql, values, (err) => {
    if (err) {
      console.error("❌ DB ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Document submitted successfully" });
  });
});
module.exports = router;