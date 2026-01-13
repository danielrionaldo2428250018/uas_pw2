import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);

  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await api.get("/customers");
    setCustomers(res.data);
  };

  /* ================= SIMPAN ================= */
  const simpanCustomer = async () => {
    if (!nama.trim()) return alert("Nama customer wajib diisi");
    if (!alamat.trim()) return alert("Alamat wajib diisi");
    if (!telepon.trim()) return alert("No telepon wajib diisi");

    const payload = { nama, alamat, telepon };

    if (editId) {
      await api.put(`/customers/${editId}`, payload);
    } else {
      await api.post("/customers", payload);
    }

    setNama("");
    setAlamat("");
    setTelepon("");
    setEditId(null);
    loadCustomers();
  };

  /* ================= EDIT ================= */
  const editCustomer = (c) => {
    setEditId(c.id);
    setNama(c.nama);
    setAlamat(c.alamat);
    setTelepon(c.telepon);
  };

  /* ================= HAPUS ================= */
  const hapusCustomer = async (id) => {
    if (!window.confirm("Hapus customer ini?")) return;
    await api.delete(`/customers/${id}`);
    loadCustomers();
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="w-100">
        <Navbar />

        <div className="p-4">
          <h4>Customer</h4>

          <div className="d-flex gap-2 mb-3">
            <input
              className="form-control"
              placeholder="Nama Customer"
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

            <button className="btn btn-primary" onClick={simpanCustomer}>
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
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.nama}</td>
                  <td>{c.alamat}</td>
                  <td>{c.telepon}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editCustomer(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => hapusCustomer(c.id)}
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