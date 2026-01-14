const express = require('express');
const router = express.Router();
const db = require('./db'); 

const getUserId = (req) => {
  return 1; // hardcoded test user
};

/* ============================
   DASHBOARD ANALYTICS SUMMARY
============================ */
router.get('/summary', (req, res) => {
  const userId = req.user?.id || 1;

  const sql = `
    SELECT
      COUNT(*) AS total_requests,
      SUM(status = 'pending') AS pending_requests,
      SUM(status = 'approved') AS approved_requests
    FROM document_requests
    WHERE user_id = ?`;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json(err);

    const summary = rows[0];

    db.query(
      `SELECT IFNULL(SUM(amount),0) AS pending_payment
       FROM payments
       WHERE user_id = ?
       AND status != 'paid'`,
      [userId],
      (err2, payRows) => {
        if (err2) return res.status(500).json(err2);

        summary.pending_payment = payRows[0].pending_payment;
        res.json(summary);
      }
    );
  });
});

/* ============================
   DOCUMENT REQUESTS
============================ */
router.get('/requests', (req, res) => {
  const userId = req.user?.id || 1;

  db.query(
    `SELECT id, document_type, status, created_at
     FROM document_requests
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ============================
   PENDING PAYMENTS
============================ */
router.get('/payments', (req, res) => {
  const userId = req.user?.id || 1;

  db.query(
    `SELECT document_type, amount
     FROM payments
     WHERE user_id = ?
     AND status != 'paid'`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* ============================
   RECENT TRANSACTIONS
============================ */
router.get('/transactions', (req, res) => {
  const userId = req.user?.id || 1;

  db.query(
    `SELECT document_type, amount, created_at
     FROM payments
     WHERE user_id = ?
     AND status = 'paid'
     ORDER BY created_at DESC
     LIMIT 5`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

module.exports = router;