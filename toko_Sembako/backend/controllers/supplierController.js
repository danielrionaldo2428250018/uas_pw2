import db from "../db.js";

/* GET ALL */
export const getSuppliers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM suppliers ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getSuppliers error:", err);
    res.status(500).json({ message: "Gagal mengambil supplier" });
  }
};

/* ADD */
export const addSupplier = async (req, res) => {
  const { nama, alamat, telepon } = req.body;

  try {
    await db.query(
      "INSERT INTO suppliers (nama, alamat, telepon) VALUES (?,?,?)",
      [nama, alamat, telepon]
    );
    res.json({ message: "Supplier berhasil ditambahkan" });
  } catch (err) {
    console.error("addSupplier error:", err);
    res.status(500).json({ message: "Gagal menambah supplier" });
  }
};

/* UPDATE */
export const updateSupplier = async (req, res) => {
  const { nama, alamat, telepon } = req.body;

  try {
    await db.query(
      "UPDATE suppliers SET nama=?, alamat=?, telepon=? WHERE id=?",
      [nama, alamat, telepon, req.params.id]
    );
    res.json({ message: "Supplier berhasil diupdate" });
  } catch (err) {
    console.error("updateSupplier error:", err);
    res.status(500).json({ message: "Gagal update supplier" });
  }
};

/* DELETE */
export const deleteSupplier = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM suppliers WHERE id=?",
      [req.params.id]
    );
    res.json({ message: "Supplier berhasil dihapus" });
  } catch (err) {
    console.error("deleteSupplier error:", err);
    res.status(500).json({ message: "Gagal hapus supplier" });
  }
};
