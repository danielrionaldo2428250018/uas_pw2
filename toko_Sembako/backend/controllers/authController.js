import db from "../db.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const [[user]] = await db.query(
      "SELECT * FROM users WHERE username=?",
      [username]
    );

    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "tokosembako",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Login gagal" });
  }
};