import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex justify-content-between align-items-center px-4 py-2 border-bottom">
      <div>
        <strong>{user?.username}</strong> ({user?.role})
      </div>

      <button className="btn btn-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
