import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [stok, setStok] = useState("");

  const [editData, setEditData] = useState(null);

  const loadData = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  /* TAMBAH */
  const tambah = async () => {
    try {
      await api.post("/products", { nama, harga, stok });
      setNama("");
      setHarga("");
      setStok("");
      loadData();
    } catch {
      alert("Gagal menambah produk");
    }
  };

  /* SIMPAN EDIT */
  const simpanEdit = async () => {
    try {
      await api.put(`/products/${editData.id}`, editData);
      setEditData(null);
      loadData();
    } catch {
      alert("Gagal update produk");
    }
  };

  /* HAPUS */
  const hapus = async (id) => {
    if (window.confirm("Yakin hapus produk ini?")) {
      await api.delete(`/products/${id}`);
      loadData();
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="p-4 w-100">
        <h3>Produk</h3>

        {/* FORM TAMBAH */}
        <div className="d-flex gap-2 mb-3">
          <input className="form-control"
            placeholder="Nama Produk"
            value={nama}
            onChange={e => setNama(e.target.value)}
          />
          <input className="form-control"
            placeholder="Harga"
            type="number"
            value={harga}
            onChange={e => setHarga(e.target.value)}
          />
          <input className="form-control"
            placeholder="Stok"
            type="number"
            value={stok}
            onChange={e => setStok(e.target.value)}
          />
          <button className="btn btn-primary" onClick={tambah}>Tambah</button>
        </div>

        {/* TABLE */}
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nama</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.nama}</td>
                <td>Rp {p.harga}</td>
                <td>{p.stok}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2"
                    onClick={() => setEditData({ ...p })}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm"
                    onClick={() => hapus(p.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* MODAL EDIT */}
        {editData && (
          <div className="modal show d-block bg-dark bg-opacity-50">
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Edit Produk</h5>

                <input className="form-control mb-2"
                  value={editData.nama}
                  onChange={e => setEditData({ ...editData, nama: e.target.value })}
                />
                <input className="form-control mb-2"
                  type="number"
                  value={editData.harga}
                  onChange={e => setEditData({ ...editData, harga: e.target.value })}
                />
                <input className="form-control mb-2"
                  type="number"
                  value={editData.stok}
                  onChange={e => setEditData({ ...editData, stok: e.target.value })}
                />

                <div className="text-end">
                  <button className="btn btn-secondary me-2"
                    onClick={() => setEditData(null)}
                  >
                    Batal
                  </button>
                  <button className="btn btn-primary" onClick={simpanEdit}>
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
