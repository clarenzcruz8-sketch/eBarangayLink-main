const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/admin/requests", (req, res) => {
  console.log("✅ /api/admin/requests HIT");
  res.json({ ok: true });
});
/**
 * GET all document requests (admin)
 */
router.get("/admin/requests", async (req, res) => {
  try {
    const sql = `
      SELECT
        dr.id,
        dr.form_type,
        dr.status,
        dr.created_at,
        u.first_name,
        u.last_name
      FROM document_requests dr
      JOIN users u ON u.id = dr.user_id
      ORDER BY dr.created_at DESC
    `;

    const [rows] = await db.query(sql); // 👈 STILL NEEDED

    console.log("🟢 Admin requests rows:", rows);

    res.json(rows);
  } catch (err) {
    console.error("❌ Admin requests error:", err);
    res.status(500).json({ error: err.message });
  }
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