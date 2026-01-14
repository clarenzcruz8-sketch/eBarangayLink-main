const express = require("express");
const router = express.Router();
const db = require("./db"); // mysql2 connection

// ===============================
// GET ALL PAYMENTS (ADMIN)
// ===============================
router.get("/admin/payments", (req, res) => {
  console.log("✅ /api/admin/payments HIT");

  const sql = `
    SELECT
      p.id,
      CONCAT(u.firstName, ' ', u.lastName) AS user_name,
      p.amount,
      p.status,
      p.receipt_file,
      p.created_at
    FROM payments p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Payments error:", err);
      return res.status(500).json([]); // 🔥 ALWAYS return array
    }

    res.json(results);
  });
});

// ===============================
// UPDATE PAYMENT STATUS
// ===============================
router.put("/admin/payments/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["completed", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const sql = `
    UPDATE payments
    SET status = ?
    WHERE id = ?
  `;

  db.query(sql, [status, id], (err) => {
    if (err) {
      console.error("❌ Update error:", err);
      return res.status(500).json({ error: "Update failed" });
    }

    res.json({ success: true });
  });
});

module.exports = router;