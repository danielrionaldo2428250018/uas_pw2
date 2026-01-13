import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [view, setView] = useState("list");
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [harga, setHarga] = useState(0);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const p = await api.get("/purchases");
    const s = await api.get("/suppliers");
    const pr = await api.get("/products");

    setPurchases(p.data);
    setSuppliers(s.data);
    setProducts(pr.data);
  };

  /* ================= HEADER ================= */
  const createPurchase = async () => {
    if (!supplierId) return alert("Pilih supplier");
    await api.post("/purchases", { supplier_id: supplierId });
    setSupplierId("");
    loadAll();
  };

  const openItems = async (id) => {
    setActiveId(id);
    setView("item");
    const res = await api.get(`/purchases/${id}/items`);
    setItems(res.data);
  };

  const deletePurchase = async (id) => {
    if (!window.confirm("Hapus pembelian ini?")) return;
    await api.delete(`/purchases/${id}`);
    loadAll();
  };

  /* ================= ITEM ================= */
  const addItem = async () => {
    if (!productId || qty <= 0) return alert("Data tidak valid");

    await api.post("/purchases/item", {
      purchase_id: activeId,
      product_id: productId,
      qty,
      harga,
    });

    setProductId("");
    setQty(1);
    setHarga(0);

    const res = await api.get(`/purchases/${activeId}/items`);
    setItems(res.data);
    loadAll();
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Hapus item ini?")) return;
    await api.delete(`/purchases/item/${id}`);
    const res = await api.get(`/purchases/${activeId}/items`);
    setItems(res.data);
    loadAll();
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="w-100">
        <Navbar />

        <div className="p-4">

          {/* ================= LIST ================= */}
          {view === "list" && (
            <>
              <h4>Pembelian</h4>

              <div className="d-flex gap-2 mb-3">
                <select
                  className="form-control"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama}
                    </option>
                  ))}
                </select>

                <button className="btn btn-primary" onClick={createPurchase}>
                  + Buat Pembelian
                </button>
              </div>

              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Tanggal</th>
                    <th>Supplier</th>
                    <th>Total Qty</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr key={p.id}>
                      <td>{p.tanggal}</td>
                      <td>{p.supplier}</td>
                      <td>{p.total}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => openItems(p.id)}
                        >
                          Detail
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePurchase(p.id)}
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

          {/* ================= ITEM ================= */}
          {view === "item" && (
            <>
              <button
                className="btn btn-secondary mb-3"
                onClick={() => setView("list")}
              >
                ⬅ Kembali
              </button>

              <h4>Detail Pembelian</h4>

              <div className="d-flex gap-2 mb-3">
                <select
                  className="form-control"
                  value={productId}
                  onChange={(e) => {
                    const p = products.find(
                      (x) => x.id === Number(e.target.value)
                    );
                    setProductId(p?.id || "");
                    setHarga(p?.harga || 0);
                  }}
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Qty"
                  value={qty}
                  min="1"
                  onChange={(e) => setQty(Number(e.target.value))}
                />

                <input
                  type="number"
                  className="form-control"
                  placeholder="Harga"
                  value={harga}
                  onChange={(e) => setHarga(Number(e.target.value))}
                />

                <button className="btn btn-primary" onClick={addItem}>
                  + Tambah
                </button>
              </div>

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
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteItem(i.id)}
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

        </div>
      </div>
    </div>
  );
}