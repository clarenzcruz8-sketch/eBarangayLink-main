const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("./db");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get payments by user ID
router.get("/payments/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
  SELECT
    p.id,
    p.document_type,
    p.amount,
    p.reference_no,
    p.status
  FROM payments p
  LEFT JOIN document_requests dr ON dr.id = p.document_request_id
  WHERE p.user_id = ?
`;

  db.query(sql, [userId], (err, result) => {
  if (err) {
    console.error("Payments query error:", err);
    return res.status(500).json({ error: err.message });
  }

  console.log("Payments result:", result);
  res.json(result); // MUST be array
  });
});

// Upload GCash receipt
router.post(
  "/payments/upload-receipt",
  upload.array("receipt_file"),
  (req, res) => {

    const receiptFile = req.files.find(
      f => f.fieldname === "receipt_file"
    );
    const receiptBuffer = receiptFile ? receiptFile.buffer : null;

    const { payment_id } = req.body;

    const sql = `
      UPDATE payments
      SET receipt_file = ?, status = 'for_verification'
      WHERE id = ?
    `;

    db.query(sql, [receiptBuffer, payment_id], err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Receipt submitted for verification" });
    });
  }
);

module.exports = router;