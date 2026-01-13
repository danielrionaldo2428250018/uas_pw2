import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const res = await api.get("/suppliers");
    setSuppliers(res.data);
  };

  const simpanSupplier = async () => {
    if (!nama.trim()) return alert("Nama supplier wajib diisi");
    if (!alamat.trim()) return alert("Alamat wajib diisi");
    if (!telepon.trim()) return alert("No telepon wajib diisi");

    const payload = { nama, alamat, telepon };

    if (editId) {
      await api.put(`/suppliers/${editId}`, payload);
    } else {
      await api.post("/suppliers", payload);
    }

    setNama("");
    setAlamat("");
    setTelepon("");
    setEditId(null);
    loadSuppliers();
  };

  const editSupplier = (s) => {
    setEditId(s.id);
    setNama(s.nama);
    setAlamat(s.alamat);
    setTelepon(s.telepon);
  };

  const hapusSupplier = async (id) => {
    if (!window.confirm("Hapus supplier ini?")) return;
    await api.delete(`/suppliers/${id}`);
    loadSuppliers();
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="w-100">
        <Navbar />

        <div className="p-4">
          <h4>Supplier</h4>

          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Nama Supplier"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />

            <input
              className="form-control"
              placeholder="Alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
            />

            <input
              className="form-control"
              placeholder="No Telepon"
              value={telepon}
              onChange={(e) => setTelepon(e.target.value)}
            />

            <button className="btn btn-primary" onClick={simpanSupplier}>
              {editId ? "Update" : "Tambah"}
            </button>
          </div>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>No Telepon</th>
                <th width="150">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id}>
                  <td>{s.nama}</td>
                  <td>{s.alamat}</td>
                  <td>{s.telepon}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editSupplier(s)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => hapusSupplier(s.id)}
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