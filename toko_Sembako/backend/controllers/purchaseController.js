import db from "../db.js";

/* ================= GET PURCHASE ================= */
export const getPurchases = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.id,
        DATE_FORMAT(p.tanggal,'%d-%m-%Y') AS tanggal,
        s.nama AS supplier,
        p.total
      FROM purchases p
      LEFT JOIN suppliers s ON s.id = p.supplier_id
      ORDER BY p.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("getPurchases error:", err);
    res.status(500).json({ message: "Gagal mengambil data pembelian" });
  }
};

/* ================= ADD PURCHASE ================= */
export const addPurchase = async (req, res) => {
  try {
    const { supplier_id } = req.body;

    await db.query(
      "INSERT INTO purchases (supplier_id, tanggal, total) VALUES (?, CURDATE(), 0)",
      [supplier_id]
    );

    res.json({ message: "Pembelian berhasil dibuat" });
  } catch (err) {
    console.error("addPurchase error:", err);
    res.status(500).json({ message: "Gagal menambah pembelian" });
  }
};

/* ================= DELETE PURCHASE ================= */
export const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;

    const [items] = await db.query(
      "SELECT product_id, qty FROM purchase_items WHERE purchase_id=?",
      [id]
    );

    for (const item of items) {
      await db.query(
        "UPDATE products SET stok = stok - ? WHERE id=?",
        [item.qty, item.product_id]
      );
    }

    await db.query("DELETE FROM purchases WHERE id=?", [id]);

    res.json({ message: "Pembelian dihapus" });
  } catch (err) {
    console.error("deletePurchase error:", err);
    res.status(500).json({ message: "Gagal menghapus pembelian" });
  }
};

/* ================= GET ITEMS ================= */
export const getPurchaseItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        i.id,
        p.nama,
        i.qty,
        i.harga,
        (i.qty * i.harga) AS subtotal
      FROM purchase_items i
      JOIN products p ON p.id = i.product_id
      WHERE i.purchase_id=?
      `,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("getPurchaseItems error:", err);
    res.status(500).json({ message: "Gagal mengambil item pembelian" });
  }
};

/* ================= ADD ITEM ================= */
export const addPurchaseItem = async (req, res) => {
  try {
    const { purchase_id, product_id, qty, harga } = req.body;

    await db.query(
      "INSERT INTO purchase_items (purchase_id, product_id, qty, harga) VALUES (?,?,?,?)",
      [purchase_id, product_id, qty, harga]
    );

    // tambah stok
    await db.query(
      "UPDATE products SET stok = stok + ? WHERE id=?",
      [qty, product_id]
    );

    // update total qty
    await db.query(
      "UPDATE purchases SET total = total + ? WHERE id=?",
      [qty, purchase_id]
    );

    res.json({ message: "Item pembelian ditambahkan" });
  } catch (err) {
    console.error("addPurchaseItem error:", err);
    res.status(500).json({ message: "Gagal menambah item pembelian" });
  }
};

/* ================= DELETE ITEM ================= */
export const deletePurchaseItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [[item]] = await db.query(
      "SELECT purchase_id, product_id, qty FROM purchase_items WHERE id=?",
      [id]
    );

    await db.query(
      "UPDATE products SET stok = stok - ? WHERE id=?",
      [item.qty, item.product_id]
    );

    await db.query(
      "UPDATE purchases SET total = total - ? WHERE id=?",
      [item.qty, item.purchase_id]
    );

    await db.query("DELETE FROM purchase_items WHERE id=?", [id]);

    res.json({ message: "Item pembelian dihapus" });
  } catch (err) {
    console.error("deletePurchaseItem error:", err);
    res.status(500).json({ message: "Gagal menghapus item pembelian" });
  }
};