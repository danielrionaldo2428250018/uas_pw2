import db from "../db.js";

/* ================= GET PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nama, harga, stok FROM products ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Gagal mengambil produk" });
  }
};

/* ================= ADD PRODUCT ================= */
export const addProduct = async (req, res) => {
  try {
    const { nama, harga, stok } = req.body;

    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama produk wajib diisi" });
    }

    if (harga === undefined || harga === null || harga <= 0) {
      return res.status(400).json({ message: "Harga harus lebih dari 0" });
    }

    if (stok === undefined || stok === null || stok < 0) {
      return res.status(400).json({ message: "Stok tidak boleh negatif" });
    }

    await db.query(
      "INSERT INTO products (nama, harga, stok) VALUES (?,?,?)",
      [nama.trim(), harga, stok]
    );

    res.json({ message: "Produk berhasil ditambahkan" });
  } catch (err) {
    console.error("addProduct error:", err);
    res.status(500).json({ message: "Gagal menambah produk" });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, harga, stok } = req.body;

    if (!nama || nama.trim() === "") {
      return res.status(400).json({ message: "Nama produk wajib diisi" });
    }

    if (harga <= 0) {
      return res.status(400).json({ message: "Harga harus lebih dari 0" });
    }

    if (stok < 0) {
      return res.status(400).json({ message: "Stok tidak boleh negatif" });
    }

    await db.query(
      "UPDATE products SET nama=?, harga=?, stok=? WHERE id=?",
      [nama.trim(), harga, stok, id]
    );

    res.json({ message: "Produk berhasil diupdate" });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Gagal update produk" });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM products WHERE id=?", [id]);

    res.json({ message: "Produk berhasil dihapus" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Gagal menghapus produk" });
  }
};