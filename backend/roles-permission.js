router.put("/users/:id/role", (req, res) => {
  const { account_id } = req.body;

  if (![1, 2].includes(account_id)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  db.query(
    "UPDATE users SET account_id = ? WHERE user_id = ?",
    [account_id, req.params.id],
    err => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Role updated" });
    }
  );
});