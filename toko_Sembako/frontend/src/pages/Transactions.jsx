import { useEffect, useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function Transactions() {
  /* ================= STATE ================= */
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [items, setItems] = useState([]);
  const [view, setView] = useState("list"); // list | item
  const [activeId, setActiveId] = useState(null);

  const [search, setSearch] = useState("");

  /* transaksi */
  const [showTxModal, setShowTxModal] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [editTxId, setEditTxId] = useState(null); // ✅ TAMBAHAN

  /* item modal */
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [stok, setStok] = useState(0);
  const [harga, setHarga] = useState(0);

  /* ================= LOAD DATA ================= */
  const loadAll = useCallback(async () => {
    const tx = await api.get("/transactions?q=" + search);
    const cs = await api.get("/customers");
    const pr = await api.get("/products");

    setTransactions(tx.data);
    setCustomers(cs.data);
    setProducts(pr.data);
  }, [search]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ================= DETAIL TRANSAKSI ================= */
  const bukaItem = async (id) => {
    setActiveId(id);
    setView("item");
    const res = await api.get(`/transactions/${id}/items`);
    setItems(res.data);
  };

  /* ================= TRANSAKSI ================= */
  const tambahTransaksi = async () => {
    if (!customerId) return alert("Pilih customer");
    await api.post("/transactions", { customer_id: customerId });
    setShowTxModal(false);
    setCustomerId("");
    loadAll();
  };

  const openEditTransaksi = (tx) => {
    setEditTxId(tx.id);
    setCustomerId(tx.customer_id);
    setShowTxModal(true);
  };

  const simpanEditTransaksi = async () => {
    if (!customerId) return alert("Pilih customer");
    await api.put(`/transactions/${editTxId}`, {
      customer_id: customerId,
    });
    setShowTxModal(false);
    setEditTxId(null);
    setCustomerId("");
    loadAll();
  };

  const hapusTransaksi = async (id) => {
    if (!window.confirm("Hapus transaksi ini?")) return;
    await api.delete(`/transactions/${id}`);
    loadAll();
  };

  /* ================= ITEM ================= */
  const openAddItem = () => {
    setEditItemId(null);
    setProductId("");
    setQty(1);
    setStok(0);
    setHarga(0);
    setShowItemModal(true);
  };

  const openEditItem = (item) => {
    setEditItemId(item.id);
    setQty(item.qty);
    setStok(item.stok + item.qty);
    setHarga(item.harga);
    setShowItemModal(true);
  };

  const simpanItem = async () => {
    if (qty > stok) return alert("Qty melebihi stok");

    if (editItemId) {
      await api.put(`/transactions/item/${editItemId}`, { qty });
    } else {
      await api.post("/transactions/item", {
        transaction_id: activeId,
        product_id: productId,
        qty,
        harga,
      });
    }

    setShowItemModal(false);
    setEditItemId(null);

    const res = await api.get(`/transactions/${activeId}/items`);
    setItems(res.data);
    loadAll();
  };

  const hapusItem = async (id) => {
    if (!window.confirm("Hapus item?")) return;
    await api.delete(`/transactions/item/${id}`);

    const res = await api.get(`/transactions/${activeId}/items`);
    setItems(res.data);
    loadAll();
  };

  /* ================= RENDER ================= */
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="p-4 w-100">
        {/* ================= LIST TRANSAKSI ================= */}
        {view === "list" && (
          <>
            <h3>Transaksi</h3>

            <button
              className="btn btn-primary mb-2"
              onClick={() => {
                setEditTxId(null);
                setCustomerId("");
                setShowTxModal(true);
              }}
            >
              + Tambah Transaksi
            </button>

            <input
              className="form-control mb-3"
              placeholder="Cari kode transaksi / customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Kode</th>
                  <th>Tanggal</th>
                  <th>Customer</th>
                  <th>Total Qty</th>
                  <th>Total</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.kode_transaksi}</td>
                    <td>{t.tanggal}</td>
                    <td>{t.customer}</td>
                    <td>{t.total_qty}</td>
                    <td>Rp {t.total}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-1"
                        onClick={() => bukaItem(t.id)}
                      >
                        Detail
                      </button>

                      <button
                        className="btn btn-primary btn-sm me-1"
                        onClick={() => openEditTransaksi(t)}
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => hapusTransaksi(t.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= ITEM TRANSAKSI ================= */}
        {view === "item" && (
          <>
            <button
              className="btn btn-secondary mb-3"
              onClick={() => setView("list")}
            >
              ⬅ Kembali
            </button>

            <h4>Item Transaksi</h4>

            <button
              className="btn btn-primary mb-2"
              onClick={openAddItem}
            >
              + Tambah Item
            </button>

            <table className="table table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Produk</th>
                  <th>Qty</th>
                  <th>Harga</th>
                  <th>Subtotal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" align="center">
                      Belum ada item
                    </td>
                  </tr>
                ) : (
                  items.map((i) => (
                    <tr key={i.id}>
                      <td>{i.nama}</td>
                      <td>{i.qty}</td>
                      <td>{i.harga}</td>
                      <td>{i.subtotal}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-1"
                          onClick={() => openEditItem(i)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => hapusItem(i.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* ================= MODAL ITEM ================= */}
        {showItemModal && (
          <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-sm">
              <div className="modal-content p-3">
                <h5>{editItemId ? "Edit Item" : "Tambah Item"}</h5>

                {!editItemId && (
                  <select
                    className="form-control mb-2"
                    value={productId}
                    onChange={(e) => {
                      const p = products.find(
                        (x) => x.id === Number(e.target.value)
                      );
                      if (!p) return;
                      setProductId(p.id);
                      setStok(p.stok);
                      setHarga(p.harga);
                    }}
                  >
                    <option value="">-- Pilih Produk --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                )}

                <input
                  className="form-control mb-2"
                  value={`Stok tersedia: ${stok}`}
                  disabled
                />

                <input
                  type="number"
                  className="form-control mb-3"
                  min="1"
                  max={stok}
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary w-50"
                    onClick={() => {
                      setShowItemModal(false);
                      setEditItemId(null);
                    }}
                  >
                    Batal
                  </button>

                  <button
                    className="btn btn-primary w-50"
                    onClick={simpanItem}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= MODAL TRANSAKSI ================= */}
        {showTxModal && (
          <div className="modal d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-sm">
              <div className="modal-content p-3">
                <h5>{editTxId ? "Edit Transaksi" : "Tambah Transaksi"}</h5>

                <select
                  className="form-control mb-3"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="">-- Pilih Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
                  ))}
                </select>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-secondary w-50"
                    onClick={() => {
                      setShowTxModal(false);
                      setEditTxId(null);
                      setCustomerId("");
                    }}
                  >
                    Batal
                  </button>

                  <button
                    className="btn btn-primary w-50"
                    onClick={editTxId ? simpanEditTransaksi : tambahTransaksi}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
