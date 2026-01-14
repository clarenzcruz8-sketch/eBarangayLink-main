const express = require("express");
const router = express.Router();
const db = require("./db");

console.log("🔥 adminRequests.js loaded");

/**
 * GET all document requests (admin)
 */
router.get("/admin/requests", (req, res) => {
  console.log("✅ /api/admin/requests HIT");

  const sql = `
    SELECT
      dr.id,
      u.username AS user_name,
      dr.document_type,
      dr.status,
      dr.created_at
    FROM document_requests dr
    JOIN users u ON u.id = dr.user_id
    ORDER BY dr.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Admin requests error:", err);
      return res.status(500).json({ error: "Failed to fetch requests" });
    }

    console.log("📦 ROWS SENT TO FRONTEND:", rows);

    // ✅ MUST BE ARRAY
    res.json(rows);
  });
});

/**
 * UPDATE request status (approve / reject)
 */
router.put("/admin/requests/:id", (req, res) => {
  const { status } = req.body;

  const sql = `
    UPDATE document_requests
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, req.params.id], err => {
    if (err) {
      console.error("❌ Status update error:", err);
      return res.status(500).json({ error: "Update failed" });
    }

    res.json({ message: "Status updated" });
  });
});

module.exports = router;