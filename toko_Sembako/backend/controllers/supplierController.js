import db from "../db.js";

/* ================= GET SUPPLIERS ================= */
export const getSuppliers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, alamat, telepon FROM suppliers ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getSuppliers error:", err);
    res.status(500).json({ message: "Gagal mengambil supplier" });
  }
};

/* ================= ADD SUPPLIER ================= */
export const addSupplier = async (req, res) => {
  try {
    const { nama, alamat, telepon } = req.body;

    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama supplier wajib diisi" });
    }

    if (!alamat || alamat.trim() === "") {
      return res.status(400).json({ message: "Alamat wajib diisi" });
    }

    if (!telepon || telepon.trim() === "") {
      return res.status(400).json({ message: "No telepon wajib diisi" });
    }

    await db.query(
      "INSERT INTO suppliers (nama, alamat, telepon) VALUES (?,?,?)",
      [nama.trim(), alamat.trim(), telepon.trim()]
    );

    res.json({ message: "Supplier berhasil ditambahkan" });
  } catch (err) {
    console.error("addSupplier error:", err);
    res.status(500).json({ message: "Gagal menambah supplier" });
  }
};

/* ================= UPDATE SUPPLIER ================= */
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, alamat, telepon } = req.body;

    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama supplier wajib diisi" });
    }

    if (!alamat || alamat.trim() === "") {
      return res.status(400).json({ message: "Alamat wajib diisi" });
    }

    if (!telepon || telepon.trim() === "") {
      return res.status(400).json({ message: "No telepon wajib diisi" });
    }

    await db.query(
      "UPDATE suppliers SET nama=?, alamat=?, telepon=? WHERE id=?",
      [nama.trim(), alamat.trim(), telepon.trim(), id]
    );

    res.json({ message: "Supplier berhasil diupdate" });
  } catch (err) {
    console.error("updateSupplier error:", err);
    res.status(500).json({ message: "Gagal update supplier" });
  }
};

/* ================= DELETE SUPPLIER ================= */
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM suppliers WHERE id=?", [id]);

    res.json({ message: "Supplier berhasil dihapus" });
  } catch (err) {
    console.error("deleteSupplier error:", err);
    res.status(500).json({ message: "Gagal menghapus supplier" });
  }
};