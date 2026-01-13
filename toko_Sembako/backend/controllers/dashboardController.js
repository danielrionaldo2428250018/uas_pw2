import db from "../db.js";

export const dashboardSummary = async (req, res) => {
  try {
    const [[produk]] = await db.query(
      "SELECT COUNT(*) AS total_produk FROM products"
    );

    const [[customer]] = await db.query(
      "SELECT COUNT(*) AS total_customer FROM customers"
    );

    const [[transaksi]] = await db.query(
      "SELECT COUNT(*) AS total_transaksi FROM transactions"
    );

    res.json({
      total_produk: produk.total_produk,
      total_customer: customer.total_customer,
      total_transaksi: transaksi.total_transaksi,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    res.status(500).json({ message: "Dashboard error" });
  }
};