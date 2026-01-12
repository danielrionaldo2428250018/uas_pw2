import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";

export default function Suppliers() {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");

  const [editData, setEditData] = useState(null);

  const loadData = () => {
    api.get("/suppliers").then((res) => setData(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ADD */
  const tambah = async () => {
    try {
      await api.post("/suppliers", { nama, alamat, telepon });
      setNama("");
      setAlamat("");
      setTelepon("");
      loadData();
    } catch {
      alert("Gagal menambah supplier");
    }
  };

  /* UPDATE */
  const simpanEdit = async () => {
    try {
      await api.put(`/suppliers/${editData.id}`, editData);
      setEditData(null);
      loadData();
    } catch {
      alert("Gagal update supplier");
    }
  };

  /* DELETE */
  const hapus = async (id) => {
    if (!window.confirm("Yakin hapus supplier?")) return;
    await api.delete(`/suppliers/${id}`);
    loadData();
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="p-4 w-100">
        <h3>Suppliers</h3>

        {/* FORM TAMBAH */}
        <div className="d-flex gap-2 mb-3">
          <input
            className="form-control"
            placeholder="Nama"
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
            placeholder="Telepon"
            value={telepon}
            onChange={(e) => setTelepon(e.target.value)}
          />
          <button className="btn btn-primary" onClick={tambah}>
            Tambah
          </button>
        </div>

        {/* TABLE */}
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Telepon</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td>{s.nama}</td>
                <td>{s.alamat}</td>
                <td>{s.telepon}</td>
                <td>
                  <button
                    className="btn btn-warning me-2"
                    onClick={() => setEditData({ ...s })}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => hapus(s.id)}
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
                <h5>Edit Supplier</h5>

                <input
                  className="form-control mb-2"
                  value={editData.nama}
                  onChange={(e) =>
                    setEditData({ ...editData, nama: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  value={editData.alamat}
                  onChange={(e) =>
                    setEditData({ ...editData, alamat: e.target.value })
                  }
                />
                <input
                  className="form-control mb-2"
                  value={editData.telepon}
                  onChange={(e) =>
                    setEditData({ ...editData, telepon: e.target.value })
                  }
                />

                <div className="text-end">
                  <button
                    className="btn btn-secondary me-2"
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
