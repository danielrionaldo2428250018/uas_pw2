import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Users() {
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("kasir");

  /* ================= FETCH ================= */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("FETCH USERS ERROR:", err);
      alert("Gagal mengambil data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= TAMBAH ================= */
  const openAdd = () => {
    setEditId(null);
    setUsername("");
    setPassword("");
    setRole("kasir");
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditId(u.id);
    setUsername(u.username);
    setRole(u.role);
    setPassword("");
    setShowModal(true);
  };

  const simpanUser = async () => {
    if (!username || (!editId && !password)) {
      return alert("Username & password wajib diisi");
    }

    try {
      if (editId) {
        await api.put(`/users/${editId}`, {
          username,
          role,
        });
      } else {
        await api.post("/users", {
          username,
          password,
          role,
        });
      }

      setShowModal(false);
      fetchUsers();
    } catch (err) {
      console.error("SIMPAN USER ERROR:", err);
      alert("Gagal menyimpan user");
    }
  };

  /* ================= HAPUS ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus user ini?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("HAPUS USER ERROR:", err);
      alert("Gagal menghapus user");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <Navbar />

        <div className="p-4">
          <h4>Pengaturan Users</h4>

          <button className="btn btn-primary mb-3" onClick={openAdd}>
            + Tambah User
          </button>

          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th width="180">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.role}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => openEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u.id)}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ================= MODAL ================= */}
          {showModal && (
            <div className="modal d-block bg-dark bg-opacity-50">
              <div className="modal-dialog modal-sm">
                <div className="modal-content p-3">
                  <h5>{editId ? "Edit User" : "Tambah User"}</h5>

                  <input
                    className="form-control mb-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  {!editId && (
                    <input
                      type="password"
                      className="form-control mb-2"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  )}

                  <select
                    className="form-control mb-3"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="kasir">Kasir</option>
                  </select>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-secondary w-50"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    <button
                      className="btn btn-primary w-50"
                      onClick={simpanUser}
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
    </div>
  );
}
