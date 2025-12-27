import db from "../db.js";

/* GET */
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

/* ADD */
export const addProduct = async (req, res) => {
  const { nama, harga, stok } = req.body;

  try {
    await db.query(
      "INSERT INTO products (nama, harga, stok) VALUES (?,?,?)",
      [nama, harga, stok]
    );
    res.json({ message: "Produk ditambahkan" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

/* UPDATE */
export const updateProduct = async (req, res) => {
  const { nama, harga, stok } = req.body;

  try {
    await db.query(
      "UPDATE products SET nama=?, harga=?, stok=? WHERE id=?",
      [nama, harga, stok, req.params.id]
    );
    res.json({ message: "Produk diupdate" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

/* DELETE */
export const deleteProduct = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM products WHERE id=?",
      [req.params.id]
    );
    res.json({ message: "Produk dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};
