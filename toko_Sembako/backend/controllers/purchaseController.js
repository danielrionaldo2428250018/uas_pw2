import db from "../db.js";


/* GET PURCHASES */
export const getPurchases = (req, res) => {
  db.query(
    "SELECT p.*, s.name AS supplier FROM purchases p JOIN suppliers s ON p.supplier_id=s.id",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

/* ADD PURCHASE */
export const addPurchase = (req, res) => {
  const { supplier_id, date, total } = req.body;

  db.query(
    "INSERT INTO purchases (supplier_id, date, total) VALUES (?, ?, ?)",
    [supplier_id, date, total],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Purchase berhasil ditambahkan" });
    }
  );
};

/* UPDATE PURCHASE */
export const updatePurchase = (req, res) => {
  const { supplier_id, date, total } = req.body;

  db.query(
    "UPDATE purchases SET supplier_id=?, date=?, total=? WHERE id=?",
    [supplier_id, date, total, req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Purchase berhasil diupdate" });
    }
  );
};

/* DELETE PURCHASE */
export const deletePurchase = (req, res) => {
  db.query(
    "DELETE FROM purchases WHERE id=?",
    [req.params.id],
    err => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Purchase berhasil dihapus" });
    }
  );
};
