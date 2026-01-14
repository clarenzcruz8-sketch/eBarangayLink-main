const express = require("express");
const router = express.Router();
const db = require("./db");

/**
 * GET all users with roles
 */
router.get("/admin/roles", (req, res) => {
  const sql = `
    SELECT 
      id,
      email,
      account_id
    FROM users
    ORDER BY email ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Roles fetch error:", err);
      return res.status(500).json([]);
    }

    res.json(rows);
  });
});

/**
 * UPDATE user role (Super Admin only)
 */
router.put("/admin/roles/:id", (req, res) => {
  const userId = req.params.id;
  const { account_id } = req.body;

  const sql = `
    UPDATE users 
    SET account_id = ?
    WHERE id = ?
  `;

  db.query(sql, [account_id, userId], err => {
    if (err) {
      console.error("❌ Role update error:", err);
      return res.status(500).json({ ok: false });
    }

    res.json({ ok: true });
  });
});

module.exports = router;