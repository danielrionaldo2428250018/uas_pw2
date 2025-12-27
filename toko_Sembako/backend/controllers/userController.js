import db from "../db.js";

/* ================= GET USERS ================= */
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, username, role FROM users"
    );
    res.json(rows);
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ message: "Gagal mengambil data users" });
  }
};

/* ================= ADD USER ================= */
export const addUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?,?,?)",
      [username, password, role]
    );
    res.json({ message: "User berhasil ditambahkan" });
  } catch (err) {
    console.error("addUser error:", err);
    res.status(500).json({ message: "Gagal menambah user" });
  }
};

/* ================= UPDATE USER ================= */
export const updateUser = async (req, res) => {
  const { username, role } = req.body;

  try {
    await db.query(
      "UPDATE users SET username=?, role=? WHERE id=?",
      [username, role, req.params.id]
    );
    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Gagal update user" });
  }
};

/* ================= DELETE USER ================= */
export const deleteUser = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM users WHERE id=?",
      [req.params.id]
    );
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Gagal hapus user" });
  }
};
