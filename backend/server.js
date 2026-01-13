
console.log("🟢 server.js loaded");

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= SIGNUP =================
app.post("/api/signup", async (req, res) => {
  console.log("🔥 SIGNUP ROUTE HIT");
  console.log("BODY:", req.body);

  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      mobile,
      street,
      house,
      username,
      password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (firstName, middleName, lastName, email, mobile, street, house, username, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        firstName,
        middleName,
        lastName,
        email,
        mobile,
        street,
        house,
        username,
        hashedPassword
      ],
      (err) => {
        if (err) {
          console.error("❌ SQL ERROR:", err);
          return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({ message: "Account created" });
      }
    );
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= LOGIN =================
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("🔐 LOGIN ATTEMPT:", username);

  const sql = "SELECT id, password, account_id FROM users WHERE username = ?";

  db.query(sql, [username], async (err, rows) => {
    if (err) {
      console.error("❌ SQL ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    console.log("✅ USER ROW FROM DB:", user);
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      userId: user.id,
      account_id: user.account_id,
      username: user.username
    });
  });
});

const documentRoutes = require("./documentrequest");
app.use("/api", documentRoutes);

app.get("/test", (req, res) => {
  res.json({ ok: true });
});
// ================= START SERVER =================
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});