import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function Customers() {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");

  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState("");
  const [editAlamat, setEditAlamat] = useState("");
  const [editTelepon, setEditTelepon] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get("/customers");
    setData(res.data);
  };

  const tambah = async () => {
    try {
      await api.post("/customers", {
        nama,
        alamat,
        telepon
      });
      setNama("");
      setAlamat("");
      setTelepon("");
      loadData();
    } catch {
      alert("Gagal menambah customer");
    }
  };

  const bukaEdit = c => {
    setEditId(c.id);
    setEditNama(c.nama);
    setEditAlamat(c.alamat);
    setEditTelepon(c.telepon);
  };

  const simpanEdit = async () => {
    try {
      await api.put(`/customers/${editId}`, {
        nama: editNama,
        alamat: editAlamat,
        telepon: editTelepon
      });
      setEditId(null);
      loadData();
    } catch {
      alert("Gagal update customer");
    }
  };

  const hapus = async id => {
    if (!window.confirm("Hapus customer?")) return;
    await api.delete(`/customers/${id}`);
    loadData();
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 w-100">
        <h3>Customers</h3>

        <div className="d-flex gap-2 mb-3">
          <input
            className="form-control"
            placeholder="Nama"
            value={nama}
            onChange={e => setNama(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Alamat"
            value={alamat}
            onChange={e => setAlamat(e.target.value)}
          />
          <input
            className="form-control"
            placeholder="Telepon"
            value={telepon}
            onChange={e => setTelepon(e.target.value)}
          />
          <button className="btn btn-primary" onClick={tambah}>
            Tambah
          </button>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.id}>
                <td>{c.nama}</td>
                <td>{c.alamat}</td>
                <td>{c.telepon}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => bukaEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => hapus(c.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {editId && (
          <div className="modal d-block" style={{ background: "#00000066" }}>
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <h5>Edit Customer</h5>

                <input
                  className="form-control mb-2"
                  value={editNama}
                  onChange={e => setEditNama(e.target.value)}
                />
                <input
                  className="form-control mb-2"
                  value={editAlamat}
                  onChange={e => setEditAlamat(e.target.value)}
                />
                <input
                  className="form-control mb-3"
                  value={editTelepon}
                  onChange={e => setEditTelepon(e.target.value)}
                />

                <div className="text-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setEditId(null)}
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
