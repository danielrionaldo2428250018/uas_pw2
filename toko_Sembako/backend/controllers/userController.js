import db from "../db.js";

export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, role FROM users ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Gagal ambil user" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );

    res.json({ message: "User berhasil ditambahkan" });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Gagal tambah user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, role } = req.body;
    const { id } = req.params;

    await db.query(
      "UPDATE users SET username=?, role=? WHERE id=?",
      [username, role, id]
    );

    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Gagal update user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM users WHERE id=?", [id]);

    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Gagal hapus user" });
  }
};
