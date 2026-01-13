import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  /* ================= TAMBAH / UPDATE ================= */
  const simpanProduk = async () => {
    if (!nama.trim()) {
      return alert("Nama produk wajib diisi");
    }

    if (harga === "" || Number(harga) <= 0) {
      return alert("Harga harus lebih dari 0");
    }

    if (stok === "" || Number(stok) < 0) {
      return alert("Stok tidak boleh negatif");
    }

    const payload = {
      nama,
      harga: Number(harga),
      stok: Number(stok),
    };

    if (editId) {
      await api.put(`/products/${editId}`, payload);
    } else {
      await api.post("/products", payload);
    }

    setNama("");
    setHarga("");
    setStok("");
    setEditId(null);
    loadProducts();
  };

  /* ================= EDIT ================= */
  const editProduk = (p) => {
    setEditId(p.id);
    setNama(p.nama);
    setHarga(p.harga);
    setStok(p.stok);
  };

  /* ================= HAPUS ================= */
  const hapusProduk = async (id) => {
    if (!window.confirm("Hapus produk ini?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="w-100">
        <Navbar />

        <div className="p-4">
          <h4>Produk</h4>

          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Nama Produk"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />

            <input
              type="number"
              className="form-control"
              placeholder="Harga"
              value={harga}
              min="1"
              onChange={(e) => setHarga(e.target.value)}
            />

            <input
              type="number"
              className="form-control"
              placeholder="Stok"
              value={stok}
              min="0"
              onChange={(e) => setStok(e.target.value)}
            />

            <button className="btn btn-primary" onClick={simpanProduk}>
              {editId ? "Update" : "Tambah"}
            </button>
          </div>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stok</th>
                <th width="150">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.nama}</td>
                  <td>Rp {p.harga}</td>
                  <td>{p.stok}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editProduk(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => hapusProduk(p.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}