import db from "../db.js";

/* ================= GET TRANSACTIONS ================= */
export const getTransactions = async (req, res) => {
  try {
    const q = req.query.q || "";

    const [rows] = await db.query(
      `
      SELECT 
        t.id,
        t.kode_transaksi,
        DATE_FORMAT(t.tanggal,'%d-%m-%Y') AS tanggal,
        c.nama AS customer,

        COUNT(i.id) AS total_qty,                     -- JUMLAH ITEM
        IFNULL(SUM(i.qty * i.harga), 0) AS total      -- TOTAL HARGA

      FROM transactions t
      JOIN customers c ON c.id = t.customer_id
      LEFT JOIN transaction_items i ON i.transaction_id = t.id
      WHERE t.kode_transaksi LIKE ? OR c.nama LIKE ?
      GROUP BY t.id
      ORDER BY t.id DESC
      `,
      [`%${q}%`, `%${q}%`]
    );

    res.json(rows);
  } catch (err) {
    console.error("getTransactions error:", err);
    res.status(500).json({ message: "Gagal mengambil transaksi" });
  }
};

/* ================= CREATE TRANSACTION ================= */
export const createTransaction = async (req, res) => {
  try {
    const { customer_id } = req.body;

    const [[count]] = await db.query(
      "SELECT COUNT(*) total FROM transactions WHERE DATE(tanggal)=CURDATE()"
    );

    const urut = String(count.total + 1).padStart(3, "0");
    const d = new Date();

    const kode = `TRX-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${urut}`;

    await db.query(
      "INSERT INTO transactions (kode_transaksi, customer_id, tanggal) VALUES (?,?,CURDATE())",
      [kode, customer_id]
    );

    res.json({ message: "Transaksi berhasil dibuat" });
  } catch (err) {
    console.error("createTransaction error:", err);
    res.status(500).json({ message: "Gagal membuat transaksi" });
  }
};

/* ================= UPDATE TRANSACTION ================= */
export const updateTransaction = async (req, res) => {
  try {
    const { customer_id } = req.body;
    const { id } = req.params;

    await db.query(
      "UPDATE transactions SET customer_id=? WHERE id=?",
      [customer_id, id]
    );

    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (err) {
    console.error("updateTransaction error:", err);
    res.status(500).json({ message: "Gagal update transaksi" });
  }
};

/* ================= DELETE TRANSACTION ================= */
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // ambil item transaksi
    const [items] = await db.query(
      "SELECT product_id, qty FROM transaction_items WHERE transaction_id=?",
      [id]
    );

    // kembalikan stok
    for (const item of items) {
      await db.query(
        "UPDATE products SET stok = stok + ? WHERE id=?",
        [item.qty, item.product_id]
      );
    }

    // hapus item
    await db.query(
      "DELETE FROM transaction_items WHERE transaction_id=?",
      [id]
    );

    // hapus transaksi
    await db.query(
      "DELETE FROM transactions WHERE id=?",
      [id]
    );

    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (err) {
    console.error("deleteTransaction error:", err);
    res.status(500).json({ message: "Gagal menghapus transaksi" });
  }
};

/* ================= GET ITEMS ================= */
export const getItems = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        i.id,
        p.nama,
        p.stok,
        i.qty,
        i.harga,
        (i.qty * i.harga) AS subtotal
      FROM transaction_items i
      JOIN products p ON p.id = i.product_id
      WHERE i.transaction_id=?
      `,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("getItems error:", err);
    res.status(500).json({ message: "Gagal mengambil item" });
  }
};

/* ================= ADD ITEM ================= */
export const addItem = async (req, res) => {
  try {
    const { transaction_id, product_id, qty, harga } = req.body;

    const [[exist]] = await db.query(
      "SELECT id FROM transaction_items WHERE transaction_id=? AND product_id=?",
      [transaction_id, product_id]
    );

    if (exist) {
      return res.status(400).json({ message: "Produk sudah ada" });
    }

    const [[product]] = await db.query(
      "SELECT stok FROM products WHERE id=?",
      [product_id]
    );

    if (product.stok < qty) {
      return res.status(400).json({ message: "Stok tidak cukup" });
    }

    await db.query(
      "INSERT INTO transaction_items (transaction_id, product_id, qty, harga) VALUES (?,?,?,?)",
      [transaction_id, product_id, qty, harga]
    );

    await db.query(
      "UPDATE products SET stok = stok - ? WHERE id=?",
      [qty, product_id]
    );

    res.json({ message: "Item berhasil ditambahkan" });
  } catch (err) {
    console.error("addItem error:", err);
    res.status(500).json({ message: "Gagal menambah item" });
  }
};

/* ================= UPDATE ITEM ================= */
export const updateItemQty = async (req, res) => {
  try {
    const { qty } = req.body;
    const { id } = req.params;

    const [[item]] = await db.query(
      "SELECT qty, product_id FROM transaction_items WHERE id=?",
      [id]
    );

    const [[product]] = await db.query(
      "SELECT stok FROM products WHERE id=?",
      [item.product_id]
    );

    const diff = qty - item.qty;

    if (product.stok < diff) {
      return res.status(400).json({ message: "Stok tidak cukup" });
    }

    await db.query(
      "UPDATE transaction_items SET qty=? WHERE id=?",
      [qty, id]
    );

    await db.query(
      "UPDATE products SET stok = stok - ? WHERE id=?",
      [diff, item.product_id]
    );

    res.json({ message: "Item berhasil diperbarui" });
  } catch (err) {
    console.error("updateItemQty error:", err);
    res.status(500).json({ message: "Gagal update item" });
  }
};

/* ================= DELETE ITEM ================= */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const [[item]] = await db.query(
      "SELECT qty, product_id FROM transaction_items WHERE id=?",
      [id]
    );

    await db.query(
      "UPDATE products SET stok = stok + ? WHERE id=?",
      [item.qty, item.product_id]
    );

    await db.query(
      "DELETE FROM transaction_items WHERE id=?",
      [id]
    );

    res.json({ message: "Item berhasil dihapus" });
  } catch (err) {
    console.error("deleteItem error:", err);
    res.status(500).json({ message: "Gagal menghapus item" });
  }
};
