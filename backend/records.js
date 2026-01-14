const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/records/user/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      dr.id AS document_id,
      dr.document_type,
      dr.created_at,
      dr.status AS approval_status,
      p.status AS payment_status
    FROM document_requests dr
    LEFT JOIN payments p
      ON p.document_request_id = dr.id
    WHERE dr.user_id = ?
    ORDER BY dr.created_at DESC
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Records fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch records" });
    }
    res.json(rows);
  });
});

router.get("/records/download/:documentId", (req, res) => {
  const { documentId } = req.params;

  const sql = `
    SELECT approved_file
    FROM document_requests
    WHERE id = ? AND status = 'approved'
  `;

  db.query(sql, [documentId], (err, rows) => {
    if (err || rows.length === 0) {
      return res.status(404).send("File not available");
    }

    res.setHeader("Content-Type", "application/pdf");
    res.send(rows[0].approved_file);
  });
});
module.exports = router;