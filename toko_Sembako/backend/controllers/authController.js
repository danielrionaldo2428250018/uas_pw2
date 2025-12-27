import db from "../db.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT id, username, role FROM users WHERE username=? AND password=?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Login gagal" });
    }

    res.json({
      token: "dummy-token",
      user: rows[0],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
