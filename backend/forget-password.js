const express = require("express");
const router = express.Router();
const db = require("./db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

/**
 * SEND VERIFICATION CODE
 */
router.post("/forgot-password", async (req, res) => {
  console.log("🔥 /forgot-password HIT");

  const { email, password } = req.body;
  console.log("📩 Email:", email);

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  db.query(
    `
    UPDATE users 
    SET reset_code = ?, reset_expires = ?, temp_password = ?
    WHERE email = ?
    `,
    [code, expires, hashedPassword, email],
    async (err, result) => {
      console.log("🟡 DB callback reached");

      if (err) {
        console.error("❌ DB ERROR:", err);
        return res.status(500).json({ error: "DB error" });
      }

      if (result.affectedRows === 0) {
        console.log("❌ Email not found");
        return res.status(400).json({ error: "Email not found" });
      }

      console.log("✅ Code saved:", code);

      try {
        console.log("📨 Creating transporter...");

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: "clarenzcruz8@gmail.com",
            pass: "hxlogmnbicpogtcc" // NO SPACES
          }
        });

        console.log("🔍 Verifying SMTP...");
        await transporter.verify();

        console.log("✅ SMTP VERIFIED");

        await transporter.sendMail({
          from: `"eBarangay Link" <clarenzcruz8@gmail.com>`,
          to: email,
          subject: "Password Reset Code",
          text: `Your verification code is: ${code}`
        });

        console.log("✅ EMAIL SENT");

        res.json({ ok: true });

      } catch (e) {
        console.error("❌ EMAIL ERROR:", e);
        res.status(500).json({ error: "Email failed" });
      }
    }
  );
});
/**
 * VERIFY CODE & UPDATE PASSWORD
 */
router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;

  const cleanCode = String(code).trim();

  db.query(
    `
    SELECT * FROM users
    WHERE email = ?
      AND reset_code = ?
      AND reset_expires > NOW()
    `,
    [email, cleanCode],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
      }

      if (rows.length === 0) {
        return res.status(400).json({ error: "Invalid or expired code" });
      }

      db.query(
        `
        UPDATE users
        SET password = temp_password,
            temp_password = NULL,
            reset_code = NULL,
            reset_expires = NULL
        WHERE email = ?
        `,
        [email]
      );

      res.json({ ok: true });
    }
  );
});

module.exports = router;
