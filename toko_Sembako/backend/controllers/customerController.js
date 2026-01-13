import db from "../db.js";

/* ================= GET CUSTOMERS ================= */
export const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, alamat, telepon FROM customers ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getCustomers error:", err);
    res.status(500).json({ message: "Gagal mengambil customer" });
  }
};

/* ================= ADD CUSTOMER ================= */
export const addCustomer = async (req, res) => {
  try {
    const { nama, alamat, telepon } = req.body;

    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama customer wajib diisi" });
    }

    if (!alamat || alamat.trim() === "") {
      return res.status(400).json({ message: "Alamat wajib diisi" });
    }

    if (!telepon || telepon.trim() === "") {
      return res.status(400).json({ message: "No telepon wajib diisi" });
    }

    await db.query(
      "INSERT INTO customers (nama, alamat, telepon) VALUES (?,?,?)",
      [nama.trim(), alamat.trim(), telepon.trim()]
    );

    res.json({ message: "Customer berhasil ditambahkan" });
  } catch (err) {
    console.error("addCustomer error:", err);
    res.status(500).json({ message: "Gagal menambah customer" });
  }
};

/* ================= UPDATE CUSTOMER ================= */
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, alamat, telepon } = req.body;

    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama customer wajib diisi" });
    }

    if (!alamat || alamat.trim() === "") {
      return res.status(400).json({ message: "Alamat wajib diisi" });
    }

    if (!telepon || telepon.trim() === "") {
      return res.status(400).json({ message: "No telepon wajib diisi" });
    }

    await db.query(
      "UPDATE customers SET nama=?, alamat=?, telepon=? WHERE id=?",
      [nama.trim(), alamat.trim(), telepon.trim(), id]
    );

    res.json({ message: "Customer berhasil diupdate" });
  } catch (err) {
    console.error("updateCustomer error:", err);
    res.status(500).json({ message: "Gagal update customer" });
  }
};

/* ================= DELETE CUSTOMER ================= */
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM customers WHERE id=?", [id]);

    res.json({ message: "Customer berhasil dihapus" });
  } catch (err) {
    console.error("deleteCustomer error:", err);
    res.status(500).json({ message: "Gagal menghapus customer" });
  }
};