import db from "../db.js";

export const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customers ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const addCustomer = async (req, res) => {
  const { nama, alamat, telepon } = req.body;
  try {
    await db.query(
      "INSERT INTO customers (nama, alamat, telepon) VALUES (?,?,?)",
      [nama, alamat, telepon]
    );
    res.json({ message: "Customer ditambahkan" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const updateCustomer = async (req, res) => {
  const { nama, alamat, telepon } = req.body;
  try {
    await db.query(
      "UPDATE customers SET nama=?, alamat=?, telepon=? WHERE id=?",
      [nama, alamat, telepon, req.params.id]
    );
    res.json({ message: "Customer diupdate" });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    await db.query("DELETE FROM customers WHERE id=?", [req.params.id]);
    res.json({ message: "Customer dihapus" });
  } catch (err) {
    res.status(500).json(err);
  }
};
